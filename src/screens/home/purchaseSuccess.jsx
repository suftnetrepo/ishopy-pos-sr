/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import {    
    YStack,
    StyledText,
    StyledSpacer,
    StyledButton,
} from 'fluent-styles';
import { StyledMIcon } from '../../components/icon';
import { fontStyles, palettes, theme } from '../../configs/theme';
import { prepareSeedData } from '../../model/seed';
import { useNavigation } from '@react-navigation/native';

const PurchaseSuccess = ({ setPaymentStatus }) => {
    const navigator = useNavigation()

    const clearHandler = async () => {
        setPaymentStatus(false)
        await prepareSeedData()
        navigator.navigate("bottom-tabs", { screen: 'Settings' })    }

    return (
        <YStack
            backgroundColor={palettes.transparent05}
            flex={1}
            justifyContent='center'
            alignItems='center'
        >
            <YStack
                width={'90%'}
                backgroundColor={theme.colors.gray[1]}
                borderRadius={16}
                paddingHorizontal={16}
                paddingVertical={16}
                justifyContent='center'
                alignItems='center'
            >
                <StyledMIcon
                    name="check-circle"
                    size={120}
                    color={theme.colors.green[600]}
                />
                <StyledSpacer marginVertical={8} />
                <StyledText
                    fontFamily={fontStyles.Roboto_Regular}
                    color={theme.colors.gray[800]}
                    fontWeight={theme.fontWeight.normal}
                    fontSize={theme.fontSize.xlarge}
                    paddingVertical={1}
                    paddingHorizontal={16}
                    textAlign='center'
                >
                    Thank You for Your Purchase!
                </StyledText>
                <StyledSpacer marginVertical={8} />
                <StyledText
                    fontFamily={fontStyles.Roboto_Regular}
                    color={theme.colors.gray[800]}
                    fontWeight={theme.fontWeight.normal}
                    fontSize={theme.fontSize.normal}
                    textAlign='center'
                >
                    We appreciate your support and are thrilled to have you on board. Please note that all Store test data will be deleted to ensure a clean experience.
                    We recommend updating your Store and user account details.
                </StyledText>
                <StyledSpacer marginVertical={8} />
                <StyledButton
                    borderRadius={30}
                    borderColor={theme.colors.cyan[500]}
                    backgroundColor={theme.colors.cyan[500]}
                    onPress={() => clearHandler()}
                >
                    <StyledText
                        fontFamily={fontStyles.OpenSansRegular}
                        color={theme.colors.gray[1]}
                        fontWeight={theme.fontWeight.normal}
                        fontSize={theme.fontSize.normal}
                        paddingHorizontal={16}
                        paddingVertical={8}
                    >
                        Get Settings
                    </StyledText>
                </StyledButton>
                <StyledSpacer marginVertical={8} />
            </YStack>
        </YStack>
    )
}

export { PurchaseSuccess }