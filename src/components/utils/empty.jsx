/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from "react";
import { YStack, StyledText, StyledButton, StyledSpacer } from 'fluent-styles';
import { StyledMIcon } from "../icon";
import { fontStyles, theme } from "../../configs/theme";
import { useNavigation } from "@react-navigation/native";

const EmptyView = ({ button, icon = "notifications-active", title, description, screen }) => {
    const navigator = useNavigation()

    return (
        <YStack flex={1} justifyContent="center" paddingHorizontal={32} paddingVertical={1}
            alignItems="center">
            {
                icon && (
                    <StyledMIcon
                        size={60}
                        name={icon}
                        color={theme.colors.gray[800]}
                    />
                )
            }
            {
                title && (
                    <StyledText
                        fontFamily={fontStyles.Roboto_Regular}
                        fontSize={theme.fontSize.large}
                        fontWeight={theme.fontWeight.bold}
                        paddingHorizontal={8}
                        color={theme.colors.gray[800]}>
                        {title}
                    </StyledText>
                )
            }
            {
                description && (
                    <StyledText
                        fontFamily={fontStyles.Roboto_Regular}
                        fontSize={theme.fontSize.normal}
                        fontWeight={theme.fontWeight.normal}
                        paddingHorizontal={8}
                        paddingVertical={8}
                        color={theme.colors.gray[800]}>
                        {description}
                    </StyledText>
                )
            }

            {
                button && (
                    <>
                        <StyledSpacer marginVertical={4} />
                        <StyledButton backgroundColor={theme.colors.cyan[500]} onPress={() => screen && navigator.navigate(screen)} >
                            <StyledText color={theme.colors.gray[1]} paddingHorizontal={16} paddingVertical={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} >
                                {button}
                            </StyledText>
                        </StyledButton>
                    </>
                )
            }

        </YStack>
    )

}

export default EmptyView