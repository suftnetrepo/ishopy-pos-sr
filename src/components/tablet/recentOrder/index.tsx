import React from 'react';
import {StyledText, StyledSpacer} from 'fluent-styles';
import {Stack} from '../../../components/package/stack';
import {theme} from '../../../utils/theme';
import {StyledImage} from '../../../components/package/image';
import {ScrollView} from 'react-native';
import {backgroundColorHelper, textColorHelper} from '../../../utils/help';
import {useQueryRecentOrders} from '../../../hooks/useOrderItems';

const RecentOrder = () => {
  const {data} = useQueryRecentOrders();

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
        <StyledText
          color={theme.colors.gray[800]}
          fontSize={14}
          fontWeight={theme.fontWeight.thin}>
          View All
        </StyledText>
      </Stack>
      <StyledSpacer marginVertical={8} />
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
            <StyledImage
              source={{
                uri: 'https://img1.wsimg.com/isteam/ip/8fa9801a-9459-437f-ac41-7e7e90b4e436/Making%20Egusi%20Soup%20Recipe%20(with%20Assorted%20Meat)%20.jpg/:/rs=w:1280',
              }}
              size={32}
              cycle
              resizeMode="contain"></StyledImage>
            <Stack vertical>
              <StyledText
                color={theme.colors.gray[500]}
                fontSize={16}
                fontWeight={theme.fontWeight.medium}
                marginLeft={2}>
                {dish.menu_name}
              </StyledText>
              <Stack
                horizonal
                justifyContent="flex-start"
                alignItems="center"
                gap={4}>
                <StyledText
                  color={theme.colors.gray[400]}
                  fontSize={14}
                  fontWeight={theme.fontWeight.normal}
                  marginLeft={2}>
                  Items:
                </StyledText>
                <StyledText
                  color={theme.colors.green[800]}
                  fontSize={14}
                  fontWeight={theme.fontWeight.semiBold}
                  marginLeft={5}>
                  {dish.order_count}
                </StyledText>
              </Stack>
            </Stack>
            <StyledSpacer flex={1} />
            <Stack
              borderColor={backgroundColorHelper(dish.status)}
              backgroundColor={backgroundColorHelper(dish.status)}
              borderRadius={30}>
              <StyledText
                color={textColorHelper(dish.status)}
                fontSize={12}
                paddingHorizontal={12}
                paddingVertical={4}
                fontWeight={theme.fontWeight.normal}>
                {dish.status}
              </StyledText>
            </Stack>
          </Stack>
        ))}
      </ScrollView>
    </Stack>
  );
};

export default RecentOrder;
