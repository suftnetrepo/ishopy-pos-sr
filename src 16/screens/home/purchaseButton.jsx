/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import { 
    XStack,
    StyledSpacer,
    StyledButton
} from 'fluent-styles';
import Text from '../../components/text';
import { StyledMIcon } from '../../components/icon';
import { theme } from '../../configs/theme';
import { useInAppPurchase } from '../../hooks/_useInAppPurchase';
import {useAppTheme} from '../../theme';

const PurchaseButton = () => {
  const {t} = useAppTheme(); 
    const { purchaseHandler } = useInAppPurchase();

    return (
        <XStack absolute bottom={8} right={16}>
            <StyledSpacer flex={1} />
            <StyledButton backgroundColor={theme.colors.orange[400]} onPress={ async() => await purchaseHandler()}>
                <XStack justifyContent='flex-end' alignItems='center' paddingHorizontal={16} paddingVertical={8}>
                    <StyledMIcon size={24} name='apps' color={t.bgCard} />
                    <StyledSpacer marginHorizontal={4} />
                    <Text variant="button" color={t.bgCard}>
                        Buy this App
                    </Text>
                </XStack>
            </StyledButton>
        </XStack>
    )
}

export { PurchaseButton }