import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  YStack,
  XStack,
  StyledSpacer,
  StyledText,
  StyleShape,
  StyledPressable,
} from 'fluent-styles';
import {StyledMIcon} from '../../icon';
import {useAppContext} from '../../../hooks/appContext';
import {fontStyles} from '../../../utils/fontStyles';
import {theme} from '../../../utils/theme';
import {updateOccupancy} from '../../../hooks/useTable';
import {useAppTheme} from '../../../theme';
import {formatCurrency} from '../../../utils/help';

const CheckOut = ({
  table_id,
  table_name,
  order,
  printHandler,
  shareReceipt,
  onClose,
}) => {
  const {t} = useAppTheme();
  const {clearItem, shop} = useAppContext();
  const navigator = useNavigation();

  const close = async () => {
    clearItem(table_id);
    await updateOccupancy(table_id, 0, 0, '', '');

    if (shop.mode === 'restaurant') {
      navigator.navigate('big-table');
    } else {
      onClose();
    }
  };

  const print = () => {
    printHandler(table_name, order);
  };

  const share = () => {
    shareReceipt(table_name, order);
  };

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="rgba(0, 0, 0, 0.7)">
      <YStack
        maxWidth={480}
        width="90%"
        padding={24}
        borderRadius={16}
        backgroundColor={t.bgCard}
        borderWidth={1}
        borderColor={t.borderDefault}
        alignItems="center"
        shadowColor="black"
        shadowOffset={{width: 0, height: 12}}
        shadowOpacity={0.22}
        shadowRadius={24}
        elevation={16}>
        {/* Close Button */}
        <StyledPressable width="100%" justifyContent="flex-end" marginBottom={12}   onPress={() => close()}>
          <StyleShape cycle size={48} borderWidth={1} borderColor={t.borderDefault}>
            <StyledMIcon
            pointerEvents="none"
              name="close"
              size={24}
              color={t.textSecondary}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            />
          </StyleShape>
        </StyledPressable>

        {/* Success Icon with Shadow */}
        <YStack
          width={100}
          height={100}
          borderRadius={50}
          alignItems="center"
          justifyContent="center"
          marginTop={16}
          marginBottom={20}
          shadowColor={t.successColor}
          shadowOffset={{width: 0, height: 8}}
          shadowOpacity={0.2}
          shadowRadius={12}
          elevation={8}>
          <StyledMIcon name="check-circle" size={100} color={t.successColor} />
        </YStack>

        {/* Title */}
        <StyledText
          fontFamily={fontStyles.Roboto_Regular}
          color={t.textPrimary}
          fontWeight="700"
          fontSize={24}
          textAlign="center"
          marginTop={16}>
          Payment Successful
        </StyledText>

        {/* Subtitle */}
        <StyledText
          fontFamily={fontStyles.Roboto_Regular}
          color={t.textSecondary}
          fontWeight="400"
          fontSize={14}
          textAlign="center"
          marginTop={6}>
          {formatCurrency(shop?.currency || '£', order?.amount || 0)} received
        </StyledText>

        <StyledSpacer marginVertical={20} />

        {/* Buttons */}
        <XStack width="100%" gap={12} horizontal>
          <StyledPressable
            flex={1}
            height={44}
            borderRadius={12}
            backgroundColor={t.bgInput}
            borderWidth={1}
            borderColor={t.borderDefault}
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
            gap={8}
            onPress={() => share()}>
            <StyledMIcon name="email" size={20} color={t.textPrimary} />
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontWeight="600"
              color={t.textPrimary}
              fontSize={14}>
              Email Receipt
            </StyledText>
          </StyledPressable>

          <StyledPressable
            flex={1}
            height={44}
            borderRadius={12}
            backgroundColor={t.brandPrimary}
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
            gap={8}
            onPress={() => print()}>
            <StyledMIcon name="print" size={20} color={t.textInverse} />
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontWeight="600"
              color={t.textInverse}
              fontSize={14}>
              Print Receipt
            </StyledText>
          </StyledPressable>
        </XStack>

        <StyledPressable
          width="100%"
          height={44}
          marginTop={12}
          borderRadius={12}
          justifyContent="center"
          alignItems="center"
          onPress={() => close()}>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontWeight="600"
            color={t.textSecondary}
            fontSize={14}>
            Close
          </StyledText>
        </StyledPressable>
      </YStack>
    </YStack>
  );
};

export default CheckOut;
