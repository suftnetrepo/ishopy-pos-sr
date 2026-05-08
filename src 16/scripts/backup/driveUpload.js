import RNFS from 'react-native-fs';
import GoogleDrive from 'react-native-google-drive-api-wrapper';

export async function uploadToDrive(accessToken, filePath) {
  const drive = new GoogleDrive(accessToken);
  const fileData = await RNFS.readFile(filePath, 'base64');

  await drive.files.create({
    requestBody: {
      name: `restaurant-backup-${Date.now()}.realm`,
      parents: ['appDataFolder'],
    },
    media: {
      mimeType: 'application/octet-stream',
      body: fileData,
    },
  });
}
