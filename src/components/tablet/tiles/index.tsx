/* eslint-disable prettier/prettier */
import React from 'react';
import {Stack} from '../../../components/package/stack';
import {Text} from '../../../components/text';
import {theme} from '../../../utils/theme';
import {useOrderStatusAggregate} from '../../../hooks/useOrder';
import {OrderStatusAggregate} from '../../../model/orders';
import {useAppTheme, ThemeTokens} from '../../../theme';
import Svg, {Path} from 'react-native-svg';

type OrderKey = 'Progress' | 'Completed' | 'Cancelled';

interface TileConfig {
  key: OrderKey;
  label: string;
  sparklineColorKey: 'brandPrimary' | 'successColor' | 'dangerColor';
  sparkline: number[];
}

// Default fallback sparkline
const DEFAULT_SPARKLINE = [0, 1, 1, 2, 1, 2, 2];

const TILES: TileConfig[] = [
  {
    key: 'Progress',
    label: 'In progress',
    sparklineColorKey: 'brandPrimary',
    sparkline: [1, 2, 2, 3, 4, 5, 6],
  },
  {
    key: 'Completed',
    label: 'Completed',
    sparklineColorKey: 'successColor',
    sparkline: [0, 1, 1, 2, 3, 4, 5],
  },
  {
    key: 'Cancelled',
    label: 'Cancelled',
    sparklineColorKey: 'dangerColor',
    sparkline: [3, 3, 2, 2, 1, 1, 0],
  },
];

interface TileProps extends TileConfig {
  value: number;
  t: ThemeTokens;
  orderKey?: OrderKey;
}

// Generate mock sparkline data (smooth curve)
const getSparklineData = (key: OrderKey): number[] => {
  const mockData: Record<OrderKey, number[]> = {
    Progress: [1, 2, 2, 3, 4, 5, 6],
    Completed: [0, 1, 1, 2, 3, 4, 5],
    Cancelled: [3, 3, 2, 2, 1, 1, 0],
  };
  return mockData[key] ?? DEFAULT_SPARKLINE;
};

// Create smooth SVG path from data points
const createSparklinePath = (data: number[] = []): string => {
  if (!Array.isArray(data) || data.length === 0) return '';

  const width = 100;
  const height = 24;
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  // Scale data to fit in chart area
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return {x, y};
  });

  // Create smooth curve using quadratic bezier
  let pathData = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const xMid = (points[i - 1].x + points[i].x) / 2;
    const yMid = (points[i - 1].y + points[i].y) / 2;
    pathData += ` Q ${xMid} ${points[i - 1].y} ${xMid} ${yMid}`;
    pathData += ` Q ${xMid} ${points[i].y} ${points[i].x} ${points[i].y}`;
  }

  return pathData;
};

type SparklineProps = {
  data?: number[];
  color: string;
  opacity?: number;
  width?: number;
  height?: number;
};

const Sparkline = ({
  data = [],
  color,
  opacity = 0.8,
  width = 80,
  height = 32,
}: SparklineProps) => {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length < 2) return null;

  const path = createSparklinePath(safeData);

  if (!path) return null;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 100 24"
      preserveAspectRatio="none">
      <Path
        d={path}
        stroke={color}
        strokeWidth={2}
        fill="none"
        opacity={opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

// Mock delta data: change from previous period
const DELTA_DATA: Record<OrderKey, {change: number; percentage: number}> = {
  Progress: {change: 2, percentage: 12},
  Completed: {change: 5, percentage: 18},
  Cancelled: {change: -1, percentage: -20},
};

const Tile = ({
  label,
  value,
  t,
  sparklineColorKey,
  sparkline,
  orderKey,
}: TileProps) => {
  const sparklineColor = t[sparklineColorKey];

  // Safe sparkline fallback
  const safeSparkline =
    sparkline && Array.isArray(sparkline) && sparkline.length >= 2
      ? sparkline
      : DEFAULT_SPARKLINE;

  const hasSparklineData = safeSparkline.length >= 2;

  // Get delta indicator
  const delta = orderKey ? DELTA_DATA[orderKey] : {change: 0, percentage: 0};
  const isDeltaPositive = delta.change > 0;
  const isDeltaNeutral = delta.change === 0;
  const deltaColor = isDeltaPositive
    ? t.successColor
    : isDeltaNeutral
    ? t.textMuted
    : t.dangerColor;
  const deltaArrow = isDeltaPositive ? '↑' : isDeltaNeutral ? '→' : '↓';

  return (
    <Stack
      flex={1}
      horizontal
      borderRadius={16}
      overflow="hidden"
      borderWidth={1}
      borderColor={t.borderDefault}
      backgroundColor={t.bgCard}
      shadowColor="#000"
      shadowOpacity={0.06}
      shadowRadius={12}
      elevation={3}
      alignItems="center"
      justifyContent="space-between">
      {/* Content area with number and label */}
      <Stack
        vertical
        paddingHorizontal={16}
        paddingVertical={16}
        gap={4}
        flex={1}
        justifyContent="space-between">
        {/* Number (large, bold, primary) — metric variant */}
        <Text variant="metric" color={t.textPrimary}>
          {value}
        </Text>

        {/* Label (smaller, secondary) — subLabel variant */}
        <Text variant="subLabel" color={t.textSecondary}>
          {label}
        </Text>

        {/* Delta indicator: change vs previous period */}
        <Stack horizontal gap={6} alignItems="center">
          <Text variant="caption" color={deltaColor}>
            {deltaArrow}
          </Text>
          <Text variant="caption" color={deltaColor}>
            {Math.abs(delta.change)} ({Math.abs(delta.percentage)}%)
          </Text>
        </Stack>
      </Stack>

      <Stack marginRight={16}>
        <Sparkline
          data={safeSparkline}
          color={sparklineColor}
          opacity={0.8}
          width={50}
          height={26}
        />
      </Stack>
    </Stack>
  );
};

const Tiles = () => {
  const {t} = useAppTheme();
  const {data} = useOrderStatusAggregate();

  return (
    <Stack
      horizontal
      gap={16}
      paddingHorizontal={16}
      alignItems="stretch"
      marginBottom={16}>
      {TILES.map(({key, ...tile}) => (
        <Tile
          key={key}
          {...tile}
          t={t}
          value={data ? (data as OrderStatusAggregate)[key] : 0}
          orderKey={key}
        />
      ))}
    </Stack>
  );
};

export default Tiles;
