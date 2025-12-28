import Realm from 'realm';
import RNFS from 'react-native-fs';

export async function createRealmSnapshot(realmConfig) {
  const realm = await Realm.open(realmConfig);

  const backupPath =
    `${RNFS.DocumentDirectoryPath}/backup.realm`;

  realm.writeCopyTo({ path: backupPath });
  realm.close();

  return backupPath;
}
