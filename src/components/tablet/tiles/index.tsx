/* eslint-disable prettier/prettier */
import React from 'react';
import {StyledText} from 'fluent-styles';
import {Stack} from '../../../components/package/stack';
import {theme} from '../../../utils/theme';
import {useOrderStatusAggregate} from '../../../hooks/useOrder';
import {OrderStatusAggregate} from '../../../model/orders';
import {useAppTheme, ThemeTokens} from '../../../theme';
import Svg, {Path} from 'react-native-svg';

type OrderKey = 'Progress' | 'Completed' | 'Cancelled';

interface TileConfig {
  key:      OrderKey;
  label:    string;
  sparklineColorKey: 'brandPrimary' | 'successColor' | 'dangerColor';
}

const TILES: TileConfig[] = [
  {key: 'Progress', label: 'In progress', sparklineColorKey: 'brandPrimary'},
  {key: 'Completed', label: 'Completed',  sparklineColorKey: 'successColor'},
  {key: 'Cancelled', label: 'Cancelled',  sparklineColorKey: 'dangerColor'},
];

interface TileProps extends TileConfig {
  value: number;
  t: ThemeTokens;
}

// Generate mock sparkline data (smooth curve)
const getSparklineData = (key: OrderKey): number[] => {
  const mockData: Record<OrderKey, number[]> = {
    Progress: [10, 15, 12, 18, 22, 20, 25, 28, 30],
    Completed: [5, 8, 10, 9, 12, 15, 18, 20, 22],
    Cancelled: [8, 6, 7, 5, 4, 6, 3, 2, 1],
  };
  return mockData[key];
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
};

const Sparkline = ({ data = [], color, opacity = 0.4 }: SparklineProps) => {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length < 2) return null;

  const path = createSparklinePath(safeData);

  if (!path) return null;

  return (
    <Svg width="100%" height={28} viewBox="0 0 100 24" preserveAspectRatio="none">
      <Path
        d={path}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        opacity={opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const Tile = ({label, value, t, sparklineColorKey}: TileProps) => {
  const sparklineData = getSparklineData(label as any) ?? [];
  const sparklineColor = t[sparklineColorKey];

  return (
    <Stack flex={1} vertical borderRadius={16} overflow="hidden"
      borderWidth={1} borderColor={t.borderDefault} backgroundColor={t.bgCard}>
      
      {/* Content area */}
      <Stack
        vertical
        paddingHorizontal={20}
        paddingVertical={20}
        gap={12}
        flex={1}
        justifyContent="space-between">
        
        {/* Number (large, bold, primary) */}
        <StyledText fontSize={40} fontWeight="800" color={t.textPrimary}>
          {value}
        </StyledText>
        
        {/* Label (smaller, secondary) */}
        <StyledText fontSize={theme.fontSize.small} color={t.textSecondary}>
          {label}
        </StyledText>
      </Stack>
      
      {/* Sparkline at bottom */}
      <Stack paddingHorizontal={20} paddingBottom={12}>
        <Sparkline data={sparklineData ?? []} color={sparklineColor} opacity={0.4} />
      </Stack>
    </Stack>
  );
};

const Tiles = () => {
  const {t} = useAppTheme();
  const {data} = useOrderStatusAggregate();

  return (
    <Stack horizontal gap={16} marginHorizontal={16} alignItems="stretch" marginVertical={8}>
      {TILES.map(({key, ...tile}) => (
        <Tile
          key={key}
          {...tile}
          t={t}
          value={data ? (data as OrderStatusAggregate)[key] : 0}
        />
      ))}
    </Stack>
  );
};

export default Tiles;