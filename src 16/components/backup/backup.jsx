import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRealmBackup } from '../../scripts/backup/useRealmBackup';
import { RealmOptions } from '../../model/store';

export function Backup() {
  const realmConfig = RealmOptions(); // ✅ FULL config

  const { backup, loading, error } =
    useRealmBackup(realmConfig);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Backup Database
      </Text>

      <Text style={{ marginBottom: 20 }}>
        This will save your restaurant data to Google Drive.
      </Text>

      <Button
        title={loading ? 'Backing up...' : 'Backup Now'}
        onPress={backup}
        disabled={loading}
      />

      {error && (
        <Text style={{ color: 'red', marginTop: 10 }}>
          {error}
        </Text>
      )}
    </View>
  );
}
