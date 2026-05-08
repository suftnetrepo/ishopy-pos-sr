/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {
  StyledPage,
  StyledSpacer,
  StyledPressable,
  StyledSpinner,
  Stack,
  theme,
  toastService,
} from 'fluent-styles';
import Text from '../../../components/text';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import {StyledIcon} from '../../../components/package/icon';
import useKursaBackup from '../../../scripts/backup/useKursaBackup';
import usePremium from '../../../hooks/usePremium';
import {useAppTheme} from '../../../theme';

const InfoRow = ({icon, label, value, t}) => (
  <Stack horizontal alignItems="center" gap={10} paddingVertical={10}
    borderBottomWidth={0.5} borderBottomColor={t.bgPage}>
    <StyledIcon name={icon} size={18} color={t.textMuted} />
    <Text variant="body" color={t.textSecondary} flex={1}>{label}</Text>
    <Text variant="label" color={t.textSecondary}>{value}</Text>
  </Stack>
);

const BackupRow = ({file, onRestore, restoring, t}) => (
  <Stack horizontal alignItems="center" gap={12} paddingVertical={12}
    borderBottomWidth={0.5} borderBottomColor={t.bgPage}>
    <Stack width={36} height={36} borderRadius={8} backgroundColor={t.infoBg}
      alignItems="center" justifyContent="center">
      <StyledIcon name="cloud-done" size={18} color={t.infoColor} />
    </Stack>
    <Stack vertical flex={1} gap={2}>
      <Text variant="label" color={t.textPrimary} numberOfLines={1}>{file.date}</Text>
      <Text variant="caption" color={t.textMuted}>{file.size}</Text>
    </Stack>
    <StyledPressable
      onPress={() => Alert.alert('Restore this backup?',
        'This will replace all current data. The app will need to restart.',
        [{text: 'Cancel', style: 'cancel'},
         {text: 'Restore', style: 'destructive', onPress: () => onRestore(file.id)}])}
      borderWidth={1} borderColor={theme.colors.amber[300]}
      backgroundColor={t.brandPrimaryBg}
      borderRadius={8} paddingHorizontal={14} paddingVertical={6}
      disabled={restoring}>
      <Text variant="button" color={t.brandPrimaryText}>Restore</Text>
    </StyledPressable>
  </Stack>
);

const BackupScreen = () => {
  const [showFiles, setShowFiles] = useState(false);
  const {t} = useAppTheme();
  const {isPremium, requirePremium} = usePremium();
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
    if (!isPremium) { requirePremium(); return; }
    await backup();
    toastService.show({message: 'Backup saved', description: 'Your data was saved to Google Drive.', variant: 'success', duration: 2500, theme: 'light'});
  };

  const handleShowFiles = async () => {
    setShowFiles(true);
    await listBackups();
  };

  return (
    <StyledPage backgroundColor={t.bgPage}>
      <StyledPage.Header.Full>
        <RenderHeader showBackButton showLogo={false} showTitle title="Backup & Restore" />
      </StyledPage.Header.Full>
      <Stack horizontal flex={1.5}>
        <SideBarAdapter selectedMenu={5} showMenu={false} collapse />
        <Stack flex={3} paddingHorizontal={16} vertical>

          {/* Google account */}
          <Stack backgroundColor={t.bgCard} borderRadius={14} padding={16} marginTop={16} marginBottom={12}>
            <Text variant="overline" color={t.textSecondary} marginBottom={12} letterSpacing={0.5}>GOOGLE ACCOUNT</Text>
            {!isSignedIn ? (
              <StyledPressable onPress={signIn}
                flexDirection="row" alignItems="center" gap={12}
                borderWidth={1} borderColor={t.borderDefault}
                backgroundColor={t.bgPage} borderRadius={12} padding={14}>
                <Stack width={36} height={36} borderRadius={18} backgroundColor={t.infoBg}
                  alignItems="center" justifyContent="center">
                  <StyledIcon name="account-circle" size={22} color={t.infoColor} />
                </Stack>
                <Stack vertical flex={1}>
                  <Text variant="label" color={t.textPrimary}>Sign in with Google</Text>
                  <Text variant="caption" color={t.textMuted}>Required to backup and restore</Text>
                </Stack>
                <StyledIcon name="chevron-right" size={20} color={t.textMuted} />
              </StyledPressable>
            ) : (
              <Stack horizontal alignItems="center" gap={12}>
                <Stack width={36} height={36} borderRadius={18} backgroundColor={t.successBg}
                  alignItems="center" justifyContent="center">
                  <StyledIcon name="check-circle" size={22} color={t.successColor} />
                </Stack>
                <Stack vertical flex={1}>
                  <Text variant="label" color={t.textPrimary}>Connected to Google Drive</Text>
                  <Text variant="caption" color={t.textMuted}>Backups saved to "Kursa Backups" folder</Text>
                </Stack>
                <StyledPressable onPress={signOut} borderWidth={1} borderColor={t.dangerBg}
                  backgroundColor={t.dangerBg} borderRadius={8} paddingHorizontal={12} paddingVertical={6}>
                  <Text variant="button" color={t.dangerColor}>Sign out</Text>
                </StyledPressable>
              </Stack>
            )}
          </Stack>

          {/* Backup */}
          <Stack backgroundColor={t.bgCard} borderRadius={14} padding={16} marginBottom={12}>
            <Text variant="overline" color={t.textSecondary} marginBottom={12} letterSpacing={0.5}>BACKUP</Text>
            <Stack horizontal alignItems="center" gap={10} marginBottom={16}>
              <StyledIcon name="info-outline" size={16} color={t.textMuted} />
              <Text variant="body" color={t.textSecondary} flex={1}>
                Saves all menus, orders, tables and settings to Google Drive.
              </Text>
            </Stack>
            {lastBackup && <InfoRow icon="history" label="Last backup" value={lastBackup} 
                        t={t}/>}
            <StyledSpacer marginVertical={8} />
            <StyledPressable onPress={handleBackup} disabled={!isSignedIn || backingUp}
              backgroundColor={isSignedIn ? t.brandPrimary : t.borderDefault}
              borderRadius={12} paddingVertical={14} alignItems="center" justifyContent="center" horizontal gap={8}>
              <StyledIcon name="cloud-upload" size={20} color={isSignedIn ? t.textPrimary : t.textMuted} />
              <Text variant="button" color={isSignedIn ? t.textPrimary : t.textMuted}>
                {backingUp ? 'Backing up...' : 'Back up now'}
              </Text>
            </StyledPressable>
          </Stack>

          {/* Restore */}
          <Stack backgroundColor={t.bgCard} borderRadius={14} padding={16} marginBottom={12}>
            <Stack horizontal justifyContent="space-between" alignItems="center" marginBottom={12}>
              <Text variant="overline" color={t.textSecondary} letterSpacing={0.5}>RESTORE</Text>
              {isSignedIn && (
                <StyledPressable onPress={handleShowFiles}
                  borderWidth={1} borderColor={t.borderDefault}
                  backgroundColor={t.bgPage} borderRadius={8} paddingHorizontal={12} paddingVertical={5}>
                  <Text variant="body" color={t.textSecondary}>
                    {showFiles ? 'Refresh' : 'Show backups'}
                  </Text>
                </StyledPressable>
              )}
            </Stack>
            {!isSignedIn && <Text variant="body" color={t.textMuted}>Sign in to Google to see your backups.</Text>}
            {showFiles && backupFiles.length === 0 && (
              <Stack alignItems="center" paddingVertical={24} gap={8}>
                <StyledIcon name="cloud-off" size={32} color={t.textMuted} />
                <Text variant="body" color={t.textMuted}>No backups found in Google Drive</Text>
              </Stack>
            )}
            {showFiles && backupFiles.map(file => (
              <BackupRow key={file.id} file={file} onRestore={restore} restoring={restoring} 
                        t={t}/>
            ))}
          </Stack>

          {/* How it works */}
          <Stack backgroundColor={t.bgCard} borderRadius={14} padding={16}>
            <Text variant="overline" color={t.textSecondary} marginBottom={12} letterSpacing={0.5}>HOW IT WORKS</Text>
            {[
              {icon: 'cloud-upload', text: 'Tap "Back up now" to save everything to your Google Drive'},
              {icon: 'devices',      text: 'On a new device, sign in to the same Google account and restore'},
              {icon: 'lock-outline', text: 'Only you can access your backups — stored in your personal Drive'},
              {icon: 'schedule',     text: 'Back up regularly, especially before updates'},
            ].map((item, i) => (
              <Stack key={i} horizontal alignItems="flex-start" gap={10}
                paddingVertical={8} borderBottomWidth={i < 3 ? 0.5 : 0} borderBottomColor={t.bgPage}>
                <StyledIcon name={item.icon} size={16} color={t.brandPrimaryDark} />
                <Text variant="body" color={t.textSecondary} flex={1}>{item.text}</Text>
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