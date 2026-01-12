import React from 'react';
import { StyledText, StyledSpacer } from 'fluent-styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Stack } from '../../../components/package/stack';
import { theme } from '../../../utils/theme';
import { StyledIcon } from '../../../components/package/icon';
import { ScrollView } from 'react-native';
import { backgroundColorHelper, formatDate, textColorHelper, capitalize, getLastChars } from '../../../utils/help';
import { useQueryRecentOrders } from '../../../hooks/useOrderItems';

const RecentOrder = () => {
  const { data } = useQueryRecentOrders();

  return (
    <Stack
      vertical
      shadowOpacity={0.9}
      shadowColor={theme.colors.gray[200]}
      shadowRadius={8}
      borderRadius={8}
      backgroundColor={theme.colors.gray[1]}
      paddingHorizontal={24}
      paddingVertical={24}
      marginLeft={16}>
      <Stack
        horizonal
        justifyContent="space-between"
        alignItems="center"
        gap={8}>
        <StyledText
          color={theme.colors.gray[800]}
          fontSize={theme.fontSize.large}
          fontWeight={theme.fontWeight.normal}>
          Recent Orders
        </StyledText>
           <StyledIcon size={24} name='share' color={theme.colors.gray[300]} />
      </Stack>
          <StyledSpacer borderWidth={0.4} borderColor={theme.colors.gray[300]} width={'100%'} marginVertical={8} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {data.map((dish, index) => (
          <Stack
            key={index}
            flex={1}
            horizonal
            justifyContent="flex-start"
            alignItems="center"
            gap={8}
            marginBottom={16}>
            <Stack vertical>
              <Stack
                horizonal
                justifyContent="flex-start"
                alignItems="center"
                gap={4}>
                <StyledText
                  color={theme.colors.gray[800]}
                  fontSize={theme.fontSize.small}
                  fontWeight={theme.fontWeight.medium}
                  marginLeft={2}>
               
                    #{getLastChars(dish.order?.order_id, 8)}
                </StyledText>
                <StyledText
                  color={theme.colors.gray[800]}
                  fontSize={theme.fontSize.small}
                  fontWeight={theme.fontWeight.thin}
                  marginLeft={5}>
                  X {dish.item_count}
                </StyledText>
              </Stack>
              <Stack
                horizonal
                justifyContent="flex-start"
                alignItems="center"
                gap={4}>
                <Stack gap={4} horizonal alignItems="center">
                  <MaterialIcon name="access-time" size={16} color={theme.colors.gray[600]} />
                  <StyledText color={theme.colors.gray[600]} fontSize={theme.fontSize.small}>{formatDate(dish.order?.date)}</StyledText>
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
    </Stack>
  );
};

export default RecentOrder;
