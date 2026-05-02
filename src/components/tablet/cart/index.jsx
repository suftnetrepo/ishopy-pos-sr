/* eslint-disable prettier/prettier */
import React, {Fragment, useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {
  StyledSpacer, Drawer, StyledScrollView, StyledPressable,
  StyledText, XStack, YStack, Stack,
} from 'fluent-styles';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {useAppContext} from '../../../hooks/appContext';
import {formatCurrency, paymentOptions} from '../../../utils/help';
import {theme} from '../../../utils/theme';
import Payment from '../payment/cash';
import {useInsertOrder, updataStatusHandler} from '../../../hooks/useOrder';
import EmptyView from '../../../components/utils/empty';
import {useNavigation} from '@react-navigation/native';
import {useAppTheme} from '../../../theme';

export default function Cart({table_id, table_name}) {
  const navigation = useNavigation();
  const {updateOrderId, getItems, shop, removeItem, getTotalTax, clearItem, getTotal, getTotalPrice} = useAppContext();
  const {t} = useAppTheme();
  const {orderHandler, printHandler, shareReceipt, deleteHandler, queryOrderByIdhandler, data} = useInsertOrder(table_id, table_name);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPayment,   setShowPayment]   = useState(false);

  const items        = getItems(table_id);
  const totalPrice   = getTotalPrice(table_id);
  const hasOrderId   = !!items?.order_id;
  const isCartChanged = parseFloat(totalPrice) > parseFloat(data?.total_price || 0) && hasOrderId;
  const hasItems     = items?.items?.length > 0;

  useEffect(() => {
    if (items?.order_id) queryOrderByIdhandler(items.order_id);
  }, [items?.order_id]);

  const calculateItemPrice = item => {
    const addOnsTotal = [item?.addOns || []].reduce((total, addOn) =>
      total + parseFloat(addOn.price || 0) * parseInt(addOn.quantity || 0), 0) || 0;
    return addOnsTotal + (item?.price || 0);
  };

  const handleOrder = async () => {
    if (!hasItems) return;
    const orderId = await orderHandler();
    if (orderId) updateOrderId(orderId, table_id);
  };

  const handleVoid = async () => {
    if (!hasOrderId) return;
    updataStatusHandler(items?.order_id, 'Cancelled').then(() => clearItem(table_id));
  };

  const handleUpdateOrder = () => {
    if (!hasOrderId) return;
    deleteHandler(items?.order_id).then(() => handleOrder());
  };

  const handlePaymentPress = () => { if (paymentMethod === 'cash') setShowPayment(true); };
  const handlePrint = () => { if (data && table_name) printHandler(table_name, data); };

  // ── Cart items ────────────────────────────────────────────────────────────
  const renderCartItems = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {items?.items?.map((item, index) => (
        <Fragment key={`${item.id}-${index}`}>
          <Stack
            borderRadius={8} paddingHorizontal={12} paddingVertical={4}
            backgroundColor={t.bgInput}
            borderWidth={1} borderColor={t.borderDefault}
            horizontal flex={1} justifyContent="space-between" alignItems="center">
            <StyledText
              flex={1} color={t.textPrimary}
              fontSize={theme.fontSize.small}>
              {item.name}
            </StyledText>
            <Stack horizontal alignItems="center" gap={12}>
              <StyledText fontSize={theme.fontSize.small} color={t.textSecondary}>
                {formatCurrency(shop?.currency || '£', calculateItemPrice(item))}
              </StyledText>
              <Stack
                width={20} height={30} borderRadius={15}
                backgroundColor={t.bgInput}
                justifyContent="center" alignItems="center">
                <Icons
                  name="cancel" size={24} color={t.textMuted}
                  onPress={() => removeItem(item.index, table_id)}
                />
              </Stack>
            </Stack>
          </Stack>
          <StyledSpacer marginVertical={1} />
        </Fragment>
      ))}
    </ScrollView>
  );

  // ── Order summary ─────────────────────────────────────────────────────────
  const renderOrderSummary = () => (
    <Stack
      backgroundColor={t.bgInput}
      borderWidth={1} borderColor={t.borderDefault}
      paddingHorizontal={16} paddingVertical={16} borderRadius={12} vertical>
      <Stack horizontal justifyContent="space-between" marginBottom={8}>
        <StyledText color={t.textSecondary} fontSize={theme.fontSize.normal}>Subtotal</StyledText>
        <StyledText color={t.textSecondary} fontSize={theme.fontSize.normal}>
          {formatCurrency(shop?.currency || '£', getTotal(table_id))}
        </StyledText>
      </Stack>
      <Stack horizontal justifyContent="space-between" marginBottom={8}>
        <StyledText color={t.textSecondary} fontSize={theme.fontSize.normal}>Tax%</StyledText>
        <StyledText color={t.textSecondary} fontSize={theme.fontSize.normal}>
          {formatCurrency(shop?.currency || '£', getTotalTax(table_id))}
        </StyledText>
      </Stack>
      <Stack height={1} backgroundColor={t.borderDefault} marginVertical={10} />
      <Stack horizontal justifyContent="space-between">
        <StyledText color={t.textPrimary} fontWeight={theme.fontWeight.semiBold} fontSize={theme.fontSize.normal}>Total</StyledText>
        <StyledText color={t.textPrimary} fontWeight={theme.fontWeight.semiBold} fontSize={theme.fontSize.normal}>
          {formatCurrency(shop?.currency || '£', totalPrice)}
        </StyledText>
      </Stack>
    </Stack>
  );

  // ── Payment methods ───────────────────────────────────────────────────────
  const renderPaymentMethods = () => (
    <XStack marginTop={16} gap={16}>
      {paymentOptions.map(option => {
        const isSelected = paymentMethod === option.key;
        return (
          <StyledPressable
            key={option.key}
            onPress={() => setPaymentMethod(option.key)}
            flex={1} padding={14} borderRadius={12}
            alignItems="center"
            backgroundColor={isSelected ? t.brandPrimary : t.bgInput}
            borderWidth={1}
            borderColor={isSelected ? t.brandPrimary : t.borderDefault}>
            <Icons
              name={option.icon} size={24}
              color={isSelected ? t.onBrandPrimary || '#fff' : t.textSecondary}
            />
            <StyledText
              marginTop={4}
              color={isSelected ? t.onBrandPrimary || '#fff' : t.textSecondary}
              fontSize={14}>
              {option.label}
            </StyledText>
          </StyledPressable>
        );
      })}
    </XStack>
  );

  // ── Action buttons ────────────────────────────────────────────────────────
  const ActionBtn = ({onPress, bg, borderCol, label, disabled, textColor}) => (
    <StyledPressable
      flex={1} paddingVertical={14} paddingHorizontal={12}
      borderRadius={12} alignItems="center" justifyContent="center"
      backgroundColor={bg} borderWidth={borderCol ? 1 : 0} borderColor={borderCol}
      onPress={onPress} disabled={disabled}>
      <StyledText color={textColor} fontSize={theme.fontSize.small}
        fontWeight={theme.fontWeight.semiBold}>{label}</StyledText>
    </StyledPressable>
  );

  const renderActionButtons = () => {
    if (isCartChanged && hasOrderId)
      return <ActionBtn onPress={handleUpdateOrder} bg={t.brandPrimary} textColor={t.onBrandPrimary || '#fff'} label="+ Order" />;

    if (!isCartChanged && hasItems) {
      if (!hasOrderId)
        return <ActionBtn onPress={handleOrder} bg={t.brandPrimary} textColor={t.onBrandPrimary || '#fff'} label="Place Order" />;

      return (
        <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ActionBtn onPress={handlePrint} bg={t.bgInput} borderCol={t.borderDefault} textColor={t.textSecondary} label="Print" />
          <StyledSpacer marginHorizontal={8} />
          <ActionBtn onPress={() => navigation.navigate('big-table')} bg={t.brandPrimary} textColor={t.onBrandPrimary || '#fff'} label="Send" />
          <StyledSpacer marginHorizontal={8} />
          <ActionBtn onPress={handlePaymentPress} disabled={!paymentMethod} bg={t.successColor} textColor={t.onBrandPrimary || '#fff'} label="Pay" />
          <StyledSpacer marginHorizontal={8} />
          <ActionBtn onPress={handleVoid} bg={t.dangerColor} textColor={t.onBrandPrimary || '#fff'} label="Void" />
          <StyledSpacer marginHorizontal={8} />
        </StyledScrollView>
      );
    }
    return null;
  };

  if (!hasItems) {
    return (
      <Stack flex={1} paddingHorizontal={16} paddingVertical={16}
        backgroundColor={t.bgCard} borderRadius={16}
        borderWidth={1} borderColor={t.borderDefault}
        justifyContent="center" alignItems="center">
        <EmptyView color={t.textMuted} title="Your cart is empty"
          description="Add items to your cart to see them here." />
      </Stack>
    );
  }

  return (
    <Stack flex={1} paddingHorizontal={16} paddingVertical={16} vertical
      backgroundColor={t.bgCard} borderRadius={16}
      borderWidth={1} borderColor={t.borderDefault}>
      <Stack flex={1} vertical marginBottom={16}>{renderCartItems()}</Stack>
      <Stack flex={1} vertical>
        {hasItems && renderOrderSummary()}
        {hasOrderId && renderPaymentMethods()}
        <Stack flex={1} gap={8} justifyContent="space-between" alignItems="center" horizontal>
          {renderActionButtons()}
        </Stack>
      </Stack>
      <Drawer
        visible={showPayment}
        bodyStyle={{backgroundColor: t.bgPage}}
        onClose={() => setShowPayment(false)}
        title="Cash Payment" width="30%" side="right">
        <Payment
          order_id={items?.order_id} payment_method={paymentMethod}
          table_name={table_name} table_id={table_id}
          printHandler={printHandler} shareReceipt={shareReceipt}
          onClose={() => setShowPayment(false)} />
      </Drawer>
    </Stack>
  );
}
