
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
                <StyledSpacer marginVertical={8} />
                <PrinterOptions />
            </YStack>
        </>
    );
};

export default Printer;
