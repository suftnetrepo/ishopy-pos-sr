/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import { YStack, XStack, StyledSpacer, StyledText, StyledCard, StyledSeparator, StyledBadge } from 'fluent-styles';
import { StyledMIcon } from '../../components/icon';
import { fontStyles, theme } from '../../configs/theme';
import { useAppContext } from '../../hooks/appContext';
import { useQueryOrderItemByOrder } from '../../hooks/useOrderItems';
import { formatCurrency, formatDateTime, toWordCase } from '../../utils/help';
import { ScrollView } from 'react-native';

const CompletedOrder = ({ order, setModal }) => {
    const { shop } = useAppContext()
    const { data } = useQueryOrderItemByOrder(order.order_id)
 
    const close = () => {
        setModal((pre) => {
            return {
                ...pre,
                visible: false,
                order: null
            }
        })
    }

    const RenderOrder = () => {
        return (
            <XStack paddingHorizontal={8} backgroundColor={theme.colors.gray[1]} borderColor={theme.colors.gray[200]}
                paddingVertical={8} justifyContent='space-between' borderWidth={1} borderRadius={8} alignItems='center' >
                <YStack justifyContent='flex-start' alignItems='flex-start'>
                    <XStack justifyContent='flex-start' alignItems='center'>
                        <StyledMIcon size={16} name='shopping-bag' color={theme.colors.gray[600]} />
                        <StyledText
                            fontWeight={theme.fontWeight.normal}
                            fontSize={theme.fontSize.normal}
                            paddingHorizontal={4}
                            paddingVertical={1}
                            fontFamily={fontStyles.FontAwesome5_Regular}
                        >
                            {order.order_id.slice(0, 8)}
                        </StyledText>
                    </XStack>
                    <StyledSpacer marginVertical={1} />
                    <XStack justifyContent='flex-start' alignItems='center'>
                        <StyledMIcon size={16} name='date-range' color={theme.colors.gray[600]} />
                        <StyledText
                            fontWeight={theme.fontWeight.normal}
                            fontSize={theme.fontSize.small}
                            paddingHorizontal={4}
                            paddingVertical={1}
                        >
                            {formatDateTime(order.date.toISOString())}
                        </StyledText>
                    </XStack>
                </YStack>
                <XStack flex={1} justifyContent='flex-end' alignItems='center'>
                    <StyledBadge
                        color={theme.colors.green[800]}
                        backgroundColor={theme.colors.green[50]}
                        fontWeight={theme.fontWeight.bold}
                        fontSize={theme.fontSize.small}
                        paddingHorizontal={16}
                        paddingVertical={4}
                        fontFamily={fontStyles.FontAwesome5_Regular}>{toWordCase(order.status)}</StyledBadge>

                </XStack>
            </XStack>
        )
    }

    const RenderItem = ({ item }) => {
        return (
            <>
                <XStack justifyContent='space-between' paddingVertical={8} paddingHorizontal={16} alignItems='center'>
                    <StyledText color={theme.colors.gray[800]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal}>
                        {item.product_name}
                    </StyledText>
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
                </XStack>
                <StyledSeparator line lineProps={{
                    borderColor: theme.colors.gray[200]
                }} />
            </>
        )
    }
    const RenderOrderItems = () => {
        return (
            <StyledCard width={'100%'} shadow='light' borderColor={theme.colors.gray[200]} borderRadius={8} borderWidth={1} backgroundColor={theme.colors.gray[1]} paddingTop={8}>
                {
                    (data || []).map((item, index) =>
                        <RenderItem item={item} key={index} />
                    )
                }                

            </StyledCard>
        )
    }

    return (
        <YStack justifyContent='center' alignItems='center' flex={1} transparent>
            <YStack  borderRadius={8} justifyContent='flex-start' alignItems='flex-start' width='90%' backgroundColor={theme.colors.gray[1]} paddingHorizontal={16} paddingVertical={8}>
                <XStack justifyContent='flex-end' alignItems='center' >
                    <StyledSpacer flex={1}></StyledSpacer>
                    <StyledMIcon
                        name="cancel"
                        size={48}
                        color={theme.colors.gray[600]}
                        onPress={() => close()}
                    />
                </XStack>
                <StyledSpacer marginVertical={4} />
                <RenderOrder />
                <StyledSpacer marginVertical={4} />
                <YStack width={'100%'} height={'30%'}>
                    <ScrollView showsVerticalScrollIndicator={false} >
                        <RenderOrderItems />
                    </ScrollView>
                </YStack>
                <YStack width={'100%'}>
                    <XStack justifyContent='flex-end' paddingVertical={8} paddingHorizontal={16} alignItems='center' backgroundColor={theme.colors.gray[100]}>
                        <YStack >
                            <StyledText color={theme.colors.gray[800]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal}>
                                Subtotal
                            </StyledText>
                        </YStack>
                        <StyledSpacer marginHorizontal={8} />
                        <StyledText color={theme.colors.gray[800]}
                            fontWeight={theme.fontWeight.normal}
                            fontSize={theme.fontSize.normal}>
                            {formatCurrency(shop.currency || "£", (order.total || 0))}
                        </StyledText>
                    </XStack>
                    <StyledSeparator line lineProps={{
                        borderColor: theme.colors.gray[200]
                    }} />
                    <XStack justifyContent='flex-end' paddingVertical={8} paddingHorizontal={16} alignItems='center' backgroundColor={theme.colors.gray[100]}>
                        <YStack >
                            <StyledText color={theme.colors.gray[400]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal}>
                                Discount
                            </StyledText>
                        </YStack>
                        <StyledSpacer marginHorizontal={8} />
                        <XStack justifyContent='flex-end' alignItems='center'>
                            <StyledText color={theme.colors.gray[800]}
                                fontWeight={theme.fontWeight.normal}
                                fontSize={theme.fontSize.normal}>
                                {formatCurrency(shop.currency || "£", (order?.discount || 0))}
                            </StyledText>
                        </XStack>
                    </XStack>
                    <StyledSeparator line lineProps={{
                        borderColor: theme.colors.gray[200]
                    }} />
                    <XStack justifyContent='flex-end' paddingVertical={8} paddingHorizontal={16} alignItems='center' backgroundColor={theme.colors.gray[100]}>
                        <YStack >
                            <StyledText color={theme.colors.gray[400]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal}>
                                Tax
                            </StyledText>
                        </YStack>
                        <StyledSpacer marginHorizontal={8} />
                        <XStack justifyContent='flex-end' alignItems='center'>
                            <StyledText color={theme.colors.gray[800]}
                                fontWeight={theme.fontWeight.normal}
                                fontSize={theme.fontSize.normal}>
                                {formatCurrency(shop.currency || "£", (order?.tax || 0))}
                            </StyledText>
                        </XStack>
                    </XStack>
                    <StyledSeparator line lineProps={{
                        borderColor: theme.colors.gray[200]
                    }} />
                    <XStack justifyContent='flex-end' paddingVertical={8} paddingHorizontal={16} alignItems='center' backgroundColor={theme.colors.gray[1]}>
                        <YStack >
                            <StyledText color={theme.colors.gray[800]} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.large}>
                                Total
                            </StyledText>
                        </YStack>
                        <StyledSpacer marginHorizontal={8} />
                        <StyledText color={theme.colors.gray[800]}
                            fontWeight={theme.fontWeight.bold}
                            fontSize={theme.fontSize.large}>
                            {formatCurrency(shop.currency || "£", (order?.total_price || 0))}
                        </StyledText>
                    </XStack>
                </YStack>                
            </YStack>
        </YStack>
    )
}

export default CompletedOrder