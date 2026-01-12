
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { YStack, XStack, StyledSpacer, StyledText, StyledButton } from 'fluent-styles';
import { StyledMIcon } from '../../icon';
import { useAppContext } from '../../../hooks/appContext';
import { fontStyles } from '../../../utils/fontStyles';
import { theme } from '../../../utils/theme';
import { updateOccupancy } from '../../../hooks/useTable';

const CheckOut = ({ table_id, table_name, order, printHandler, shareReceipt, onClose }) => {
    const { clearItem, shop } = useAppContext()
    const navigator = useNavigation()

    const close = async () => {
        clearItem(table_id)
        await updateOccupancy(table_id, 0, 0, '', '');

        if (shop.mode === 'restaurant') {
            navigator.navigate("big-table")
        }else {
            onClose()
        }
    }

    const print = () => {
        printHandler(table_name, order)
    }

    const share = () => {
        shareReceipt(table_name, order)
    }

    return (
        <YStack justifyContent='center' alignItems='center' flex={1} transparent>
            <YStack borderRadius={16} justifyContent='center' alignItems='center' width='30%' backgroundColor={theme.colors.gray[1]} paddingHorizontal={24} paddingVertical={16}>
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
                    size={90}
                    color={theme.colors.green[600]}
                />
                <StyledSpacer marginVertical={8}></StyledSpacer>
                <StyledText
                    fontFamily={fontStyles.Roboto_Regular}
                    color={theme.colors.gray[800]}
                    fontWeight={theme.fontWeight.normal}
                    fontSize={theme.fontSize.normal}
                    textAlign="center"
                >
                    Payment Succeefull !
                </StyledText>
                <StyledSpacer marginVertical={48}></StyledSpacer>
                <XStack justifyContent='flex-end' alignItems='flex-end'>
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
                    <StyledSpacer marginHorizontal={4}></StyledSpacer>
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
                </XStack>
                <StyledSpacer marginVertical={8}></StyledSpacer>
            </YStack>
        </YStack>
    )
}

export default CheckOut