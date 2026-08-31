/* eslint-disable prettier/prettier */
import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  PanResponder,
  Animated,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  StyledSpacer,
  Drawer,
  StyledPressable,
  XStack,
  YStack,
  Stack,
  toastService,
} from 'fluent-styles';
import {Text} from '../../../components/text';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {useAppContext} from '../../../hooks/appContext';
import {formatCurrency, paymentOptions} from '../../../utils/help';
import {theme} from '../../../utils/theme';
import Payment from '../payment/cash';
import {useInsertOrder, updateStatusHandler} from '../../../hooks/useOrder';
import {useNavigation} from '@react-navigation/native';
import {useAppTheme} from '../../../theme';
import {StyledMIcon} from '../../../components/icon';
import AddOn from '../cards/menu/addOn';

export default function Cart({table_id, table_name, order_type}) {
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
    updateItem,
  } = useAppContext();
  const {t} = useAppTheme();
  const {width} = useWindowDimensions();
  const isNarrowCart = width < 1100;
  const {
    orderHandler,
    printHandler,
    shareReceipt,
    deleteHandler,
    queryOrderByIdhandler,
    data,
    loading: isOrderSubmitting,
  } = useInsertOrder(table_id, table_name, order_type);
 
  const drawerWidth = width < 768 ? '90%' : width < 1024 ? '60%' : '45%';
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [swipedItemKey, setSwipedItemKey] = useState(null);
  const [showAddOnModal, setShowAddOnModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Refs for swipe animation values (keyed by item id, not index)
  const swipePanRefs = useRef({});

  const items = getItems(table_id);
  const totalPrice = getTotalPrice(table_id);
  const hasOrderId = !!items?.order_id;
  const isCartChanged =
    parseFloat(totalPrice) > parseFloat(data?.total_price || 0) && hasOrderId;
  const hasItems = items?.items?.length > 0;

  useEffect(() => {
    if (items?.order_id) queryOrderByIdhandler(items.order_id);
  }, [items?.order_id]);

  // Clear swipe state when items list changes (prevents index shifting issues)
  useEffect(() => {
    setSwipedItemKey(null);
    Object.values(swipePanRefs.current).forEach(value => {
      if (value instanceof Animated.Value) {
        value.setValue(0);
      }
    });
  }, [items?.items?.length]);

  const calculateItemPrice = item => {
    const addOnsTotal =
      (item?.addOns || []).reduce(
        (total, addOn) =>
          total + parseFloat(addOn.price || 0) * parseInt(addOn.quantity || 0),
        0
      ) || 0;
    return addOnsTotal + (item?.price || 0);
  };

  const calculateBasePrice = item => item?.price || 0;

  const calculateAddOnsTotal = item => {
    return (
      (item?.addOns || []).reduce(
        (total, addOn) =>
          total + parseFloat(addOn.price || 0) * parseInt(addOn.quantity || 0),
        0
      ) || 0
    );
  };

  const hasAddOns = item => (item?.addOns || []).length > 0;

  // Generate stable key for cart item (based on id, not index)
  const getCartItemKey = (item, index) =>
    String(
      item?.cartItemId || item?.id || item?.menu_id || `${item?.name}-${index}`
    );

  const handleOrder = async () => {
    // Guard against double-submission: orderHandler mints a fresh order_id
    // on every call, so a rapid double-tap here would create two separate
    // real Order records (and, in restaurant mode, two kitchen tickets) for
    // the same cart.
    if (!hasItems || isOrderSubmitting) return;
    const orderId = await orderHandler();
    if (orderId) updateOrderId(orderId, table_id);
  };

  const handleVoid = async () => {
    if (!hasOrderId) return;
    updateStatusHandler(items?.order_id, 'Cancelled').then(() =>
      clearItem(table_id)
    );
  };

  const handleUpdateOrder = async () => {
    if (!hasOrderId || isOrderSubmitting) return;
    // Only proceed to recreate the order if the old one actually got
    // cleared — previously this ran handleOrder() regardless of whether
    // deleteHandler succeeded, which (combined with deleteOrder silently
    // always failing) created a duplicate order instead of updating one.
    const deleted = await deleteHandler(items?.order_id);
    if (deleted) {
      await handleOrder();
    } else {
      toastService.show({
        message: 'Could not update order',
        description: 'Please try again.',
        variant: 'error',
        duration: 2500,
        theme: 'light',
      });
    }
  };

  const handlePaymentPress = () => {
    if (!paymentMethod) {
      toastService.show({
        message: 'Select a payment method',
        description: 'Choose Cash or Card above before completing payment.',
        variant: 'warning',
        duration: 2500,
        theme: 'light',
      });
      return;
    }
    if (paymentMethod === 'cash') setShowPayment(true);
  };
  const handlePrint = () => {
    if (data && table_name) printHandler(table_name, data);
  };

  // ── Cart items ────────────────────────────────────────────────────────────
  const DELETE_WIDTH = 84;
  const SWIPE_THRESHOLD = 45;

  // Get or create animated value for a row (by stable key, not index)
  const getSwipeAnimValue = key => {
    if (!swipePanRefs.current[key]) {
      swipePanRefs.current[key] = new Animated.Value(0);
    }
    return swipePanRefs.current[key];
  };


  // Close swipe animation with optional key override
  const closeSwipe = (key = swipedItemKey) => {
    if (key && swipePanRefs.current[key]) {
      Animated.spring(swipePanRefs.current[key], {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
    setSwipedItemKey(null);
  };

  const handleEditItem = item => {
    setEditingItem(item);
    setShowAddOnModal(true);
    closeSwipe();
  };

  const handleCloseAddOnModal = () => {
    setShowAddOnModal(false);
    setEditingItem(null);
  };

  const handleAddOnModalSubmit = updatedItem => {
    if (editingItem) {
      // Update existing cart item
      updateItem(updatedItem, table_id);
    }
    handleCloseAddOnModal();
  };

  // Close swipe panel when tapping anywhere on the main row
  const handleRowPress = item => {
    if (swipedItemKey !== null) {
      // Reset swipe state
      closeSwipe();
    } else if (hasAddOns(item)) {
      // Tap to edit if has add-ons and not swiped
      handleEditItem(item);
    }
  };

  const renderCartItems = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {items?.items?.map((item, index) => {
        const itemKey = getCartItemKey(item, index);
        const isSwiped = swipedItemKey === itemKey;
        const animValue = getSwipeAnimValue(itemKey);
        const addOnsCount = item?.addOns?.length || 0;
        const basePrice = calculateBasePrice(item);
        const addOnsTotal = calculateAddOnsTotal(item);
        const lineTotal = calculateItemPrice(item);
        const showAddOnBreakdown = hasAddOns(item) && addOnsTotal > 0;

        const panResponder = PanResponder.create({
          onStartShouldSetPanResponder: () => false,
          onMoveShouldSetPanResponder: (_, gesture) =>
            Math.abs(gesture.dx) > 12 &&
            Math.abs(gesture.dx) > Math.abs(gesture.dy),

          onPanResponderMove: (_, gesture) => {
            const dx = Math.max(-DELETE_WIDTH, Math.min(0, gesture.dx));
            animValue.setValue(dx);
          },

          onPanResponderRelease: (_, gesture) => {
            const shouldOpen = gesture.dx < -SWIPE_THRESHOLD;

            setSwipedItemKey(shouldOpen ? itemKey : null);

            Animated.spring(animValue, {
              toValue: shouldOpen ? -DELETE_WIDTH : 0,
              useNativeDriver: true,
            }).start();
          },
        });

        const handleDeletePress = () => {
          closeSwipe(itemKey);
          removeItem(item.index ?? index, table_id);
          delete swipePanRefs.current[itemKey];
        };

        return (
          <View
            key={`${item.id}-${index}`}
            style={{
              position: 'relative',
              marginBottom: 8,
              borderRadius: 10,
              overflow: 'hidden',
              backgroundColor: t.bgInput,
            }}>
            {/* Delete action behind row */}
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: DELETE_WIDTH,
                backgroundColor: t.dangerColor,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              }}>
              <StyledPressable
                width="100%"
                height="100%"
                alignItems="center"
                justifyContent="center"
                onPress={handleDeletePress}>
                <StyledMIcon
                  pointerEvents="none"
                  name="delete-outline"
                  size={22}
                  color={t.textInverse}
                />
              </StyledPressable>
            </View>

            {/* Main row */}
            <Animated.View
              {...panResponder.panHandlers}
              style={{
                transform: [{translateX: animValue}],
                backgroundColor: t.bgCard,
                borderRadius: 10,
              }}>
              <StyledPressable
                paddingHorizontal={12}
                paddingVertical={10}
                backgroundColor={t.bgCard}
                borderWidth={1}
                borderColor={t.borderDefault}
                borderRadius={10}
                onPress={() => {
                  if (swipedItemKey !== null) {
                    closeSwipe();
                    return;
                  }

                  if (hasAddOns(item)) {
                    handleEditItem(item);
                  }
                }}>
                <YStack gap={6}>
                  <XStack
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={8}>
                    <YStack flex={1} gap={4}>
                      <Text
                        color={t.textPrimary}
                        variant="body"
                        fontWeight="700"
                        numberOfLines={1}>
                        {item.name}
                      </Text>

                      {hasAddOns(item) && (
                        <XStack alignItems="center" gap={4}>
                          <StyledMIcon
                            name="tune"
                            size={14}
                            color={t.brandPrimary}
                          />
                          <Text variant="caption" color={t.textSecondary}>
                            {addOnsCount} add-on{addOnsCount !== 1 ? 's' : ''}
                          </Text>
                        </XStack>
                      )}
                    </YStack>

                    <Text variant="body"  color={t.textPrimary}>
                      {formatCurrency(shop?.currency || '£', lineTotal)}
                    </Text>
                  </XStack>

                  {showAddOnBreakdown && (
                    <YStack
                      paddingHorizontal={8}
                      paddingVertical={6}
                      backgroundColor={`${t.brandPrimary}08`}
                      borderRadius={8}
                      gap={4}>
                      {isNarrowCart ? (
                        <XStack justifyContent="flex-end">
                          <Text
                            variant="caption"
                            color={t.brandPrimary}
                            fontWeight="700">
                            +
                            {formatCurrency(shop?.currency || '£', addOnsTotal)}
                          </Text>
                        </XStack>
                      ) : (
                        <XStack
                          justifyContent="space-between"
                          alignItems="center"
                          gap={8}>
                          <XStack
                            alignItems="center"
                            flex={1}
                            minWidth={0}
                            gap={6}>
                            <Text
                              variant="caption"
                              color={t.textSecondary}
                              numberOfLines={1}
                              style={{flexShrink: 1}}>
                              Base{' '}
                              {formatCurrency(shop?.currency || '£', basePrice)}
                            </Text>

                            <Text variant="caption" color={t.textMuted}>
                              •
                            </Text>

                            <Text
                              variant="caption"
                              color={t.brandPrimary}
                              fontWeight="600"
                              numberOfLines={1}
                              style={{flexShrink: 1}}>
                              {addOnsCount} add-on{addOnsCount !== 1 ? 's' : ''}
                            </Text>
                          </XStack>

                          <Text
                            variant="caption"
                            color={t.brandPrimary}
                            fontWeight="700">
                            +
                            {formatCurrency(shop?.currency || '£', addOnsTotal)}
                          </Text>
                        </XStack>
                      )}
                    </YStack>
                  )}
                </YStack>
              </StyledPressable>
            </Animated.View>
          </View>
        );
      })}
    </ScrollView>
  );
  // ── Order summary ─────────────────────────────────────────────────────────
  const renderOrderSummary = () => (
    <Stack
      backgroundColor={t.bgInput}
      borderWidth={1}
      borderColor={t.borderDefault}
      paddingHorizontal={16}
      paddingVertical={16}
      borderRadius={12}
      vertical>
      <Stack horizontal justifyContent="space-between" marginBottom={8}>
        <Text variant="subLabel" color={t.textSecondary}>
          Subtotal
        </Text>
        <Text variant="subLabel" color={t.textSecondary}>
          {formatCurrency(shop?.currency || '£', getTotal(table_id))}
        </Text>
      </Stack>
      <Stack horizontal justifyContent="space-between" marginBottom={8}>
        <Text variant="subLabel" color={t.textSecondary}>
          Tax%
        </Text>
        <Text variant="subLabel" color={t.textSecondary}>
          {formatCurrency(shop?.currency || '£', getTotalTax(table_id))}
        </Text>
      </Stack>
      <Stack height={1} backgroundColor={t.borderDefault} marginVertical={10} />
      <Stack horizontal justifyContent="space-between">
        <Text variant="label" color={t.textPrimary}>
          Total
        </Text>
        <Text variant="label" color={t.textPrimary}>
          {formatCurrency(shop?.currency || '£', totalPrice)}
        </Text>
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
            flex={1}
            padding={14}
            borderRadius={12}
            alignItems="center"
            backgroundColor={isSelected ? t.bgInput : t.bgCard}
            borderWidth={1}
            borderColor={isSelected ? t.borderFocus : t.borderDefault}>
            <Icons
              name={option.icon}
              size={24}
              color={isSelected ? t.textPrimary : t.textSecondary}
            />
            <Text
              marginTop={4}
              color={isSelected ? t.textPrimary : t.textSecondary}
              variant="label">
              {option.label}
            </Text>
          </StyledPressable>
        );
      })}
    </XStack>
  );

  // ── Action buttons ────────────────────────────────────────────────────────
 const ActionBtn = ({
  onPress,
  bg,
  borderCol,
  label,
  disabled,
  textColor,
  flex = 1,
}) => (
  <StyledPressable
    flex={flex}
    minHeight={44}
    paddingHorizontal={10}
    paddingVertical={10}
    borderRadius={12}
    alignItems="center"
    justifyContent="center"
    backgroundColor={bg}
    borderWidth={borderCol ? 1 : 0}
    borderColor={borderCol}
    onPress={onPress}
    disabled={disabled}>
    <Text
      color={textColor}
      variant="button"
      numberOfLines={1}
      adjustsFontSizeToFit>
      {label}
    </Text>
  </StyledPressable>
);

  const renderActionButtons = () => {
    if (isCartChanged && hasOrderId)
      return (
        <ActionBtn
          onPress={handleUpdateOrder}
          disabled={isOrderSubmitting}
          bg={t.brandPrimary}
          textColor={t.textInverse}
          label={isOrderSubmitting ? 'Updating…' : '+ Order'}
        />
      );

    if (!isCartChanged && hasItems) {
      if (!hasOrderId)
        return (
          <ActionBtn
            onPress={handleOrder}
            disabled={isOrderSubmitting}
            bg={t.brandPrimary}
            textColor={t.textInverse}
            label={isOrderSubmitting ? 'Placing…' : 'Place Order'}
          />
        );

    // "Hold" saves the order against its table and returns to the Tables
    // overview to go serve someone else — a restaurant/multi-table concept.
    // Shop mode has a single fixed register (table_id), so there's nothing
    // to "come back to" and nowhere in shop mode's own navigation that
    // 'big-table' is reachable from — don't offer it there.
    const isRestaurant = shop?.mode === 'restaurant';

    if (isNarrowCart) {
  return (
    <YStack gap={10} width="100%">
      <XStack gap={8} width="100%">
        <ActionBtn onPress={handlePrint} bg={t.bgInput} borderCol={t.borderDefault} textColor={t.textSecondary} label="Print" flex={1} />
        {isRestaurant && (
          <ActionBtn onPress={() => navigation.navigate('big-table')} bg={`${t.brandPrimary}12`} borderCol={t.brandPrimary} textColor={t.brandPrimary} label="Hold" flex={1} />
        )}
      </XStack>

      <ActionBtn onPress={handlePaymentPress} bg={paymentMethod ? t.successColor : t.bgInput} borderCol={paymentMethod ? undefined : t.borderDefault} textColor={paymentMethod ? t.textInverse : t.textMuted} label="Pay" flex={0} />
      <ActionBtn onPress={handleVoid} bg={t.dangerColor} textColor={t.textInverse} label="Void" flex={0} />
    </YStack>
  );
}

return (
  <XStack flex={1} gap={8}>
    <ActionBtn onPress={handlePrint} bg={t.bgInput} borderCol={t.borderDefault} textColor={t.textSecondary} label="Print" flex={1} />
    {isRestaurant && (
      <ActionBtn onPress={() => navigation.navigate('big-table')} bg={`${t.brandPrimary}12`} borderCol={t.brandPrimary} textColor={t.brandPrimary} label="Hold" flex={1} />
    )}
    <ActionBtn onPress={handlePaymentPress} bg={paymentMethod ? t.successColor : t.bgInput} borderCol={paymentMethod ? undefined : t.borderDefault} textColor={paymentMethod ? t.textInverse : t.textMuted} label="Pay" flex={1} />
    <ActionBtn onPress={handleVoid} bg={t.dangerColor} textColor={t.textInverse} label="Void" flex={1} />
  </XStack>
);
    }
    return null;
  };

  if (!hasItems) {
    return (
      <Stack
        flex={1}
        paddingHorizontal={16}
        paddingVertical={16}
        vertical
        backgroundColor={t.bgCard}
        borderRadius={16}
        borderWidth={1}
        borderColor={t.borderDefault}>
        <Stack flex={1} alignItems="center" justifyContent="center" gap={4}>
          <Stack
            width={72}
            height={72}
            borderRadius={36}
            backgroundColor={`${t.brandPrimary}15`}
            alignItems="center"
            justifyContent="center"
            marginBottom={8}>
            <StyledMIcon name="shopping-cart" size={30} color={t.brandPrimary} />
          </Stack>
          <Text variant="label" fontSize={16} color={t.textPrimary} textAlign="center">
            Your cart is empty
          </Text>
          <Text
            variant="body"
            color={t.textSecondary}
            textAlign="center"
            paddingHorizontal={12}>
            Add items to your cart to see them here.
          </Text>
        </Stack>

        <Stack vertical>
          <Stack height={1} backgroundColor={t.borderDefault} marginBottom={16} />
          <Stack horizontal justifyContent="space-between" marginBottom={16}>
            <Text variant="label" color={t.textPrimary}>
              Total
            </Text>
            <Text variant="label" color={t.textPrimary}>
              {formatCurrency(shop?.currency || '£', 0)}
            </Text>
          </Stack>
          <StyledPressable
            disabled
            paddingVertical={14}
            borderRadius={12}
            alignItems="center"
            justifyContent="center"
            backgroundColor={`${t.brandPrimary}22`}>
            <Text variant="button" color={t.brandPrimary}>
              View Cart
            </Text>
          </StyledPressable>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack
      flex={1}
      paddingHorizontal={16}
      paddingVertical={16}
      vertical
      backgroundColor={t.bgCard}
      borderRadius={16}
      borderWidth={1}
      borderColor={t.borderDefault}>
      <Stack flex={1} vertical marginBottom={16}>
        {renderCartItems()}
      </Stack>
      {/* Order summary + payment methods + action buttons (Pay/Hold/Void).
          This used to share a rigid 50/50 flex split with the items list
          above, regardless of actual content height — once payment methods
          were showing too, it could overflow its half with nothing to
          scroll it, silently clipping the action buttons off the bottom.
          Capped + scrollable instead, so they're always reachable. */}
      <ScrollView
        style={{maxHeight: '55%'}}
        showsVerticalScrollIndicator={false}>
        <Stack vertical>
          {hasItems && renderOrderSummary()}
          {hasOrderId && renderPaymentMethods()}
          <Stack marginTop={16} width="100%">
            {renderActionButtons()}
          </Stack>
        </Stack>
      </ScrollView>
      <Drawer
        visible={showPayment}
        bodyStyle={{backgroundColor: t.bgPage}}
        onClose={() => setShowPayment(false)}
        colors={{
          background: t.bgPage,
          headerBg: theme.colors.transparent,
          headerTitle: t.textPrimary,
          headerSubtitle: t.textSecondary,
          headerBorder: t.bgPage,
        }}
        title="Cash Payment"
        width={drawerWidth}
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

      {/* ── AddOn Modal for editing existing items ── */}
      {showAddOnModal && editingItem && (
        <Stack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="rgba(0, 0, 0, 0.55)"
          alignItems="center"
          justifyContent="center"
          zIndex={999}>
          <AddOn
            table_id={table_id}
            onClose={handleCloseAddOnModal}
            item={editingItem}
            setItem={setEditingItem}
            mode="edit"
            onSubmit={handleAddOnModalSubmit}
          />
        </Stack>
      )}
    </Stack>
  );
}
