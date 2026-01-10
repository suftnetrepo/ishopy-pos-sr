import React from 'react';
import {
  Pressable,
  ScrollView,
} from "@gluestack-ui/themed";
import { Stack } from "../package/stack";
import { theme } from "../../utils/theme";
import { icons } from './icons';
import { Icon } from '../tablet/icon/icon';

const IconPicker = ({ name, size = 28, selectedIcon, onPress }) => {
  const options = icons[name];

  return (<ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <Stack gap={8} horizonal>
      {options.map((icon) => {
        const isActive = icon === selectedIcon;
        return (
          <Pressable key={icon} onPress={() => onPress(icon)}>
            <Icon
              isSelected={isActive}
              size={size}
              name={icon}
              color={theme.colors.gray[800]}
            />
          </Pressable>
        );
      })}
    </Stack>
  </ScrollView>)
};

export default IconPicker;