import React, { Fragment, useState } from "react";
import { ScrollView } from "react-native";
import { YStack, XStack, StyledSafeAreaView, StyledText, StyledDialog, StyledBadgeIcon, StyledBadge, StyledSpacer, StyledButton, StyledHeader } from 'fluent-styles';
import {
    Box,
    Text,
    HStack,
    VStack,
    Pressable,
    Button,
    ButtonText,
    Icon,
} from "@gluestack-ui/themed";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAppContext } from "../../../hooks/appContext";
import { formatCurrency } from "../../../utils/help";
import { theme } from "../../../utils/theme";
import Drawer from "../../../components/package/drawer";
import Payment from "../cards/menu/PaymentDrawer";

export default function Cart() {
    const { getItems, shop, removeItem, getTotalTax, getTotal, getTotalPrice } = useAppContext()
    const [method, setMethod] = useState("cash");
    const [showPayment, setShowPayment] = useState(false);
    const cartItems = getItems("1");

    console.log("Cart Items:", cartItems);
    console.log("Cart Items Length:", cartItems.length);


    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    const paymentOptions = [
        { key: "cash", label: "Cash", icon: "attach-money" },
        { key: "card", label: "Card", icon: "credit-card" },
    ];


    return (
        <VStack flex={1} px={16} py={16} space="lg" backgroundColor={theme.colors.gray[700]} borderRadius={16}>

            <VStack flex={1} space="md" mb="lg">
                <ScrollView showsVerticalScrollIndicator={false} >
                    {cartItems.map((item, index) => (
                        <Fragment key={`${item.id}-${index}`}>
                            <Box
                                borderRadius={16}
                                px={8}
                                py={8}
                                backgroundColor={theme.colors.gray[800]}
                            >
                                <HStack flex={1} justifyContent="space-between" alignItems="center">
                                    <Text flex={1} color={theme.colors.gray[1]} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal}>
                                        {item.name} <Text color={theme.colors.gray[400]}>x{1}</Text>
                                    </Text>
                                    <HStack space="md" alignItems="center">
                                        <Text fontSize={theme.fontSize.normal} color={theme.colors.gray[1]} fontWeight={theme.fontWeight.normal}>
                                            {formatCurrency(shop?.currency || "£", item.price)}
                                        </Text>
                                        <Box
                                            w={32}
                                            h={32}
                                            borderRadius={20}
                                            backgroundColor={theme.colors.gray[1]}
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Icon
                                                as={MaterialIcons}
                                                name={"cancel"}
                                                size={24}
                                                color={theme.colors.gray[800]}
                                                onPress={() => removeItem(item.index, "1")}
                                            />
                                        </Box>
                                    </HStack>
                                </HStack>
                            </Box>
                            <StyledSpacer marginVertical={1} />
                        </Fragment>
                    ))}
                </ScrollView>
            </VStack>
            <VStack flex={1} mb="lg">
                <Box backgroundColor={theme.colors.gray[800]} px={16} py={20} borderRadius={12}>
                    <HStack justifyContent="space-between" mb={8}>
                        <Text color={theme.colors.gray[400]}>Subtotal</Text>
                        <Text color={theme.colors.gray[400]}> {formatCurrency(shop?.currency || "£", getTotal("1"))}</Text>
                    </HStack>

                    <HStack justifyContent="space-between" mb={8}>
                        <Text color={theme.colors.gray[400]}>Tax 10%</Text>
                        <Text color={theme.colors.gray[400]}> {formatCurrency(shop?.currency || "£", getTotalTax("1"))}</Text>
                    </HStack>

                    <Box
                        height={1}
                        backgroundColor={theme.colors.gray[800]}
                        my={12}
                    />

                    <HStack justifyContent="space-between">
                        <Text color={theme.colors.gray[1]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal}>
                            Total
                        </Text>
                        <Text color={theme.colors.gray[1]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal}>
                            {formatCurrency(shop?.currency || "£", getTotalPrice("1"))}
                        </Text>
                    </HStack>
                </Box>

                <HStack mt={16} space="md">
                    {paymentOptions.map((j) => (
                        <Pressable
                            key={j.key}
                            onPress={() => { 
                                setMethod(j.key) }}
                            style={{
                                flex: 1,
                                padding: 16,
                                borderRadius: 12,
                                backgroundColor: method === j.key ? theme.colors.gray[1] : theme.colors.gray[800],
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: method === j.key ? theme.colors.gray[1] : theme.colors.gray[800],
                            }}
                        >
                            <Icon
                                as={MaterialIcons}
                                name={j.icon}
                                size="xl"
                                color={method === j.key ? theme.colors.gray[800] : theme.colors.gray[1]}
                            />
                            <Text
                                mt={4}
                                color={method === j.key ? theme.colors.gray[800] : theme.colors.gray[1]}
                                fontSize={14}
                            >
                                {j.label}
                            </Text>
                        </Pressable>
                    ))}
                </HStack>
                <Button
                    mt={16}
                    size="lg"
                    bg={theme.colors.gray[1]}
                    borderRadius={30}
                    onPress={()=> {
                      method=== "cash" &&   
                      setShowPayment(true);
                    }}
                >
                    <ButtonText color={theme.colors.gray[800]} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal}>
                        Place Order
                    </ButtonText>
                </Button>
            </VStack>
            <Drawer
                direction="right"
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
            >
                <Payment onClose={()=> setShowPayment(false)} />
            </Drawer>
        </VStack>
    );
}
