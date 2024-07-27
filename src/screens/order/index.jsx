/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { YStack, XStack, StyledSafeAreaView, StyledText, StyledButton, StyledInput, StyledDialog, StyledCycle, StyledBadge, StyledHeader, StyledSpinner, StyledOkDialog, StyledSpacer } from 'fluent-styles';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fontStyles, theme } from '../../configs/theme';
import { useOrders } from '../../hooks/useOrder';
import { FlatList } from 'react-native';
import { dateConverter, formatCurrency, formatDateTime } from '../../utils/help';
import { StyledMIcon } from '../../components/icon';
import { useAppContext } from '../../hooks/appContext';
import CompletedOrder from './order';
import { convertJsonToCsv } from '../../utils/convertJsonToCsv';

const Order = () => {
    const navigator = useNavigation()
    const { shop } = useAppContext()
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const { data, error, loading, resetHandler, loadOrdersByDateRange } = useOrders(showFilter)
    const [modal, setModal] = useState({
        visible: false,
        order: null
    })
   
    const handleStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartPicker(false);
        setStartDate(currentDate);
    };

    const handleEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndPicker(false);
        setEndDate(currentDate);
    };

    const handleFilter=async ()=>{
        setShowFilter(!showFilter)       
    }

    const RenderCard = ({ item }) => {
        return (
            <XStack paddingHorizontal={8} backgroundColor={theme.colors.gray[1]}
                paddingVertical={8} justifyContent='flex-start' marginBottom={8} borderRadius={16} alignItems='center' >
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
                            {item.order_id.slice(0, 8)}
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
                            {formatDateTime(item.date.toISOString())}
                        </StyledText>
                    </XStack>

                </YStack>
                <XStack flex={1} justifyContent='flex-end' alignItems='center'>
                    <StyledBadge
                        color={theme.colors.gray[800]}
                        backgroundColor={theme.colors.gray[50]}
                        fontWeight={theme.fontWeight.bold}
                        fontSize={theme.fontSize.normal}
                        paddingHorizontal={8}
                        paddingVertical={4}
                        fontFamily={fontStyles.FontAwesome5_Regular}>{formatCurrency(shop.currency || "£", item.total_price)}</StyledBadge>
                    <StyledSpacer marginHorizontal={4} />
                    <StyledMIcon size={32} name='view-list' color={theme.colors.gray[400]} onPress={() => {
                        setModal((pre) => {
                            return {
                                ...pre,
                                visible: true,
                                order: item
                            }
                        })
                    }
                    } />
                </XStack>
            </XStack>
        )
    }

    const RenderDatePicker = () => {
        return (
            <XStack paddingHorizontal={4} borderRadius={16} justifyContent='flex-start' alignItems='center' marginHorizontal={8} backgroundColor={theme.colors.gray[200]}>
                <XStack flex={1} justifyContent='flex-start' alignItems='center'>
                    <StyledInput fontSize={theme.fontSize.micro}
                        borderColor={theme.colors.yellow[800]}
                        backgroundColor={theme.colors.gray[1]} borderRadius={8} value={dateConverter(startDate.toISOString())} flex={1} />
                    <StyledMIcon size={44} name='date-range' color={theme.colors.gray[800]} onPress={() => { setShowStartPicker(true) }} />
                </XStack>
                <StyledSpacer marginHorizontal={1} />
                <XStack flex={1} justifyContent='flex-start' alignItems='center'>
                    <StyledInput fontSize={theme.fontSize.micro}
                        borderColor={theme.colors.yellow[800]}
                        backgroundColor={theme.colors.gray[1]} borderRadius={8} value={dateConverter(endDate.toISOString())} flex={1} />
                    <StyledMIcon size={44} name='date-range' color={theme.colors.gray[800]} onPress={() => { setShowEndPicker(true) }} />
                </XStack>
                <StyledSpacer marginHorizontal={1} />
                <StyledButton backgroundColor={theme.colors.cyan[500]} onPress={() => loadOrdersByDateRange(startDate, endDate)} >
                    <StyledText color={theme.colors.gray[1]} fontWeight={theme.fontWeight.normal}
                        fontSize={theme.fontSize.normal}
                        paddingHorizontal={16}
                        paddingVertical={16}
                        fontFamily={fontStyles.FontAwesome5_Regular}>
                        Go
                    </StyledText>
                </StyledButton>
                {showStartPicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={handleStartDateChange}
                    />
                )}
                {showEndPicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={handleEndDateChange}
                    />
                )}
            </XStack>
        )
    }

    return (
        <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
            <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
                <StyledHeader.Header backgroundColor={theme.colors.gray[1]} onPress={() => navigator.navigate("bottom-tabs", { screen: 'Home' })} title='Orders' icon cycleProps={{
                    borderColor: theme.colors.gray[300],
                    marginRight: 8
                }} rightIcon={
                    <XStack flex={1} justifyContent='flex-end' alignItems='center' paddingHorizontal={8}>
                        <StyledSpacer marginHorizontal={4} />
                        <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]} >
                            <StyledMIcon size={32} name={showFilter ? "cancel" : 'filter-list'} color={theme.colors.gray[800]} onPress={() => handleFilter()} />
                        </StyledCycle>
                        <StyledSpacer marginHorizontal={4} />
                        <StyledCycle borderWidth={1} borderColor={theme.colors.gray[500]} backgroundColor={theme.colors.gray[1]}>
                            <StyledMIcon size={24} name='share' color={theme.colors.gray[800]} onPress={async () => data?.length && await convertJsonToCsv(data)} />
                        </StyledCycle>
                    </XStack>
                } />
            </StyledHeader>
            {
                showFilter && (
                    <>
                        <StyledSpacer marginVertical={4} />
                        <RenderDatePicker />
                    </>
                )
            }
            <StyledSpacer marginVertical={4} />
            <YStack flex={1} paddingHorizontal={8} backgroundColor={theme.colors.gray[100]}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.order_id}
                    initialNumToRender={100}
                    renderItem={({ item, index }) => <RenderCard key={index} item={item} />}
                    showsVerticalScrollIndicator={false}
                    numColumns={1}
                    extraData={data}
                />
                {
                    (loading) && (
                        <StyledSpinner />
                    )
                }
                {
                    (error) && (
                        <StyledOkDialog title={error?.message} description='please try again' visible={true} onOk={() => {
                            resetHandler()
                        }} />
                    )
                }
                {
                    modal.visible &&
                    <StyledDialog visible>
                        <CompletedOrder order={modal?.order} setModal={setModal} />
                    </StyledDialog>
                }
            </YStack>
        </StyledSafeAreaView>
    );
}

export default Order;
