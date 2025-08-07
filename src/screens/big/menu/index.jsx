import React from 'react';
import {
  StyledSafeAreaView,
  StyledText,
  StyledHeader,
} from 'fluent-styles';
import {useNavigation} from '@react-navigation/native';
import {Stack} from '../../../components/package/stack';
import {fontStyles, theme} from '../../../utils/theme';
import {StyledButton} from '../../../components/package/button';
import {StyledIcon} from '../../../components/package/icon';

import PopularDishes from '../../../components/tablet/popularDishes';
import LowStockItems from '../../../components/tablet/lowStockItems';
import DailyTransactionChart from '../../../components/tablet/chart';
import Tiles from '../../../components/tablet/tiles';
import {useAppContext} from '../../../hooks/appContext';
import RecentOrder from '../../../components/tablet/recentOrder';
import {ScrollView} from 'react-native-gesture-handler';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import { useCategories } from '../../../hooks/useCategory';

const BigMenu = () => {
  const navigate = useNavigation();
  const {user} = useAppContext();
  const { data } = useCategories()

  console.log('.............data', JSON.stringify( data));

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
      <StyledHeader borderRadius={30} statusProps={{translucent: true}}>
        <StyledHeader.Full>
          <RenderHeader showBackButton={true} showLog={false} showTitle={true} title='Table Menus' />
        </StyledHeader.Full>
      </StyledHeader>
      <Stack flex={1.5} horizonal backgroundColor={theme.colors.gray[100]}>
        <SideBarAdapter collapse={true} />

        <Stack flex={2} vertical backgroundColor={theme.colors.transparent}>
          <ScrollView vertical showsVerticalScrollIndicator={false}>
            <Tiles />
            <DailyTransactionChart />
            <RecentOrder />
          </ScrollView>
        </Stack>
        <Stack flex={1} paddingHorizontal={16} gap={16} vertical>
          <StyledButton
            paddingVertical={12}
            paddingHorizontal={20}
            borderRadius={8}
            justifyContent="center"
            backgroundColor={theme.colors.yellow[500]}
            borderColor={theme.colors.yellow[500]}
            onPress={() => console.log('Dashboard clicked')}>
            <StyledIcon name={'add'} size={25} color={theme.colors.gray[800]} />
            <StyledText
              color={theme.colors.gray[800]}
              fontSize={15}
              fontWeight={theme.fontWeight.medium}
              marginLeft={5}
              textAlign="center">
              CREATE NEW ORDER
            </StyledText>
          </StyledButton>
          <PopularDishes />
          <LowStockItems />
        </Stack>
      </Stack>
    </StyledSafeAreaView>
  );
};

export default BigMenu;
