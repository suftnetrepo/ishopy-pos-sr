
import React, { useEffect } from 'react';
import { YStack,theme, StyledSpacer } from 'fluent-styles';
import {
    Text,
    HStack,
} from "@gluestack-ui/themed";
import { fontStyles } from '../../../configs/theme';
import { useRadioContext } from '../../../hooks/radioContext';
import { StyledIcon } from '../../../components/package/icon';
import PrinterOptions from './printerOption';

const Printer = ({ onClose }) => {
    const { onValueChange, checked } = useRadioContext()

    useEffect(() => {
        onValueChange('bluetooth')
    }, [])

    return (
        <>
            <YStack paddingHorizontal={8} flex={1} backgroundColor={theme.colors.gray[100]}>
                <StyledSpacer marginVertical={16} />
                <HStack justifyContent="space-between" alignItems="center" >
                    <HStack flex={1} horizontal justifyContent="flex-start" alignItems="center">
                        <StyledIcon
                            name="print"
                            size={32}
                            color={theme.colors.gray[800]}
                        />
                        <Text
                            paddingHorizontal={4}
                            fontFamily={fontStyles.Roboto_Regular}
                            color={theme.colors.gray[800]}
                            fontSize={theme.fontSize.large}
                            fontWeight={theme.fontWeight.normal}
                        >
                            Printer
                        </Text>
                    </HStack>
                    <StyledIcon
                        name="cancel"
                        size={48}
                        color={theme.colors.gray[800]}
                        onPress={() => onClose()}
                    />
                </HStack>
                <StyledSpacer marginVertical={8} />
                <PrinterOptions />
            </YStack>
        </>
    );
};

export default Printer;
