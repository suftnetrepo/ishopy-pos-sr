import React from 'react';
import {ScrollView} from 'react-native';
import {Stack, StyledPressable} from 'fluent-styles';
import {theme} from '../../utils/theme';
import {Icon} from '../tablet/icon/icon';
import {icons} from './icons';
import {useAppTheme} from '../../theme';

const IconPicker = ({name, size = 28, selectedIcon, onPress, t}) => {
  const options = icons[name];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Stack gap={8} horizontal>
        {options.map(icon => {
          const isActive = icon === selectedIcon;
          return (
            <StyledPressable key={icon} onPress={() => onPress(icon)}>
              <Icon
                isSelected={isActive}
                size={size}
                name={icon}
                color={t.textPrimary}
              />
            </StyledPressable>
          );
        })}
      </Stack>
    </ScrollView>
  );
};

export default IconPicker;
