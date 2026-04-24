import React, {FC} from 'react';
import {
  YStack,
  XStack,
  StyledSpacer,
  StyledText,
  StyledCard,
  StyledDivider,
  StyledBadge,
  StyledPressable,
} from 'fluent-styles';
import {StyledMIcon} from '../../../components/icon';
import {fontStyles, theme} from '../../../configs/theme';
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
  const {data} = useQueryOrderItemByOrder(order?.order_id || '');

   console.log('Order data for receipt:', {
          order,
          tableName: order?.table_name,
          shop,
          user,
        });

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
        backgroundColor={theme.colors.gray[1]}
        borderRadius={8}
        paddingHorizontal={16}
        paddingVertical={16}
        shadowColor="black"
        shadowOffset={{width: 0, height: 1}}
        shadowOpacity={0.1}
        shadowRadius={2}
        elevation={3}
        borderWidth={1}
        borderColor={theme.colors.gray[800]}
        status={colorCodeStatus(order?.status) as any}>
        <XStack
          marginBottom={2}
          justifyContent="space-between"
          alignItems="center">
          <XStack gap={4} alignItems="center">
            <StyledText
              color={theme.colors.gray[800]}
              fontSize={theme.fontSize.normal}>
              {order?.table_name}
            </StyledText>
          </XStack>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.small}
            fontWeight={theme.fontWeight.normal as any}
            color={theme.colors.gray[700]}>
            #{getLastChars(order?.order_id, 3)}
          </StyledText>
        </XStack>

        <YStack>
          <XStack gap={4} alignItems="center">
            <StyledMIcon
              {...({name: 'access-time'} as any)}
              size={18}
              color={theme.colors.gray[600]}
            />
            <StyledText
              color={theme.colors.gray[600]}
              fontSize={theme.fontSize.small}>
              {formatDate(order?.date)}
            </StyledText>
          </XStack>
        </YStack>
      </Stack>
    );
  };

  const RenderAddOn: FC<{addOn: AddOn}> = ({addOn}) => {
    return (
      <>
        <XStack
          flex={1}
          justifyContent="space-between"
          paddingVertical={8}
          paddingHorizontal={16}
          alignItems="center"
          backgroundColor={theme.colors.gray[1]}>
          <StyledText
            flex={2.5}
            color={theme.colors.gray[800]}
            fontWeight={theme.fontWeight.normal as any}
            fontSize={theme.fontSize.normal}>
            {addOn.addOnName}
          </StyledText>
          <StyledBadge
            color={theme.colors.gray[800]}
            backgroundColor={theme.colors.gray[1]}
            fontWeight={theme.fontWeight.normal as any}
            fontSize={theme.fontSize.normal}
            paddingHorizontal={10}
            paddingVertical={1}
            flex={0.5}>
            {addOn.quantity}
          </StyledBadge>

          <StyledText
            textAlign={'right'}
            flex={1}
            color={theme.colors.gray[800]}
            fontWeight={theme.fontWeight.normal as any}
            fontSize={theme.fontSize.normal}>
            {formatCurrency(shop?.currency || '£', addOn?.price || 0)}
          </StyledText>
        </XStack>
        <StyledDivider borderColor={theme.colors.gray[200]} />
      </>
    );
  };

  const RenderItem: FC<{item: OrderItem}> = ({item}) => {
    return (
      <>
        <XStack
          backgroundColor={theme.colors.blueGray[100]}
          borderColor={theme.colors.blueGray[100]}
          justifyContent="space-between"
          paddingVertical={8}
          paddingHorizontal={16}
          alignItems="center">
          <StyledText
            flex={2.5}
            color={theme.colors.gray[800]}
            fontWeight={theme.fontWeight.normal as any}
            fontSize={theme.fontSize.normal}>
            {item.menu_name}
          </StyledText>
          <StyledBadge
            color={theme.colors.gray[800]}
            backgroundColor={theme.colors.blueGray[100]}
            fontWeight={theme.fontWeight.normal as any}
            fontSize={theme.fontSize.normal}
            paddingHorizontal={10}
            paddingVertical={1}
            flex={0.5}>
            {item.quantity}
          </StyledBadge>
          <StyledText
            textAlign={'right'}
            flex={1}
            color={theme.colors.gray[800]}
            fontWeight={theme.fontWeight.normal as any}
            fontSize={theme.fontSize.normal}>
            {formatCurrency(shop?.currency || '£', item?.price || 0)}
          </StyledText>
        </XStack>
        <StyledDivider borderColor={theme.colors.gray[200]} />
      </>
    );
  };

  const RenderOrderItems: FC = () => {
    return (
      <StyledCard
        shadow="dark"
        borderColor={theme.colors.gray[200]}
        borderRadius={8}
        borderWidth={1}
        backgroundColor={theme.colors.gray[1]}>
        {(Array.isArray(data) ? (data as OrderItem[]) : []).map(
          (item: OrderItem, index: number) => (
            <React.Fragment key={index}>
              <RenderItem item={item} />
              <StyledDivider borderColor={theme.colors.gray[200]} />
              {(item?.addOns ? JSON.parse(item.addOns) : []).map(
                (addOn: AddOn, addOnIndex: number) => (
                  <RenderAddOn addOn={addOn} key={`${index}-${addOnIndex}`} />
                )
              )}
            </React.Fragment>
          )
        )}
      </StyledCard>
    );
  };

  return (
    <YStack
      flex={1}
      marginTop={0}
      borderRadius={8}
      justifyContent="flex-start"
      alignItems="flex-start"
      backgroundColor={theme.colors.gray[50]}
      paddingHorizontal={16}
      paddingVertical={8}>
      <StyledSpacer marginVertical={16} />
      <XStack justifyContent="space-between" alignItems="center">
        <StyledSpacer flex={1}></StyledSpacer>
        <StyledPressable >
          <StyledMIcon
            {...({name: 'print'} as any)}
            size={48}
            color={theme.colors.gray[800]}
            onPress={() => handlePrint()}
          />
        </StyledPressable>

        <StyledPressable >
          <StyledMIcon
            {...({name: 'cancel'} as any)}
            size={48}
            color={theme.colors.gray[800]}
onPress={() => onClose()}
          />
        </StyledPressable>
      </XStack>
      <StyledSpacer marginVertical={8} />
      <Card order={order} />
      <StyledSpacer marginVertical={4} />
      <XStack>
        <ScrollView showsVerticalScrollIndicator={false}>
          <RenderOrderItems />
          <YStack flex={1} width={'100%'}>
            <XStack
              justifyContent="flex-end"
              paddingVertical={8}
              paddingHorizontal={16}
              alignItems="center"
              backgroundColor={theme.colors.gray[100]}>
              <StyledText
                color={theme.colors.gray[800]}
                fontWeight={theme.fontWeight.bold as any}
                paddingHorizontal={16}
                fontSize={theme.fontSize.normal}>
                Subtotal
              </StyledText>
              <StyledText
                color={theme.colors.gray[800]}
                fontWeight={theme.fontWeight.normal as any}
                fontSize={theme.fontSize.normal}>
                {formatCurrency(shop?.currency || '£', order?.total || 0)}
              </StyledText>
            </XStack>

            <XStack
              justifyContent="flex-end"
              paddingVertical={8}
              paddingHorizontal={16}
              alignItems="center"
              backgroundColor={theme.colors.gray[100]}>
              <StyledText
                color={theme.colors.gray[800]}
                fontWeight={theme.fontWeight.normal as any}
                paddingHorizontal={16}
                fontSize={theme.fontSize.normal}>
                Discount
              </StyledText>
              <StyledSpacer marginHorizontal={16} />
              <XStack justifyContent="flex-end" alignItems="center">
                <StyledText
                  color={theme.colors.gray[800]}
                  fontWeight={theme.fontWeight.normal as any}
                  fontSize={theme.fontSize.normal}>
                  {formatCurrency(shop?.currency || '£', order?.discount || 0)}
                </StyledText>
              </XStack>
            </XStack>

            <XStack
              justifyContent="flex-end"
              paddingVertical={8}
              paddingHorizontal={16}
              alignItems="center"
              backgroundColor={theme.colors.gray[100]}>
              <StyledText
                color={theme.colors.gray[800]}
                paddingHorizontal={16}
                fontWeight={theme.fontWeight.normal as any}
                fontSize={theme.fontSize.normal}>
                Tax
              </StyledText>
              <StyledSpacer marginHorizontal={8} />
              <XStack justifyContent="flex-end" alignItems="center">
                <StyledText
                  color={theme.colors.gray[800]}
                  fontWeight={theme.fontWeight.normal as any}
                  fontSize={theme.fontSize.normal}>
                  {formatCurrency(shop?.currency || '£', order?.tax || 0)}
                </StyledText>
              </XStack>
            </XStack>

            <XStack
              justifyContent="flex-end"
              paddingVertical={8}
              paddingHorizontal={16}
              alignItems="center"
              backgroundColor={theme.colors.gray[1]}>
              <StyledText
                color={theme.colors.gray[800]}
                fontWeight={theme.fontWeight.bold as any}
                paddingHorizontal={16}
                fontSize={theme.fontSize.large}>
                Total
              </StyledText>
              <StyledSpacer marginHorizontal={8} />
              <StyledText
                color={theme.colors.gray[800]}
                fontWeight={theme.fontWeight.bold as any}
                fontSize={theme.fontSize.large}>
                {formatCurrency(shop?.currency || '£', order?.total_price || 0)}
              </StyledText>
            </XStack>
          </YStack>
        </ScrollView>
      </XStack>
    </YStack>
  );
};

export default OrderCart;
