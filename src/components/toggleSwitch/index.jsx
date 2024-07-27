/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState } from "react"
import { YStack, XStack, StyledConfirmDialog, StyledCard, StyledCycle, StyledButton, StyledSeparator, StyledBadge, StyledHeader, StyledSafeAreaView, StyledSpinner, StyledOkDialog, StyledSpacer, StyledText } from 'fluent-styles';
import { theme } from "../../configs/theme";

const StyledToggleSwitch = ({ defaultLabel = "Cash", nextLabel = "Card", onPress }) => {
    const [selected, setSelected] = useState(defaultLabel)

    const onSwitch = (label) => {
        setSelected(label)
       onPress && onPress(label)
    }
    return (
        <XStack justifyContent='space-between' borderRadius={35} paddingVertical={0} paddingHorizontal={0} borderColor={theme.colors.gray[300]} backgroundColor={theme.colors.gray[300]} alignItems='center'  >
            <StyledButton  borderRadius={35} selected={selected === defaultLabel} flex={1} onPress={() => { onSwitch(defaultLabel) }}>
                <StyledText paddingVertical={16} paddingHorizontal={16}  color={theme.colors.gray[1]} selected={selected === defaultLabel} >{defaultLabel}</StyledText>
            </StyledButton>
            <StyledButton  borderRadius={35} selected={selected === nextLabel} flex={1} onPress={() => { onSwitch(nextLabel) }}>
                <StyledText paddingVertical={16} paddingHorizontal={16} color={theme.colors.gray[800]} selected={selected === nextLabel}>{nextLabel}</StyledText>
            </StyledButton>
        </XStack>
    )
}

export { StyledToggleSwitch }