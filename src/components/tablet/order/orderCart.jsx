
import React from 'react';
import { YStack, XStack, StyledSpacer, StyledText, StyledCard, StyledSeparator, StyledBadge } from 'fluent-styles';
import { StyledMIcon } from '../../../components/icon';
import { fontStyles, theme } from '../../../configs/theme';
import { useAppContext } from '../../../hooks/appContext';
import { useQueryOrderItemByOrder } from '../../../hooks/useOrderItems';
import { formatCurrency, colorCodeStatus, getLastChars } from '../../../utils/help';
import { ScrollView } from 'react-native';
import { Stack } from '../../../components/package/stack';

const OrderCart = ({ onClose }) => {
    const { shop, order } = useAppContext()
    const { data } = useQueryOrderItemByOrder(order?.order_id)

    const Card = ({ order }) => {
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        };

        return (
            <Stack
                width={'100%'}
                backgroundColor={theme.colors.gray[1]}
                borderRadius={8}
                paddingHorizontal={16}
                paddingVertical={16}
                shadowColor="black"
                shadowOffset={{ width: 0, height: 1 }}
                shadowOpacity={0.1}
                shadowRadius={2}
                elevation={3}
                borderWidth={1}
                borderColor={theme.colors.gray[800]}
                status={colorCodeStatus(order?.status)}
                vertical
            >
                <Stack marginBottom={2} horizonal  justifyContent="space-between" alignItems="center">
                    <Stack gap={4} horizonal alignItems="center">
                        <StyledText color={theme.colors.gray[800]} fontSize={theme.fontSize.normal}>{order?.table_name}</StyledText>
                    </Stack>
                    <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.normal} color={theme.colors.gray[700]}>
                        #{getLastChars(order?.order_id, 3)}
                    </StyledText>
                </Stack>

                <Stack vertical >
                    <Stack gap={4} horizonal alignItems="center">
                        <StyledMIcon name="access-time" size={18} color={theme.colors.gray[600]} />
                        <StyledText color={theme.colors.gray[600]} fontSize={theme.fontSize.small}>{formatDate(order?.date)}</StyledText>
                    </Stack>
                </Stack>
            </Stack>
        );
    };

    const RenderAddOn = ({ addOn }) => {
        return (
            <>
                <XStack flex={1} justifyContent='space-between' paddingVertical={8} paddingHorizontal={16} alignItems='center' backgroundColor={theme.colors.gray[1]}>
                    <StyledText flex={2.5} color={theme.colors.gray[800]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal}>
                            {addOn.addOnName}
                        </StyledText>
                    <StyledBadge
                        color={theme.colors.gray[800]}
                        backgroundColor={theme.colors.gray[1]}
                        fontWeight={theme.fontWeight.normal}
                        fontSize={theme.fontSize.normal}
                        paddingHorizontal={10}
                        paddingVertical={1}
                         flex={0.5}
                    >
                        {addOn.quantity}
                    </StyledBadge>
                   
                    <StyledText textAlign={'right'}    flex={1} color={theme.colors.gray[800]}
                        fontWeight={theme.fontWeight.normal}
                        fontSize={theme.fontSize.normal}>
                        {formatCurrency(shop?.currency || "£", (addOn?.price || 0))}
                    </StyledText>
                   
                </XStack>
                <StyledSeparator line lineProps={{
                    borderColor: theme.colors.gray[200]
                }} />
            </>
        )
    }
    const RenderItem = ({ item }) => {
        return (
            <>
                <XStack backgroundColor={theme.colors.blueGray[100]} borderColor={theme.colors.blueGray[100]} justifyContent='space-between' paddingVertical={8} paddingHorizontal={16} alignItems='center'>
                    <StyledText flex={2.5} color={theme.colors.gray[800]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal}>
                            {item.menu_name}
                    </StyledText>
                    <StyledBadge
                        color={theme.colors.gray[800]}
                        backgroundColor={theme.colors.blueGray[100]}
                        fontWeight={theme.fontWeight.normal}
                        fontSize={theme.fontSize.normal}
                        paddingHorizontal={10}
                        paddingVertical={1}
                        flex={0.5}
                    >
                        {item.quantity}
                    </StyledBadge>
                    <StyledText textAlign={'right'}    flex={1} color={theme.colors.gray[800]}
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
            <StyledCard shadow='dark' borderColor={theme.colors.gray[200]} borderRadius={8} borderWidth={1} backgroundColor={theme.colors.gray[1]} >
                {
                    (data || []).map((item, index) => (
                        <React.Fragment key={index}>
                            <RenderItem item={item} />
                            <StyledSeparator line lineProps={{
                                borderColor: theme.colors.gray[200]
                            }} />
                            {(item?.addOns ? JSON.parse(item.addOns) : []).map((addOn, addOnIndex) => (
                                <RenderAddOn
                                    addOn={addOn}
                                    key={`${index}-${addOnIndex}`}
                                />
                            ))}
                        </React.Fragment>
                    )
                    )
                }

            </StyledCard>
        )
    }

    return (
        <YStack flex={1} marginTop={0} borderRadius={8} justifyContent='flex-start' alignItems='flex-start' backgroundColor={theme.colors.gray[50]} paddingHorizontal={16} paddingVertical={8}>
            <StyledSpacer marginVertical={16} />
            <XStack justifyContent='space-between' alignItems='center' >
                <StyledSpacer flex={1}></StyledSpacer>
                 <StyledMIcon
                    name="print"
                    size={48}
                    color={theme.colors.gray[800]}
                    onPress={() => onClose()}
                />
                <StyledMIcon
                    name="cancel"
                    size={48}
                    color={theme.colors.gray[800]}
                    onPress={() => onClose()}
                />
               
            </XStack>
            <StyledSpacer marginVertical={8} />
            <Card order={order} />
            <StyledSpacer marginVertical={4} />
            <XStack flex={1} >
                <ScrollView  showsVerticalScrollIndicator={false} >
                    <RenderOrderItems />
                </ScrollView>
            </XStack>
            <YStack flex={1} width={'100%'}>
                <XStack justifyContent='flex-end' paddingVertical={8} paddingHorizontal={16} alignItems='center' backgroundColor={theme.colors.gray[100]}>
                    <YStack >
                        <StyledText color={theme.colors.gray[800]} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.normal}>
                            Subtotal
                        </StyledText>
                    </YStack>
                    <StyledSpacer marginHorizontal={8} />
                    <StyledText color={theme.colors.gray[800]}
                        fontWeight={theme.fontWeight.normal}
                        fontSize={theme.fontSize.normal}>
                        {formatCurrency(shop?.currency || "£", (order?.total || 0))}
                    </StyledText>
                </XStack>
                <StyledSeparator line lineProps={{
                    borderColor: theme.colors.gray[200]
                }} />
                <XStack justifyContent='flex-end' paddingVertical={8} paddingHorizontal={16} alignItems='center' backgroundColor={theme.colors.gray[100]}>
                    <YStack >
                        <StyledText color={theme.colors.gray[800]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal}>
                            Discount
                        </StyledText>
                    </YStack>
                    <StyledSpacer marginHorizontal={8} />
                    <XStack justifyContent='flex-end' alignItems='center'>
                        <StyledText color={theme.colors.gray[800]}
                            fontWeight={theme.fontWeight.normal}
                            fontSize={theme.fontSize.normal}>
                            {formatCurrency(shop?.currency || "£", (order?.discount || 0))}
                        </StyledText>
                    </XStack>
                </XStack>
                <StyledSeparator line lineProps={{
                    borderColor: theme.colors.gray[100]
                }} />
                <XStack justifyContent='flex-end' paddingVertical={8} paddingHorizontal={16} alignItems='center' backgroundColor={theme.colors.gray[100]}>
                    <YStack >
                        <StyledText color={theme.colors.gray[800]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal}>
                            Tax
                        </StyledText>
                    </YStack>
                    <StyledSpacer marginHorizontal={8} />
                    <XStack justifyContent='flex-end' alignItems='center'>
                        <StyledText color={theme.colors.gray[800]}
                            fontWeight={theme.fontWeight.normal}
                            fontSize={theme.fontSize.normal}>
                            {formatCurrency(shop?.currency || "£", (order?.tax || 0))}
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
                        {formatCurrency(shop?.currency || "£", (order?.total_price || 0))}
                    </StyledText>
                </XStack>
            </YStack>
        </YStack>
    )
}

export default OrderCart