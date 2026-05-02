/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Pressable} from 'react-native';
import {
  StyledText,
  StyledTable,
  StyledChip,
  Stack,
  StyleShape,
} from 'fluent-styles';
import {theme} from '../../../utils/theme';
import {
  formatDate,
  formatCurrency,
  getLastChars,
  statusOptions,
} from '../../../utils/help';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {StyledCycle} from 'fluent-styles';
import {useAppContext} from '../../../hooks/appContext';
import EmptyView from '../../utils/empty';
import useOrderTable from '../../../hooks/useOrderTable';
import {useAppTheme} from '../../../theme';

// ─── Status chip colours ──────────────────────────────────────────────────────
const STATUS_STYLE = {
  completed: {bg: theme.colors.green[50], color: theme.colors.green[700]},
  progress: {bg: theme.colors.amber[500], color: theme.colors.amber[700]},
  pending: {bg: theme.colors.blue[50], color: theme.colors.blue[600]},
  cancelled: {bg: theme.colors.red[50], color: theme.colors.red[500]},
};

const getStatusStyle = status =>
  STATUS_STYLE[(status || '').toLowerCase()] || {
    bg: theme.colors.gray[100],
    color: theme.colors.gray[500],
  };

const formatStatus = status =>
  status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '';

// ─── Column builder ───────────────────────────────────────────────────────────
const buildColumns = symbol => [
  {
    key: 'order_id',
    title: 'Order ID',
    width: 130,
    render: v => (
      <StyledText
        fontSize={theme.fontSize.small}
        fontWeight={theme.fontWeight.normal}
        color={theme.colors.blueGray[600]}>
        #{getLastChars(v, 8)}
      </StyledText>
    ),
  },
  {
    key: 'table_name',
    title: 'Table',
    width: 90,
    align: 'center',
    render: v => (
      <StyledText
        fontSize={theme.fontSize.small}
        color={theme.colors.gray[500]}>
        {v || '—'}
      </StyledText>
    ),
  },
  {
    key: 'total',
    title: 'Subtotal',
    width: 110,
    align: 'right',
    sortable: true,
    render: v => (
      <StyledText
        fontSize={theme.fontSize.small}
        fontWeight={theme.fontWeight.normal}
        color={theme.colors.gray[500]}>
        {formatCurrency(symbol, v)}
      </StyledText>
    ),
  },
  {
    key: 'total_price',
    title: 'Total',
    width: 110,
    align: 'right',
    sortable: true,
    render: v => (
      <StyledText
        fontSize={theme.fontSize.small}
        fontWeight={theme.fontWeight.bold}
        color={theme.colors.gray[900]}>
        {formatCurrency(symbol, v)}
      </StyledText>
    ),
  },
  {
    key: 'tax',
    title: 'Tax',
    width: 80,
    align: 'right',
    render: v => (
      <StyledText
        fontSize={theme.fontSize.small}
        color={theme.colors.gray[500]}>
        {v ? formatCurrency(symbol, v) : '—'}
      </StyledText>
    ),
  },
  {
    key: 'discount',
    title: 'Discount',
    width: 90,
    align: 'right',
    render: v => (
      <StyledText
        fontSize={theme.fontSize.small}
        color={v ? theme.colors.red[500] : theme.colors.gray[400]}>
        {v ? `-${formatCurrency(symbol, v)}` : '—'}
      </StyledText>
    ),
  },
  {
    key: 'date',
    title: 'Date',
    sortable: true,
    render: v => (
      <Stack horizontal alignItems="center" gap={4}>
        <MaterialIcon
          name="access-time"
          size={14}
          color={theme.colors.gray[400]}
        />
        <StyledText
          fontSize={theme.fontSize.small}
          color={theme.colors.gray[500]}>
          {formatDate(v)}
        </StyledText>
      </Stack>
    ),
  },
  {
    key: 'status',
    title: 'Status',
    width: 130,
    align: 'center',
    render: v => {
      const s = getStatusStyle(v);
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
            {formatStatus(v)}
          </StyledText>
        </Stack>
      );
    },
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrderCard({onOrderChange, onHandleFilter}) {
  const {updateSelectedOrder, date_filter, updateDateFilter, shop} =
    useAppContext();
  const {t} = useAppTheme();

  // Active chip label — UI only, actual filtering done via setStatusFilter
  const [activeChip, setActiveChip] = useState('All');

  const symbol = shop?.currency || '£';
  const columns = buildColumns(symbol);

  const {tableProps, setStatusFilter} = useOrderTable({
    dateFilter: date_filter,
  });

  const hasActiveFilter = date_filter?.startDate && date_filter?.endDate;

  const handleFilter = status => {
    setActiveChip(status);
    setStatusFilter(status); // tells usePaginatedQuery to re-fetch with new filter
  };

  const handleClearDateFilter = () => {
    updateDateFilter({startDate: '', endDate: ''});
    setActiveChip('All');
    setStatusFilter('All');
  };

  return (
    <Stack vertical flex={1}>
      {/* Filter chips */}
      <Stack
        horizontal
        justifyContent="space-between"
        alignItems="center"
        marginBottom={12}
        marginLeft={8}
        marginRight={8}>
        <Stack horizontal gap={6} flexWrap="wrap" alignItems="center">
          {statusOptions.map(status => (
            <StyledChip
              key={status}
              label={status}
              variant="ingredient"
              size="md"
              selected={status === activeChip}
              showCheck={status === activeChip}
              onPress={() => handleFilter(status)}
            />
          ))}
        </Stack>

        <Stack horizontal gap={8} alignItems="center">
          {hasActiveFilter && (
            <Pressable onPress={handleClearDateFilter}>
              <StyleShape
                paddingHorizontal={10}
                borderWidth={1}
                cycle
                size={48}
                backgroundColor={t.bgPage}
                borderColor={t.textMuted}>
                <MaterialIcon size={24} name="close" color={t.textPrimary} />
              </StyleShape>
            </Pressable>
          )}
          <Pressable onPress={() => onHandleFilter('filter')}>
            <StyleShape
              paddingHorizontal={10}
              borderWidth={1}
              cycle
              size={48}
              backgroundColor={t.bgPage}
              borderColor={t.textMuted}>
              <MaterialIcon
                size={24}
                name="filter-list"
                color={t.textPrimary}
              />
            </StyleShape>
          </Pressable>
        </Stack>
      </Stack>

      <StyledTable
        columns={columns}
        {...tableProps}
        showDivider
        bordered
        forceTable
        onRowPress={row => {
          updateSelectedOrder(row);
          onOrderChange('basket');
        }}
        emptyNode={<></>}
      />
    </Stack>
  );
}
