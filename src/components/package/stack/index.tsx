import {View, ViewProps, ViewStyle} from 'react-native';
import {styled} from '../../../utils/styled';

type StackProps = {
  horizonal?: boolean;
  vertical?: boolean;
} & ViewProps;

const Stack = styled<StackProps & ViewStyle>(View, {
  base: {
    position: 'relative',
  },
  variants: {
    horizonal: {
      true: {flexDirection: 'row'},
    },
    vertical: {
      true: {flexDirection: 'column'},
    },
  },
});

export {Stack};
