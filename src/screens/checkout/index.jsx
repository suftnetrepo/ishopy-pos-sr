/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { YStack, XStack, StyledDialog, StyledCard, StyledCycle, StyledButton, StyledSeparator, StyledBadge, StyledHeader, StyledSafeAreaView, StyledSpinner, StyledOkDialog, StyledSpacer, StyledText } from 'fluent-styles';
import { fontStyles, theme } from '../../configs/theme';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../hooks/appContext';
import { ScrollView } from 'react-native';
import { formatCurrency } from '../../utils/help';
import { StyledMIcon } from '../../components/icon';
import MIcon from "react-native-vector-icons/MaterialIcons";
import { StyledToggleSwitch } from '../../components/toggleSwitch';
import { useQueryTaxByStatus } from '../../hooks/useTax';
import { useQueryDiscountByStatus } from '../../hooks/useDiscount';
import { useInsertOrder, } from '../../hooks/useOrder';
import CheckOutCompleted from './checkOutCompleted';

const CheckOut = () => {
    const navigator = useNavigation()
    const { getItems, getTotalPrice, shop, deleteItem, setDiscount, setTax, getTotal, getTotalDiscount, getTotalTax } = useAppContext()
    const { orderHandler, data, error, loading, resetHandler, printHandler, shareReceipt } = useInsertOrder()
    const [modalVisible, setModalVisible] = useState(false)
    const { data: taxes } = useQueryTaxByStatus(1)
    const { data: discounts } = useQueryDiscountByStatus(1)
    const [selectValue, setSelectValue ] = useState()   
    const items = getItems()      

    const RenderItem = ({ item }) => {
        return (
            <>
                <XStack justifyContent='space-between' paddingVertical={8} paddingHorizontal={16} alignItems='center'>
                    <YStack flex={1} backgroundColor={theme.colors.gray[1]}>
                        <StyledText color={theme.colors.gray[800]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal}>
                            {item.name}
                        </StyledText>
                    </YStack>
                    <StyledBadge
                        color={theme.colors.gray[800]}
                        backgroundColor={theme.colors.gray[1]}
                        fontWeight={theme.fontWeight.normal}
                        fontSize={theme.fontSize.normal}
                        paddingHorizontal={10}
                        paddingVertical={1}
                    >
                        {item.quantity}
                    </StyledBadge>
                    <StyledSpacer marginHorizontal={16} />
                    <StyledText color={theme.colors.gray[800]}
                        fontWeight={theme.fontWeight.normal}
                        fontSize={theme.fontSize.normal}>
                        {formatCurrency(shop?.currency || "£", (item?.price || 0))}
                    </StyledText>
                    <StyledSpacer marginHorizontal={4} />
                    <StyledMIcon size={30} name='cancel' color={theme.colors.gray[400]} onPress={() => deleteItem(item.id)} />
                </XStack>
                <StyledSeparator line lineProps={{
                    borderColor: theme.colors.gray[200]
                }} />
            </>
        )
    }

    const RenderDiscountCard = ({ item }) => {       
        return (
            <StyledCard pressable={true} pressableProps={{
                onPress: () => {
                    setDiscount(item.rate)
                    setSelectValue()
                }
            }} >
                <XStack flex={1} marginVertical={4} paddingHorizontal={8} paddingVertical={8} justifyContent='space-between' alignItems='center' borderWidth={1} backgroundColor={theme.colors.gray[1]} borderColor={theme.colors.gray[1]} borderRadius={16}>
                    <YStack paddingHorizontal={8} justifyContent='flex-start' alignItems='flex-start'>
                        <StyledText fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[600]} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal}>
                            {item.name}
                        </StyledText>
                    </YStack>
                    <XStack gap={2}>
                        <StyledSpacer marginHorizontal={16} />
                        <StyledBadge
                            color={theme.colors.gray[100]}
                            backgroundColor={theme.colors.gray[800]}
                            fontWeight={theme.fontWeight.normal}
                            fontSize={theme.fontSize.normal}
                            paddingHorizontal={10}
                            paddingVertical={1}
                        >
                            {item.rate} %
                        </StyledBadge>
                    </XStack>
                </XStack>
            </StyledCard>
        )
    }

    const RenderTaxCard = ({ item }) => {
        return (
            <StyledCard pressable={true} pressableProps={{
                onPress: () => {
                     setTax(item.rate) 
                    setSelectValue()
                }
            }} >
                <XStack flex={1} marginVertical={4} paddingHorizontal={8} paddingVertical={8} justifyContent='space-between' alignItems='center' borderWidth={1} backgroundColor={theme.colors.gray[1]} borderColor={theme.colors.gray[1]} borderRadius={16}>
                    <YStack paddingHorizontal={8} justifyContent='flex-start' alignItems='flex-start'>
                        <StyledText fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[800]} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal}>
                            {item.name}
                        </StyledText>
                    </YStack>
                    <XStack gap={2}>
                        <StyledSpacer marginHorizontal={16} />
                        <StyledBadge
                            color={theme.colors.gray[100]}
                            backgroundColor={theme.colors.gray[800]}
                            fontWeight={theme.fontWeight.bold}
                            fontSize={theme.fontSize.normal}
                            paddingHorizontal={10}
                            paddingVertical={1}
                        >
                            {item.rate} %
                        </StyledBadge>
                    </XStack>
                </XStack>
            </StyledCard>
        )
    }   

    return (
        <StyledSafeAreaView backgroundColor={theme.colors.gray[200]}>
            <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
                <StyledHeader.Header backgroundColor={theme.colors.gray[1]} onPress={() => navigator.goBack()} title='Checkout' icon cycleProps={{
                    borderColor: theme.colors.gray[300],
                    marginRight: 8
                }} rightIcon={
                    <>
                        <XStack flex={1} justifyContent='flex-end' alignItems='center' paddingHorizontal={8}>
                            <StyledSpacer marginHorizontal={4} />
                            <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]} >
                                <MIcon size={48} name='remove' color={theme.colors.gray[700]} onPress={() => {
                                    setSelectValue("discounts")                    
                                }} />
                            </StyledCycle>
                            <StyledSpacer marginHorizontal={4} />
                            <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]} >
                                <MIcon size={48} name='add' color={theme.colors.gray[700]} onPress={() => {                               
                                    setSelectValue("taxes")                                
                                }} />
                            </StyledCycle>
                        </XStack>
                    </>
                } />
            </StyledHeader>          
           
            <YStack flex={1} paddingHorizontal={12} paddingVertical={8} backgroundColor={theme.colors.gray[200]}>
                <StyledToggleSwitch />                
                <ScrollView showsVerticalScrollIndicator={false} >
                    {
                        selectValue === "discounts" && (
                            <YStack marginTop={8} >
                                <XStack justifyContent='center' alignItems='center'>
                                    <StyledText fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[800]} fontSize={theme.fontSize.large} fontWeight={theme.fontWeight.normal}>
                                        Discounts
                                    </StyledText>
                                </XStack>
                                <StyledSpacer marginVertical={4} />
                                {
                                    discounts?.map((item, index) => {
                                        return (
                                            <RenderDiscountCard key={index} item={item} />
                                        )
                                    })
                                }
                            </YStack>
                        )
                    }
                    {
                        selectValue === "taxes" && (
                            <YStack marginTop={8}  >
                                <XStack justifyContent='center' alignItems='center'>
                                    <StyledText fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[800]} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal}>
                                        Taxes
                                    </StyledText>
                                </XStack>
                                <StyledSpacer marginVertical={4} />
                                {
                                    taxes?.map((item, index) => {
                                        return (
                                            <RenderTaxCard key={index} item={item} />
                                        )
                                    })
                                }
                            </YStack>
                        )
                    }
                    <StyledSpacer marginVertical={4} />
                    <StyledCard shadow='light' borderColor={theme.colors.gray[200]} borderRadius={16} borderWidth={1} backgroundColor={theme.colors.gray[1]} paddingTop={8}>
                        {
                            (items || []).map((item, index) =>
                                <RenderItem item={item} key={index} />
                            )
                        }
                        <XStack justifyContent='flex-end' paddingVertical={8} paddingHorizontal={16} alignItems='center' backgroundColor={theme.colors.gray[100]}>
                            <YStack >
                                <StyledText color={theme.colors.gray[800]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.large}>
                                    Subtotal
                                </StyledText>
                            </YStack>
                            <StyledSpacer marginHorizontal={8} />
                            <StyledText color={theme.colors.gray[800]}
                                fontWeight={theme.fontWeight.normal}
                                fontSize={theme.fontSize.normal}>
                                {formatCurrency(shop.currency || "£", (getTotal() || 0))}
                            </StyledText>
                        </XStack>
                        <StyledSeparator line lineProps={{
                            borderColor: theme.colors.gray[200]
                        }} />
                        <XStack justifyContent='flex-end' paddingVertical={8} paddingHorizontal={16} alignItems='center' backgroundColor={theme.colors.gray[100]}>
                            <YStack >
                                <StyledText color={theme.colors.gray[400]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.large}>
                                    Discount
                                </StyledText>
                            </YStack>
                            <StyledSpacer marginHorizontal={8} />
                            <XStack justifyContent='flex-end' alignItems='center'>
                                <StyledText color={theme.colors.gray[800]}
                                    fontWeight={theme.fontWeight.normal}
                                    fontSize={theme.fontSize.normal}>
                                    {formatCurrency(shop.currency || "£", (getTotalDiscount() || 0))}
                                </StyledText>
                                <StyledSpacer marginHorizontal={4} />
                                <StyledMIcon size={30} name='cancel' color={theme.colors.gray[400]} onPress={() => setDiscount(0)} />
                            </XStack>
                        </XStack>
                        <StyledSeparator line lineProps={{
                            borderColor: theme.colors.gray[200]
                        }} />
                        <XStack justifyContent='flex-end' paddingVertical={8} paddingHorizontal={16} alignItems='center' backgroundColor={theme.colors.gray[100]}>
                            <YStack >
                                <StyledText color={theme.colors.gray[400]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.large}>
                                    Tax
                                </StyledText>
                            </YStack>
                            <StyledSpacer marginHorizontal={8} />
                            <XStack justifyContent='flex-end' alignItems='center'>
                                <StyledText color={theme.colors.gray[800]}
                                    fontWeight={theme.fontWeight.normal}
                                    fontSize={theme.fontSize.normal}>
                                    {formatCurrency(shop.currency || "£", (getTotalTax() || 0))}
                                </StyledText>
                                <StyledSpacer marginHorizontal={4} />
                                <StyledMIcon size={30} name='cancel' color={theme.colors.gray[400]} onPress={() => setTax(0)} />
                            </XStack>
                        </XStack>
                        <StyledSeparator line lineProps={{
                            borderColor: theme.colors.gray[200]
                        }} />
                        <XStack justifyContent='flex-end' paddingVertical={8} paddingHorizontal={16} alignItems='center' backgroundColor={theme.colors.gray[100]}>
                            <YStack >
                                <StyledText color={theme.colors.gray[800]} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.large}>
                                    Total
                                </StyledText>
                            </YStack>
                            <StyledSpacer marginHorizontal={8} />
                            <StyledText color={theme.colors.gray[800]}
                                fontWeight={theme.fontWeight.bold}
                                fontSize={theme.fontSize.large}>
                                {formatCurrency(shop.currency || "£", (getTotalPrice() || 0))}
                            </StyledText>
                        </XStack>
                    </StyledCard>
                </ScrollView>
            </YStack>
            {
                items.length > 0 && (
                    <XStack absolute paddingVertical={8} marginBottom={8} paddingHorizontal={8}>
                        <StyledButton flex={2} borderRadius={32} borderColor={theme.colors.cyan[500]} backgroundColor={theme.colors.cyan[500]} onPress={() => orderHandler().then((result) => result && setModalVisible(true))} >
                            <StyledText paddingHorizontal={16} paddingVertical={16} fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.bold} color={theme.colors.gray[100]} >Confirm Payment</StyledText>
                        </StyledButton>
                    </XStack >
                )
            }           
            {
                modalVisible &&
                <StyledDialog visible>
                    <CheckOutCompleted order={data} printHandler={printHandler} shareReceipt={shareReceipt} />
                </StyledDialog>
            }
            {
                (error) && (
                    <StyledOkDialog title={error?.message} description='please try again' visible={true} onOk={() => {
                        resetHandler()
                    }} />
                )
            }
            {
                (loading) && (
                    <StyledSpinner />
                )
            }
        </StyledSafeAreaView>
    )
}

export default CheckOut