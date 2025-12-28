import { useState, useCallback } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createRealmSnapshot } from './realmSnapshot';
import { uploadToDrive } from './driveUpload';

export function useRealmBackup(realmConfig) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backup = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await GoogleSignin.signIn();
      const { accessToken } =
        await GoogleSignin.getTokens();

      const snapshotPath =
        await createRealmSnapshot(realmConfig);

      await uploadToDrive(accessToken, snapshotPath);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [realmConfig]);

  return { backup, loading, error };
}
