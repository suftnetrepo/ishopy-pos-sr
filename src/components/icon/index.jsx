
import React, { forwardRef } from "react";
import MIcon from "react-native-vector-icons/MaterialIcons/";
// import { styled } from 'fluent-styles';
import { theme } from "../../configs/theme";
import { styled } from '../../../src/utils/styled'

const Icon = styled(MIcon, {
    base: {

    },
    variant: {
        focused: {
            true: {
                color: theme.colors.green[500]
            },
            false: {
                color: theme.colors.red[500]
            }
        }
    }
})

const StyledMIcon = forwardRef(({ size = 48, name = 'home', focused = false, color = theme.colors.green[500], onLongPress, onPress, ...rest }, ref) => {   
    return (
        <Icon ref={ref} {...rest} size={size} focused={focused} name={name} color={color} onLongPress={() => onLongPress && onLongPress()} onPress={() => onPress && onPress()} />
    )
})
export { StyledMIcon }