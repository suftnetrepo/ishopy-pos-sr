/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { XStack, StyledText, StyledButton, StyledCycle, StyledSpacer } from 'fluent-styles';
import { useQueryCategoriesByStatus } from "../../hooks/useCategory";
import { ScrollView } from "react-native";
import { fontStyles, theme } from "../../configs/theme";
import { StyledMIcon } from "../icon";
import {useAppTheme} from '../../theme';

const CategoryScrollView = ({onPress, t}) => {
    const { data } = useQueryCategoriesByStatus();
    const [selected, setSelected] = useState("-1")

    const handleSelect = (category) => {
        setSelected(category.category_id)
        onPress && onPress(category)
    }

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack paddingHorizontal={8} backgroundColor={t.textPrimary} paddingVertical={6} >
                {
                    data.map((category, index) => (
                        <XStack key={index}>
                            <StyledButton borderColor={category.color_code || t.textSecondary} backgroundColor={category.color_code || t.textSecondary} onPress={() => handleSelect(category)} >
                                <XStack paddingHorizontal={16} paddingVertical={10} key={index} justifyContent="flex-start" alignItems="center">
                                    {(selected === category.category_id) && (
                                        <>
                                            <StyledCycle borderWidth={1} height={24} width={24} borderColor={t.bgCard} backgroundColor={t.bgCard}>
                                                <StyledMIcon size={16} name='done' color={t.textSecondary} />
                                            </StyledCycle>
                                            <StyledSpacer marginHorizontal={4} />
                                        </>
                                    )}
                                    <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.small} color={t.bgCard} >{category.name}</StyledText>
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