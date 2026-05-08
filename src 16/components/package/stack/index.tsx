import {View, ViewProps, ViewStyle} from 'react-native';
import {styled} from '../../../utils/styled';
import {theme} from '../../../utils/theme';

type StackVariants = {
  horizontal?: boolean | [boolean, ViewStyle];
  vertical?: boolean | [boolean, ViewStyle];
  status?: (color?: string) => void;
  selected?: boolean;
};

type StackProps = StackVariants & ViewProps & ViewStyle;

const Stack = styled<StackProps>(View, {
  base: {
    position: 'relative',
  } as ViewStyle,
  variants: {
    vertical: {
      true:  {flexDirection: 'column'} as ViewStyle,
      false: {} as ViewStyle,
    },
    horizontal: {
      true:  {flexDirection: 'row'} as ViewStyle,
      false: {} as ViewStyle,
    },
    status: (color?: string) => {
      if (!color) return {};
      return {
        borderLeftColor:   color,
        borderLeftWidth:   4,
        borderTopColor:    color,
        borderRightColor:  color,
        borderBottomColor: color,
        borderTopWidth:    0,
        borderRightWidth:  0,
        borderBottomWidth: 0,
      };
    },
    green: {
      true: {
        borderLeftColor:   theme.colors.green[600],
        borderTopColor:    theme.colors.green[600],
        borderRightColor:  theme.colors.green[600],
        borderBottomColor: theme.colors.green[600],
        borderTopWidth:    2,
        borderRightWidth:  2,
        borderBottomWidth: 2,
        borderLeftWidth:   2,
        backgroundColor:   theme.colors.gray[100],
      },
      false: {
        borderColor:     theme.colors.gray[200],
        backgroundColor: theme.colors.gray[1],
      },
    },
    blue: {
      true: {
        borderLeftColor:   theme.colors.blue[500],
        borderTopColor:    theme.colors.blue[500],
        borderRightColor:  theme.colors.blue[500],
        borderBottomColor: theme.colors.blue[500],
        borderTopWidth:    2,
        borderRightWidth:  2,
        borderBottomWidth: 2,
        borderLeftWidth:   2,
        borderColor:       theme.colors.blue[500],
        backgroundColor:   theme.colors.gray[100],
      },
      false: {
        borderColor:     theme.colors.gray[200],
        backgroundColor: theme.colors.gray[1],
      },
    },
  } as any,
});

const XStack = styled<Omit<StackProps, 'vertical' | 'horizontal'>>(View, {
  base: {
    position: 'relative',
    flexDirection: 'row',
  } as ViewStyle,
});

const YStack = styled<Omit<StackProps, 'vertical' | 'horizontal'>>(View, {
  base: {
    position: 'relative',
    flexDirection: 'column',
  } as ViewStyle,
});

export {Stack, XStack, YStack};
export type {StackProps};