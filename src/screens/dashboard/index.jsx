import React from 'react';
import {
  StyledSpacer,
  StyledPage,
} from 'fluent-styles';
import PopularDishes from '../../components/tablet/popularDishes';
import LowStockItems from '../../components/tablet/lowStockItems';
import DailyTransactionChart from '../../components/tablet/chart';
import Tiles from '../../components/tablet/tiles';
import RecentOrder from '../../components/tablet/recentOrder';
import { ScrollView } from 'react-native-gesture-handler';
import SideBarAdapter from '../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../components/tablet/header';
import { useFocus } from '../../hooks/useFocus';
import { Stack } from '../../components/package/stack';
import {useAppTheme} from '../../theme';

const Dashboard = () => {
  const focused = useFocus();
  const {t} = useAppTheme();

  return (
    <StyledPage backgroundColor={t.bgPage} >
      <StyledPage.Header.Full>
         <RenderHeader showLogo={true} />
      </StyledPage.Header.Full>
      <Stack key={focused} flex={1.5} horizontal backgroundColor={t.bgPage}>
        <SideBarAdapter selectedMenu={1} key={focused} collapse={false} />
        <Stack flex={2} vertical backgroundColor={t.bgPage} gap={16}>
          <ScrollView vertical showsVerticalScrollIndicator={false}>
            <Tiles />
            <DailyTransactionChart />
            <StyledSpacer marginVertical={8} />
            <RecentOrder />
          </ScrollView>
        </Stack>
        <Stack flex={1} paddingHorizontal={16} gap={16} vertical>
          <ScrollView vertical showsVerticalScrollIndicator={false}>
            <PopularDishes />
            <StyledSpacer marginVertical={8} />
            <LowStockItems />
          </ScrollView>
        </Stack>
      </Stack>
    </StyledPage>
  );
};

export default Dashboard;