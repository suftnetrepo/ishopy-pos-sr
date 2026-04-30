/* eslint-disable prettier/prettier */
import React from 'react';
import {StyledText} from 'fluent-styles';
import {Stack} from '../../../components/package/stack';
import {theme} from '../../../utils/theme';
import {useOrderStatusAggregate} from '../../../hooks/useOrder';
import {OrderStatusAggregate} from '../../../model/orders';

type OrderKey = 'Progress' | 'Completed' | 'Cancelled';

interface TileConfig {
  key:         OrderKey;
  label:       string;
  barColor:    string;
  bgColor:     string;
  numColor:    string;
  lblColor:    string;
  dotBg:       string;
  dotColor:    string;
}

const TILES: TileConfig[] = [
  {
    key:      'Progress',
    label:    'In progress',
    barColor: '#f59e0b',
    bgColor:  '#fffbeb',
    numColor: '#92400e',
    lblColor: '#b45309',
    dotBg:    '#fde68a',
    dotColor: '#f59e0b',
  },
  {
    key:      'Completed',
    label:    'Completed',
    barColor: '#22c55e',
    bgColor:  '#f0fdf4',
    numColor: '#166534',
    lblColor: '#15803d',
    dotBg:    '#bbf7d0',
    dotColor: '#22c55e',
  },
  {
    key:      'Cancelled',
    label:    'Cancelled',
    barColor: '#ef4444',
    bgColor:  '#fff5f5',
    numColor: '#991b1b',
    lblColor: '#b91c1c',
    dotBg:    '#fecaca',
    dotColor: '#ef4444',
  },
];

interface TileProps extends TileConfig {
  value: number;
}

const Tile = ({label, barColor, bgColor, numColor, lblColor, dotBg, dotColor, value}: TileProps) => (
  <Stack flex={1} vertical borderRadius={12} overflow="hidden"
    borderWidth={0.5} borderColor={theme.colors.gray[200]}>
    {/* Colour top bar */}
    <Stack height={4} backgroundColor={barColor} />
    {/* Tinted body */}
    <Stack
      horizontal
      alignItems="center"
      justifyContent="space-between"
      backgroundColor={bgColor}
      paddingHorizontal={16}
      paddingVertical={14}>
      <Stack vertical gap={4}>
        <StyledText fontSize={32} fontWeight={theme.fontWeight.semiBold} color={numColor}>
          {value}
        </StyledText>
        <StyledText fontSize={theme.fontSize.small} color={lblColor}>
          {label}
        </StyledText>
      </Stack>
      {/* Dot indicator */}
      <Stack
        width={44} height={44} borderRadius={22}
        backgroundColor={dotBg}
        alignItems="center" justifyContent="center">
        <Stack width={10} height={10} borderRadius={5} backgroundColor={dotColor} />
      </Stack>
    </Stack>
  </Stack>
);

const Tiles = () => {
  const {data} = useOrderStatusAggregate();

  return (
    <Stack horizontal gap={10} marginHorizontal={16} marginBottom={4} alignItems="stretch">
      {TILES.map(({key, ...tile}) => (
        <Tile
          key={key}
          {...tile}
          value={data ? (data as OrderStatusAggregate)[key] : 0}
        />
      ))}
    </Stack>
  );
};

export default Tiles;