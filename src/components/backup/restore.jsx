import React, { useEffect } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
} from 'react-native';
import RNRestart from 'react-native-restart';
import { useRealmRestore } from '../../scripts/backup/useRealmRestore';

export function Restore() {
  const {
    backups,
    loadBackups,
    restore,
    loading,
    error,
  } = useRealmRestore();

  useEffect(() => {
    loadBackups();
  }, [loadBackups]);

  const confirmRestore = (item) => {
    Alert.alert(
      'Restore Backup',
      'This will replace all local data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            await restore(item.id);
            RNRestart.Restart();
          },
        },
      ]
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Restore Database
      </Text>

      <Text style={{ marginBottom: 20 }}>
        Select a backup from Google Drive to restore.
      </Text>

      {error && (
        <Text style={{ color: 'red' }}>
          {error}
        </Text>
      )}

      <FlatList
        data={backups}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text>No backups found.</Text>
        }
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Button
              title={new Date(
                item.createdTime
              ).toLocaleString()}
              onPress={() => confirmRestore(item)}
              disabled={loading}
            />
          </View>
        )}
      />
    </View>
  );
}
