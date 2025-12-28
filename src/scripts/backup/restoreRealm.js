import RNFS from 'react-native-fs';

export async function restoreRealm(backupPath) {
  const realmPath =
    `${RNFS.DocumentDirectoryPath}/default.realm`;

  const files = [
    realmPath,
    `${realmPath}.lock`,
    `${realmPath}.note`,
    `${realmPath}.management`,
  ];

  for (const file of files) {
    if (await RNFS.exists(file)) {
      await RNFS.unlink(file);
    }
  }

  await RNFS.copyFile(backupPath, realmPath);
}
