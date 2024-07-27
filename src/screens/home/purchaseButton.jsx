/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import { 
    XStack,
    StyledText,
    StyledSpacer,
    StyledButton
} from 'fluent-styles';
import { StyledMIcon } from '../../components/icon';
import { fontStyles, theme } from '../../configs/theme';
import { useInAppPurchase } from '../../hooks/useInAppPurchase';

const PurchaseButton = () => { 
    const { purchaseHandler } = useInAppPurchase();

    return (
        <XStack absolute bottom={8} right={16}>
            <StyledSpacer flex={1} />
            <StyledButton backgroundColor={theme.colors.orange[400]} onPress={ async() => await purchaseHandler()}>
                <XStack justifyContent='flex-end' alignItems='center' paddingHorizontal={16} paddingVertical={8}>
                    <StyledMIcon size={24} name='apps' color={theme.colors.gray[1]} />
                    <StyledSpacer marginHorizontal={4} />
                    <StyledText color={theme.colors.gray[1]} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.large} >
                        Buy this App
                    </StyledText>
                </XStack>
            </StyledButton>
        </XStack>
    )
}

export { PurchaseButton }