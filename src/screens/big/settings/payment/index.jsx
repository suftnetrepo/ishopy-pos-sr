import React, { useState, useEffect } from 'react';
import {
    StyledSafeAreaView,
    StyledHeader,
    StyledCycle,
    StyledSpinner,
    StyledOkDialog,
    StyledSpacer
} from 'fluent-styles';
import { Stack } from '../../../../components/package/stack';
import { theme } from '../../../../utils/theme';
import SideBarAdapter from '../../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../../components/tablet/header';
import { StyledIcon } from '../../../../components/package/icon';
import { Pressable } from 'react-native';
import PaymentCard from './card';
import OrderDateFilter from '../../order/orderDateFilter';
import { usePayments } from '../../../../hooks/usePayment';
import { useAppContext } from '../../../../hooks/appContext';
import { convertDateFilter } from '../../../../utils/help';

const BigPayment = () => {
    const [showCalendar, setCalendarShow] = useState(false);
    const { date_filter, updateDateFilter } = useAppContext()
    const { data, error, loading, resetHandler, loadPaymentsByDateRange, loadPayment } = usePayments()
    const hasActiveFilter = date_filter?.startDate && date_filter?.endDate;

    useEffect(() => {
        if (date_filter?.startDate && date_filter?.endDate) {
            try {
                const { startDate, endDate } = convertDateFilter(date_filter.startDate, date_filter.endDate);
                loadPaymentsByDateRange(startDate, endDate);
            } catch (error) {
                if (__DEV__)
                    console.error("Error parsing dates:", error);
            }
        }
    }, [date_filter?.startDate, date_filter?.endDate])

    const handleClearDateFilter = async () => {
        try {
            await loadPayment();
            updateDateFilter({ startDate: '', endDate: '' });
        } catch (error) {
            if (__DEV__)
                console.error("Error clearing date filter:", error);
        }
    }

    return (
        <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
            <StyledHeader borderRadius={30} statusProps={{ translucent: true, hidden: false }}>
                <StyledHeader.Full>
                    <RenderHeader
                        showBackButton={true}
                        showLogo={false}
                        showTitle={true}
                        title='Payments'
                        CopyIcon={
                            <>
                                {
                                    hasActiveFilter && (
                                        <Pressable onTouchStart={() => handleClearDateFilter()}>
                                            <StyledCycle width={48} height={48} borderWidth={1} backgroundColor={theme.colors.gray[50]} borderColor={theme.colors.gray[400]}>
                                                <StyledIcon size={24} name={'close'} color={theme.colors.gray[800]} />
                                            </StyledCycle>
                                        </Pressable>
                                    )
                                }

                                <StyledSpacer marginHorizontal={4} />
                                <Pressable onTouchStart={() => setCalendarShow(true)}>
                                    <StyledCycle width={48} height={48} borderWidth={1} backgroundColor={theme.colors.yellow[500]} borderColor={theme.colors.yellow[500]}>
                                        <StyledIcon size={24} name={'filter-list'} color={theme.colors.gray[800]} />
                                    </StyledCycle>
                                </Pressable>
                            </>

                        }
                    />
                </StyledHeader.Full>
            </StyledHeader>
            <Stack flex={1.5} horizonal>
                <SideBarAdapter selectedMenu={5} showMenu={false} collapse={true} />
                <Stack flex={3} gap={8} marginHorizontal={16} vertical>
                    <PaymentCard data={data} />
                </Stack>
            </Stack>
            {
                showCalendar && (
                    <OrderDateFilter visible={!!showCalendar} setVisible={setCalendarShow} />
                )
            }
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
        </StyledSafeAreaView>
    );
};

export default BigPayment;