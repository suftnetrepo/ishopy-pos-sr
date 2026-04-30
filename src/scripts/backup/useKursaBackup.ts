/* eslint-disable prettier/prettier */
import {useState} from 'react';
import {Platform, Alert} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import GDrive, { IGDrive } from 'react-native-google-drive-api-wrapper';
import RNFS from 'react-native-fs';
import {getRealmInstance} from '../../model/store';

const FOLDER_NAME   = 'Kursa Backups';
const BACKUP_PREFIX = 'kursa-backup-';

export interface BackupFile {
  id: string;
  name: string;
  date: string;
  size: string;
}

interface UseKursaBackupReturn {
  backup: () => Promise<void>;
  backingUp: boolean;
  backupError: string | null;
  lastBackup: string | null;
  listBackups: () => Promise<BackupFile[]>;
  restore: (fileId: string) => Promise<void>;
  restoring: boolean;
  restoreError: string | null;
  backupFiles: BackupFile[];
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isSignedIn: boolean;
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const errMsg = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);

// ─── Get or create the Kursa Backups folder ─────────────────────────────────
const getOrCreateFolder = async (drive: IGDrive): Promise<string> => {
  const res = await drive.files.list({
    q: `name = '${FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id)',
  });
  if (res?.files?.length > 0) return res.files[0].id as string;

  const folder = await drive.files.create({
    requestBody: {
      name:     FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      parents:  ['root'],
    },
    fields: 'id',
  });
  return folder.id as string;
};

// ─── Hook ────────────────────────────────────────────────────────────────────
const useKursaBackup = (): UseKursaBackupReturn => {
  const [backingUp,    setBackingUp]    = useState(false);
  const [restoring,    setRestoring]    = useState(false);
  const [backupError,  setBackupError]  = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [lastBackup,   setLastBackup]   = useState<string | null>(null);
  const [backupFiles,  setBackupFiles]  = useState<BackupFile[]>([]);
  const [isSignedIn,   setIsSignedIn]   = useState(false);

  // ── Sign in / out ──────────────────────────────────────────────────────
  const signIn = async (): Promise<void> => {
    try {
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      setIsSignedIn(true);
    } catch (err: unknown) {
      setBackupError(`Sign-in failed: ${errMsg(err)}`);
    }
  };

  const signOut = async (): Promise<void> => {
    await GoogleSignin.signOut();
    setIsSignedIn(false);
  };

  // ── Get authenticated drive instance ──────────────────────────────────
  const getDrive = async (): Promise<IGDrive> => {
    const {accessToken} = await GoogleSignin.getTokens();
    return new GDrive(accessToken);
  };

  // ── Backup ─────────────────────────────────────────────────────────────
  const backup = async (): Promise<void> => {
    setBackingUp(true);
    setBackupError(null);
    try {
      const realm    = await getRealmInstance();
      const drive    = await getDrive();
      const folderId = await getOrCreateFolder(drive);

      const tempDir    = Platform.OS === 'ios'
        ? RNFS.TemporaryDirectoryPath
        : RNFS.CachesDirectoryPath;
      const datestamp  = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const backupPath = `${tempDir}/${BACKUP_PREFIX}${datestamp}.realm`;

      if (await RNFS.exists(backupPath)) await RNFS.unlink(backupPath);
      (realm as any).writeCopy(backupPath);

      const fileData = await RNFS.readFile(backupPath, 'base64');

      await drive.files.create({
        requestBody: {
          name:    `${BACKUP_PREFIX}${datestamp}.realm`,
          parents: [folderId],
        },
        media: {
          mimeType: 'application/octet-stream',
          body:     fileData,
        },
      });

      await RNFS.unlink(backupPath).catch(() => {});
      setLastBackup(new Date().toLocaleString());
    } catch (err: unknown) {
      setBackupError(errMsg(err));
    } finally {
      setBackingUp(false);
    }
  };

  // ── List backups ───────────────────────────────────────────────────────
  const listBackups = async (): Promise<BackupFile[]> => {
    try {
      const drive = await getDrive();
      const res = await drive.files.list({
        q:       `name contains '${BACKUP_PREFIX}' and trashed = false`,
        orderBy: 'createdTime desc',
        fields:  'files(id, name, createdTime, size)',
      });

      const files: BackupFile[] = ((res?.files ?? []) as Array<{
        id: string;
        name: string;
        createdTime: string;
        size?: string;
      }>).map(f => ({
        id:   f.id,
        name: f.name,
        date: new Date(f.createdTime).toLocaleString(),
        size: formatBytes(parseInt(f.size ?? '0', 10)),
      }));

      setBackupFiles(files);
      return files;
    } catch (err: unknown) {
      setRestoreError(errMsg(err));
      return [];
    }
  };

  // ── Restore ────────────────────────────────────────────────────────────
  const restore = async (fileId: string): Promise<void> => {
    setRestoring(true);
    setRestoreError(null);
    try {
      const drive       = await getDrive();
      const tempDir     = Platform.OS === 'ios'
        ? RNFS.TemporaryDirectoryPath
        : RNFS.CachesDirectoryPath;
      const restorePath = `${tempDir}/restore.realm`;

      // Download file content
      const data = await drive.files.get({fileId, alt: 'media'});
      await RNFS.writeFile(restorePath, data as string, 'base64');

      // Close Realm before swapping the file
      const realm = await getRealmInstance();
      if (!realm.isClosed) realm.close();

      const realmPath = `${RNFS.DocumentDirectoryPath}/__store__.realm`;
      if (await RNFS.exists(realmPath)) await RNFS.unlink(realmPath);
      await RNFS.moveFile(restorePath, realmPath);

      Alert.alert(
        'Restore complete',
        'Your data has been restored. Please restart the app.',
        [{text: 'OK'}],
      );
    } catch (err: unknown) {
      setRestoreError(errMsg(err));
    } finally {
      setRestoring(false);
    }
  };

  return {
    backup,      backingUp,  backupError,  lastBackup,
    listBackups, restore,    restoring,    restoreError,
    backupFiles, signIn,     signOut,      isSignedIn,
  };
};

export default useKursaBackup;