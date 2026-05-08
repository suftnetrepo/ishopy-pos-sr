import GoogleDrive from 'react-native-google-drive-api-wrapper';

export async function listBackups(accessToken) {
  const drive = new GoogleDrive(accessToken);

  const res = await drive.files.list({
    spaces: 'appDataFolder',
    fields: 'files(id, name, size, createdTime)',
    orderBy: 'createdTime desc',
  });

  return res.files || [];
}
