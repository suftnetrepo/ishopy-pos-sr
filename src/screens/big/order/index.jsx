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

const BigOrder = () => {
    const { updateMenuQuery } = useAppContext();
    const [show, setShow] = useState(false);

    return (
        <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
            <StyledHeader borderRadius={30} statusProps={{ translucent: true }}>
                <StyledHeader.Full>
                    <RenderHeader showBackButton={true} showLogo={false} showTitle={true} title='Order' >
                        <StyledSearchBar placeholder="Search orders..." flex={1} onTextChange={(query) => updateMenuQuery(query)} />
                    </RenderHeader>
                </StyledHeader.Full>
            </StyledHeader>
            <Stack flex={1.5} horizonal>
                <SideBarAdapter selectedMenu={4} showMenu={true} collapse={true} />
                <Stack flex={3} paddingHorizontal={8} vertical >
                    <OrderCard onOrderChange={() => setShow(true)} />
                </Stack>
            </Stack>
            <Drawer
                direction="right"
                isOpen={show}
                onClose={() => setShow(false)}
            >
                <OrderCart onClose={()=> setShow(false)} />
            </Drawer>
        </StyledSafeAreaView>
    );
};

export default BigOrder;
