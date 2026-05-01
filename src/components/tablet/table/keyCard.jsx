/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  YStack,
  StyledSpacer,
  StyledText,
  StyledPressable,
  Stack,
} from 'fluent-styles';
import {StyledIcon} from '../../package/icon';
import {fontStyles, theme} from '../../../utils/theme';
import {useAppTheme} from '../../../theme';

export default function KeyCard({onSubmit, onClose, table_name, table_id}) {
  const [pad, setPad] = useState('');
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
      guest_name: 'Guest',
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
              <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                color={t.textInverse}
                fontSize={theme.fontSize.large}
                fontWeight={theme.fontWeight.medium}>
                {table_name}
              </StyledText>
            </Stack>
            <StyledIcon
              name="cancel"
              size={48}
              color={t.textInverse}
              onPress={handleClose}
            />
          </Stack>

          {/* Body */}
          <Stack
            paddingHorizontal={16}
            paddingVertical={16}
            justifyContent="center"
            alignItems="center"
            vertical>
            <StyledText
              marginBottom={24}
              fontFamily={fontStyles.Roboto_Regular}
              color={t.textMuted}
              fontSize={theme.fontSize.normal}
              fontWeight={theme.fontWeight.thin}>
              Enter number of guests
            </StyledText>
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              color={t.textInverse}
              fontSize={theme.fontSize.large}
              fontWeight={theme.fontWeight.medium}>
              {pad}
            </StyledText>
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
                  <StyledText
                    color={t.textPrimary}
                    fontFamily={fontStyles.Roboto_Regular}
                    fontSize={theme.fontSize.large}
                    fontWeight={theme.fontWeight.medium}>
                    {num}
                  </StyledText>
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
                <StyledText
                  fontFamily={fontStyles.Roboto_Regular}
                  color={t.textInverse}>
                  Close
                </StyledText>
              </StyledPressable>
              <StyledSpacer flex={1} />
              <StyledPressable
                backgroundColor={canSubmit ? t.brandPrimary : '#3a3a3a'}
                paddingHorizontal={30}
                paddingVertical={10}
                borderRadius={25}
                onPress={() => canSubmit && handleSubmit()}>
                <StyledText
                  fontFamily={fontStyles.Roboto_Regular}
                  color={canSubmit ? t.textOnAmber : t.textMuted}>
                  Open
                </StyledText>
              </StyledPressable>
            </Stack>
          </Stack>
        </Stack>
      </YStack>
    </YStack>
  );
}
