/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
    YStack,
    XStack,
    StyledText,
    StyledSpacer,
    StyledCard
} from 'fluent-styles';
import { StyledMIcon } from '../../components/icon';
import { fontStyles, theme } from '../../configs/theme';
import {
    useMonthlySales,
    useWeeklySales,
} from '../../hooks/useDashboard';
import { useAppContext } from '../../hooks/appContext';
import { formatCurrency } from '../../utils/help';

const SalesTrend = () => {
    const { shop } = useAppContext();
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
                    <StyledMIcon size={24} name={'weekend'} color={theme.colors.orange[500]} />
                    <StyledSpacer marginVertical={8} />
                    <StyledText
                        fontFamily={fontStyles.Roboto_Regular}
                        fontSize={theme.fontSize.normal}
                        fontWeight={theme.fontWeight.bold}
                        color={theme.colors.orange[800]}>
                        {formatCurrency(shop.currency || '£', weeklySales)}
                    </StyledText>
                    <StyledText fontFamily={fontStyles.Roboto_Regular}
                        fontSize={theme.fontSize.small}
                        fontWeight={theme.fontWeight.normal}
                        color={theme.colors.gray[700]}>
                        Weekly sales
                    </StyledText>
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
                    <StyledMIcon size={24} name={'view-day'} color={theme.colors.yellow[500]} />
                    <StyledSpacer marginVertical={8} />
                    <StyledText
                        fontFamily={fontStyles.Roboto_Regular}
                        fontSize={theme.fontSize.normal}
                        fontWeight={theme.fontWeight.bold}
                        color={theme.colors.yellow[800]}>
                        {formatCurrency(shop.currency || '£', monthlySales)}
                    </StyledText>
                    <StyledText fontFamily={fontStyles.Roboto_Regular}
                        fontSize={theme.fontSize.small}
                        fontWeight={theme.fontWeight.normal}
                        color={theme.colors.gray[700]}>
                        Monthly sales
                    </StyledText>
                </YStack>
            </StyledCard>


        </XStack>
    )
}

export { SalesTrend }