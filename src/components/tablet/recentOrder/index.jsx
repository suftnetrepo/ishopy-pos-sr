import React from 'react';
import {StyledSpacer, StyledEmptyState} from 'fluent-styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Stack} from '../../package/stack';
import Text from '../../../components/text';
import {StyledIcon} from '../../package/icon';
import {ScrollView} from 'react-native';
import {
  backgroundColorHelper,
  formatDate,
  textColorHelper,
  capitalize,
  getLastChars,
} from '../../../utils/help';
import {useQueryRecentOrders} from '../../../hooks/useOrderItems';
import EmptyView from '../../utils/empty';
import {useAppTheme} from '../../../theme';

const RecentOrder = () => {
  const {t} = useAppTheme();
  const {data} = useQueryRecentOrders();

  return (
    <Stack
      vertical
      borderRadius={16}
      borderWidth={1}
      borderColor={t.borderDefault}
      backgroundColor={t.bgCard}
      paddingHorizontal={16}
      paddingVertical={16}
      marginLeft={16}
      shadowColor="#000"
      shadowOpacity={0.06}
      shadowRadius={12}
      elevation={3}>
      <Stack
        horizontal
        justifyContent="space-between"
        alignItems="center"
        gap={8}>
        <Text
          color={t.textPrimary}
          variant="title">
          Recent Orders
        </Text>
        <StyledIcon size={24} name="share" color={t.textMuted} />
      </Stack>
      <StyledSpacer
        borderWidth={1}
        borderColor={t.borderDefault}
        width={'100%'}
        marginVertical={12}
      />

      {data.length === 0 ? (
        <>
          <Stack width={'100%'} vertical gap={4}>
            <EmptyView
              color={t.textMuted}
              title="Your Recent Orders list is empty"
              description="Once you place an order, it will appear here. "
            />
          </Stack>
        </>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            {data.map((dish, index) => (
              <Stack
                key={index}
                flex={1}
                horizontal
                justifyContent="flex-start"
                alignItems="center"
                gap={8}
                marginBottom={16}>
                <Stack vertical>
                  <Stack
                    horizontal
                    justifyContent="flex-start"
                    alignItems="center"
                    gap={4}>
                    <Text
                      color={t.textPrimary}
                      variant="label"
                      marginLeft={2}>
                      #{getLastChars(dish.order?.order_id, 8)}
                    </Text>
                    <Text
                      color={t.textPrimary}
                      variant="caption"
                      marginLeft={5}>
                      X {dish.item_count}
                    </Text>
                  </Stack>
                  <Stack
                    horizontal
                    justifyContent="flex-start"
                    alignItems="center"
                    gap={4}>
                    <Stack gap={4} horizontal alignItems="center">
                      <MaterialIcon
                        name="access-time"
                        size={16}
                        color={t.textSecondary}
                      />
                      <Text
                        color={t.textSecondary}
                        variant="caption">
                        {formatDate(dish.order?.date)}
                      </Text>
                    </Stack>
                  </Stack>
                </Stack>
                <StyledSpacer flex={1} />
                <Stack
                  borderColor={backgroundColorHelper(dish.order.status)}
                  backgroundColor={backgroundColorHelper(dish.order.status)}
                  borderRadius={30}>
                  <Text
                    color={textColorHelper(dish.order.status)}
                    variant="caption"
                    paddingHorizontal={12}
                    paddingVertical={4}>
                    {capitalize(dish.order.status)}
                  </Text>
                </Stack>
              </Stack>
            ))}
          </ScrollView>
        </>
      )}
    </Stack>
  );
};

export default RecentOrder;
