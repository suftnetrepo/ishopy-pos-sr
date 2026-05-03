/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  StyledText, StyledSpacer, StyledSpinner, StyledOkDialog,
  StyledDialog, Stack, StyledChip, StyledPressable, YStack,
} from 'fluent-styles';
import {fontStyles, theme} from '../../../../utils/theme';
import {useAppContext} from '../../../../hooks/appContext';
import {formatCurrency} from '../../../../utils/help';
import CheckOut from '../../../../components/tablet/checkout';
import {useInsertPayment} from '../../../../hooks/usePayment';
import {updataStatusHandler} from '../../../../hooks/useOrder';
import {useAppTheme} from '../../../../theme';

const QUICK_AMOUNTS = [10, 20, 40, 60, 80, 100];

export default function Payment({
  payment_method, onClose, table_name, table_id, order_id, printHandler, shareReceipt,
}) {
  const {getTotalPrice, shop} = useAppContext();
  const {t} = useAppTheme();
  const {insert, data, error, loading, success} = useInsertPayment();

  const subtotal  = getTotalPrice(table_id) || 0;
  const baseTotal = subtotal;
  const cur       = shop?.currency || '£';

  const [chipPounds, setChipPounds] = useState(0);
  const [keyDigits,  setKeyDigits]  = useState('');

  const keypad    = ['1','2','3','4','5','6','7','8','9','.','0','<'];
  const keyAmount   = keyDigits ? parseFloat(keyDigits) || 0 : 0;
  const amountToPay = chipPounds + keyAmount;
  const change      = amountToPay - baseTotal;
  const hasInput    = chipPounds > 0 || keyDigits.length > 0;
  const canPay      = parseFloat(amountToPay.toFixed(2)) >= parseFloat(baseTotal.toFixed(2));

  const handleQuickAmount = amount => setChipPounds(prev => prev + amount);

  const handleKeyPress = key => {
    setKeyDigits(prev => {
      if (key === '<') return prev.slice(0, -1);
      if (key === '.') { if (prev.includes('.')) return prev; return (prev || '0') + '.'; }
      if (prev === '0') return key;
      return prev + key;
    });
  };

  const handleClear = () => { setChipPounds(0); setKeyDigits(''); };
  const handleClose = () => { handleClear(); onClose(); };

  const handleSubmit = async () => {
    if (!canPay || !order_id) return;
    insert({
      order_id, amount: parseFloat(baseTotal),
      payment_method, date: new Date().toISOString(),
    }).then(() => updataStatusHandler(order_id, 'Completed'));
  };

  return (
    <Stack
      flex={1} vertical
      backgroundColor={t.bgCard}
      borderWidth={1} borderColor={t.borderDefault}>

      <Stack paddingHorizontal={16} paddingVertical={16} flex={1} vertical>

        {/* Amount entered */}
        {hasInput && (
          <StyledText
            fontFamily={fontStyles.Roboto_Regular} textAlign="center"
            color={t.textMuted} fontSize={theme.fontSize.xxlarge}
            fontWeight={theme.fontWeight.thin}>
            {formatCurrency(cur, amountToPay)}
          </StyledText>
        )}

        {/* Total due */}
        <StyledText
          textAlign="center" color={t.textPrimary}
          fontSize={theme.fontSize.xxxlarge} fontWeight={theme.fontWeight.bold}
          fontFamily={fontStyles.Roboto_Regular}>
          {formatCurrency(cur, baseTotal)}
        </StyledText>

        {/* Change */}
        {hasInput && change > 0 && (
          <StyledText
            textAlign="center" fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.xlarge} color={t.successColor}
            fontWeight={theme.fontWeight.medium}>
            Change: {formatCurrency(cur, change)}
          </StyledText>
        )}

        {/* Quick amounts */}
        <Stack marginHorizontal={8} horizontal gap={8} marginTop={16} flexWrap="wrap">
          {QUICK_AMOUNTS.map((amount, i) => (
            <StyledChip
              key={i} onPress={() => handleQuickAmount(amount)}
              label={`${formatCurrency(cur, amount)}`}
              variant="filled" selected={false}
            />
          ))}
        </Stack>

        <StyledSpacer marginVertical={8} />

        {/* Keypad */}
        <Stack horizontal flexWrap="wrap" justifyContent="center">
          {keypad.map((num, i) => (
            <StyledPressable
              key={`key-${i}`}
              onPress={() => handleKeyPress(num)}
              width="30%" margin="1.5%" height={70}
              borderRadius={10}
              backgroundColor={t.bgPage}
              borderWidth={1} borderColor={t.borderDefault}
              alignItems="center" justifyContent="center">
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

        {/* Footer */}
        <Stack
          horizontal justifyContent="center"
          paddingHorizontal={16} paddingVertical={16}
          gap={12} borderTopWidth={1} borderColor={t.borderDefault}>
          {hasInput && (
            <StyledPressable
              flex={1} backgroundColor={t.bgPage}
                alignItems='center'
              borderWidth={1} borderColor={t.textMuted}
              paddingHorizontal={20} paddingVertical={10}
              borderRadius={12} onPress={handleClear}>
              <StyledText fontFamily={fontStyles.Roboto_Regular} color={t.textSecondary}>
                Clear
              </StyledText>
            </StyledPressable>
          )}
          {canPay && (
            <StyledPressable
              flex={1} backgroundColor={t.successColor}
              alignItems='center' justifyContent='center'
              paddingHorizontal={30} paddingVertical={10}
              borderRadius={12} onPress={handleSubmit} disabled={loading}>
              <StyledText fontFamily={fontStyles.Roboto_Regular} color={t.bgCard}>
                Pay
              </StyledText>
            </StyledPressable>
          )}
        </Stack>
      </Stack>

      {loading && <StyledSpinner />}
      {error && (
        <StyledOkDialog
          title={error?.message || 'Payment Error'}
          description="Please try again" visible={true} onOk={() => {}} />
      )}
      {success && data && (
        <StyledDialog visible>
          <CheckOut
            table_name={table_name} table_id={table_id} order={data}
            printHandler={printHandler} shareReceipt={shareReceipt} onClose={handleClose} />
        </StyledDialog>
      )}
    </Stack>
  );
}
