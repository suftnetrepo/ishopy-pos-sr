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
        paddingVertical={11}
        paddingHorizontal={16}
        alignItems="center"
        backgroundColor="transparent"
        gap={12}>
        <Text
          flex={1}
          color={t.textPrimary}
          variant="body"
          numberOfLines={1}>
          {addOn.addOnName}
        </Text>
        <Text
          width={32}
          textAlign="center"
          color={t.textSecondary}
          variant="caption"
          style={{opacity: 0.75}}>
          {addOn.quantity}
        </Text>
        <Text
          width={80}
          textAlign="right"
          color={t.textPrimary}
          variant="body"
          fontWeight="600">
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
          paddingVertical={11}
          paddingHorizontal={16}
          alignItems="center"
          gap={12}>
          <Text
            flex={1}
            color={t.textPrimary}
            variant="body"
            fontWeight="600"
            numberOfLines={1}>
            {item.menu_name}
          </Text>
          <Text
            width={32}
            textAlign="center"
            color={t.textSecondary}
            variant="caption"
            style={{opacity: 0.75}}>
            {item.quantity}
          </Text>
          <Text
            width={80}
            textAlign="right"
            color={t.textPrimary}
            variant="body"
            fontWeight="600">
            {formatCurrency(shop?.currency || '£', item?.price || 0)}
          </Text>
        </XStack>
        {(item?.addOns ? JSON.parse(item.addOns) : []).length > 0 && (
          <YStack paddingHorizontal={16} paddingVertical={4} gap={0}>
            {(item?.addOns ? JSON.parse(item.addOns) : []).map(
              (addOn: AddOn, addOnIndex: number) => (
                <RenderAddOn addOn={addOn} key={addOnIndex} />
              )
            )}
          </YStack>
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
            marginTop={16}
            paddingTop={14}
            borderTopWidth={1}
            borderTopColor={`${t.borderSubtle}30`}
            gap={10}>
            <XStack
              paddingVertical={8}
              paddingHorizontal={16}
              alignItems="center"
              gap={12}>
              <Text
                flex={1}
                color={t.textSecondary}
                variant="caption">
                Subtotal
              </Text>
              <Text
                width={80}
                textAlign="right"
                color={t.textPrimary}
                variant="body">
                {formatCurrency(shop?.currency || '£', order?.total || 0)}
              </Text>
            </XStack>

            <XStack
              paddingVertical={8}
              paddingHorizontal={16}
              alignItems="center"
              gap={12}>
              <Text
                flex={1}
                color={t.textSecondary}
                variant="caption">
                Discount
              </Text>
              <Text
                width={80}
                textAlign="right"
                color={t.textPrimary}
                variant="body">
                {formatCurrency(shop?.currency || '£', order?.discount || 0)}
              </Text>
            </XStack>

            <XStack
              paddingVertical={8}
              paddingHorizontal={16}
              alignItems="center"
              gap={12}>
              <Text
                flex={1}
                color={t.textSecondary}
                variant="caption">
                Tax
              </Text>
              <Text
                width={80}
                textAlign="right"
                color={t.textPrimary}
                variant="body">
                {formatCurrency(shop?.currency || '£', order?.tax || 0)}
              </Text>
            </XStack>

            <XStack
              paddingVertical={12}
              paddingHorizontal={16}
              alignItems="center"
              gap={12}
              backgroundColor={t.bgInput}
              borderRadius={8}
              marginHorizontal={0}
              marginVertical={4}>
              <Text
                flex={1}
                color={t.textPrimary}
                variant="title"
                fontWeight="700">
                Total
              </Text>
              <Text
                width={80}
                textAlign="right"
                color={t.textPrimary}
                variant="title"
                fontWeight="700">
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
