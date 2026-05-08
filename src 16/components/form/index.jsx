
import React, { forwardRef } from 'react';
import { TextInput } from 'react-native';
import { YStack, StyledSpacer, StyledText } from 'fluent-styles';
import { isValidColor, isValidNumber, isValidString } from '../../utils/help';
import { styled } from '../../utils/styled';
import { theme } from '../../configs/theme';
import {useAppTheme} from '../../theme';


const StyledInputText = styled(TextInput, {
    base: {
        borderWidth: 0,
        borderRadius: 0,
        width: '100%',
        fontSize: theme.fontSize.normal,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    variants: {
        fontWeight: (size = theme.fontWeight.normal) => {
            if (!isValidString(size)) {
                throw new Error('Invalid fontWeight value');
            }
            return { fontWeight: size };
        },
        color: (color = theme.colors.gray[900]) => {
            if (!isValidColor(color)) {
                throw new Error('Invalid color value');
            }
            return { color: color };
        },
        fontSize: (size = theme.fontSize.normal) => {
            if (!isValidNumber(size)) {
                throw new Error('Invalid fontSize value');
            }
            return { fontSize: size };
        },
        fontFamily: font => {
            if (!font) return
            return {
                fontFamily: font
            }
        },
        textAlign: (align = 'left') => {
            const validAlignments = ['auto', 'left', 'right', 'center', 'justify'];
            if (!validAlignments.includes(align)) {
                throw new Error('Invalid textAlign value');
            }
            return { textAlign: align };
        },
        borderRadius: (value = 16) => {
            if (!isValidNumber(value)) {
                throw new Error('Invalid borderRadius value');
            }
            return { borderRadius: value };
        },
        borderColor: (value = theme.colors.gray[100]) => {
            if (!isValidColor(value)) {
                throw new Error('Invalid borderColor value');
            }
            return { borderColor: value };
        },
        backgroundColor: (value = theme.colors.gray[1]) => {
            if (!isValidColor(value)) {
                throw new Error('Invalid backgroundColor value');
            }
            return { backgroundColor: value };
        },
        noBorder: {
            true: { borderWidth: 0 }
        },
        placeholderTextColor: (value = theme.colors.gray[900]) => {
            if (!isValidColor(value)) {
                throw new Error('Invalid placeholderTextColor value');
            }
            return { placeholderTextColor: value };
        }
    }
});

const StyledInput = forwardRef(({ label, containerProps, borderColor, errorMessage, error, errorProps, labelProps, marginBottom, ...rest }, ref) => {
    const {t} = useAppTheme();
    const [focused, setFocused] = React.useState(false);
    
    return (
        <YStack marginBottom={marginBottom ?? 12} width="100%">
            {
                label && (
                    <YStack width={'100%'} justifyContent='flex-start' alignItems='flex-start' {...containerProps} >
                        <StyledText paddingHorizontal={8} color={t.textSecondary} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal} {...labelProps}>
                            {label}
                        </StyledText>
                        <StyledSpacer marginVertical={4} />
                    </YStack>
                )
            }
            <YStack
                backgroundColor={t.bgInput}
                borderColor={error ? t.dangerColor : (focused ? t.borderFocus : t.borderDefault)}
                borderWidth={1}
                borderRadius={12}
                overflow="hidden"
                width="100%"
            >
                <StyledInputText
                    ref={ref}
                    backgroundColor={t.bgInput}
                    color={t.textPrimary}
                    placeholderTextColor={t.textMuted}
                    borderColor={error ? t.dangerColor : t.borderDefault}
                    borderWidth={0}
                    borderRadius={0}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    {...rest}
                />
            </YStack>
            {
                errorMessage && (
                    <YStack width={'100%'} justifyContent='flex-start' alignItems='flex-start' {...containerProps} >
                        <StyledSpacer marginVertical={1} />
                        <StyledText marginHorizontal={8} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.small} color={t.dangerColor} {...errorProps}>
                            {errorMessage}
                        </StyledText>
                    </YStack>
                )
            }
        </YStack>
    )
})

const StyledMultiInput = ({label, errorMessage, borderColor, error, errorProps, labelProps, marginBottom, ...rest}) => {
    const {t} = useAppTheme();
    const [focused, setFocused] = React.useState(false);
    
    return (
        <YStack marginBottom={marginBottom ?? 12} width="100%">
            {
                label && (
                    <>
                        <StyledSpacer marginVertical={4} />
                        <StyledText paddingHorizontal={8} color={t.textSecondary} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal} {...labelProps}>
                            {label}
                        </StyledText>
                        <StyledSpacer marginVertical={4} />
                    </>
                )
            }
            <YStack
                backgroundColor={t.bgInput}
                borderColor={error ? t.dangerColor : (focused ? t.borderFocus : t.borderDefault)}
                borderWidth={1}
                borderRadius={12}
                overflow="hidden"
                width="100%"
            >
                <StyledInputText
                    backgroundColor={t.bgInput}
                    color={t.textPrimary}
                    placeholderTextColor={t.textMuted}
                    borderColor={error ? t.dangerColor : t.borderDefault}
                    borderWidth={0}
                    borderRadius={0}
                    textAlignVertical='top'
                    multiline
                    numberOfLines={5}
                    inputMode='text'
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    {...rest}
                />
            </YStack>
            {
                errorMessage && (
                    <>
                        <StyledSpacer marginVertical={1} />
                        <StyledText marginHorizontal={8} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.small} color={t.dangerColor} {...errorProps}>
                            {errorMessage}
                        </StyledText>
                    </>
                )
            }
        </YStack>
    )
}

// ─── Themed wrapper for Fluent Styles StyledTextInput ───────────────────────
const ThemedStyledTextInput = forwardRef((props, ref) => {
    const { t } = useAppTheme();
    const [focused, setFocused] = React.useState(false);
    
    return (
        <YStack marginBottom={props.marginBottom ?? 12} width="100%">
            {
                props.label && (
                    <YStack width={'100%'} justifyContent='flex-start' alignItems='flex-start'>
                        <StyledText paddingHorizontal={8} color={t.textSecondary} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal}>
                            {props.label}
                        </StyledText>
                        <StyledSpacer marginVertical={4} />
                    </YStack>
                )
            }
            <YStack
                backgroundColor={t.bgInput}
                // borderColor={props.error ? t.dangerColor : (focused ? t.borderFocus : t.borderDefault)}
                borderWidth={1}
                borderRadius={12}
                overflow="hidden"
                width="100%"
            >
                <StyledInputText
                    ref={ref}
                    backgroundColor={t.bgInput}
                    color={t.textPrimary}
                    placeholderTextColor={t.textMuted}
                    // borderColor={props.error ? t.dangerColor : t.borderDefault}
                    borderWidth={0}
                    borderRadius={0}
                    paddingHorizontal={props.paddingHorizontal ?? 14}
                    paddingVertical={props.paddingVertical ?? 12}
                    onFocus={() => {
                        setFocused(true);
                        props.onFocus?.();
                    }}
                    onBlur={() => {
                        setFocused(false);
                        props.onBlur?.();
                    }}
                    {...props}
                />
            </YStack>
            {props.errorMessage && (
                <>
                    <StyledSpacer marginVertical={4} />
                    <StyledText marginHorizontal={8} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.small} color={t.dangerColor}>
                        {props.errorMessage}
                    </StyledText>
                </>
            )}
        </YStack>
    );
});

export { StyledInput, StyledMultiInput, ThemedStyledTextInput }
export default StyledInputText