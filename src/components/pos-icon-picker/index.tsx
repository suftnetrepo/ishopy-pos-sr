/* eslint-disable prettier/prettier */
/**
 * PosIconPicker
 *
 * Displays all SVG icons from the POS icon pack as a scrollable grid.
 * User taps an icon to select it. Selected icon gets a highlighted border.
 *
 * Usage:
 *   <PosIconPicker selected={fields.icon_name} onSelect={(name) => setFields({...fields, icon_name: name})} />
 */

import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { StyledText } from 'fluent-styles';
import { theme } from '../../configs/theme';
import PosIcon from '../pos-icon';

// All available icons with display labels
const ALL_ICONS = [
  { name: 'rice-bowl',  label: 'Rice Bowl'  },
  { name: 'soup',       label: 'Soup'       },
  { name: 'swallow',    label: 'Swallow'    },
  { name: 'grill',      label: 'Grill'      },
  { name: 'protein',    label: 'Protein'    },
  { name: 'beans',      label: 'Beans'      },
  { name: 'sides',      label: 'Sides'      },
  { name: 'drink',      label: 'Drink'      },
  { name: 'vegetable',  label: 'Vegetable'  },
  { name: 'grains',     label: 'Grains'     },
  { name: 'frozen',     label: 'Frozen'     },
  { name: 'spice',      label: 'Spice'      },
  { name: 'snack',      label: 'Snack'      },
  { name: 'household',  label: 'Household'  },
  { name: 'cafe',       label: 'Café'       },
  { name: 'pastry',     label: 'Pastry'     },
  { name: 'fish',       label: 'Fish'       },
  { name: 'chicken',    label: 'Chicken'    },
  { name: 'meat',       label: 'Meat'       },
  { name: 'flour',      label: 'Flour'      },
  { name: 'beauty',     label: 'Beauty'     },
  { name: 'basket',     label: 'Basket'     },
  { name: 'cart',       label: 'Cart'       },
  { name: 'store',      label: 'Store'      },
  { name: 'barcode',    label: 'Barcode'    },
  { name: 'cash',       label: 'Cash'       },
  { name: 'receipt',    label: 'Receipt'    },
  { name: 'printer',    label: 'Printer'    },
  { name: 'water',      label: 'Water'      },
  { name: 'restaurant', label: 'Restaurant' },
];

interface PosIconPickerProps {
  selected?: string;
  onSelect: (name: string) => void;
  color?: string;
}

const PosIconPicker: React.FC<PosIconPickerProps> = ({
  selected,
  onSelect,
  color = theme.colors.gray[700],
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={s.row}>
        {ALL_ICONS.map(icon => {
          const isSelected = selected === icon.name;
          return (
            <TouchableOpacity
              key={icon.name}
              onPress={() => onSelect(icon.name)}
              style={[
                s.item,
                isSelected && s.itemSelected,
              ]}>
              <PosIcon
                name={icon.name}
                size={26}
                color={isSelected ? theme.colors.blue[700] : color}
              />
              <StyledText
                fontSize={9}
                color={isSelected ? theme.colors.blue[700] : theme.colors.gray[500]}
                style={{ marginTop: 4, textAlign: 'center' }}>
                {icon.label}
              </StyledText>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  item: {
    width: 60,
    height: 64,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.gray[200],
    backgroundColor: theme.colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  itemSelected: {
    borderColor: theme.colors.blue[500],
    backgroundColor: theme.colors.blue[50],
  },
});

export default PosIconPicker;
