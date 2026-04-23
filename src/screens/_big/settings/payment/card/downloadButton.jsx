
import React, { useState, useEffect} from 'react';
import {
    StyledText,
    StyledSpacer,
    StyledCycle, StyledButton
} from 'fluent-styles';
import { StyledMIcon } from '../../../../../components/icon';
import { fontStyles, theme } from '../../../../../configs/theme';
import { convertJsonToCsv } from '../../../../../utils/convertJsonToCsv';
import { formatCurrency } from '../../../../../utils/help';
import { Stack } from '../../../../../components/package/stack';

const DownloadButton = ({ data, currency }) => {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const total = data.reduce((total, pay) => total + pay.amount, 0);
        setTotal(total);
    }, [data]);

    return (
        <Stack justifyContent='flex-end' alignItems='flex-end' vertical flex={1} bottom={8} backgroundColor={theme.colors.transparent} >
            <Stack height={40}  position='absolute' borderRadius={50} backgroundColor={theme.colors.pink[500]} horizonal justifyContent='flex-end' alignItems='center' paddingLeft={4} paddingRight={8} marginHorizontal={2} paddingVertical={8} 
            onTouchStart={async () => data?.length && await convertJsonToCsv(data)}>
                <StyledCycle width={30} height={30} borderWidth={1} borderColor={theme.colors.gray[1]} backgroundColor={theme.colors.yellow[500]}>
                    <StyledMIcon size={16} name='share' color={theme.colors.green[100]} />
                </StyledCycle>
                <StyledSpacer marginHorizontal={2} />
                <StyledText color={theme.colors.gray[1]} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.large} >
                    {formatCurrency(currency || "£", total)}
                </StyledText>
            </Stack>
        </Stack>
    )
}

export { DownloadButton }