/* eslint-disable prettier/prettier */
import React from 'react';
import {useWindowDimensions} from 'react-native';
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

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return {x, y};
  });

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
  isCompact,
}: TileProps & {isCompact?: boolean}) => {
  const sparklineColor = t[sparklineColorKey];

  const safeSparkline =
    sparkline && Array.isArray(sparkline) && sparkline.length >= 2
      ? sparkline
      : DEFAULT_SPARKLINE;

  const delta = orderKey ? DELTA_DATA[orderKey] : {change: 0, percentage: 0};
  const isDeltaPositive = delta.change > 0;
  const isDeltaNeutral = delta.change === 0;
  const deltaColor = isDeltaPositive
    ? t.successColor
    : isDeltaNeutral
    ? t.textMuted
    : t.dangerColor;
  const deltaArrow = isDeltaPositive ? '↑' : isDeltaNeutral ? '→' : '↓';

  // Phase 1: Responsive sizing (no hardcoded values)
  const contentPadH = isCompact ? 12 : 14;
  const contentPadV = isCompact ? 14 : 16;
  const sparklineW = isCompact ? 45 : 56;
  const sparklineH = isCompact ? 22 : 28;
  const spacingGap = isCompact ? 2 : 3;

  return (
    <Stack
      flex={1}
      horizontal
      borderRadius={14}
      overflow="visible"
      borderWidth={1}
      borderColor={t.borderDefault}
      backgroundColor={t.bgCard}
      shadowColor="#000"
      shadowOpacity={0.04}
      shadowRadius={8}
      elevation={2}
      alignItems="center"
      justifyContent="space-between">
      {/* Phase 3: Better composition - metric, label, delta on left */}
      <Stack
        vertical
        paddingHorizontal={contentPadH}
        paddingVertical={contentPadV}
        gap={spacingGap}
        flex={1}
        justifyContent="center">
        {/* Metric: large, bold, primary text - using default metric lineHeight (40) */}
        <Text
          variant="metric"
          color={t.textPrimary}>
          {value}
        </Text>

        {/* Label: smaller, secondary text, semi-bold weight */}
        <Text
          variant="subLabel"
          color={t.textSecondary}
          style={{fontSize: isCompact ? 11 : 12, fontWeight: '500'}}>
          {label}
        </Text>

        {/* Delta: change percentage with directional indicator */}
        <Stack horizontal gap={4} alignItems="center" marginTop={2}>
          <Text variant="caption" color={deltaColor} style={{fontSize: 10, fontWeight: '600'}}>
            {deltaArrow}
          </Text>
          <Text variant="caption" color={deltaColor} style={{fontSize: 10, fontWeight: '500'}}>
            {Math.abs(delta.change)} ({Math.abs(delta.percentage)}%)
          </Text>
        </Stack>
      </Stack>

      {/* Phase 3: Sparkline on right, vertically centered */}
      <Stack marginRight={contentPadH} alignItems="center" justifyContent="center">
        <Sparkline
          data={safeSparkline}
          color={sparklineColor}
          opacity={0.85}
          width={sparklineW}
          height={sparklineH}
        />
      </Stack>
    </Stack>
  );
};

const Tiles = () => {
  const {t} = useAppTheme();
  const {data} = useOrderStatusAggregate();
  const {width} = useWindowDimensions();
  const isCompact = width < 900;
  const isMedium = width >= 900 && width < 1180;
  
  // Phase 1: Responsive layout - no hardcoded values
  const tileWidth = isCompact ? '100%' : isMedium ? '48%' : '31.5%';
  const tileMinHeight = isCompact ? 125 : isMedium ? 135 : 145;
  const tileGap = isCompact ? 12 : 14;
  const tilesMarginBottom = isCompact ? 12 : 16;

  return (
    <Stack
      horizontal
      gap={tileGap}
      flexWrap="wrap"
      alignItems="stretch"
      marginBottom={tilesMarginBottom}>
      {TILES.map(tile => (
        <Stack key={tile.key} width={tileWidth} minHeight={tileMinHeight}>
          <Tile
            key={tile.key}
            label={tile.label}
            sparklineColorKey={tile.sparklineColorKey}
            sparkline={tile.sparkline}
            t={t}
            value={data ? (data as OrderStatusAggregate)[tile.key] : 0}
            orderKey={tile.key}
            isCompact={isCompact}
          />
        </Stack>
      ))}
    </Stack>
  );
};

export default Tiles;