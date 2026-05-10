/* eslint-disable prettier/prettier */
import React, {useMemo, useState} from 'react';
import {ScrollView, useWindowDimensions} from 'react-native';
import {
  StyledText,
  StyledSpinner,
  StyledOkDialog,
  StyledDialog,
  Stack,
  StyledPressable,
  YStack,
} from 'fluent-styles';
import {fontStyles, theme} from '../../../../utils/theme';
import {useAppContext} from '../../../../hooks/appContext';
import {formatCurrency} from '../../../../utils/help';
import CheckOut from '../../../../components/tablet/checkout';
import {useInsertPayment} from '../../../../hooks/usePayment';
import {updataStatusHandler} from '../../../../hooks/useOrder';
import {useAppTheme} from '../../../../theme';

const QUICK_AMOUNTS = [10, 20, 40, 60, 80, 100];
const KEYPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '<'];

export default function Payment({
  payment_method,
  onClose,
  table_name,
  table_id,
  order_id,
  printHandler,
  shareReceipt,
}) {
  const {getTotalPrice, shop} = useAppContext();
  const {t} = useAppTheme();
  const {width, height} = useWindowDimensions();
  const {insert, data, error, loading, success} = useInsertPayment();

  const isCompact = width < 900;
  const isWide = width >= 1200;

  const subtotal = getTotalPrice(table_id) || 0;
  const baseTotal = subtotal;
  const cur = shop?.currency || '£';

  const [chipPounds, setChipPounds] = useState(0);
  const [keyDigits, setKeyDigits] = useState('');

  const keyAmount = keyDigits ? parseFloat(keyDigits) || 0 : 0;
  const amountToPay = chipPounds + keyAmount;
  const change = amountToPay - baseTotal;
  const hasInput = chipPounds > 0 || keyDigits.length > 0;
  const canPay =
    parseFloat(amountToPay.toFixed(2)) >= parseFloat(baseTotal.toFixed(2));

  // ── Responsive grid dimensions ────────────────────────────────────────────
  // Since drawer width is dynamic, use fixed button sizes that scale with screen
  // Keypad: always 3-column, button size scales by viewport
  const keypadButtonSize = useMemo(() => {
    if (width < 600) return 52;
    if (width < 900) return 58;
    if (width < 1200) return 62;
    return 66;
  }, [width]);

  const keypadGap = 8;
  const keypadGridWidth = keypadButtonSize * 3 + keypadGap * 2;

  // Quick amounts: 2-column grid with smart responsive sizing
  // Use fixed max sizes and scale down gracefully
  const quickAmountButtonSize = useMemo(() => {
    if (width < 600) return 86;  // Small phones
    if (width < 900) return 110; // Tablets  
    if (width < 1200) return 125; // Large tablets
    return 140; // Extra large
  }, [width]);

  const quickAmountGap = 8;
  const quickAmountGridWidth = quickAmountButtonSize * 2 + quickAmountGap;

  const handleQuickAmount = amount => setChipPounds(prev => prev + amount);

  const handleKeyPress = key => {
    setKeyDigits(prev => {
      if (key === '<') return prev.slice(0, -1);
      if (key === '.') {
        if (prev.includes('.')) return prev;
        return (prev || '0') + '.';
      }
      if (prev === '0') return key;
      return prev + key;
    });
  };

  const handleClear = () => {
    setChipPounds(0);
    setKeyDigits('');
  };

  const handleClose = () => {
    handleClear();
    onClose();
  };

  const handleSubmit = async () => {
    if (!canPay || !order_id) return;

    insert({
      order_id,
      amount: parseFloat(baseTotal),
      payment_method,
      date: new Date().toISOString(),
    }).then(() => updataStatusHandler(order_id, 'Completed'));
  };

  return (
    <Stack
      flex={1}
      vertical
      backgroundColor={t.bgCard}
      borderWidth={1}
      borderColor={t.borderDefault}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: isCompact ? 12 : 16,
          paddingVertical: 18,
          minHeight: height * 0.82,
          flexGrow: 1,
        }}>
        {/* Top: Amount due */}
        <YStack alignItems="center" gap={8} marginBottom={24}>
          {hasInput && (
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              textAlign="center"
              color={t.textMuted}
              fontSize={theme.fontSize.xlarge}
              fontWeight={theme.fontWeight.medium}>
              Received {formatCurrency(cur, amountToPay)}
            </StyledText>
          )}

          <StyledText
            textAlign="center"
            color={t.textPrimary}
            fontSize={isCompact ? 36 : 44}
            fontWeight={theme.fontWeight.bold}
            fontFamily={fontStyles.Roboto_Regular}>
            {formatCurrency(cur, baseTotal)}
          </StyledText>

          {hasInput && change > 0 && (
            <Stack
              marginTop={8}
              paddingHorizontal={14}
              paddingVertical={6}
              borderRadius={999}
              backgroundColor={`${t.successColor}12`}>
              <StyledText
                textAlign="center"
                fontFamily={fontStyles.Roboto_Regular}
                fontSize={theme.fontSize.normal}
                color={t.successColor}
                fontWeight={theme.fontWeight.medium}>
                Change {formatCurrency(cur, change)}
              </StyledText>
            </Stack>
          )}
        </YStack>

        {/* Quick amounts: 2-column centered grid */}
        <Stack
          alignItems="center"
          marginBottom={24}>
          <Stack
            horizontal
            gap={quickAmountGap}
            justifyContent="center"
            width={quickAmountGridWidth}
            flexWrap="wrap">
            {QUICK_AMOUNTS.map((amount) => (
              <StyledPressable
                key={`quick-${amount}`}
                onPress={() => handleQuickAmount(amount)}
                paddingHorizontal={16}
                paddingVertical={8}
                borderRadius={30}
                backgroundColor={t.bgInput}
                borderWidth={1}
                borderColor={t.borderDefault}
                alignItems="center"
                justifyContent="center">
                <StyledText
                  fontFamily={fontStyles.Roboto_Regular}
                  color={t.textPrimary}
                  fontWeight={theme.fontWeight.normal}
                  fontSize={theme.fontSize.small}>
                  {formatCurrency(cur, amount)}
                </StyledText>
              </StyledPressable>
            ))}
          </Stack>
        </Stack>

        {/* Keypad: 3-column centered grid */}
        <Stack
          alignItems="center"
          marginBottom={8}
          flex={1}>
          <Stack
            horizontal
            justifyContent="center"
            flexWrap="wrap">
            {KEYPAD.map((num, index) => (
              <StyledPressable
                key={`key-${num}-${index}`}
                onPress={() => handleKeyPress(num)}
                paddingHorizontal={32}
                paddingVertical={16}
                borderRadius={12}
                backgroundColor={t.bgInput}
                margin={8}
                borderWidth={1}
                borderColor={t.borderDefault}
                alignItems="center"
                justifyContent="center">
                <StyledText
                  color={t.textPrimary}
                  fontFamily={fontStyles.Roboto_Regular}
                  fontSize={theme.fontSize.xlarge}
                  fontWeight={theme.fontWeight.medium}>
                  {num}
                </StyledText>
              </StyledPressable>
            ))}
          </Stack>
        </Stack>
         <Stack
        horizontal
        paddingHorizontal={isCompact ? 16 : 24}
        paddingVertical={16}
        gap={12}
        borderTopWidth={1}
        borderColor={t.borderDefault}
        backgroundColor={t.bgCard}>
        <StyledPressable
          flex={1}
          height={48}
          backgroundColor={t.bgInput}
          borderWidth={1}
          borderColor={t.borderDefault}
          alignItems="center"
          justifyContent="center"
          borderRadius={14}
          onPress={handleClear}
          disabled={!hasInput}>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontWeight={theme.fontWeight.medium}
            color={hasInput ? t.textSecondary : t.textMuted}
            fontSize={theme.fontSize.normal}>
            Clear
          </StyledText>
        </StyledPressable>

        <StyledPressable
          flex={1.4}
          height={48}
          backgroundColor={canPay ? t.successColor : t.borderDefault}
          alignItems="center"
          justifyContent="center"
          borderRadius={14}
          onPress={handleSubmit}
          disabled={!canPay || loading}>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontWeight={theme.fontWeight.medium}
            color={canPay ? t.textInverse : t.textMuted}
            fontSize={theme.fontSize.normal}>
            Pay {formatCurrency(cur, baseTotal)}
          </StyledText>
        </StyledPressable>
      </Stack>
      </ScrollView>

     

      {loading && <StyledSpinner />}

      {error && (
        <StyledOkDialog
          title={error?.message || 'Payment Error'}
          description="Please try again"
          visible={true}
          onOk={() => {}}
        />
      )}

      {success && data && (
        <StyledDialog visible>
          <CheckOut
            table_name={table_name}
            table_id={table_id}
            order={data}
            printHandler={printHandler}
            shareReceipt={shareReceipt}
            onClose={handleClose}
          />
        </StyledDialog>
      )}
    </Stack>
  );
}