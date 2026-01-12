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
import { useRoute } from '@react-navigation/native';

const BigMenu = () => {
  const { updateMenuQuery, shop } = useAppContext();
  const [item, setItem] = useState(null)
  const route = useRoute();
  const params  = route.params;

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
      <StyledHeader borderRadius={30} statusProps={{ translucent: true }}>
        <StyledHeader.Full>
          <RenderHeader showBackButton={true} showLogo={false} showTitle={true} title={`${params?.table_name || "Items"}`} >
            <StyledSearchBar placeholder="Search menu items..." flex={1} onTextChange={(query) => updateMenuQuery(query)} />
          </RenderHeader>
        </StyledHeader.Full>
      </StyledHeader>
      <Stack flex={1.5} horizonal>
        <SideBarAdapter selectedMenu={3} showMenu={shop.mode ==="restaurant" ? '3' : ''} collapse={true} />
        <Stack flex={2.5} paddingHorizontal={8} vertical >
          <MenuCategory />
          <StyledSpacer marginVertical={4} />
          <ItemCard table_id={params?.table_id || shop?.table_id} onChangeItem={(item) => setItem(item)} />
        </Stack>
        <Stack flex={1.1} gap={16} vertical marginRight={16}>
          <Cart table_name={params?.table_name || "Shop"} table_id={params?.table_id || shop?.table_id} />
        </Stack>
      </Stack>
      {item &&
        <StyledDialog visible>
          <AddOn table_id={params?.table_id || shop?.table_id} item={item} setItem={setItem} onClose={() => setItem(null)} />
        </StyledDialog>}
    </StyledSafeAreaView>
  );
};

export default BigMenu;
