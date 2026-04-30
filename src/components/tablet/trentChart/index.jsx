/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {StyledText, StyledSpacer, StyledPressable} from 'fluent-styles';
import {Stack} from '../../package/stack';
import {theme} from '../../../utils/theme';
import {BarChart} from 'react-native-chart-kit';
import {fontStyles} from '../../../configs/theme';
import {formatCurrency} from '../../../utils/help';
import {
  useWeeklyTransactions,
  useTransactionTrend,
} from '../../../hooks/useDashboard';
import {
  useWeekTrend,
  useMonthTrend,
  useYearTrend,
} from '../../../hooks/useTrendCharts';
import {StyledIcon} from '../../package/icon';
import SvgTrendLine from '../trentChart/SvgTrendLine';
import {useAppContext} from '../../../hooks/appContext';

// ─── Config ───────────────────────────────────────────────────────────────────
const PERIODS = [
  {key: 'day',   label: 'Day',   title: 'Daily transaction'},
  {key: 'week',  label: 'Week',  title: 'Weekly transaction'},
  {key: 'month', label: 'Month', title: 'Monthly transaction'},
  {key: 'year',  label: 'Year',  title: 'Yearly transaction'},
];

const ACTIVE_COLORS = {
  day:   {bg: theme.colors.green[100],  text: theme.colors.green[700],  border: theme.colors.green[200]},
  week:  {bg: theme.colors.amber[100],  text: theme.colors.amber[700],  border: theme.colors.amber[200]},
  month: {bg: theme.colors.amber[100],  text: theme.colors.amber[700],  border: theme.colors.amber[200]},
  year:  {bg: theme.colors.amber[100],  text: theme.colors.amber[700],  border: theme.colors.amber[200]},
};

const TREND_STYLE = {
  week:  {line: theme.colors.blue[500],    gradFrom: 'rgba(59,130,246,0.20)',  gradTo: 'rgba(59,130,246,0)'},
  month: {line: theme.colors.emerald[500], gradFrom: 'rgba(16,185,129,0.20)',  gradTo: 'rgba(16,185,129,0)'},
  year:  {line: theme.colors.amber[500],   gradFrom: 'rgba(245,158,11,0.20)',  gradTo: 'rgba(245,158,11,0)'},
};

const barChartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {borderRadius: 8},
  propsForBackgroundLines: {strokeDasharray: ''},
};

// ─── Period chip ──────────────────────────────────────────────────────────────
const PeriodChip = ({label, periodKey, active, onPress}) => {
  const c = ACTIVE_COLORS[periodKey];
  return (
    <StyledPressable
      onPress={onPress}
      paddingHorizontal={12}
      paddingVertical={5}
      borderRadius={999}
      borderWidth={1}
      borderColor={active ? c.border : theme.colors.gray[300]}
      backgroundColor={active ? c.bg : theme.colors.gray[1]}>
      <Stack horizontal alignItems="center" gap={4}>
        {active && (
          <StyledText fontSize={theme.fontSize.small} color={c.text}>✓</StyledText>
        )}
        <StyledText
          fontSize={theme.fontSize.small}
          fontWeight={active ? theme.fontWeight.medium : theme.fontWeight.normal}
          color={active ? c.text : theme.colors.gray[500]}>
          {label}
        </StyledText>
      </Stack>
    </StyledPressable>
  );
};

// ─── Day panel ────────────────────────────────────────────────────────────────
const DayPanel = ({containerWidth, symbol}) => {
  const {data} = useWeeklyTransactions();
  const {trend, dailyTransaction} = useTransactionTrend();

  return (
    <Stack vertical>
      <Stack horizontal justifyContent="flex-start" alignItems="center">
        <StyledText
          fontFamily={fontStyles.Roboto_Regular}
          fontSize={theme.fontSize.xxxlarge}
          fontWeight={theme.fontWeight.bold}
          paddingHorizontal={8}
          color={theme.colors.gray[800]}>
          {formatCurrency(symbol, dailyTransaction)}
        </StyledText>
        <Stack
          flexShrink={1}
          borderRadius={16}
          paddingHorizontal={20}
          paddingVertical={5}
          backgroundColor={trend === 'up' ? theme.colors.green[500] : theme.colors.red[400]}>
          <Stack horizontal justifyContent="center" paddingVertical={1} alignItems="center">
            <StyledIcon
              size={16}
              name={trend === 'up' ? 'arrow-upward' : 'arrow-downward'}
              color={theme.colors.gray[1]}
            />
          </Stack>
        </Stack>
      </Stack>
      <StyledSpacer marginVertical={8} />
      {containerWidth > 0 && (
        <BarChart
          data={data}
          width={containerWidth - 16}
          height={250}
          fromZero
          chartConfig={barChartConfig}
          style={{marginVertical: 8, borderRadius: 16, marginLeft: 8}}
        />
      )}
    </Stack>
  );
};

// ─── Trend panel — Week / Month / Year ───────────────────────────────────────
const TrendPanel = ({period, containerWidth, symbol, data, labels, total, loading, error}) => {
  const style = TREND_STYLE[period];

  const formatYLabel = v =>
    v >= 1000 ? `${symbol}${(v / 1000).toFixed(1)}k` : `${symbol}${Math.round(v)}`;

  const periodLabel =
    period === 'week' ? 'This week' : period === 'month' ? 'This month' : 'This year';

  const formattedTotal =
    total >= 1000
      ? `${symbol}${(total / 1000).toFixed(2)}k`
      : `${symbol}${total.toFixed(2)}`;

  if (loading) {
    return (
      <Stack vertical alignItems="center" justifyContent="center" height={250}>
        <ActivityIndicator color={style.line} />
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack vertical alignItems="center" justifyContent="center" height={250}>
        <StyledText fontSize={theme.fontSize.small} color={theme.colors.gray[400]}>
          Unable to load data
        </StyledText>
      </Stack>
    );
  }

  return (
    <Stack vertical>
      <Stack horizontal justifyContent="space-between" alignItems="center" paddingHorizontal={8}>
        <StyledText fontSize={theme.fontSize.small} color={theme.colors.gray[500]}>
          {periodLabel}
        </StyledText>
        <StyledText
          fontSize={theme.fontSize.small}
          fontWeight={theme.fontWeight.semiBold}
          color={style.line}>
          {formattedTotal}
        </StyledText>
      </Stack>
      <StyledSpacer marginVertical={4} />
      {containerWidth > 0 && (
        <SvgTrendLine
          data={data}
          labels={labels}
          width={containerWidth}
          height={250}
          lineColor={style.line}
          gradientFrom={style.gradFrom}
          gradientTo={style.gradTo}
          dotColor={style.line}
          showDots={data.length <= 14}
          labelColor={theme.colors.gray[400]}
          gridColor={theme.colors.gray[200]}
          gridLines={4}
          formatLabel={formatYLabel}
        />
      )}
    </Stack>
  );
};

// Each panel owns its hook — only the active one mounts
const WeekPanel  = props => { const s = useWeekTrend();  return <TrendPanel period="week"  {...s} {...props} />; };
const MonthPanel = props => { const s = useMonthTrend(); return <TrendPanel period="month" {...s} {...props} />; };
const YearPanel  = props => { const s = useYearTrend();  return <TrendPanel period="year"  {...s} {...props} />; };

// ─── Main component ───────────────────────────────────────────────────────────
const DailyTransactionChart = () => {
  const [activePeriod, setActivePeriod] = useState('day');
  const [containerWidth, setContainerWidth] = useState(0);
  const {shop} = useAppContext();
  const symbol = shop?.currency || '£';
  const sharedProps = {containerWidth, symbol};

  const activeTitle = PERIODS.find(p => p.key === activePeriod)?.title;

  return (
    <Stack
      vertical
      shadowOpacity={0.9}
      shadowColor={theme.colors.gray[200]}
      shadowRadius={8}
      marginVertical={16}
      marginLeft={16}
      backgroundColor={theme.colors.gray[1]}
      borderRadius={8}
      paddingHorizontal={8}
      paddingVertical={16}>

      {/* Chips left, dynamic title right */}
      <Stack horizontal justifyContent="space-between" alignItems="center" paddingHorizontal={8}>
        <Stack horizontal gap={6} alignItems="center">
          {PERIODS.map(p => (
            <PeriodChip
              key={p.key}
              label={p.label}
              periodKey={p.key}
              active={activePeriod === p.key}
              onPress={() => setActivePeriod(p.key)}
            />
          ))}
        </Stack>
        <StyledText
          fontFamily={fontStyles.Roboto_Regular}
          fontSize={theme.fontSize.small}
          fontWeight={theme.fontWeight.normal}
          color={theme.colors.gray[800]}>
          {activeTitle}
        </StyledText>
      </Stack>

      <StyledSpacer marginVertical={8} />

      <Stack vertical onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
        {activePeriod === 'day'   && <DayPanel   {...sharedProps} />}
        {activePeriod === 'week'  && <WeekPanel  {...sharedProps} />}
        {activePeriod === 'month' && <MonthPanel {...sharedProps} />}
        {activePeriod === 'year'  && <YearPanel  {...sharedProps} />}
      </Stack>
    </Stack>
  );
};

export default DailyTransactionChart;