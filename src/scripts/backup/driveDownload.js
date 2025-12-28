import RNFS from 'react-native-fs';
import GoogleDrive from 'react-native-google-drive-api-wrapper';

export async function downloadFromDrive(accessToken, fileId) {
  const drive = new GoogleDrive(accessToken);

  const data = await drive.files.get({
    fileId,
    alt: 'media',
  });

  const localPath =
    `${RNFS.DocumentDirectoryPath}/restore.realm`;

  await RNFS.writeFile(localPath, data, 'base64');
  return localPath;
}
