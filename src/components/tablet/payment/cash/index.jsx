/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Pressable,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import {
  StyledText,
  StyledSpacer,
  StyledSpinner,
  StyledOkDialog,
  StyledDialog,
  Stack,
  StyledChip,
} from 'fluent-styles';
import {fontStyles, theme} from '../../../../utils/theme';
import {useAppContext} from '../../../../hooks/appContext';
import {formatCurrency} from '../../../../utils/help';
import CheckOut from '../../../../components/tablet/checkout';
import {useInsertPayment} from '../../../../hooks/usePayment';
import {updataStatusHandler} from '../../../../hooks/useOrder';

const QUICK_AMOUNTS = [10, 20, 40, 60, 80, 100];

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
  const {insert, data, error, loading, success} = useInsertPayment();

  const subtotal  = getTotalPrice(table_id) || 0;
  const baseTotal = subtotal;
  const cur       = shop?.currency || '£';

  // ── State ─────────────────────────────────────────────────────
  // chipPounds : whole pounds accumulated from chip taps  e.g. 20
  // keyDigits  : digit string from the keypad             e.g. "3"
  //
  // KEY RULE: keyDigits always represents WHOLE POUNDS.
  //   "3"   → £3.00
  //   "23"  → £23.00
  //   "3.5" → £3.50  (decimal allowed for fine-tuning)
  //
  // amountToPay = chipPounds + parseFloat(keyDigits || 0)
  //
  // Examples:
  //   Chip £20 + key "3"    → 20 + 3   = £23.00  ✅
  //   Key "23" only         → 0  + 23  = £23.00  ✅
  //   Chip £20 only         → 20 + 0   = £20.00  ✅
  //   Chip £20 + key "3.50" → 20 + 3.5 = £23.50  ✅

  const [chipPounds, setChipPounds] = useState(0);
  const [keyDigits,  setKeyDigits]  = useState('');

  const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '<'];

  const keyAmount   = keyDigits ? parseFloat(keyDigits) || 0 : 0;
  const amountToPay = chipPounds + keyAmount;
  const change      = amountToPay - baseTotal;
  const hasInput    = chipPounds > 0 || keyDigits.length > 0;
  const canPay      = parseFloat(amountToPay.toFixed(2)) >= parseFloat(baseTotal.toFixed(2));

  // ── Chips ─────────────────────────────────────────────────────
  const handleQuickAmount = amount => {
    setChipPounds(prev => prev + amount);
  };

  // ── Keypad ────────────────────────────────────────────────────
  const handleKeyPress = key => {
    setKeyDigits(prev => {
      if (key === '<') return prev.slice(0, -1);
      if (key === '.') {
        if (prev.includes('.')) return prev;
        return (prev || '0') + '.';
      }
      // Prevent leading zero before digits e.g. "03"
      if (prev === '0') return key;
      return prev + key;
    });
  };

  // ── Clear / close ─────────────────────────────────────────────
  const handleClear = () => {
    setChipPounds(0);
    setKeyDigits('');
  };

  const handleClose = () => {
    handleClear();
    onClose();
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!canPay || !order_id) return;
    insert({
      order_id,
      amount:         parseFloat(baseTotal),
      payment_method,
      date:           new Date().toISOString(),
    }).then(() => updataStatusHandler(order_id, 'Completed'));
  };

  // ── Renders ───────────────────────────────────────────────────

  const renderAmountDisplay = () => {
    if (!hasInput) return null;
    return (
      <StyledText
        fontFamily={fontStyles.Roboto_Regular}
        textAlign="center"
        color={theme.colors.gray[400]}
        fontSize={theme.fontSize.xxlarge}
        fontWeight={theme.fontWeight.thin}>
        {formatCurrency(cur, amountToPay)}
      </StyledText>
    );
  };

  const renderChangeDisplay = () => {
    if (!hasInput || change <= 0) return null;
    return (
      <StyledText
        textAlign="center"
        fontFamily={fontStyles.Roboto_Regular}
        fontSize={theme.fontSize.xlarge}
        color={theme.colors.green[600]}
        fontWeight={theme.fontWeight.medium}>
        Change: {formatCurrency(cur, change)}
      </StyledText>
    );
  };

  const renderQuickAmounts = () => (
    <Stack marginHorizontal={8} horizontal gap={8} marginTop={16} flexWrap="wrap">
      {QUICK_AMOUNTS.map((amount, index) => (
        <StyledChip
          key={index}
          onPress={() => handleQuickAmount(amount)}
          label={`${formatCurrency(cur, amount)}`}
          variant="filled"
          selected={false}
        />
      ))}
    </Stack>
  );

  const renderKeypad = () => (
    <HStack flex={1} flexWrap="wrap" justifyContent="center">
      {keypad.map((num, index) => (
        <Pressable
          key={`key-${index}`}
          onPress={() => handleKeyPress(num)}
          style={{
            width:           '30%',
            margin:          '1.5%',
            height:          70,
            borderRadius:    10,
            backgroundColor: theme.colors.gray[100],
            borderWidth:     1,
            borderColor:     theme.colors.gray[200],
            alignItems:      'center',
            justifyContent:  'center',
          }}>
          <Text
            color={theme.colors.gray[800]}
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.large}
            fontWeight={theme.fontWeight.medium}>
            {num}
          </Text>
        </Pressable>
      ))}
    </HStack>
  );

  const renderFooter = () => (
    <HStack
      justifyContent="center"
      px={16}
      py={16}
      mt="auto"
      gap={12}
      borderTopWidth={1}
      borderColor={theme.colors.gray[200]}>
      {hasInput && (
        <Button
          flex={1}
          bg={theme.colors.gray[100]}
          borderWidth={1}
          borderColor={theme.colors.gray[300]}
          px={20}
          py={10}
          borderRadius={12}
          onPress={handleClear}>
          <ButtonText fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[700]}>
            Clear
          </ButtonText>
        </Button>
      )}
      {canPay && (
        <Button
          flex={1}
          bg={theme.colors.green[600]}
          px={30}
          py={10}
          borderRadius={12}
          onPress={handleSubmit}
          disabled={loading}>
          <ButtonText fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[1]}>
            Pay
          </ButtonText>
        </Button>
      )}
    </HStack>
  );

  const renderStatusIndicators = () => {
    if (loading) return <StyledSpinner />;
    if (error) {
      return (
        <StyledOkDialog
          title={error?.message || 'Payment Error'}
          description="Please try again"
          visible={true}
          onOk={() => {}}
        />
      );
    }
    if (success && data) {
      return (
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
      );
    }
    return null;
  };

  return (
    <Box
      flex={1}
      backgroundColor={theme.colors.gray[1]}
      borderWidth={1}
      borderColor={theme.colors.gray[200]}>

      <VStack px={16} py={16} flex={1}>

        {renderAmountDisplay()}

        <StyledText
          textAlign="center"
          color={theme.colors.gray[900]}
          fontSize={theme.fontSize.xxxlarge}
          fontWeight={theme.fontWeight.bold}
          fontFamily={fontStyles.Roboto_Regular}>
          {formatCurrency(cur, baseTotal)}
        </StyledText>

        {renderChangeDisplay()}

        {renderQuickAmounts()}

        <StyledSpacer marginVertical={8} />

        {renderKeypad()}

        {renderFooter()}
      </VStack>

      {renderStatusIndicators()}
    </Box>
  );
}