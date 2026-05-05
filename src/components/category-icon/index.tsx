/* eslint-disable prettier/prettier */
import React from 'react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../../configs/theme';
import {useAppTheme} from '../../theme';

interface CategoryIconProps {
  iconName?: string;
  color?: string;
  size?: number;
}

/**
 * Shared CategoryIcon component — renders category icons consistently
 * Uses MaterialCommunityIcons with fallback to 'restaurant'
 */
const CategoryIcon: React.FC<CategoryIconProps> = ({
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

export default CategoryIcon;
