import React from 'react';
import {
  StyledSpacer,
  StyledPage,
  theme,
} from 'fluent-styles';
import { useNavigation } from '@react-navigation/native';
import PopularDishes from '../../components/tablet/popularDishes';
import LowStockItems from '../../components/tablet/lowStockItems';
import DailyTransactionChart from '../../components/tablet/chart';
import Tiles from '../../components/tablet/tiles';
import { useAppContext } from '../../hooks/appContext';
import RecentOrder from '../../components/tablet/recentOrder';
import { ScrollView } from 'react-native-gesture-handler';
import SideBarAdapter from '../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../components/tablet/header';
import { useFocus } from '../../hooks/useFocus';
import { Stack } from '../../components/package/stack';
import {useAppTheme} from '../../theme';

const Dashboard = () => {
  const focused = useFocus();
  const navigate = useNavigation();
  const { user, shop } = useAppContext();
  const {t} = useAppTheme();

  return (
    <StyledPage backgroundColor={t.bgPage} >
      <StyledPage.Header.Full>
         <RenderHeader showLogo={true} />
      </StyledPage.Header.Full>
      <Stack key={focused} flex={1.5} horizontal backgroundColor={t.bgPage}>
        <SideBarAdapter selectedMenu={1} key={focused} collapse={false} />
        <Stack flex={2} vertical backgroundColor={theme.colors.transparent}>
          <ScrollView vertical showsVerticalScrollIndicator={false}>
            <Tiles />
            <DailyTransactionChart />
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