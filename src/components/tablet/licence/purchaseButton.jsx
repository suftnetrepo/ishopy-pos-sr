
import React from 'react';
import {
    XStack,
    StyledText,
    StyledSpacer,
    StyledButton
} from 'fluent-styles';
import { StyledMIcon } from '../../icon';
import { fontStyles, theme } from '../../../configs/theme';
import { useInAppPurchase } from '../../../hooks/useInAppPurchase';

const PurchaseButton = ({ collapse = false }) => {
    const { purchaseHandler } = useInAppPurchase();

    return (
        <StyledButton borderRadius={50} borderWidth={1} borderColor={theme.colors.orange[400]} backgroundColor={theme.colors.orange[400]} onPress={purchaseHandler}>
            <XStack justifyContent='center' alignItems='center' paddingHorizontal={16} paddingVertical={8}>
                <StyledMIcon size={24} name='apps' color={theme.colors.gray[1]} />
                {
                    collapse && (
                        <>
                            <StyledSpacer marginHorizontal={2} />
                            <StyledText color={theme.colors.gray[1]} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} >
                                Buy this App
                            </StyledText>
                        </>
                    )
                }

            </XStack>
        </StyledButton>
    )
}

export { PurchaseButton }