
import React, { useState } from "react";
import { styled, theme, StyledSpacer, isValidColor, StyledCycle, isValidNumber, StyledInput } from 'fluent-styles';
import { StyledMIcon } from "../icon";
import { View } from "react-native";

const SearchBar = styled(View, {
    base: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 1,
        paddingHorizontal: 1,
        height: 50,
        borderRadius: 100,
        backgroundColor: theme.colors.gray[1],
    },
    variants: {
        borderColor: color => {
            if (!color) return
            if (!isValidColor(color)) {
                throw new Error('Invalid color value')
            }
            return { borderColor: color }
        },
        borderRadius: (size = 32) => {
            if (!isValidNumber(size)) {
                throw new Error('Invalid borderRadius value')
            }
            return { borderRadius: size }
        },
        backgroundColor: color => {
            if (!color) return
            if (!isValidColor(color)) {
                throw new Error('Invalid color value')
            }
            return { backgroundColor: color }
        }
    }
})

const StyledSearchBar = ({ size = 24, name = 'search', placeholder = 'Search item by name', showSearchIcon = false, onTextChange, onPress, ...rest }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubmit = () => {
        if (onPress && searchQuery) {
            onPress(searchQuery)
        }
    }

    return (
        <SearchBar flex={1}  {...rest}>
            <StyledInput variant="outline" marginHorizontal={8} flex={1} placeholder={placeholder} fontSize={theme.fontSize.normal} value={searchQuery}
                onChangeText={(text) => {
                    setSearchQuery((pre) => {
                        return {
                            ...pre,
                            text
                        }
                    })
                    onTextChange(text)
                }} returnKeyType='search'  onSubmitEditing={handleSubmit} />
            <StyledSpacer marginHorizontal={2} />
            {
                showSearchIcon && (
                    <StyledCycle borderWidth={1} borderColor={theme.colors.cyan[400]} backgroundColor={theme.colors.cyan[500]}>
                        {
                            <StyledMIcon size={size} name={name} color={theme.colors.gray[1]} onPress={() => handleSubmit()} />
                        }
                    </StyledCycle>
                )
            }

        </SearchBar>
    )
}

export { StyledSearchBar }