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
import {
    StyledText,
    StyledSpacer,
    StyledSpinner,
    StyledOkDialog,
    StyledDialog
} from 'fluent-styles';
import { StyledIcon } from "../../../package/icon";
import { fontStyles, theme } from "../../../../utils/theme";
import { useAppContext } from "../../../../hooks/appContext";
import { formatCurrency } from "../../../../utils/help";
import { Stack } from "../../../../components/package/stack";
import CheckOut from "../../../../components/tablet/checkout";
import { useInsertPayment } from "../../../../hooks/usePayment";

export default function Payment({ 
    payment_method, 
    onClose, 
    table_name, 
    table_id, 
    order_id, 
    printHandler, 
    shareReceipt 
}) {
    const { getTotalPrice, shop } = useAppContext();
    const { insert, data, error, loading, success } = useInsertPayment();
    
    const subtotal = getTotalPrice(table_id) || 0;
    const tax = 0;
    const baseTotal = subtotal + tax;
    
    const [amountInput, setAmountInput] = useState("");
    const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "<"];
    
    const calculateAmountToPay = (input) => {
        if (!input) return 0;
        
        if (input.includes(".")) {
            return parseFloat(input) || 0;
        }
        
        return (parseInt(input, 10) || 0) / 100;
    };
    
    const amountToPay = calculateAmountToPay(amountInput);
    const change = amountToPay - baseTotal;
    const canPay = parseFloat(amountToPay.toFixed(2)) >= parseFloat(baseTotal.toFixed(2));

    const handleKeyPress = (key) => {
        setAmountInput((prev) => {
            if (key === "<") {
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
    };

    const handleSubmit = async () => {
        if (!canPay || !order_id) return;
        
        const body = {
            order_id: order_id,
            amount: parseFloat(baseTotal),
            payment_method: payment_method,
            date: new Date().toISOString()
        };
        
        await insert(body);
    };

    const renderAmountDisplay = () => {
        if (amountInput && amountInput.length > 0) {
            return (
                <StyledText 
                    fontFamily={fontStyles.Roboto_Regular} 
                    textAlign="center" 
                    color={theme.colors.gray[500]} 
                    fontSize={theme.fontSize.xxxlarge} 
                    fontWeight={theme.fontWeight.thin}
                >
                    {formatCurrency(shop?.currency || "£", amountToPay)}
                </StyledText>
            );
        }
        return null;
    };

    const renderChangeDisplay = () => {
        if (amountInput && change > 0) {
            return (
                <>
                    <StyledSpacer marginVertical={2} />
                    <StyledText 
                        textAlign="center" 
                        fontFamily={fontStyles.Roboto_Regular} 
                        fontSize={theme.fontSize.xlarge} 
                        color={theme.colors.red[500]} 
                        fontWeight={theme.fontWeight.medium}
                    >
                     {formatCurrency(shop?.currency || "£", change)}
                    </StyledText>
                </>
            );
        }
        return null;
    };

    const renderKeypad = () => (
        <HStack flex={1} flexWrap="wrap" justifyContent="center">
            {keypad.map((num, index) => (
                <Pressable
                    key={`key-${index}`}
                    onPress={() => handleKeyPress(num)}
                    style={{
                        width: "30%",
                        margin: "1.5%",
                        height: 70,
                        borderRadius: 10,
                        backgroundColor: theme.colors.gray[800],
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text 
                        color={theme.colors.gray[1]} 
                        fontFamily={fontStyles.Roboto_Regular} 
                        fontSize={theme.fontSize.large} 
                        fontWeight={theme.fontWeight.medium}
                    >
                        {num}
                    </Text>
                </Pressable>
            ))}
        </HStack>
    );

    const renderPaymentButton = () => {
        if (canPay) {
            return (
                <Button 
                    flex={1} 
                    bg={theme.colors.green[600]} 
                    px={30} 
                    py={10} 
                    borderRadius={12} 
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <ButtonText 
                        fontFamily={fontStyles.Roboto_Regular} 
                        color={theme.colors.gray[1]}
                    >
                        Pay
                    </ButtonText>
                </Button>
            );
        }
        return null;
    };

    const renderStatusIndicators = () => {
        if (loading) {
            return <StyledSpinner />;
        }

        if (error) {
            return (
                <StyledOkDialog 
                    title={error?.message || "Payment Error"} 
                    description="Please try again" 
                    visible={true} 
                    onOk={() => { /* Add reset handler if available */ }}
                />
            );
        }

        if (success && data) {
            return (
                <StyledDialog visible>
                    <CheckOut 
                        table_name={table_name} 
                        table_id={table_id} 
                        order={data} 
                        printHandler={printHandler} 
                        shareReceipt={shareReceipt} 
                    />
                </StyledDialog>
            );
        }

        return null;
    };

    return (
        <Box borderRadius={30} flex={1} backgroundColor={theme.colors.gray[900]}>
            {/* Header */}
            <HStack  justifyContent="space-between" alignItems="center" px={24} py={16}>
                <HStack flex={1} horizontal justifyContent="flex-start" alignItems="flex-start">
                    <StyledIcon
                        name="attach-money"
                        size={24}
                        color={theme.colors.gray[1]}
                    />
                    <Text 
                        fontFamily={fontStyles.Roboto_Regular} 
                        color={theme.colors.gray[1]} 
                        fontSize={theme.fontSize.large} 
                        fontWeight={theme.fontWeight.medium}
                    >
                        Cash 
                    </Text>
                </HStack>
                <StyledIcon
                    name="cancel"
                    size={48}
                    color={theme.colors.gray[1]}
                    onPress={handleClose}
                />
            </HStack>

            {/* Main Content */}
            <VStack px={16} py={16} flex={1}>
                {/* Amount Display */}
                {renderAmountDisplay()}
                
                {/* Total Amount */}
                <StyledText
                    textAlign="center"
                    color={theme.colors.gray[1]}
                    fontSize={theme.fontSize.xxxlarge}
                    fontWeight={theme.fontWeight.bold}
                    fontFamily={fontStyles.Roboto_Regular}
                >
                    {formatCurrency(shop?.currency || "£", baseTotal)}
                </StyledText>
                
                {/* Change Display */}
                {renderChangeDisplay()}
                
                <StyledSpacer marginVertical={16} />
                
                {/* Keypad */}
                {renderKeypad()}
                
                {/* Payment Button */}
                <HStack
                    justifyContent="center"
                    px={16}
                    py={16}
                    mt="auto"
                    borderTopWidth={1}
                    borderColor={theme.colors.gray[800]}
                >
                    {renderPaymentButton()}
                </HStack>
            </VStack>

            {/* Status Indicators */}
            {renderStatusIndicators()}
        </Box>
    );
}