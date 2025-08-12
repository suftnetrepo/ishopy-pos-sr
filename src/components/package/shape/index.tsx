import {View, ViewProps, ViewStyle} from 'react-native';
import {styled} from '../../../utils/styled';

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
      true: {
        borderRadius: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    cycle: {
      true: {
        borderRadius: 50,
        height: 48,
        width: 48,
        flexDirection: 'column',
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
