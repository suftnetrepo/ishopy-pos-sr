import React, { useState } from 'react';
import {
  StyledSafeAreaView,
  StyledHeader,
  StyledSpacer,
  StyledDialog,
} from 'fluent-styles';
import { Stack } from '../../../components/package/stack';
import { theme } from '../../../utils/theme';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import MenuCategory from '../../../components/tablet/cards/category';
import ItemCard from '../../../components/tablet/cards/menu';
import Cart from '../../../components/tablet/cart';
import { StyledSearchBar } from '../../../components/searchBar';
import { useAppContext } from '../../../hooks/appContext';
import AddOn from '../../../components/tablet/cards/menu/addOn';

const BigMenu = () => {
  const { updateMenuQuery } = useAppContext();
    const [item, setItem] = useState(null)

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
      <StyledHeader borderRadius={30} statusProps={{ translucent: true }}>
        <StyledHeader.Full>
          <RenderHeader showBackButton={true} showLogo={false} showTitle={true} title='Table Menus' >
            <StyledSearchBar placeholder="Search menu items..." flex={1} onTextChange={(query) => updateMenuQuery(query)} />
          </RenderHeader>
        </StyledHeader.Full>
      </StyledHeader>
      <Stack flex={1.5} horizonal>
        <SideBarAdapter collapse={true} />
        <Stack flex={2.5} paddingHorizontal={8} vertical >
          <MenuCategory />
          <StyledSpacer marginVertical={4} />
          <ItemCard onChangeItem={(item)=> setItem(item)} />
        </Stack>
        <Stack flex={1.1} gap={16} vertical marginRight={16}>
          <Cart />
        </Stack>
      </Stack>
      {item &&
        <StyledDialog visible>
          <AddOn item={item} setItem={setItem} onClose={()=> setItem(null)} />
        </StyledDialog>}
    </StyledSafeAreaView>
  );
};

export default BigMenu;
