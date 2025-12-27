import React, { useState } from 'react';
import {
    StyledSafeAreaView,
    StyledHeader,
} from 'fluent-styles';
import { Stack } from '../../../components/package/stack';
import { theme } from '../../../utils/theme';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import { StyledSearchBar } from '../../../components/searchBar';
import { useAppContext } from '../../../hooks/appContext';
import OrderCard from '../../../components/tablet/order';
import Drawer from '../../../components/package/drawer';
import OrderCart from '../../../components/tablet/order/orderCart';
import OrderDateFilter from './orderDateFilter';

const BigOrder = () => {
    const { updateMenuQuery } = useAppContext();
    const [show, setShow] = useState(null);
    const [showCalendar, setCalendarShow] = useState(null);

    return (
        <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
            <StyledHeader borderRadius={30} statusProps={{ translucent: true, hidden: false }}>
                <StyledHeader.Full>
                    <RenderHeader showBackButton={true} showLogo={false} showTitle={true} title='Order' >
                        <StyledSearchBar placeholder="Search orders..." flex={1} onTextChange={(query) => updateMenuQuery(query)} />
                    </RenderHeader>
                </StyledHeader.Full>
            </StyledHeader>
            <Stack flex={1.5} horizonal>
                <SideBarAdapter selectedMenu={4} showMenu={false} collapse={true} />
                <Stack flex={3} paddingHorizontal={8} vertical >
                    <OrderCard onOrderChange={(j) => setShow(j)} onHandleFilter={(i) => setCalendarShow(i)} />
                </Stack>
            </Stack>
            <Drawer
                direction="right"
                isOpen={!!show}
                onClose={() => setShow(null)}
            >
                <OrderCart onClose={() => setShow(null)} />
            </Drawer>
            {
                showCalendar && (
                    <OrderDateFilter visible={!!showCalendar} setVisible={setCalendarShow} />
                )
            }

        </StyledSafeAreaView>
    );
};

export default BigOrder;
