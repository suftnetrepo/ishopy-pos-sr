
import React, { useEffect } from 'react';
import { YStack,theme, StyledSpacer } from 'fluent-styles';
import PrinterOptions from './printerOption';
import {useAppTheme} from '../../../theme';

const Printer = () => {
  const {t} = useAppTheme();
 

    return (
        <>
            <YStack paddingHorizontal={8} flex={1} backgroundColor={t.bgPage}>
                <StyledSpacer marginVertical={8} />
                <PrinterOptions />
            </YStack>
        </>
    );
};

export default Printer;
