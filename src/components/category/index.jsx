/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { XStack, StyledText, StyledButton, StyledCycle, StyledSpacer } from 'fluent-styles';
import { useQueryCategoriesByStatus } from "../../hooks/useCategory";
import { ScrollView } from "react-native";
import { fontStyles, theme } from "../../configs/theme";
import { StyledMIcon } from "../icon";

const CategoryScrollView = ({ onPress }) => {
    const { data } = useQueryCategoriesByStatus();
    const [selected, setSelected] = useState("-1")

    const handleSelect = (category) => {
        setSelected(category.category_id)
        onPress && onPress(category)
    }

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack paddingHorizontal={8} backgroundColor={theme.colors.gray[800]} paddingVertical={6} >
                {
                    data.map((category, index) => (
                        <XStack key={index}>
                            <StyledButton borderColor={category.color_code || theme.colors.gray[600]} backgroundColor={category.color_code || theme.colors.gray[600]} onPress={() => handleSelect(category)} >
                                <XStack paddingHorizontal={16} paddingVertical={10} key={index} justifyContent="flex-start" alignItems="center">
                                    {(selected === category.category_id) && (
                                        <>
                                            <StyledCycle borderWidth={1} height={24} width={24} borderColor={theme.colors.gray[1]} backgroundColor={theme.colors.gray[1]}>
                                                <StyledMIcon size={16} name='done' color={theme.colors.gray[700]} />
                                            </StyledCycle>
                                            <StyledSpacer marginHorizontal={4} />
                                        </>
                                    )}
                                    <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.small} color={theme.colors.gray[1]} >{category.name}</StyledText>
                                </XStack>
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