/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
    YStack,
    XStack,
    StyledSpacer,
    StyledCard
} from 'fluent-styles';
import Text from '../../components/text';
import { StyledMIcon } from '../../components/icon';
import { theme } from '../../configs/theme';
import {
    useMonthlySales,
    useWeeklySales,
} from '../../hooks/useDashboard';
import { useAppContext } from '../../hooks/appContext';
import { formatCurrency } from '../../utils/help';
import {useAppTheme} from '../../theme';

const SalesTrend = () => {
    const { shop } = useAppContext();
  const {t} = useAppTheme();
    const { data: monthlySales } = useMonthlySales();
    const { data: weeklySales } = useWeeklySales()

    return (
        <XStack marginHorizontal={16} justifyContent='space-between' alignItems='center' gap={8}>
            <StyledCard
                borderColor={theme.colors.orange[100]}
                backgroundColor={theme.colors.orange[100]}
                paddingHorizontal={8}
                borderRadius={32}
                flex={1}
            >
                <YStack justifyContent='flex-start' alignItems='flex-start' paddingHorizontal={8} paddingVertical={16}>
                    <StyledMIcon size={24} name={'weekend'} color={t.brandPrimary} />
                    <StyledSpacer marginVertical={8} />
                    <Text variant="metric" color={theme.colors.orange[800]}>
                        {formatCurrency(shop.currency || '£', weeklySales)}
                    </Text>
                    <Text variant="body" color={t.textSecondary}>
                        Weekly sales
                    </Text>
                </YStack>
            </StyledCard>
            <StyledCard
                borderColor={theme.colors.yellow[50]}
                backgroundColor={theme.colors.yellow[50]}
                paddingHorizontal={8}
                borderRadius={32}
                flex={1}
            >
                <YStack justifyContent='flex-start' alignItems='flex-start' paddingHorizontal={8} paddingVertical={16}>
                    <StyledMIcon size={24} name={'view-day'} color={t.brandPrimary} />
                    <StyledSpacer marginVertical={8} />
                    <Text variant="metric" color={t.brandPrimaryDark}>
                        {formatCurrency(shop.currency || '£', monthlySales)}
                    </Text>
                    <Text variant="body" color={t.textSecondary}>
                        Monthly sales
                    </Text>
                </YStack>
            </StyledCard>


        </XStack>
    )
}

export { SalesTrend }