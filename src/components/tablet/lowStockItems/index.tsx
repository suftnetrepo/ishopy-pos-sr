import React from 'react';
import { StyledText, StyledSpacer } from 'fluent-styles';
import { Stack } from '../../../components/package/stack';
import { theme } from '../../../utils/theme';
import { StyledIcon } from '../../../components/package/icon';
import { ScrollView } from 'react-native';
import { useQueryGetLowerStock } from '../../../hooks/useStock';
import { Icon } from '../icon/icon';

const LowStockItems = () => {
  const { data } = useQueryGetLowerStock();

  return (
    <Stack
      vertical
      shadowOpacity={0.9}
      shadowColor={theme.colors.gray[200]}
      shadowRadius={8}
      width={'100%'}
      borderRadius={8}
      backgroundColor={theme.colors.gray[1]}
      paddingHorizontal={24}
      paddingVertical={24}
      justifyContent="flex-start"
      alignItems="flex-start">
      <Stack
        horizonal
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        gap={8}>
        <StyledText
          color={theme.colors.gray[800]}
          fontSize={theme.fontSize.large}
          fontWeight={theme.fontWeight.normal}>
          Low Stock Items
        </StyledText>
        <StyledIcon size={24} name='share' color={theme.colors.gray[300]} />
      </Stack>
      <StyledSpacer borderWidth={0.5} borderColor={theme.colors.gray[300]} width={'100%'} marginVertical={8} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {data.map((dish, index) => (
          <Stack
            key={index}
            horizonal
            justifyContent="flex-start"
            alignItems="center"
            gap={4}
            marginBottom={16}>
            <Icon name={dish?.icon_name} isSelected={false} />
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
                  Available:
                </StyledText>
                <StyledText
                  color={theme.colors.green[800]}
                  fontSize={14}
                  fontWeight={theme.fontWeight.semiBold}
                  marginLeft={5}>
                  {dish.current_stock || 0}
                </StyledText>
              </Stack>
            </Stack>
            <StyledSpacer flex={1} />
          </Stack>
        ))}
      </ScrollView>
    </Stack>
  );
};

export default LowStockItems;
