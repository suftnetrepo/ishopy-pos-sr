/* eslint-disable prettier/prettier */
import React from 'react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppTheme} from '../../theme';

interface ItemIconProps {
  iconName?: string;
  color?: string;
  size?: number;
}

/**
 * Shared ItemIcon component — renders item/menu icons consistently
 * Uses MaterialCommunityIcons with fallback to 'restaurant'
 * Priority: iconName || fallback to 'restaurant'
 */
const ItemIcon: React.FC<ItemIconProps> = ({
  iconName,
  color,
  size = 24,
}) => {
  const {t} = useAppTheme();

  // Safe icon validation
  const isValidIcon =
    iconName &&
    iconName !== 'undefined' &&
    String(iconName).trim().length > 0;

  // Determine final icon name (with fallback)
  const finalIconName = isValidIcon ? iconName : 'restaurant';

  // Determine final color (with fallback)
  const finalColor = color || t.brandPrimary;

  return (
    <MIcon
      name={finalIconName}
      size={size}
      color={finalColor}
    />
  );
};

export default ItemIcon;
