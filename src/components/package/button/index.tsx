import {ViewStyle, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {styled} from '../../../utils/styled';
import {theme} from '../../../utils/theme';
import { viewStyleStringVariants, viewStyleVariants } from '../../../utils/viewStyleVariants';

type StyledProps = TouchableOpacityProps & ViewStyle & {
  square?: boolean;
  cycle?: boolean;
  size?: number | string;
};

const StyledButton = styled<StyledProps>(TouchableOpacity, {
  base: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 8,
    borderColor: theme.colors.gray[200],
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  variants: {
   ...viewStyleStringVariants,
  ...viewStyleVariants,
    square: {
      true: {borderRadius: 0},
    },
    cycle: {
      true: {borderRadius: 50},
    },
    size: (value: string | number) => {
      if (!value) return {};
      return {
        width: value,
        height: value,
      } as ViewStyle;
    },
    
  },
});

export {StyledButton};
