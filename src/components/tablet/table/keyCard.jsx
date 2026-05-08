/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {useWindowDimensions, ScrollView} from 'react-native';
import {
  YStack,
  StyledSpacer,
  StyledPressable,
  Stack,
} from 'fluent-styles';
import Text from '../../text';
import {StyledIcon} from '../../package/icon';
import {theme} from '../../../utils/theme';
import {useAppTheme} from '../../../theme';

export default function KeyCard({onSubmit, onClose, table_name, table_id, prefill}) {
  const [pad, setPad] = useState(
    prefill?.guest_count ? String(prefill.guest_count) : '',
  );

  const {width, height} = useWindowDimensions();
  const {t} = useAppTheme();

  const isCompact = width < 700;
  const isMedium = width >= 700 && width < 1100;

  const modalWidth = isCompact
    ? Math.min(width * 0.92, 420)
    : isMedium
      ? Math.min(width * 0.52, 460)
      : Math.min(width * 0.36, 500);

  const keySize = isCompact ? 64 : isMedium ? 72 : 76;
  const keyGap = isCompact ? 8 : 10;

  const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '<'];

  const handleKeyPress = key => {
    setPad(prev => {
      if (key === '<') return prev.slice(0, -1);
      if (prev === '0') return key;
      return prev + key;
    });
  };

  const handleSubmit = () => {
    onSubmit({
      table_id,
      guest_count: pad,
      guest_name: prefill?.guest_name || 'Guest',
      isOccupied: 1,
      start_time: new Date().toTimeString().split(' ')[0],
    });
    onClose();
  };

  const handleClose = () => {
    setPad('');
    onClose();
  };

  const canSubmit = pad.length > 0 && pad !== '0';

  return (
    <YStack
      backgroundColor="rgba(0,0,0,0.6)"
      flex={1}
      justifyContent="center"
      alignItems="center"
      paddingHorizontal={16}>
      <Stack
        width={modalWidth}
        maxHeight={height * 0.86}
        borderRadius={18}
        overflow="hidden"
        backgroundColor={theme.colors.gray[900]}>
        {/* Header */}
        <Stack
          horizontal
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={24}
          paddingVertical={16}>
          <Stack horizontal flex={1} alignItems="center" gap={8}>
            <StyledIcon name="attach-money" size={24} color={t.textInverse} />
            <Stack vertical>
              <Text variant="label" color={t.textInverse}>
                {table_name}
              </Text>
              {prefill?.guest_name && (
                <Text variant="caption" color={t.textMuted}>
                  {prefill.guest_name}
                </Text>
              )}
            </Stack>
          </Stack>

          <StyledPressable onPress={handleClose}>
            <StyledIcon
              pointerEvents="none"
              name="cancel"
              size={48}
              color={t.textInverse}
            />
          </StyledPressable>
        </Stack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            alignItems: 'center',
          }}>
          <Text variant="body" color={t.textInverse} marginTop={8} marginBottom={16}>
            {prefill?.guest_count
              ? 'Confirm number of guests'
              : 'Enter number of guests'}
          </Text>

          {!!pad && (
            <Text variant="metric" color={t.textInverse}>
              {pad}
            </Text>
          )}

          <StyledSpacer marginVertical={10} />

          {/* Keypad: always 3-column phone-style keypad */}
          <Stack
            horizontal
            flexWrap="wrap"
            justifyContent="center"
            width={keySize * 3 + keyGap * 2}>
            {keypad.map((num, index) => (
              <StyledPressable
                key={`${num}-${index}`}
                onPress={() => handleKeyPress(num)}
                width={keySize}
                height={keySize}
                marginRight={(index + 1) % 3 === 0 ? 0 : keyGap}
                marginBottom={keyGap}
                borderRadius={12}
                backgroundColor={t.bgCard}
                borderWidth={1}
                borderColor={t.borderDefault}
                alignItems="center"
                justifyContent="center">
                <Text variant="label" color={t.textPrimary}>
                  {num}
                </Text>
              </StyledPressable>
            ))}
          </Stack>
        </ScrollView>

        {/* Actions */}
        <Stack
          horizontal
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={20}
          paddingVertical={16}
          borderTopWidth={1}
          borderColor={t.borderDefault}>
          <StyledPressable
            borderWidth={1}
            borderColor={t.textSecondary}
            paddingHorizontal={24}
            paddingVertical={12}
            borderRadius={25}
            onPress={handleClose}>
            <Text variant="button" color={t.textInverse}>
              Close
            </Text>
          </StyledPressable>

          <StyledPressable
            backgroundColor={canSubmit ? t.brandPrimary : t.borderDefault}
            paddingHorizontal={32}
            paddingVertical={12}
            borderRadius={25}
            onPress={() => canSubmit && handleSubmit()}>
            <Text variant="button" color={canSubmit ? t.textOnAmber : t.textMuted}>
              Open
            </Text>
          </StyledPressable>
        </Stack>
      </Stack>
    </YStack>
  );
}