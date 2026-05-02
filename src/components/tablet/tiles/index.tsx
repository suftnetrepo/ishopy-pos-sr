/* eslint-disable prettier/prettier */
import React from 'react';
import {StyledText} from 'fluent-styles';
import {Stack} from '../../../components/package/stack';
import {theme} from '../../../utils/theme';
import {useOrderStatusAggregate} from '../../../hooks/useOrder';
import {OrderStatusAggregate} from '../../../model/orders';
import {useAppTheme, ThemeTokens} from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

type OrderKey = 'Progress' | 'Completed' | 'Cancelled';

interface TileConfig {
  key:      OrderKey;
  label:    string;
  barColor: string;
  bgColor:  string;
  numColor: string;
  lblColor: string;
  dotBg:    string;
  dotColor: string;
  deltaType: 'positive' | 'negative' | 'neutral'; // for demo
}

const TILES: TileConfig[] = [
  {key: 'Progress', label: 'In progress', barColor: '#f59e0b', bgColor: '#fffbeb', numColor: '#92400e', lblColor: '#b45309', dotBg: '#fde68a', dotColor: '#f59e0b', deltaType: 'positive'},
  {key: 'Completed', label: 'Completed',  barColor: '#22c55e', bgColor: '#f0fdf4', numColor: '#166534', lblColor: '#15803d', dotBg: '#bbf7d0', dotColor: '#22c55e', deltaType: 'positive'},
  {key: 'Cancelled', label: 'Cancelled',  barColor: '#ef4444', bgColor: '#fff5f5', numColor: '#991b1b', lblColor: '#b91c1c', dotBg: '#fecaca', dotColor: '#ef4444', deltaType: 'negative'},
];

interface TileProps extends TileConfig {
  value: number;
  t: ThemeTokens;
}

// Mock delta data (in future, fetch from API)
const getDeltaData = (key: OrderKey): {delta: number; percentage: number} => {
  const deltas: Record<OrderKey, {delta: number; percentage: number}> = {
    Progress: {delta: 3, percentage: 12},
    Completed: {delta: 8, percentage: 15},
    Cancelled: {delta: -2, percentage: -8},
  };
  return deltas[key];
};

const getDeltaIcon = (delta: number): string => {
  if (delta > 0) return 'trending-up';
  if (delta < 0) return 'trending-down';
  return 'trending-flat';
};

const getDeltaColor = (delta: number, t: ThemeTokens): string => {
  if (delta > 0) return t.successColor;
  if (delta < 0) return t.dangerColor;
  return t.textMuted;
};

const Tile = ({label, bgColor, numColor, lblColor, dotBg, dotColor, value, t, deltaType}: TileProps) => {
  const {delta, percentage} = getDeltaData(label as any);
  const deltaColor = getDeltaColor(delta, t);
  const deltaIcon = getDeltaIcon(delta);

  return (
    <Stack flex={1} vertical borderRadius={12} overflow="hidden"
      borderWidth={1} borderColor={t.borderDefault} backgroundColor={t.bgCard}>
      {/* Top bar with color accent */}
      <Stack height={3} backgroundColor={dotColor} width="100%" />
      
      {/* Content */}
      <Stack
        horizontal alignItems="center" justifyContent="space-between"
        backgroundColor={t.bgCard} paddingHorizontal={16} paddingVertical={16}>
        
        {/* Left: Number + Label + Delta */}
        <Stack vertical gap={8} flex={1}>
          {/* Number (hierarchy: largest, boldest) */}
          <StyledText fontSize={36} fontWeight="800" color={t.textPrimary}>
            {value}
          </StyledText>
          
          {/* Label (hierarchy: small, muted) */}
          <StyledText fontSize={theme.fontSize.small} color={t.textSecondary}>
            {label}
          </StyledText>
          
          {/* Delta indicator (small accent text with icon) */}
          <Stack horizontal alignItems="center" gap={4} marginTop={4}>
            <Icon
              name={deltaIcon}
              size={14}
              color={deltaColor}
            />
            <StyledText fontSize={12} fontWeight="600" color={deltaColor}>
              {delta > 0 ? '+' : ''}{delta} ({percentage > 0 ? '+' : ''}{percentage}%)
            </StyledText>
            <StyledText fontSize={11} color={t.textMuted}>
              vs last period
            </StyledText>
          </Stack>
        </Stack>
        
        {/* Right: Dot indicator */}
        <Stack width={48} height={48} borderRadius={24}
          backgroundColor={dotBg} alignItems="center" justifyContent="center">
          <Stack width={12} height={12} borderRadius={6} backgroundColor={dotColor} />
        </Stack>
      </Stack>
    </Stack>
  );
};

const Tiles = () => {
  const {t} = useAppTheme();
  const {data} = useOrderStatusAggregate();

  return (
    <Stack horizontal gap={12} marginHorizontal={16} alignItems="stretch" marginVertical={8}>
      {TILES.map(({key, deltaType, ...tile}) => (
        <Tile
          key={key}
          {...tile}
          deltaType={deltaType}
          t={t}
          value={data ? (data as OrderStatusAggregate)[key] : 0}
        />
      ))}
    </Stack>
  );
};

export default Tiles;