/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Stack} from '../../../components/package/stack';
import {Text} from '../../../components/text';
import {theme} from '../../../utils/theme';
import {useOrderStatusAggregate} from '../../../hooks/useOrder';
import {OrderStatusAggregate} from '../../../model/orders';
import {useAppTheme, ThemeTokens} from '../../../theme';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';

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
  gradientId: string;
};

const Sparkline = ({
  data = [],
  color,
  opacity = 0.8,
  width = 80,
  height = 32,
  gradientId,
}: SparklineProps) => {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length < 2) return null;

  const path = createSparklinePath(safeData);

  if (!path) return null;

  // Close the line down to the baseline so the area beneath it can carry a
  // soft gradient fill — reads as a premium "filled" sparkline rather than
  // a bare line.
  const areaPath = `${path} L 100 24 L 0 24 Z`;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 100 24"
      preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity={0.28} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
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
  const contentPadH = isCompact ? 14 : 18;
  const contentPadV = isCompact ? 16 : 20;
  const sparklineW = isCompact ? 60 : 76;
  const sparklineH = isCompact ? 40 : 52;
  const spacingGap = isCompact ? 6 : 8;
  const deltaBg = isDeltaNeutral
    ? `${t.textMuted}18`
    : isDeltaPositive
    ? t.successBg
    : t.dangerBg;

  return (
    <Stack
      flex={1}
      horizontal
      borderRadius={16}
      overflow="hidden"
      borderLeftWidth={4}
      borderLeftColor={sparklineColor}
      backgroundColor={t.bgCard}
      shadowColor="#000"
      shadowOffset={{width: 0, height: 2}}
      shadowOpacity={0.06}
      shadowRadius={10}
      elevation={3}
      alignItems="center"
      justifyContent="space-between">
      {/* Metric, label, delta on left */}
      <Stack
        vertical
        paddingHorizontal={contentPadH}
        paddingVertical={contentPadV}
        gap={spacingGap}
        flex={1}
        justifyContent="center">
        {/* Metric: large, bold, primary text */}
        <Text
          color={t.textPrimary}
          fontWeight="800"
          style={{
            fontSize: isCompact ? 32 : 40,
            lineHeight: isCompact ? 36 : 44,
          }}>
          {value}
        </Text>

        {/* Label: smaller, secondary text, semi-bold weight */}
        <Text
          variant="subLabel"
          color={t.textSecondary}
          style={{fontSize: isCompact ? 12 : 13, fontWeight: '600'}}>
          {label}
        </Text>

        {/* Delta: change percentage as a tinted pill */}
        <Stack
          horizontal
          gap={4}
          alignItems="center"
          alignSelf="flex-start"
          paddingHorizontal={10}
          paddingVertical={4}
          borderRadius={20}
          backgroundColor={deltaBg}
          marginTop={2}>
          <Text color={deltaColor} style={{fontSize: 12, fontWeight: '700'}}>
            {deltaArrow}
          </Text>
          <Text color={deltaColor} style={{fontSize: 12, fontWeight: '700'}}>
            {Math.abs(delta.change)} ({Math.abs(delta.percentage)}%)
          </Text>
        </Stack>
      </Stack>

      {/* Sparkline on right, vertically centered */}
      <Stack marginRight={contentPadH} alignItems="center" justifyContent="center">
        <Sparkline
          data={safeSparkline}
          color={sparklineColor}
          opacity={0.9}
          width={sparklineW}
          height={sparklineH}
          gradientId={`tile-spark-${orderKey || label}`}
        />
      </Stack>
    </Stack>
  );
};

const Tiles = () => {
  const {t} = useAppTheme();
  const {data} = useOrderStatusAggregate();

  // Measure our own rendered width instead of reading the full window width
  // (useWindowDimensions) — the sidebar eats a chunk of that (84–210px), so
  // a window-width breakpoint drifts out of sync with what these tiles
  // actually have to work with. On a real iPad in landscape (~1080pt window)
  // that mismatch landed the row in a "medium" bucket meant for 2-per-row,
  // wrapping to an awkward 2+1 layout instead of one clean row of three.
  const [containerWidth, setContainerWidth] = useState(0);

  // Only stack to a single column on genuinely phone-narrow widths — every
  // iPad, portrait or landscape, mini through 13", keeps all three stats in
  // one row.
  const isCompact = containerWidth > 0 && containerWidth < 560;

  const tileWidth = isCompact ? '100%' : '31.5%';
  const tileMinHeight = isCompact ? 140 : 160;
  const tileGap = isCompact ? 12 : 14;
  const tilesMarginBottom = isCompact ? 12 : 16;

  return (
    <Stack
      horizontal
      gap={tileGap}
      flexWrap="wrap"
      alignItems="stretch"
      marginBottom={tilesMarginBottom}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
      {containerWidth > 0 &&
        TILES.map(tile => (
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