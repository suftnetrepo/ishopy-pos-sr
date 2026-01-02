import { GDrive, MimeTypes } from "@robinbobin/react-native-google-drive-api-wrapper";
import RNFS from 'react-native-fs';

const backupToDrive = async (realm) => {
  const { accessToken } = await GoogleSignin.getTokens();
  const gdrive = new GDrive();
  gdrive.accessToken = accessToken;

  try {
    // 1. Check if our folder exists, if not, create it
    const folderId = await gdrive.files.safeCreateFolder({
      name: "Restaurant_App_Backups",
      parents: ["root"]
    });

    // 2. Prepare the Realm file
    const backupPath = `${RNFS.DocumentDirectoryPath}/backup.realm`;
    if (await RNFS.exists(backupPath)) await RNFS.unlink(backupPath);
    realm.writeCopy(backupPath);

    // 3. Upload to that specific folder
    const content = await RNFS.readFile(backupPath, 'base64');
    await gdrive.files.createMultipartQuery()
      .setData(content, MimeTypes.BINARY)
      .setMetadata({
        name: `Backup_${new Date().toISOString().split('T')[0]}.realm`,
        parents: [folderId]
      })
      .execute();

    alert("Backup saved to 'Restaurant_App_Backups' in your Drive!");
  } catch (error) {
    console.error("Backup failed", error);
  }
};


const restoreFromDrive = async () => {
  const { accessToken } = await GoogleSignin.getTokens();
  const gdrive = new GDrive();
  gdrive.accessToken = accessToken;

  // 1. Search for files created by this app
  const result = await gdrive.files.list({
    q: "name contains 'Backup_' and trashed = false",
    orderBy: "createdTime desc" // Get the newest backup first
  });

  if (result.files.length === 0) return alert("No backups found.");

  // 2. Download the most recent one
  const fileId = result.files[0].id;
  const data = await gdrive.files.getBinary(fileId);

  // 3. Save locally
  const tempPath = `${RNFS.TemporaryDirectoryPath}/restore.realm`;
  await RNFS.writeFile(tempPath, data, 'base64');

  // [Use the Swap Logic from the previous step to overwrite the Realm file]
};

export { restoreFromDrive, backupToDrive}