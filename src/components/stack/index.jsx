/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import { styled } from 'fluent-styles';
import { theme } from "../../configs/theme";
import { View } from 'react-native';

const StyledStack = styled(View, {
    base: {
        flexDirection: 'row'
    },
    variants: {
        status: {
            '0': {
                borderLeftColor: theme.colors.red[400],
                borderLeftWidth: 4,
                borderTopColor: theme.colors.gray[300],
                borderRightColor: theme.colors.gray[300],
                borderBottomColor: theme.colors.gray[300],
                borderTopWidth: 1,
                borderRightWidth: 1,
                borderBottomWidth: 1,
            },
            '1': {
                borderLeftColor: theme.colors.teal[500],
                borderLeftWidth: 4,
                borderTopColor: theme.colors.gray[300],
                borderRightColor: theme.colors.gray[300],
                borderBottomColor: theme.colors.gray[300],
                borderTopWidth: 1,
                borderRightWidth: 1,
                borderBottomWidth: 1,

            },
        }
    }
})

export { StyledStack }