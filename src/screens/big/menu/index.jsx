import React from 'react';
import {
  StyledSafeAreaView,
  StyledHeader,
  StyledSpacer,
} from 'fluent-styles';
import { Stack } from '../../../components/package/stack';
import { theme } from '../../../utils/theme';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import MenuCategory from '../../../components/tablet/cards/category';
import ItemCard from '../../../components/tablet/cards/menu';
import Cart from '../../../components/tablet/cart';
import {StyledSearchBar} from '../../../components/searchBar';
import { useAppContext } from '../../../hooks/appContext';

const BigMenu = () => {
 const { updateMenuQuery } = useAppContext();
  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
      <StyledHeader borderRadius={30} statusProps={{ translucent: true }}>
        <StyledHeader.Full>
          <RenderHeader showBackButton={true} showLogo={false} showTitle={true} title='Table Menus' >
             <StyledSearchBar placeholder="Search menu items..." flex={1} onTextChange={(query)=> updateMenuQuery(query)} />
          </RenderHeader>
        </StyledHeader.Full>
      </StyledHeader>
      <Stack flex={1.5} horizonal>
        <SideBarAdapter collapse={true} />
        <Stack flex={2.5} paddingHorizontal={8} vertical >
          <MenuCategory />
          <StyledSpacer marginVertical={4} />
          <ItemCard />
        </Stack>
        <Stack flex={1.1} gap={16} vertical marginRight={16}>
          <Cart />
        </Stack>
      </Stack>
    </StyledSafeAreaView>
  );
};

export default BigMenu;
