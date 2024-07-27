/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { YStack, XStack, StyledSpacer, StyledText, StyledButton } from 'fluent-styles';
import { StyledMIcon } from '../../components/icon';
import { fontStyles, theme } from '../../configs/theme';
import { useAppContext } from '../../hooks/appContext';

const CheckOutCompleted = ({ order, printHandler, shareReceipt }) => {
    const { clearItem } = useAppContext()
    const navigator = useNavigation()

    const close = () => {
        clearItem()
        navigator.navigate("sales")
    }

    const print = () => {
        printHandler(order)
    }

    const share = () => {
        shareReceipt(order)
    }

    return (
        <YStack justifyContent='center' alignItems='center' flex={1} transparent>
            <YStack borderRadius={16} justifyContent='center' alignItems='center' width='90%' backgroundColor={theme.colors.gray[1]} paddingHorizontal={24} paddingVertical={16}>
                <XStack justifyContent='flex-end' alignItems='center' >
                    <StyledSpacer flex={1}></StyledSpacer>
                    <StyledMIcon
                        name="cancel"
                        size={48}
                        color={theme.colors.gray[600]}
                        onPress={() => close()}
                    />
                </XStack>
                <StyledSpacer marginVertical={8}></StyledSpacer>
                <StyledMIcon
                    name="check-circle"
                    size={120}
                    color={theme.colors.green[600]}
                />
                <StyledSpacer marginVertical={8}></StyledSpacer>
                <StyledText
                    fontFamily={fontStyles.Roboto_Regular}
                    color={theme.colors.gray[800]}
                    fontWeight={theme.fontWeight.normal}
                    fontSize={theme.fontSize.xxlarge}
                    textAlign="center"
                >
                    Thanks you for purchasing from us.
                </StyledText>
                <StyledSpacer marginVertical={16}></StyledSpacer>
                <XStack justifyContent='flex-end' alignItems='flex-end'>
                    <StyledButton borderRadius={8} color={theme.colors.green[500]} borderColor={theme.colors.green[500]} backgroundColor={theme.colors.gray[1]} flex={1} onPress={() => {
                        print();
                    }} >
                        <XStack justifyContent='flex-end' alignItems='center' gap={4}>
                            <StyledMIcon
                                name="print"
                                size={24}
                                color={theme.colors.green[600]}
                            />
                            <StyledText paddingVertical={8} fontWeight={theme.fontWeight.bold} color={theme.colors.gray[800]} fontSize={theme.fontSize.small}>Print Receipt</StyledText>
                        </XStack>
                    </StyledButton>
                    <StyledSpacer marginHorizontal={4}></StyledSpacer>
                    <StyledButton borderRadius={8} color={theme.colors.cyan[500]} borderColor={theme.colors.cyan[500]} backgroundColor={theme.colors.gray[1]} flex={1} onPress={() => {
                        share()
                    }} >
                        <XStack justifyContent='flex-end' alignItems='center' gap={4}>
                            <StyledMIcon
                                name="email"
                                size={24}
                                color={theme.colors.cyan[600]}
                            />
                            <StyledText paddingVertical={8} fontWeight={theme.fontWeight.bold} color={theme.colors.gray[800]} fontSize={theme.fontSize.small}>Email Receipt</StyledText>
                        </XStack>
                    </StyledButton>
                </XStack>
                <StyledSpacer marginVertical={8}></StyledSpacer>
            </YStack>
        </YStack>
    )
}

export default CheckOutCompleted