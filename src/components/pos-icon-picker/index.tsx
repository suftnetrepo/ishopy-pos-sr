/* eslint-disable prettier/prettier */
import React from 'react';
import {ScrollView} from 'react-native';
import {StyledPressable, Stack} from 'fluent-styles';
import {theme} from '../../configs/theme';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppTheme} from '../../theme';

/**
 * Food/menu category icons — broad categories for organizing menu sections
 */
const CATEGORY_ICONS = [
  {name: 'silverware-fork-knife', label: 'Main Meals'},
  {name: 'coffee', label: 'Coffee'},
  {name: 'cup', label: 'Beverages'},
  {name: 'glass-cocktail', label: 'Cocktails'},
  {name: 'bottle-soda', label: 'Soft Drinks'},
  {name: 'hamburger', label: 'Burgers'},
  {name: 'pizza', label: 'Pizza'},
  {name: 'pasta', label: 'Pasta'},
  {name: 'noodle', label: 'Noodles'},
  {name: 'rice', label: 'Rice'},
  {name: 'bowl-mix', label: 'Bowls'},
  {name: 'pot-steam', label: 'Soups'},
  {name: 'fish', label: 'Seafood'},
  {name: 'chicken-leg', label: 'Poultry'},
  {name: 'food-steak', label: 'Steaks'},
  {name: 'bread-slice', label: 'Breads'},
  {name: 'cake', label: 'Desserts'},
  {name: 'cupcake', label: 'Pastries'},
  {name: 'ice-cream', label: 'Ice Cream'},
  {name: 'fruit-cherries', label: 'Fruits'},
  {name: 'carrot', label: 'Vegetables'},
];

/**
 * Food/drink item icons — specific items for individual menu entries
 */
const ITEM_ICONS = [
  {name: 'food', label: 'Food'},
  {name: 'food-fork-drink', label: 'Plate'},
  {name: 'silverware-fork-knife', label: 'Entree'},
  {name: 'coffee', label: 'Coffee'},
  {name: 'cup', label: 'Cup'},
  {name: 'glass-cocktail', label: 'Cocktail'},
  {name: 'bottle-soda', label: 'Soda'},
  {name: 'hamburger', label: 'Burger'},
  {name: 'pizza', label: 'Pizza'},
  {name: 'pasta', label: 'Pasta'},
  {name: 'noodle', label: 'Noodles'},
  {name: 'rice', label: 'Rice'},
  {name: 'bowl-mix', label: 'Bowl'},
  {name: 'pot-steam', label: 'Soup'},
  {name: 'grill', label: 'Grilled'},
  {name: 'fish', label: 'Fish'},
  {name: 'chicken-leg', label: 'Chicken'},
  {name: 'food-steak', label: 'Steak'},
  {name: 'bread-slice', label: 'Bread'},
  {name: 'cake', label: 'Cake'},
  {name: 'cupcake', label: 'Cupcake'},
  {name: 'ice-cream', label: 'Ice Cream'},
  {name: 'fruit-cherries', label: 'Fruits'},
  {name: 'carrot', label: 'Vegetables'},
  {name: 'peanut', label: 'Nuts'},
  {name: 'french-fries', label: 'Fries'},
  {name: 'sandwich', label: 'Sandwich'},
  {name: 'tea', label: 'Tea'},
  {name: 'beer', label: 'Beer'},
  {name: 'store', label: 'Store'},
];

interface PosIconPickerProps {
  selected?: string;
  onSelect: (name: string) => void;
  color?: string;
  /**
   * 'category' for category icon picker, 'item' for menu item icon picker
   * @default 'item'
   */
  type?: 'category' | 'item';
}

const PosIconPicker: React.FC<PosIconPickerProps> = ({
  selected,
  onSelect,
  color = theme.colors.gray[500],
  type = 'item',
}) => {
  const {t} = useAppTheme();
  
  // Select appropriate icon list based on type
  const icons = type === 'category' ? CATEGORY_ICONS : ITEM_ICONS;
  
  // Determine selected color for styling
  const selectedColor = color && color !== t.textSecondary ? color : t.brandPrimary;

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingHorizontal: 4 }}>
      <Stack horizontal gap={8} paddingVertical={8}>
        {icons.map(icon => {
          const isSelected = selected === icon.name;
          return (
            <StyledPressable
              key={icon.name}
              onPress={() => onSelect(icon.name)}
              width={56}
              height={56}
              borderRadius={12}
              borderWidth={1}
              borderColor={
                isSelected
                  ? selectedColor
                  : t.borderDefault
              }
              backgroundColor={
                isSelected
                  ? `${selectedColor}15`
                  : t.bgInput
              }
              alignItems="center"
              justifyContent="center">
              <MIcon
                name={icon.name}
                size={24}
                color={
                  isSelected
                    ? selectedColor
                    : color
                }
              />
            </StyledPressable>
          );
        })}
      </Stack>
    </ScrollView>
  );
};

export default PosIconPicker;