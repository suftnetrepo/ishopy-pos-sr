/* eslint-disable prettier/prettier */
import React from 'react';
import {
  StyledText,
  StyledSpacer,
  StyledCycle,
  Stack,
  theme,
  StyledShape,
} from 'fluent-styles';
import {StyledMIcon} from '../../../../components/icon';
import {fontStyles} from '../../../../configs/theme';
import {convertJsonToCsv} from '../../../../utils/convertJsonToCsv';
import {formatCurrency} from '../../../../utils/help';

/**
 * DownloadButton
 * data     — current page rows (for CSV export)
 * total    — pre-computed grand total from the hook
 * currency — currency symbol
 */
const DownloadButton = ({data = [], grandTotal = 0, currency}) => {
  return (
    <Stack
      justifyContent="flex-end"
      alignItems="flex-end"
      vertical
      flex={1}
      bottom={8}
      backgroundColor={theme.colors.transparent}>
      <Stack
        height={40}
        position="absolute"
        borderRadius={50}
        backgroundColor={theme.colors.orange[500]}
        horizontal
        justifyContent="flex-end"
        alignItems="center"
        paddingLeft={4}
        paddingRight={8}
        marginHorizontal={2}
        paddingVertical={8}
        onTouchStart={async () => data?.length && (await convertJsonToCsv(data))}>
        <StyledShape
          cycle
          size={30}
          borderWidth={1}
          borderColor={theme.colors.gray[1]}
          backgroundColor={theme.colors.orange[800]}>
          <StyledMIcon size={16} name="share" color={theme.colors.orange[100]} />
        </StyledShape>
        <StyledSpacer marginHorizontal={2} />
        <StyledText
          color={theme.colors.gray[1]}
          fontFamily={fontStyles.Roboto_Regular}
          fontWeight={theme.fontWeight.bold}
          fontSize={theme.fontSize.large}>
          {formatCurrency(currency || '£', grandTotal)}
        </StyledText>
      </Stack>
    </Stack>
  );
};

export {DownloadButton};