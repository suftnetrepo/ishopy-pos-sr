import React, { useState } from "react";
import {
    Box,
    Text,
    VStack,
    HStack,
    Pressable,
    Button,
    ButtonText,
} from "@gluestack-ui/themed";
import { YStack, XStack, StyledSafeAreaView, StyledText, StyledDialog, StyledBadgeIcon, StyledBadge, StyledSpacer, StyledButton, StyledHeader } from 'fluent-styles';

import { StyledIcon } from "../../../package/icon";
import { fontStyles, theme } from "../../../../utils/theme";
import { useAppContext } from "../../../../hooks/appContext";
import { formatCurrency } from "../../../../utils/help";
import { Stack } from "../../../../components/package/stack";

export default function Payment({ onClose }) {
    const { getTotalPrice, shop } = useAppContext();
    const subtotal = getTotalPrice("1");
    const tax = 0;
    const baseTotal = subtotal + tax;
    const [amountInput, setAmountInput] = useState("");
    const amountToPay = amountInput.includes(".")
        ? parseFloat(amountInput || "0") || 0
        : ((parseInt(amountInput || "0", 10) || 0) / 100);
    const change = amountToPay - baseTotal;
    const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "x"];

    const handleKeyPress = (key) => {
        setAmountInput((prev) => {

            if (key === "x") {
                return prev.slice(0, -1);
            }

            if (key === ".") {
                if (prev.includes(".")) return prev;
                if (prev === "") return "0.";
                return prev + ".";
            }

            if (prev === "0") return key;
            return prev + key;
        });
    };

    const handleClose = () => {
        setAmountInput("");
        onClose();
    }

    return (
        <Box borderRadius={30} flex={1} backgroundColor={theme.colors.gray[900]}>
            <HStack justifyContent="space-between" alignItems="center" px={24} py={16}>
                <Stack horizonal flex={1} justifyContent="flex-start" alignItems="center">
                    <StyledIcon
                        name="attach-money"
                        size={24}
                        color={theme.colors.gray[1]}
                    />
                    <Text fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[1]} fontSize={theme.fontSize.large} fontWeight={theme.fontWeight.medium}>
                        Cash
                    </Text>
                </Stack>
                <StyledIcon
                    name="cancel"
                    size={48}
                    color={theme.colors.gray[1]}
                    onPress={handleClose}
                />
            </HStack>

            <HStack flex={1}>
                <VStack px={16} py={16} >
                    {
                        amountInput > 0 && (
                            <StyledText fontFamily={fontStyles.Roboto_Regular} textAlign="center" color={theme.colors.gray[500]} fontSize={theme.fontSize.xxxlarge} fontWeight={theme.fontWeight.medium}>
                                {amountInput
                                    ? formatCurrency(shop?.currency || "£", amountToPay)
                                    : formatCurrency(shop?.currency || "£", 0)}
                            </StyledText>
                        )
                    }
                    <StyledText
                        textAlign="center"
                        color={theme.colors.gray[1]}
                        fontSize={theme.fontSize.xxxlarge}
                        fontWeight={theme.fontWeight.bold}
                        fontFamily={fontStyles.Roboto_Regular}
                    >
                        {formatCurrency(shop?.currency || "£", baseTotal)}
                    </StyledText>
                    <StyledSpacer marginVertical={2} />
                    {amountInput && change > 0 && (
                        <StyledText textAlign="center" fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.xlarge} color={theme.colors.pink[500]} fontWeight={theme.fontWeight.medium}>
                            {formatCurrency(shop?.currency || "£", change)}
                        </StyledText>
                    )}
                    <StyledSpacer marginVertical={16} />
                    <HStack flex={1} flexWrap="wrap" justifyContent="center">
                        {keypad.map((num, i) => (
                            <Pressable
                                key={i}
                                onPress={() => handleKeyPress(num)}
                                style={{
                                    width: "30%",
                                    margin: "1.5%",
                                    height: 70,
                                    borderRadius: 10,
                                    backgroundColor: "#2E2E2E",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text color={theme.colors.gray[1]} fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.large} fontWeight={theme.fontWeight.medium}>
                                    {num}
                                </Text>
                            </Pressable>
                        ))}
                    </HStack>
                    <HStack
                        justifyContent="space-between"
                        px={16}
                        py={16}
                        mt="auto"
                        borderTopWidth={1}
                        borderColor={theme.colors.gray[800]}
                    >
                        <Button variant="outline" borderColor={theme.colors.gray[600]} px={20} py={10} borderRadius={25}>
                            <ButtonText fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[1]}>Print Receipt</ButtonText>
                        </Button>

                        <Button  bg={theme.colors.green[500]} px={30} py={10} borderRadius={25}>
                            <ButtonText fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[1]}>Order</ButtonText>
                        </Button>
                    </HStack>
                </VStack>
            </HStack>
        </Box>
    );
}
