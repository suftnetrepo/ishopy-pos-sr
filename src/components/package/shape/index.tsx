import {View, ViewProps, ViewStyle} from 'react-native';
import {styled} from '../../../utils/styled';
import {theme} from '../../../utils/theme';
import {de} from '@faker-js/faker';

type ShapeProps = {
  square?: boolean;
  default?: boolean;
  cycle?: boolean;
} & ViewProps;

const StyledShape = styled<ShapeProps & ViewStyle>(View, {
  base: {
    position: 'relative',

   
  },
  variants: {
    square: {
      true: {borderRadius: 8},
    },
    cycle: {
      true: {
        borderRadius: 50,
        height: 48,
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
      },
      false: {
        height: 48,
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  },
});

export {StyledShape};
