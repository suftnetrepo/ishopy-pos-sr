import { View, ViewProps, ViewStyle } from 'react-native';
import { styled } from '../../../utils/styled';
import { theme } from '../../../utils/theme';

type StackProps = {
  horizonal?: boolean;
  vertical?: boolean;
  status?: (color?: string) => void
  selected?: boolean
} & ViewProps;

const Stack = styled<StackProps & ViewStyle>(View, {
  base: {
    position: 'relative',
  },
  variants: {
    horizonal: {
      true: { flexDirection: 'row' },
    },
    vertical: {
      true: { flexDirection: 'column' },
    },
    status: (color?: string) => {
      if (!color) return {};
      return {
        borderLeftColor: color,
        borderLeftWidth: 4,
        borderTopColor: color,
        borderRightColor: color,
        borderBottomColor: color,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
      }
    },
    green: {
      true: {
        borderLeftColor: theme.colors.green[500],
        borderTopColor: theme.colors.green[500],
        borderRightColor: theme.colors.green[500],
        borderBottomColor: theme.colors.green[500],
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderColor: theme.colors.pink[500],
        backgroundColor: theme.colors.gray[50],

      },
      false: {
        borderColor: theme.colors.gray[1],
        backgroundColor: theme.colors.gray[1],
      }
    },
    blue: {
      true: {
        borderLeftColor: theme.colors.blue[500],
        borderTopColor: theme.colors.blue[500],
        borderRightColor: theme.colors.blue[500],
        borderBottomColor: theme.colors.blue[500],
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderColor: theme.colors.blue[500],
        backgroundColor: theme.colors.gray[50],

      },
      false: {
        borderColor: theme.colors.gray[1],
        backgroundColor: theme.colors.gray[1],
      }
    }
  },
});

export { Stack };
