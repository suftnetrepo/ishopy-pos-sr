import React, { useEffect, useState } from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import {
  StyledPage,
  StyledSpacer,
  StyledDialog,
  StyleShape,
  Stack,
  theme
} from 'fluent-styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SideBarAdapter from '../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../components/tablet/header';
import MenuCategory from '../../components/tablet/cards/category';
import ItemCard from '../../components/tablet/cards/menu';
import Cart from '../../components/tablet/cart';
import { StyledSearchBar } from '../../components/searchBar';
import { useAppContext } from '../../hooks/appContext';
import AddOn from '../../components/tablet/cards/menu/addOn';
import { useRoute } from '@react-navigation/native';
import {useAppTheme} from '../../theme';
import {useQueryMenuByCategory} from '../../hooks/useMenu';
import {formatCurrency} from '../../utils/help';
import {convertJsonToCsv} from '../../utils/convertJsonToCsv';

const BigMenu = () => {
  const { updateMenuQuery, menuQuery, category_id, shop } = useAppContext();
  const {t} = useAppTheme();
  const {width} = useWindowDimensions();
  const collapseSidebar = width < 1100;
  const [item, setItem] = useState(null)
  const route = useRoute();
  const params  = route.params;

  // Mirrors ItemCard's own query — kept independent (a second lightweight
  // Realm read) rather than lifting ItemCard's internal state up, so the
  // share export always matches exactly what's currently on screen without
  // touching that component's already-tuned responsive grid logic.
  const {data: visibleItems, handleQueryMemu} = useQueryMenuByCategory(category_id);
  useEffect(() => {
    handleQueryMemu(menuQuery);
  }, [menuQuery]);

  const handleShare = async () => {
    if (!visibleItems?.length) return;
    await convertJsonToCsv(
      visibleItems.map(menuItem => ({
        Name: menuItem?.name || '',
        Price: formatCurrency(shop?.currency || '£', menuItem?.price || 0),
        Stock: menuItem?.stock ?? '',
      })),
    );
  };

  return (
      <StyledPage backgroundColor={t.bgPage}>
      <StyledPage.Header.Full>
         <RenderHeader showBackButton={true} showLogo={false} showTitle={true} title={`${params?.table_name || "Items"}`}  >
            <StyledSearchBar placeholder="Search menu items..." flex={1} onTextChange={(query) => updateMenuQuery(query)} />
            <Pressable onPress={handleShare} style={{marginLeft: 12}}>
              <StyleShape
                paddingHorizontal={10}
                borderWidth={1}
                cycle
                size={48}
                backgroundColor={t.bgPage}
                borderColor={visibleItems?.length ? t.brandPrimary : t.textMuted}>
                <MaterialIcon
                  size={24}
                  name="share"
                  color={visibleItems?.length ? t.brandPrimary : t.textPrimary}
                />
              </StyleShape>
            </Pressable>
          </RenderHeader>
      </StyledPage.Header.Full>

      <Stack flex={1.5} horizontal>
        <SideBarAdapter selectedMenu={3} showMenu={shop.mode ==="restaurant" ? '3' : ''} collapse={collapseSidebar} />
        <Stack flex={2.5} paddingHorizontal={8} vertical >
          <MenuCategory />
          <StyledSpacer marginVertical={4} />
          <ItemCard table_id={params?.table_id || shop?.table_id} onChangeItem={(item) => setItem(item)} />
        </Stack>
        <Stack flex={1.1} gap={16} vertical marginRight={16}>
          <Cart table_name={params?.table_name || "Shop"} table_id={params?.table_id || shop?.table_id} order_type={params?.order_type} />
        </Stack>
      </Stack>
      {item &&
        <StyledDialog visible>
          <AddOn table_id={params?.table_id || shop?.table_id} item={item} setItem={setItem} onClose={() => setItem(null)} />
        </StyledDialog>}
    </StyledPage>
  );
};

export default BigMenu;
