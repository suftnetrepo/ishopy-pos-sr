import { useState, useCallback } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { listBackups } from './driveList';
import { downloadFromDrive } from './driveDownload';
import { restoreRealm } from './restoreRealm';

export function useRealmRestore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backups, setBackups] = useState([]);

  const loadBackups = useCallback(async () => {
    try {
      await GoogleSignin.signIn();
      const { accessToken } =
        await GoogleSignin.getTokens();

      const files = await listBackups(accessToken);
      setBackups(files);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const restore = useCallback(async (fileId) => {
    try {
      setLoading(true);
      setError(null);

      const { accessToken } =
        await GoogleSignin.getTokens();

      const backupPath =
        await downloadFromDrive(accessToken, fileId);

      await restoreRealm(backupPath);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    backups,
    loadBackups,
    restore,
    loading,
    error,
  };
}
