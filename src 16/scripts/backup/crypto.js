import CryptoJS from 'crypto-js';
import RNFS from 'react-native-fs';

export const encryptFile = async (
  inputPath,
  password
) => {
  try {
    const content = await RNFS.readFile(inputPath, 'base64');
    const encrypted = CryptoJS.AES.encrypt(content, password).toString();

    const encryptedPath = `${inputPath}.enc`;
    await RNFS.writeFile(encryptedPath, encrypted, 'utf8');

    return encryptedPath;
  } catch (error) {
    console.error('Error encrypting file:', error);
    throw error;
  }
};

export const decryptFile = async (
  encryptedPath,
  outputPath,
  password
) => {
  const encrypted = await RNFS.readFile(encryptedPath, 'utf8');
  const decrypted = CryptoJS.AES.decrypt(encrypted, password)
    .toString(CryptoJS.enc.Utf8);

  await RNFS.writeFile(outputPath, decrypted, 'base64');
};
