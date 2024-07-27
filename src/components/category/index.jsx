/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from "react";
import { XStack, StyledText, StyledButton, StyledSpacer } from 'fluent-styles';
import { useQueryCategoriesByStatus } from "../../hooks/useCategory";
import { ScrollView } from "react-native";
import { fontStyles, theme } from "../../configs/theme";

const CategoryScrollView = ({ onPress }) => {
    const { data } = useQueryCategoriesByStatus();

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack paddingHorizontal={8}  backgroundColor={theme.colors.gray[800]} paddingVertical={6} >
                {
                    data.map((category, index) => (
                        <XStack key={index}>
                            <StyledButton  borderColor={category.color_code || theme.colors.gray[600]} backgroundColor={category.color_code || theme.colors.gray[600]} onPress={() => onPress && onPress(category)} >
                                <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.small} color={theme.colors.gray[1]} paddingHorizontal={20} paddingVertical={10}>{category.name}</StyledText>
                            </StyledButton>
                            <StyledSpacer marginHorizontal={4} />
                        </XStack>
                    ))
                }
            </XStack>
        </ScrollView>
    )
}

export default CategoryScrollView 