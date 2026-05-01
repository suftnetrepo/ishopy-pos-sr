/* eslint-disable prettier/prettier */
import React from 'react';
import {ScrollView} from 'react-native';
import {StyledText, StyledPressable, Stack} from 'fluent-styles';
import {theme} from '../../configs/theme';
import PosIcon from '../pos-icon';
import {useAppTheme} from '../../theme';

const ALL_ICONS = [
  {name: 'rice-bowl',  label: 'Rice Bowl'},
  {name: 'soup',       label: 'Soup'},
  {name: 'swallow',    label: 'Swallow'},
  {name: 'grill',      label: 'Grill'},
  {name: 'protein',    label: 'Protein'},
  {name: 'beans',      label: 'Beans'},
  {name: 'sides',      label: 'Sides'},
  {name: 'drink',      label: 'Drink'},
  {name: 'vegetable',  label: 'Vegetable'},
  {name: 'grains',     label: 'Grains'},
  {name: 'frozen',     label: 'Frozen'},
  {name: 'spice',      label: 'Spice'},
  {name: 'snack',      label: 'Snack'},
  {name: 'household',  label: 'Household'},
  {name: 'cafe',       label: 'Café'},
  {name: 'pastry',     label: 'Pastry'},
  {name: 'fish',       label: 'Fish'},
  {name: 'chicken',    label: 'Chicken'},
  {name: 'meat',       label: 'Meat'},
  {name: 'flour',      label: 'Flour'},
  {name: 'beauty',     label: 'Beauty'},
  {name: 'basket',     label: 'Basket'},
  {name: 'cart',       label: 'Cart'},
  {name: 'store',      label: 'Store'},
  {name: 'barcode',    label: 'Barcode'},
  {name: 'cash',       label: 'Cash'},
  {name: 'receipt',    label: 'Receipt'},
  {name: 'printer',    label: 'Printer'},
  {name: 'water',      label: 'Water'},
  {name: 'restaurant', label: 'Restaurant'},
];

interface PosIconPickerProps {
  selected?: string;
  onSelect: (name: string) => void;
  color?: string;
}

const PosIconPicker: React.FC<PosIconPickerProps> = ({
  selected,
  onSelect,
  color = theme.colors.gray[500],
}) => {
  const {t} = useAppTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Stack horizontal gap={6} paddingVertical={4}>
        {ALL_ICONS.map(icon => {
          const isSelected = selected === icon.name;
          return (
            <StyledPressable
              key={icon.name}
              onPress={() => onSelect(icon.name)}
              width={60}
              height={48}
              borderRadius={8}
              borderWidth={1}
              borderColor={isSelected ? theme.colors.blue[500] : t.borderDefault}
              backgroundColor={isSelected ? t.infoBg : t.bgCard}
              alignItems="center"
              justifyContent="center"
              paddingVertical={6}>
              <PosIcon
                name={icon.name}
                size={26}
                color={isSelected ? t.infoColor : color}
              />
            </StyledPressable>
          );
        })}
      </Stack>
    </ScrollView>
  );
};

export default PosIconPicker;