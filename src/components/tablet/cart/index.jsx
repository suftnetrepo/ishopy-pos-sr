/* eslint-disable prettier/prettier */
import React, {Fragment, useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {
  StyledSpacer,
  Drawer,
  StyledScrollView,
  StyledCard,
  StyledPressable,
  StyledText,
  XStack,
  YStack,
} from 'fluent-styles';
import {
  Box,
  Text,
  HStack,
  VStack,
  Pressable,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {useAppContext} from '../../../hooks/appContext';
import {formatCurrency, paymentOptions} from '../../../utils/help';
import {theme} from '../../../utils/theme';
import Payment from '../payment/cash';
import {useInsertOrder, updataStatusHandler} from '../../../hooks/useOrder';
import EmptyView from '../../../components/utils/empty';
import {useNavigation} from '@react-navigation/native';

export default function Cart({table_id, table_name}) {
  const navigation = useNavigation();
  const {
    updateOrderId,
    getItems,
    shop,
    removeItem,
    getTotalTax,
    clearItem,
    getTotal,
    getTotalPrice,
  } = useAppContext();

  const {
    orderHandler,
    printHandler,
    shareReceipt,
    deleteHandler,
    queryOrderByIdhandler,
    data,
  } = useInsertOrder(table_id, table_name);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const items = getItems(table_id);
  const totalPrice = getTotalPrice(table_id);
  const hasOrderId = !!items?.order_id;
  const isCartChanged =
    parseFloat(totalPrice) > parseFloat(data?.total_price || 0) && hasOrderId;
  const hasItems = items?.items?.length > 0;

  useEffect(() => {
    if (items?.order_id) {
      queryOrderByIdhandler(items.order_id);
    }
  }, [items?.order_id]);

  const calculateItemPrice = item => {
    const addOnsTotal =
      [item?.addOns || []].reduce((total, addOn) => {
        return (
          total + parseFloat(addOn.price || 0) * parseInt(addOn.quantity || 0)
        );
      }, 0) || 0;
    return addOnsTotal + (item?.price || 0);
  };

  const handleOrder = async () => {
    if (!hasItems) return;
    const orderId = await orderHandler();
    if (orderId) updateOrderId(orderId, table_id);
  };

  const handleVoid = async () => {
    if (!hasOrderId) return;
    updataStatusHandler(items?.order_id, 'Cancelled').then(() => {
      clearItem(table_id);
    });
  };

  const handleUpdateOrder = () => {
    if (!hasOrderId) return;
    deleteHandler(items?.order_id).then(() => handleOrder());
  };

  const handlePaymentPress = () => {
    if (paymentMethod === 'cash') setShowPayment(true);
  };

  const handlePrint = () => {
    if (data && table_name) printHandler(table_name, data);
  };

  // ── Cart items ────────────────────────────────────────────────
  const renderCartItems = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {items?.items?.map((item, index) => (
        <Fragment key={`${item.id}-${index}`}>
          <Pressable onPress={() => {}}>
            <Box
              borderRadius={8}
              px={12}
              py={4}
              backgroundColor={theme.colors.gray[50]}
              borderWidth={1}
              borderColor={theme.colors.gray[200]}>
              <HStack
                flex={1}
                justifyContent="space-between"
                alignItems="center">
                <Text
                  flex={1}
                  color={theme.colors.gray[900]}
                  fontSize={theme.fontSize.small}
                  fontWeight={theme.fontWeight.normal}>
                  {item.name}
                </Text>
                <HStack space="md" alignItems="center">
                  <Text
                    fontSize={theme.fontSize.small}
                    color={theme.colors.gray[700]}
                    fontWeight={theme.fontWeight.normal}>
                    {formatCurrency(
                      shop?.currency || '£',
                      calculateItemPrice(item)
                    )}
                  </Text>
                  <Box
                    w={20}
                    h={30}
                    borderRadius={15}
                    backgroundColor={theme.colors.gray[100]}
                    justifyContent="center"
                    alignItems="center">
                    <Icons
                      name="cancel"
                      size={24}
                      color={theme.colors.gray[400]}
                      onPress={() => removeItem(item.index, table_id)}
                    />
                  </Box>
                </HStack>
              </HStack>
            </Box>
          </Pressable>
          <StyledSpacer marginVertical={1} />
        </Fragment>
      ))}
    </ScrollView>
  );

  // ── Order summary ─────────────────────────────────────────────
  const renderOrderSummary = () => (
    <Box
      backgroundColor={theme.colors.gray[50]}
      borderWidth={1}
      borderColor={theme.colors.gray[200]}
      px={16}
      py={16}
      borderRadius={12}>
      <HStack justifyContent="space-between" mb={8}>
        <Text color={theme.colors.gray[500]} fontSize={theme.fontSize.normal}>
          Subtotal
        </Text>
        <Text color={theme.colors.gray[700]} fontSize={theme.fontSize.normal}>
          {formatCurrency(shop?.currency || '£', getTotal(table_id))}
        </Text>
      </HStack>

      <HStack justifyContent="space-between" mb={8}>
        <Text color={theme.colors.gray[500]} fontSize={theme.fontSize.normal}>
          Tax%
        </Text>
        <Text color={theme.colors.gray[700]} fontSize={theme.fontSize.normal}>
          {formatCurrency(shop?.currency || '£', getTotalTax(table_id))}
        </Text>
      </HStack>

      <Box height={1} backgroundColor={theme.colors.gray[200]} my={10} />

      <HStack justifyContent="space-between">
        <Text
          color={theme.colors.gray[900]}
          fontWeight={theme.fontWeight.semiBold}
          fontSize={theme.fontSize.normal}>
          Total
        </Text>
        <Text
          color={theme.colors.gray[900]}
          fontWeight={theme.fontWeight.semiBold}
          fontSize={theme.fontSize.normal}>
          {formatCurrency(shop?.currency || '£', totalPrice)}
        </Text>
      </HStack>
    </Box>
  );

  // ── Payment methods ───────────────────────────────────────────
  const renderPaymentMethods = () => (
    <XStack marginTop={16} gap={16}>
      {paymentOptions.map(option => (
        <Pressable
          key={option.key}
          onPress={() => setPaymentMethod(option.key)}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 12,
            backgroundColor:
              paymentMethod === option.key
                ? theme.colors.gray[900]
                : theme.colors.gray[1],
            alignItems: 'center',
            borderWidth: 1,
            borderColor:
              paymentMethod === option.key
                ? theme.colors.gray[900]
                : theme.colors.gray[200],
          }}>
          <Icons
            name={option.icon}
            size={24}
            color={
              paymentMethod === option.key
                ? theme.colors.gray[1]
                : theme.colors.gray[600]
            }
          />
          <StyledText
            marginTop={4}
            color={
              paymentMethod === option.key
                ? theme.colors.gray[1]
                : theme.colors.gray[700]
            }
            fontSize={14}>
            {option.label}
          </StyledText>
        </Pressable>
      ))}
    </XStack>
  );

  // ── Action buttons ────────────────────────────────────────────
  const renderActionButtons = () => {
    if (isCartChanged && hasOrderId) {
      return (
        <Button
          flex={1}
          size="lg"
          bg={theme.colors.gray[900]}
          borderRadius={12}
          onPress={handleUpdateOrder}>
          <ButtonText
            color={theme.colors.gray[1]}
            fontSize={theme.fontSize.normal}
            fontWeight={theme.fontWeight.semiBold}>
            + Order
          </ButtonText>
        </Button>
      );
    }

    if (!isCartChanged && hasItems) {
      if (!hasOrderId) {
        return (
          <Button
            flex={1}
            size="lg"
            bg={theme.colors.gray[900]}
            borderRadius={12}
            onPress={handleOrder}>
            <ButtonText
              color={theme.colors.gray[1]}
              fontSize={theme.fontSize.normal}
              fontWeight={theme.fontWeight.semiBold}>
              Place Order
            </ButtonText>
          </Button>
        );
      }

      return (
        <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Button
            flex={1}
            size="lg"
            borderWidth={1}
            bg={theme.colors.gray[1]}
            borderColor={theme.colors.gray[300]}
            borderRadius={12}
            onPress={handlePrint}>
            <ButtonText
              color={theme.colors.gray[800]}
              fontSize={theme.fontSize.small}
              fontWeight={theme.fontWeight.normal}>
              Print
            </ButtonText>
          </Button>
          <StyledSpacer marginHorizontal={8} />
          <Button
            flex={1}
            size="lg"
            bg={theme.colors.orange[500]}
            borderColor={theme.colors.orange[600]}
            borderRadius={12}
            onPress={() => navigation.navigate('big-table')}>
            <ButtonText
              color={theme.colors.gray[1]}
              fontSize={theme.fontSize.small}
              fontWeight={theme.fontWeight.normal}>
              Send
            </ButtonText>
          </Button>
          <StyledSpacer marginHorizontal={8} />
          <Button
            flex={1}
            size="lg"
            bg={theme.colors.green[600]}
            borderColor={theme.colors.green[600]}
            borderRadius={12}
            onPress={handlePaymentPress}
            disabled={!paymentMethod}>
            <ButtonText
              color={theme.colors.gray[1]}
              fontSize={theme.fontSize.small}
              fontWeight={theme.fontWeight.normal}>
              Pay
            </ButtonText>
          </Button>
          <StyledSpacer marginHorizontal={8} />
          <Button
            flex={1}
            size="lg"
            bg={theme.colors.pink[700]}
            borderColor={theme.colors.pink[700]}
            borderRadius={12}
            onPress={handleVoid}>
            <ButtonText
              color={theme.colors.gray[1]}
              fontSize={theme.fontSize.small}
              fontWeight={theme.fontWeight.normal}>
              Void
            </ButtonText>
          </Button>
          <StyledSpacer marginHorizontal={8} />
        </StyledScrollView>
      );
    }

    return null;
  };

  // ── Empty state ───────────────────────────────────────────────
  if (items?.items?.length === 0) {
    return (
      <VStack
        flex={1}
        px={16}
        py={16}
        space="lg"
        backgroundColor={theme.colors.gray[1]}
        borderRadius={16}
        borderWidth={1}
        borderColor={theme.colors.gray[200]}
        justifyContent="center"
        alignItems="center">
        <EmptyView
          color={theme.colors.gray[400]}
          title="Your cart is empty"
          description="Add items to your cart to see them here."
        />
      </VStack>
    );
  }

  // ── Main render ───────────────────────────────────────────────
  return (
    <VStack
      flex={1}
      px={16}
      py={16}
      space="lg"
      backgroundColor={theme.colors.gray[1]}
      borderRadius={16}
      borderWidth={1}
      borderColor={theme.colors.gray[200]}>
      <VStack flex={1} space="md" mb="lg">
        {renderCartItems()}
      </VStack>

      <VStack flex={1}>
        {items?.items?.length > 0 ? renderOrderSummary() : null}
        {hasOrderId && renderPaymentMethods()}
        <HStack
          flex={1}
          gap={8}
          justifyContent="space-between"
          alignItems="center">
          {renderActionButtons()}
        </HStack>
      </VStack>

      <Drawer
        visible={showPayment}
        bodyStyle={{backgroundColor: theme.colors.gray[50]}}
        onClose={() => setShowPayment(false)}
        title="Cash Payment"
        width="30%"
        side="right">
        <Payment
          order_id={items?.order_id}
          payment_method={paymentMethod}
          table_name={table_name}
          table_id={table_id}
          printHandler={printHandler}
          shareReceipt={shareReceipt}
          onClose={() => setShowPayment(false)}
        />
      </Drawer>
    </VStack>
  );
}
