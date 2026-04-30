/* eslint-disable prettier/prettier */
import React from 'react';
import {
  StyledText,
  StyledTable,
  Stack,
} from 'fluent-styles';
import {theme} from '../../../../utils/theme';
import {fontStyles} from '../../../../configs/theme';
import {formatCurrency, formatDate, getLastChars} from '../../../../utils/help';
import {StyledMIcon} from '../../../../components/icon';
import {useAppContext} from '../../../../hooks/appContext';
import {DownloadButton} from './downloadButton';
import EmptyView from '../../../../components/utils/empty';
import usePaymentTable from '../../../../hooks/usePaymentTable';

// ─── Method chip colours ──────────────────────────────────────────────────────
const METHOD_STYLE = {
  cash:   {bg: theme.colors.green[50],  color: theme.colors.green[700]},
  card:   {bg: theme.colors.blue[50],   color: theme.colors.blue[700]},
  online: {bg: theme.colors.indigo[50], color: theme.colors.indigo[700]},
};

const getMethodStyle = method =>
  METHOD_STYLE[(method || '').toLowerCase()] ||
  {bg: theme.colors.gray[100], color: theme.colors.gray[600]};

const formatMethod = method =>
  method ? method.charAt(0).toUpperCase() + method.slice(1).toLowerCase() : '—';

// ─── Column builder ───────────────────────────────────────────────────────────
const buildColumns = symbol => [
   {
    key: 'order_id',
    title: 'Order Ref',
    width: 110,
    align: 'center',
    render: v => (
      <StyledText
        fontSize={theme.fontSize.small}
        fontWeight={theme.fontWeight.semiBold}
        color={theme.colors.blueGray[600]}>
        #{getLastChars(v, 8)}
      </StyledText>
    ),
  },
  {
    key: 'amount',
    title: 'Amount',
    width: 120,
    sortable: true,
    render: v => (
      <Stack horizontal alignItems="center" gap={6}>
        <StyledMIcon size={14} name="money" color={theme.colors.gray[500]} />
        <StyledText
          fontFamily={fontStyles.Roboto_Regular}
          fontWeight={theme.fontWeight.bold}
          fontSize={theme.fontSize.normal}
          color={theme.colors.gray[800]}>
          {formatCurrency(symbol, v)}
        </StyledText>
      </Stack>
    ),
  },
  {
    key: 'payment_method',
    title: 'Method',
    width: 90,
    align: 'center',
    render: v => {
      if (!v) return (
        <StyledText fontSize={theme.fontSize.small} color={theme.colors.gray[400]}>—</StyledText>
      );
      const s = getMethodStyle(v);
      return (
        <Stack
          paddingHorizontal={14}
          paddingVertical={5}
          borderRadius={20}
          backgroundColor={s.bg}
          alignItems="center"
          justifyContent="center">
          <StyledText
            fontSize={theme.fontSize.small}
            fontWeight={theme.fontWeight.semiBold}
            color={s.color}>
            {formatMethod(v)}
          </StyledText>
        </Stack>
      );
    },
  },
  {
    key: 'date',
    title: 'Date',
    sortable: true,
    render: v => (
      <Stack horizontal alignItems="center" gap={4}>
        <StyledMIcon size={14} name="date-range" color={theme.colors.gray[400]} />
        <StyledText fontSize={theme.fontSize.small} color={theme.colors.gray[500]}>
          {formatDate(v)}
        </StyledText>
      </Stack>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const PaymentCard = () => {
  const {shop, date_filter} = useAppContext();
  const symbol  = shop?.currency || '£';
  const columns = buildColumns(symbol);

  // All pagination logic lives in the hook
  const {tableProps, totalCount, grandTotal} = usePaymentTable({
    dateFilter: date_filter,
  });

  return (
    <Stack vertical flex={1}>
      <StyledTable
        columns={columns}
        {...tableProps}
        showDivider
        bordered
        forceTable
        emptyNode={
          <EmptyView
            color={theme.colors.gray[400]}
            title="Your Payment list is empty"
            description="Payments will appear here once added."
          />
        }
      />
      {totalCount > 0 && (
        <DownloadButton data={tableProps?.data} grandTotal={grandTotal} currency={symbol} />
      )}
    </Stack>
  );
};

export default PaymentCard;