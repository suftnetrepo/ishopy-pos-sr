import {ViewStyle, ImageStyle, Image, ImageProps} from 'react-native';
import {styled} from '../../../utils/styled';

type StyledImageProps = ImageProps &
  ViewStyle & {
    rounded?: boolean;
    square?: boolean;
    cycle?: boolean;
    size?: number | string;
    height?: number | string;
    width?: number | string;
  };

const StyledImage = styled<StyledImageProps>(Image, {
  base: {
    height: 50,
    width: 50,
  },
  variants: {
    rounded: {
      true: {borderRadius: 100},
    },
    square: {
      true: {borderRadius: 0},
    },
    cycle: {
      true: {borderRadius: 50},
    },
    height: (value: string | number) => {
      if (!value) return {} as ImageStyle;
      return {
        height: value,
      } as ImageStyle;
    },
    width: (value: string | number) => {
      if (!value) return {} as ImageStyle;
      return {
        width: value,
      } as ImageStyle;
    },
    size: (value: string | number) => {
      if (!value) return {} as ImageStyle;
      return {
        width: value,
        height: value,
      } as ImageStyle;
    },
  },
});

export {StyledImage};
