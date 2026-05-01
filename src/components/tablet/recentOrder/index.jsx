import React from 'react';
import {StyledText, StyledSpacer, StyledEmptyState} from 'fluent-styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Stack} from '../../package/stack';
import {theme} from '../../../utils/theme';
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
      shadowOpacity={0.9}
      shadowColor={t.borderDefault}
      shadowRadius={8}
      borderRadius={8}
      backgroundColor={t.bgCard}
      paddingHorizontal={24}
      paddingVertical={24}
      marginLeft={16}>
      <Stack
        horizontal
        justifyContent="space-between"
        alignItems="center"
        gap={8}>
        <StyledText
          color={t.textPrimary}
          fontSize={theme.fontSize.large}
          fontWeight={theme.fontWeight.normal}>
          Recent Orders
        </StyledText>
        <StyledIcon size={24} name="share" color={t.textMuted} />
      </Stack>
      <StyledSpacer
        borderWidth={0.4}
        borderColor={t.textMuted}
        width={'100%'}
        marginVertical={8}
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
                    <StyledText
                      color={t.textPrimary}
                      fontSize={theme.fontSize.small}
                      fontWeight={theme.fontWeight.medium}
                      marginLeft={2}>
                      #{getLastChars(dish.order?.order_id, 8)}
                    </StyledText>
                    <StyledText
                      color={t.textPrimary}
                      fontSize={theme.fontSize.small}
                      fontWeight={theme.fontWeight.thin}
                      marginLeft={5}>
                      X {dish.item_count}
                    </StyledText>
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
                      <StyledText
                        color={t.textSecondary}
                        fontSize={theme.fontSize.small}>
                        {formatDate(dish.order?.date)}
                      </StyledText>
                    </Stack>
                  </Stack>
                </Stack>
                <StyledSpacer flex={1} />
                <Stack
                  borderColor={backgroundColorHelper(dish.order.status)}
                  backgroundColor={backgroundColorHelper(dish.order.status)}
                  borderRadius={30}>
                  <StyledText
                    color={textColorHelper(dish.order.status)}
                    fontSize={12}
                    paddingHorizontal={12}
                    paddingVertical={4}
                    fontWeight={theme.fontWeight.normal}>
                    {capitalize(dish.order.status)}
                  </StyledText>
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
