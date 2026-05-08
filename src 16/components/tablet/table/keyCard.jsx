/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
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
    prefill?.guest_count ? String(prefill.guest_count) : ''
  );
  const {t} = useAppTheme();
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
      guest_name:  prefill?.guest_name || 'Guest',
      isOccupied:  1,
      start_time:  new Date().toTimeString().split(' ')[0],
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
      alignItems="center">
      <YStack
        width="30%"
        backgroundColor={theme.colors.transparent05}
        borderRadius={16}
        justifyContent="center"
        alignItems="center">
        <Stack borderRadius={16} backgroundColor={theme.colors.gray[900]}>
          {/* Header */}
          <Stack
            horizontal
            justifyContent="space-between"
            alignItems="center"
            paddingHorizontal={24}
            paddingVertical={16}>
            <Stack
              horizontal
              flex={1}
              justifyContent="flex-start"
              alignItems="center"
              gap={8}>
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

          {/* Body */}
          <Stack
            paddingHorizontal={16}
            paddingVertical={16}
            justifyContent="center"
            alignItems="center"
            vertical>
            <Text
              variant="body"
              color={t.textInverse}
              marginBottom={24}>
              {prefill?.guest_count
                ? 'Confirm number of guests'
                : 'Enter number of guests'}
            </Text>
            <Text variant="metric" color={t.textInverse}>
              {pad}
            </Text>
            <StyledSpacer marginVertical={16} />

            {/* Keypad */}
            <Stack
              horizontal
              flexWrap="wrap"
              justifyContent="center"
              paddingHorizontal={8}>
              {keypad.map((num, i) => (
                <StyledPressable
                  key={i}
                  onPress={() => handleKeyPress(num)}
                  width="30%"
                  margin="1.5%"
                  height={70}
                  borderRadius={10}
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
            <StyledSpacer marginVertical={8} />

            {/* Actions */}
            <Stack
              horizontal
              justifyContent="space-between"
              paddingHorizontal={16}
              paddingVertical={16}
              borderTopWidth={1}
              borderColor={t.borderDefault}>
              <StyledPressable
                borderWidth={1}
                borderColor={t.textSecondary}
                paddingHorizontal={20}
                paddingVertical={10}
                borderRadius={25}
                onPress={handleClose}>
                <Text variant="button" color={t.textInverse}>
                  Close
                </Text>
              </StyledPressable>
              <StyledSpacer flex={1} />
              <StyledPressable
                backgroundColor={canSubmit ? t.brandPrimary : t.borderDefault}
                paddingHorizontal={30}
                paddingVertical={10}
                borderRadius={25}
                onPress={() => canSubmit && handleSubmit()}>
                <Text
                  variant="button"
                  color={canSubmit ? t.textOnAmber : t.textMuted}>
                  Open
                </Text>
              </StyledPressable>
            </Stack>
          </Stack>
        </Stack>
      </YStack>
    </YStack>
  );
}