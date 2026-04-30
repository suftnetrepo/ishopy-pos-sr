/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {
  StyledPage,
  StyledText,
  StyledSpacer,
  StyledPressable,
  StyledSpinner,
  Stack,
  theme,
  toastService,
} from 'fluent-styles';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import {StyledIcon} from '../../../components/package/icon';
import useKursaBackup from '../../../scripts/backup/useKursaBackup';

const InfoRow = ({icon, label, value}) => (
  <Stack horizontal alignItems="center" gap={10} paddingVertical={10}
    borderBottomWidth={0.5} borderBottomColor={theme.colors.gray[100]}>
    <StyledIcon name={icon} size={18} color={theme.colors.gray[400]} />
    <StyledText fontSize={theme.fontSize.small} color={theme.colors.gray[500]} flex={1}>{label}</StyledText>
    <StyledText fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.medium} color={theme.colors.gray[700]}>{value}</StyledText>
  </Stack>
);

const BackupRow = ({file, onRestore, restoring}) => (
  <Stack horizontal alignItems="center" gap={12} paddingVertical={12}
    borderBottomWidth={0.5} borderBottomColor={theme.colors.gray[100]}>
    <Stack width={36} height={36} borderRadius={8} backgroundColor={theme.colors.blue[50]}
      alignItems="center" justifyContent="center">
      <StyledIcon name="cloud-done" size={18} color={theme.colors.blue[600]} />
    </Stack>
    <Stack vertical flex={1} gap={2}>
      <StyledText fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.medium}
        color={theme.colors.gray[800]} numberOfLines={1}>{file.date}</StyledText>
      <StyledText fontSize={10} color={theme.colors.gray[400]}>{file.size}</StyledText>
    </Stack>
    <StyledPressable
      onPress={() => Alert.alert('Restore this backup?',
        'This will replace all current data. The app will need to restart.',
        [{text: 'Cancel', style: 'cancel'},
         {text: 'Restore', style: 'destructive', onPress: () => onRestore(file.id)}])}
      borderWidth={1} borderColor={theme.colors.amber[300]}
      backgroundColor={theme.colors.amber[50]}
      borderRadius={8} paddingHorizontal={14} paddingVertical={6}
      disabled={restoring}>
      <StyledText fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.medium}
        color={theme.colors.amber[700]}>Restore</StyledText>
    </StyledPressable>
  </Stack>
);

const BackupScreen = () => {
  const [showFiles, setShowFiles] = useState(false);
  const {backup, backingUp, backupError, lastBackup,
         listBackups, restore, restoring, restoreError,
         backupFiles, signIn, signOut, isSignedIn} = useKursaBackup();

  useEffect(() => {
    if (backupError) toastService.show({message: 'Backup failed', description: backupError, variant: 'error', duration: 3000, theme: 'light'});
  }, [backupError]);

  useEffect(() => {
    if (restoreError) toastService.show({message: 'Restore failed', description: restoreError, variant: 'error', duration: 3000, theme: 'light'});
  }, [restoreError]);

  const handleBackup = async () => {
    await backup();
    toastService.show({message: 'Backup saved', description: 'Your data was saved to Google Drive.', variant: 'success', duration: 2500, theme: 'light'});
  };

  const handleShowFiles = async () => {
    setShowFiles(true);
    await listBackups();
  };

  return (
    <StyledPage backgroundColor={theme.colors.gray[100]}>
      <StyledPage.Header.Full>
        <RenderHeader showBackButton showLogo={false} showTitle title="Backup & Restore" />
      </StyledPage.Header.Full>
      <Stack horizontal flex={1.5}>
        <SideBarAdapter selectedMenu={5} showMenu={false} collapse />
        <Stack flex={3} paddingHorizontal={16} vertical>

          {/* Google account */}
          <Stack backgroundColor={theme.colors.gray[1]} borderRadius={14} padding={16} marginTop={16} marginBottom={12}>
            <StyledText fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.semiBold}
              color={theme.colors.gray[500]} marginBottom={12} letterSpacing={0.5}>GOOGLE ACCOUNT</StyledText>
            {!isSignedIn ? (
              <StyledPressable onPress={signIn} flexDirection='row' alignItems="center" gap={12}
                borderWidth={1} borderColor={theme.colors.gray[200]}
                backgroundColor={theme.colors.gray[50]} borderRadius={12} padding={14}>
                <Stack width={36} height={36} borderRadius={18} backgroundColor={theme.colors.blue[50]}
                  alignItems="center" justifyContent="center">
                  <StyledIcon name="account-circle" size={22} color={theme.colors.blue[600]} />
                </Stack>
                <Stack vertical flex={1}>
                  <StyledText fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.medium} color={theme.colors.gray[800]}>Sign in with Google</StyledText>
                  <StyledText fontSize={10} color={theme.colors.gray[400]}>Required to backup and restore</StyledText>
                </Stack>
                <StyledIcon name="chevron-right" size={20} color={theme.colors.gray[400]} />
              </StyledPressable>
            ) : (
              <Stack horizontal alignItems="center" gap={12}>
                <Stack width={36} height={36} borderRadius={18} backgroundColor={theme.colors.green[50]}
                  alignItems="center" justifyContent="center">
                  <StyledIcon name="check-circle" size={22} color={theme.colors.green[600]} />
                </Stack>
                <Stack vertical flex={1}>
                  <StyledText fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.medium} color={theme.colors.gray[800]}>Connected to Google Drive</StyledText>
                  <StyledText fontSize={10} color={theme.colors.gray[400]}>Backups saved to "Kursa Backups" folder</StyledText>
                </Stack>
                <StyledPressable onPress={signOut} borderWidth={1} borderColor={theme.colors.red[200]}
                  backgroundColor={theme.colors.red[50]} borderRadius={8} paddingHorizontal={12} paddingVertical={6}>
                  <StyledText fontSize={theme.fontSize.small} color={theme.colors.red[600]}>Sign out</StyledText>
                </StyledPressable>
              </Stack>
            )}
          </Stack>

          {/* Backup */}
          <Stack backgroundColor={theme.colors.gray[1]} borderRadius={14} padding={16} marginBottom={12}>
            <StyledText fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.semiBold}
              color={theme.colors.gray[500]} marginBottom={12} letterSpacing={0.5}>BACKUP</StyledText>
            <Stack horizontal alignItems="center" gap={10} marginBottom={16}>
              <StyledIcon name="info-outline" size={16} color={theme.colors.gray[400]} />
              <StyledText fontSize={theme.fontSize.small} color={theme.colors.gray[500]} flex={1}>
                Saves all menus, orders, tables and settings to Google Drive.
              </StyledText>
            </Stack>
            {lastBackup && <InfoRow icon="history" label="Last backup" value={lastBackup} />}
            <StyledSpacer marginVertical={8} />
            <StyledPressable onPress={handleBackup} disabled={!isSignedIn || backingUp}
              backgroundColor={isSignedIn ? theme.colors.amber[500] : theme.colors.gray[200]}
              borderRadius={12} paddingVertical={14} alignItems="center" justifyContent="center" horizontal gap={8}>
              <StyledIcon name="cloud-upload" size={20} color={isSignedIn ? theme.colors.gray[900] : theme.colors.gray[400]} />
              <StyledText fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.semiBold}
                color={isSignedIn ? theme.colors.gray[900] : theme.colors.gray[400]}>
                {backingUp ? 'Backing up...' : 'Back up now'}
              </StyledText>
            </StyledPressable>
          </Stack>

          {/* Restore */}
          <Stack backgroundColor={theme.colors.gray[1]} borderRadius={14} padding={16} marginBottom={12}>
            <Stack horizontal justifyContent="space-between" alignItems="center" marginBottom={12}>
              <StyledText fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.semiBold}
                color={theme.colors.gray[500]} letterSpacing={0.5}>RESTORE</StyledText>
              {isSignedIn && (
                <StyledPressable onPress={handleShowFiles}
                  borderWidth={1} borderColor={theme.colors.gray[200]}
                  backgroundColor={theme.colors.gray[50]} borderRadius={8} paddingHorizontal={12} paddingVertical={5}>
                  <StyledText fontSize={theme.fontSize.small} color={theme.colors.gray[600]}>
                    {showFiles ? 'Refresh' : 'Show backups'}
                  </StyledText>
                </StyledPressable>
              )}
            </Stack>
            {!isSignedIn && <StyledText fontSize={theme.fontSize.small} color={theme.colors.gray[400]}>Sign in to Google to see your backups.</StyledText>}
            {showFiles && backupFiles.length === 0 && (
              <Stack alignItems="center" paddingVertical={24} gap={8}>
                <StyledIcon name="cloud-off" size={32} color={theme.colors.gray[300]} />
                <StyledText fontSize={theme.fontSize.small} color={theme.colors.gray[400]}>No backups found in Google Drive</StyledText>
              </Stack>
            )}
            {showFiles && backupFiles.map(file => (
              <BackupRow key={file.id} file={file} onRestore={restore} restoring={restoring} />
            ))}
          </Stack>

          {/* How it works */}
          <Stack backgroundColor={theme.colors.gray[1]} borderRadius={14} padding={16}>
            <StyledText fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.semiBold}
              color={theme.colors.gray[500]} marginBottom={12} letterSpacing={0.5}>HOW IT WORKS</StyledText>
            {[
              {icon: 'cloud-upload', text: 'Tap "Back up now" to save everything to your Google Drive'},
              {icon: 'devices',      text: 'On a new device, sign in to the same Google account and restore'},
              {icon: 'lock-outline', text: 'Only you can access your backups — stored in your personal Drive'},
              {icon: 'schedule',     text: 'Back up regularly, especially before updates'},
            ].map((item, i) => (
              <Stack key={i} horizontal alignItems="flex-start" gap={10}
                paddingVertical={8} borderBottomWidth={i < 3 ? 0.5 : 0} borderBottomColor={theme.colors.gray[100]}>
                <StyledIcon name={item.icon} size={16} color={theme.colors.amber[600]} />
                <StyledText fontSize={theme.fontSize.small} color={theme.colors.gray[600]} flex={1}>{item.text}</StyledText>
              </Stack>
            ))}
          </Stack>

        </Stack>
      </Stack>
      {(backingUp || restoring) && <StyledSpinner />}
    </StyledPage>
  );
};

export default BackupScreen;