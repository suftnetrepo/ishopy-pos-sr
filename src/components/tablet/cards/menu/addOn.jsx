import React from "react";
import { YStack, XStack, StyledText, StyledSpacer, StyledButton } from 'fluent-styles';
import { fontStyles, theme } from "../../../../utils/theme";
import { useAppContext } from "../../../../hooks/appContext";
import { formatCurrency } from "../../../../utils/help";
import { Stack } from "../../../../components/package/stack";
import { Pressable } from "react-native";

export default function AddOn({ table_id, onClose, item, setItem }) {
    const { shop, addItem } = useAppContext();

    console.log("AddOn Item:", item);

    const increaseAddOnQuantity = (addOn) => {
        setItem((prev) => ({
            ...prev,
            addOns: prev?.addOns.map(a =>
                a.addOn_id === addOn?.addOn_id ? { ...a, quantity: parseInt(a.quantity || 0) + 1 } : a
            ),
        }))
    };
    const decreaseAddOnQuantity = (addOn) => {
        if (parseInt(addOn?.quantity || 0) === 0) return
        setItem((prev) => ({
            ...prev,
            addOns: prev?.addOns.map(a =>
                a.addOn_id === addOn?.addOn_id ? { ...a, quantity: parseInt(a.quantity || 0) - 1 } : a
            ),
        }))
    }
    const calculateTotalAddOnsPrice = () => {
        const sum = item?.addOns?.reduce((total, addOn) => {
            return total + (parseFloat(addOn.price || 0) * parseInt(addOn.quantity || 0));
        }, 0);

        return sum + item?.price || 0;
    };

    const onSubmit = () => {
        const index = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
        addItem(index, item.menu_id, item.name, item.price, 1, table_id, item?.addOns?.filter((j) => j.quantity > 0)).then(() => { });
        onClose();
    };

    const Menu = ({ item }) => {
        return (
            <Stack
                width={'100%'}
                borderBottomWidth={1}
                borderBottomColor={theme.colors.gray[300]}
                paddingHorizontal={8}
                paddingBottom={8}
                marginVertical={4}
                shadowColor="black"
                shadowOffset={{ width: 0, height: 1 }}
                shadowOpacity={0.1}
                shadowRadius={2}
                elevation={3}
                vertical
            >
                <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.medium} color={theme.colors.gray[800]}>
                    {item.name}
                </StyledText>
                <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.normal} color={theme.colors.gray[800]}>
                    {item.description}
                </StyledText>
                <StyledSpacer marginVertical={2} />
                <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.light} color={theme.colors.gray[500]}>
                    {item.stock} Available
                </StyledText>
                <StyledSpacer marginVertical={4} />
                <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.medium} color={theme.colors.gray[800]}>
                    {formatCurrency(shop?.currency || "£", item.price)}
                </StyledText>
            </Stack>
        );
    };

    return (
        <YStack
            backgroundColor={theme.colors.transparent05}
            flex={1}
            justifyContent='center'
            alignItems='center'
        >
            <YStack
                width={'35%'}
                backgroundColor={theme.colors.gray[1]}
                borderRadius={16}
                paddingHorizontal={8}
                paddingVertical={8}
                justifyContent='center'
                alignItems='center'
            >
                <Menu item={item} />
                {
                    item?.addOns?.map((addOn, index) => (
                        <Stack horizonal key={index}
                            borderBottomWidth={1}
                            borderBottomColor={theme.colors.gray[300]}
                            paddingHorizontal={8} paddingVertical={8} justifyContent='space-between' alignItems='center'  >
                            <YStack flex={2} justifyContent='flex-start' alignItems='flex-start'>
                                <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.medium} color={theme.colors.gray[800]}>
                                    {addOn.addOnName}
                                </StyledText>
                                <StyledText
                                    fontFamily={fontStyles.Roboto_Regular}
                                    color={theme.colors.gray[800]}
                                    fontWeight={theme.fontWeight.normal}
                                    fontSize={theme.fontSize.small}
                                    paddingVertical={2}
                                >
                                    {formatCurrency(shop?.currency || '£', addOn.price)}
                                </StyledText>
                            </YStack>
                            <XStack flex={1} gap={2} alignItems='center' justifyContent='flex-end' >
                                <StyledButton
                                    borderRadius={30}
                                    height={48}
                                    width={48}
                                    borderColor={theme.colors.gray[500]}
                                    backgroundColor={theme.colors.gray[1]}
                                    onPress={() => { increaseAddOnQuantity(addOn) }}
                                >
                                    <StyledText
                                        fontFamily={fontStyles.Roboto_Regular}
                                        color={theme.colors.gray[800]}
                                        fontWeight={theme.fontWeight.normal}
                                        fontSize={theme.fontSize.large}
                                        paddingHorizontal={4}
                                        paddingVertical={2}
                                    >
                                        +
                                    </StyledText>
                                </StyledButton>
                                <StyledSpacer marginVertical={2} />
                                <StyledText
                                    fontFamily={fontStyles.Roboto_Regular}
                                    color={theme.colors.gray[800]}
                                    fontWeight={theme.fontWeight.normal}
                                    fontSize={theme.fontSize.large}
                                    paddingHorizontal={4}
                                    paddingVertical={2}
                                >
                                    {addOn.quantity || 0}
                                </StyledText>
                                <StyledSpacer marginVertical={2} />
                                <StyledButton
                                    borderRadius={30}
                                    height={48}
                                    width={48}
                                    borderColor={theme.colors.gray[500]}
                                    backgroundColor={theme.colors.gray[1]}
                                    onPress={() => { decreaseAddOnQuantity(addOn) }}
                                >
                                    <StyledText
                                        fontFamily={fontStyles.Roboto_Regular}
                                        color={theme.colors.gray[800]}
                                        fontWeight={theme.fontWeight.normal}
                                        fontSize={theme.fontSize.large}
                                        paddingHorizontal={4}
                                        paddingVertical={2}
                                    >
                                        -
                                    </StyledText>
                                </StyledButton>

                            </XStack>
                        </Stack>
                    ))
                }

                <StyledSpacer marginVertical={8} />
                <XStack borderColor={theme.colors.gray[400]} borderRadius={16} width={'100%'} justifyContent='flex-end' alignItems='center' backgroundColor={theme.colors.gray[50]}>
                    <StyledButton
                        flex={1}
                        borderRadius={30}
                        borderColor={theme.colors.gray[400]}
                        backgroundColor={theme.colors.gray[1]}
                        onPress={() => onClose()}
                    >
                        <StyledText
                            fontFamily={fontStyles.Roboto_Regular}
                            color={theme.colors.gray[800]}
                            fontWeight={theme.fontWeight.normal}
                            fontSize={theme.fontSize.normal}
                            paddingHorizontal={16}
                            paddingVertical={8}
                        >
                            Close
                        </StyledText>
                    </StyledButton>
                    <StyledSpacer marginHorizontal={4} />
                    <Pressable style={{ flex: 1 }} onPress={() => onSubmit()}>
                        <Stack flex={1} borderRadius={30} paddingHorizontal={16} paddingVertical={9} horizonal justifyContent='space-between' alignItems='center' backgroundColor={theme.colors.amber[600]} >
                            <StyledText
                                fontFamily={fontStyles.Roboto_Regular}
                                color={theme.colors.gray[1]}
                                fontWeight={theme.fontWeight.normal}
                                fontSize={theme.fontSize.normal}
                            >
                                Add
                            </StyledText>
                            <StyledText color={theme.colors.gray[1]}
                                fontWeight={theme.fontWeight.normal}
                                fontSize={theme.fontSize.normal}>
                                {formatCurrency(shop?.currency || "£", calculateTotalAddOnsPrice())}
                            </StyledText>
                        </Stack>
                    </Pressable>
                </XStack>
                <StyledSpacer marginVertical={2} />
            </YStack>
        </YStack>
    );
}
