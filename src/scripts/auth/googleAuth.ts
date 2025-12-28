import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleAuth = () => {
  GoogleSignin.configure({
    webClientId: '361890514637-jkin0hlkt9nqv7dl0gtuddc5as9ne2e1.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/drive.appdata'],
  });
};
