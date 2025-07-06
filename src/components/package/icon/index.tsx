import React, {forwardRef} from 'react';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import type {ComponentProps} from 'react';
import {styled} from '../../../utils/styled';
import {theme} from '../../../utils/theme';

type MaterialIconProps = ComponentProps<typeof MIcon>;

type IconProps = MaterialIconProps & {
  name: string;
  size?: number;
  color?: string;
  focused?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
};

const Icon = styled<
  MaterialIconProps & {
    focused?: boolean;
  }
>(MIcon, {
  base: {},
});

const StyledIcon = ({
  size = 48,
  name = 'home',
  focused = false,
  color = theme.colors.red[500],
  onLongPress,
  onPress,
  ...rest
}: IconProps) => {
  return (
    <Icon
      {...rest}
      size={size}
      name={name}
      color={color}
      onLongPress={() => onLongPress && onLongPress()}
      onPress={() => onPress && onPress()}
    />
  );
};
export {StyledIcon};
