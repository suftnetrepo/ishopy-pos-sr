
import React, { useEffect } from 'react';
import { YStack,theme, StyledSpacer } from 'fluent-styles';

import { useRadioContext } from '../../../hooks/radioContext';
import PrinterOptions from './printerOption';

const Printer = () => {
    const { onValueChange } = useRadioContext()

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
