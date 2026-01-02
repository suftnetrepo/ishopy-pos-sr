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