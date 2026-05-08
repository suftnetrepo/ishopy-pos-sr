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

      // 1️⃣ Ensure Google services are available (Android-safe)
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // 2️⃣ Sign in ONLY if needed
      const isSignedIn = await GoogleSignin.signIn();
      if (!isSignedIn) {
        await GoogleSignin.signIn();
      }

      // 3️⃣ Get fresh access token (auto refresh happens here)
      const { accessToken } = await GoogleSignin.getTokens();

      if (!accessToken) {
        throw new Error('Failed to obtain Google access token');
      }

      // 4️⃣ Create Realm snapshot
      const snapshotPath = await createRealmSnapshot(realmConfig);

      // 5️⃣ Upload to Google Drive
      await uploadToDrive(accessToken, snapshotPath);

    } catch (e) {
      console.error('[Realm Backup Error]', e);
      setError(e?.message || 'Backup failed');
    } finally {
      setLoading(false);
    }
  }, [realmConfig]);

  return { backup, loading, error };
}
