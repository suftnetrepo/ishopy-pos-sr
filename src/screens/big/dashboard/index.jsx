import React from 'react';
import {
  StyledSafeAreaView,
  StyledText,
  StyledHeader,
} from 'fluent-styles';
import {useNavigation } from '@react-navigation/native';
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
import { useFocus } from '../../../hooks/useFocus';

const Dashboard = () => {
  const focused = useFocus();
  const navigate = useNavigation();
  const {user} = useAppContext();

  console.log('.............Dashboard', focused);

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
      <StyledHeader borderRadius={30} statusProps={{translucent: true}}>
        <StyledHeader.Full>
          <RenderHeader showLog={true}  />
        </StyledHeader.Full>
      </StyledHeader>
      <Stack flex={1.5} horizonal backgroundColor={theme.colors.gray[100]}>
        <SideBarAdapter selectedMenu={1} key={focused} collapse={false} />
        <Stack flex={2} vertical backgroundColor={theme.colors.transparent}>
          <ScrollView vertical showsVerticalScrollIndicator={false}>
            <Tiles />
            <DailyTransactionChart />
            <RecentOrder />
          </ScrollView>
        </Stack>
        <Stack flex={1} paddingHorizontal={16} gap={16} vertical>
          <PopularDishes />
          <LowStockItems />
        </Stack>
      </Stack>
    </StyledSafeAreaView>
  );
};

export default Dashboard;
