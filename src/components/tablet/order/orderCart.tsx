import React, {FC} from 'react';
import {
  YStack,
  XStack,
  StyledSpacer,
  StyledCard,
  StyledDivider,
  StyledBadge,
  StyledPressable,
} from 'fluent-styles';
import {StyledMIcon} from '../../../components/icon';
import {theme} from '../../../configs/theme';
import {Text} from '../../../components/text';
import {useAppContext} from '../../../hooks/appContext';
import {useQueryOrderItemByOrder} from '../../../hooks/useOrderItems';
import {
  formatCurrency,
  colorCodeStatus,
  getLastChars,
} from '../../../utils/help';
import {ScrollView} from 'react-native';
import {Stack} from '../../../components/package/stack';
import {formatReceiptData} from '../../../utils/receiptFormatter';
import {printerStore} from '../../../store/printerStore';
import {printReceipt} from '../../../utils/printReceipt';
import {useAppTheme} from '../../../theme';

interface AddOn {
  addOnName: string;
  quantity: number;
  price: number;
}

interface OrderItem {
  menu_name: string;
  quantity: number;
  price: number;
  addOns?: string;
}

interface Order {
  order_id: string;
  table_name: string;
  status: string;
  date: string;
  total: number;
  discount: number;
  tax: number;
  total_price: number;
}

interface Shop {
  currency: string;
}

interface OrderCartProps {
  onClose: () => void;
}

const OrderCart: FC<OrderCartProps> = ({onClose}) => {
  const {shop, order, user} = useAppContext();
  const {t} = useAppTheme();
  const {data} = useQueryOrderItemByOrder(order?.order_id || '');

  const handlePrint = async () => {
    try {
        console.log('Order data for receipt:', {
          order,
          tableName: order?.table_name,
          shop,
          user,
        });
      const selectedPrinter = await printerStore.getSelectedPrinter();

      console.log('Selected printer:', selectedPrinter);

      if (!selectedPrinter) {
        throw new Error('No printer selected');
      }
      const receiptData = await formatReceiptData({
        order,
        tableName: order?.table_name,
        shop,
        user,
        businessType: shop?.mode as any,
      });

      await printReceipt(selectedPrinter, receiptData);
    } catch (error) {
      console.error('Error printing receipt:', error);
    }
  };

  const Card: FC<{order: Order}> = ({order}) => {
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    };

    return (
      <Stack
        vertical
        width={'100%'}
        backgroundColor={t.bgCard}
        borderRadius={8}
        paddingHorizontal={16}
        paddingVertical={16}
        shadowColor="black"
        shadowOffset={{width: 0, height: 1}}
        shadowOpacity={0.1}
        shadowRadius={2}
        elevation={3}
        borderWidth={1}
        borderColor={t.textPrimary}
        status={colorCodeStatus(order?.status) as any}>
        <XStack
          marginBottom={2}
          justifyContent="space-between"
          alignItems="center">
          <XStack gap={4} alignItems="center">
            <Text
              color={t.textPrimary}
              variant="body">
              {order?.table_name}
            </Text>
          </XStack>
          <Text
            variant="caption"
            color={t.textSecondary}>
            #{getLastChars(order?.order_id, 3)}
          </Text>
        </XStack>

        <YStack>
          <XStack gap={4} alignItems="center">
            <StyledMIcon
              {...({name: 'access-time'} as any)}
              size={18}
              color={t.textSecondary}
            />
            <Text
              color={t.textSecondary}
              variant="caption">
              {formatDate(order?.date)}
            </Text>
          </XStack>
        </YStack>
      </Stack>
    );
  };

  const RenderAddOn: FC<{addOn: AddOn}> = ({addOn}) => {
    return (
      <XStack
        flex={1}
        justifyContent="space-between"
        paddingVertical={10}
        paddingHorizontal={16}
        alignItems="center"
        backgroundColor="transparent">
        <Text
          flex={2.5}
          color={t.textPrimary}
          variant="body">
          {addOn.addOnName}
        </Text>
        <StyledBadge
          color={t.textSecondary}
          backgroundColor="transparent"
          paddingHorizontal={10}
          paddingVertical={1}
          flex={0.5}>
          {addOn.quantity}
        </StyledBadge>

        <Text
          textAlign={'right'}
          flex={1}
          color={t.textPrimary}
          variant="body">
          {formatCurrency(shop?.currency || '£', addOn?.price || 0)}
        </Text>
      </XStack>
    );
  };

  const RenderItem: FC<{item: OrderItem}> = ({item}) => {
    return (
      <>
        <XStack
          backgroundColor="transparent"
          justifyContent="space-between"
          paddingVertical={10}
          paddingHorizontal={16}
          alignItems="center">
          <Text
            flex={2.5}
            color={t.textPrimary}
            variant="body">
            {item.menu_name}
          </Text>
          <StyledBadge
            color={t.textSecondary}
            backgroundColor="transparent"
            paddingHorizontal={10}
            paddingVertical={1}
            flex={0.5}>
            {item.quantity}
          </StyledBadge>
          <Text
            textAlign={'right'}
            flex={1}
            color={t.textPrimary}
            variant="body">
            {formatCurrency(shop?.currency || '£', item?.price || 0)}
          </Text>
        </XStack>
        {(item?.addOns ? JSON.parse(item.addOns) : []).length > 0 && (
          <Stack paddingHorizontal={16} paddingVertical={2}>
            {(item?.addOns ? JSON.parse(item.addOns) : []).map(
              (addOn: AddOn, addOnIndex: number) => (
                <RenderAddOn addOn={addOn} key={addOnIndex} />
              )
            )}
          </Stack>
        )}
      </>
    );
  };

  const RenderOrderItems: FC = () => {
    return (
      <StyledCard
        shadow="dark"
        borderColor={t.borderDefault}
        borderRadius={8}
        borderWidth={1}
        backgroundColor={t.bgCard}
        paddingVertical={0}
        paddingHorizontal={0}
        overflow="hidden">
        <YStack gap={0}>
          {(Array.isArray(data) ? (data as OrderItem[]) : []).map(
            (item: OrderItem, index: number) => (
              <React.Fragment key={index}>
                <RenderItem item={item} />
                {index < (Array.isArray(data) ? data.length - 1 : 0) && (
                  <Stack
                    height={1}
                    backgroundColor={`${t.borderSubtle}20`}
                    marginHorizontal={16}
                  />
                )}
              </React.Fragment>
            )
          )}
        </YStack>
      </StyledCard>
    );
  };

  return (
    <YStack
      flex={1}
     
      borderRadius={8}
      justifyContent="flex-start"
      alignItems="flex-start"
      backgroundColor={t.bgPage}
      paddingHorizontal={16}
      paddingVertical={8}>
   
      <Card order={order} />
      <StyledSpacer marginVertical={4} />
      <XStack>
        <ScrollView showsVerticalScrollIndicator={false}>
          <RenderOrderItems />
          <YStack
            flex={1}
            width={'100%'}
            marginTop={14}
            paddingTop={12}
            borderTopWidth={1}
            borderTopColor={`${t.borderSubtle}30`}>
            <XStack
              justifyContent="flex-end"
              paddingVertical={8}
              paddingHorizontal={16}
              alignItems="center"
              backgroundColor="transparent">
              <Text
                color={t.textSecondary}
                variant="caption"
                paddingHorizontal={16}>
                Subtotal
              </Text>
              <Text
                color={t.textPrimary}
                variant="body">
                {formatCurrency(shop?.currency || '£', order?.total || 0)}
              </Text>
            </XStack>

            <XStack
              justifyContent="flex-end"
              paddingVertical={8}
              paddingHorizontal={16}
              alignItems="center"
              backgroundColor="transparent">
              <Text
                color={t.textSecondary}
                variant="caption"
                paddingHorizontal={16}>
                Discount
              </Text>
              <StyledSpacer marginHorizontal={16} />
              <XStack justifyContent="flex-end" alignItems="center">
                <Text
                  color={t.textPrimary}
                  variant="body">
                  {formatCurrency(shop?.currency || '£', order?.discount || 0)}
                </Text>
              </XStack>
            </XStack>

            <XStack
              justifyContent="flex-end"
              paddingVertical={8}
              paddingHorizontal={16}
              alignItems="center"
              backgroundColor="transparent">
              <Text
                color={t.textSecondary}
                paddingHorizontal={16}
                variant="caption">
                Tax
              </Text>
              <StyledSpacer marginHorizontal={8} />
              <XStack justifyContent="flex-end" alignItems="center">
                <Text
                  color={t.textPrimary}
                  variant="body">
                  {formatCurrency(shop?.currency || '£', order?.tax || 0)}
                </Text>
              </XStack>
            </XStack>

            <XStack
              justifyContent="flex-end"
              paddingVertical={10}
              paddingHorizontal={16}
              alignItems="center"
              backgroundColor={t.bgInput}
              borderRadius={8}
              marginHorizontal={8}
              marginVertical={12}>
              <Text
                color={t.textPrimary}
                variant="title"
                paddingHorizontal={16}>
                Total
              </Text>
              <StyledSpacer marginHorizontal={8} />
              <Text
                color={t.textPrimary}
                variant="title">
                {formatCurrency(shop?.currency || '£', order?.total_price || 0)}
              </Text>
            </XStack>
          </YStack>
        </ScrollView>
      </XStack>
    </YStack>
  );
};

export default OrderCart;
