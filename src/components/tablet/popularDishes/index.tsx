import React from 'react';
import { StyledText, StyledSpacer, Stack, StyleShape } from 'fluent-styles';
import { theme } from '../../../utils/theme';
import { StyledIcon } from '../../../components/package/icon';
import { ScrollView } from 'react-native';
import { useQueryPopularMenuItems } from '../../../hooks/useOrderItems';
import PosIcon from '../../pos-icon';
import { useAppContext } from '../../../hooks/appContext';

const PopularDishes = () => {
  const { shop } = useAppContext();
  const { data } = useQueryPopularMenuItems();

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
      justifyContent="flex-start"
      alignItems="flex-start">

      <Stack horizontal width="100%" justifyContent="space-between" alignItems="center" gap={8}>
        <StyledText
          color={theme.colors.gray[800]}
          fontSize={theme.fontSize.large}
          fontWeight={theme.fontWeight.normal as any}>
            {shop?.mode === 'shop' ? 'Popular Items ' : 'Popular Dishes '}
        </StyledText>
        <StyledIcon size={24} name="share" color={theme.colors.gray[300]} />
      </Stack>

      <StyledSpacer
        borderWidth={0.4}
        borderColor={theme.colors.gray[300]}
        width={'100%'}
        marginVertical={8}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {data?.map((dish, index) => (
          <Stack
            key={index}
            horizontal
            width="100%"
            flexWrap="wrap"
            justifyContent="flex-start"
            alignItems="center"
            gap={4}
            marginBottom={16}>

            {/* Icon box with color */}
            <StyleShape
             size={48}
              borderRadius={10}
              backgroundColor={theme.colors.gray[100]}
              alignItems="center"
              justifyContent="center">
              <PosIcon
                name={dish?.menu_icon_name}
                size={24}
                color={theme.colors.gray[600]}
              />
            </StyleShape>

            <Stack vertical>
              <StyledText
                color={theme.colors.gray[500]}
                fontSize={16}
                fontWeight={theme.fontWeight.normal as any}
                marginLeft={2}>
                {dish.menu_name}
              </StyledText>
              <Stack horizontal justifyContent="flex-start" alignItems="center" gap={4}>
                <StyledText
                  color={theme.colors.gray[400]}
                  fontSize={14}
                  fontWeight={theme.fontWeight.normal as any}
                  marginLeft={2}>
                  Orders:
                </StyledText>
                <StyledText
                  color={theme.colors.green[800]}
                  fontSize={14}
                  fontWeight={theme.fontWeight.semiBold as any}
                  marginLeft={5}>
                  {dish.order_count || 0}
                </StyledText>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </ScrollView>
    </Stack>
  );
};

export default PopularDishes;
