import React from 'react';
import {useWindowDimensions} from 'react-native';
import {StyledSpacer, StyledPage} from 'fluent-styles';
import PopularDishes from '../../components/tablet/popularDishes';
import LowStockItems from '../../components/tablet/lowStockItems';
import DailyTransactionChart from '../../components/tablet/chart';
import Tiles from '../../components/tablet/tiles';
import RecentOrder from '../../components/tablet/recentOrder';
import {ScrollView} from 'react-native-gesture-handler';
import SideBarAdapter from '../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../components/tablet/header';
import {useFocus} from '../../hooks/useFocus';
import {Stack} from '../../components/package/stack';
import {useAppTheme} from '../../theme';

const Dashboard = () => {
  const focused = useFocus();
  const {width} = useWindowDimensions();
  const {t} = useAppTheme();

  // iPadOS can resize the app in Split View / Stage Manager, so this must be
  // calculated from useWindowDimensions instead of static Dimensions.
  const isCompact = width < 900;
  const isMedium = width >= 900 && width < 1180;
  const collapseSidebar = width < 1100;
  const showRightRail = width >= 1180;
  const contentPadding = isCompact ? 12 : 16;

  return (
    <StyledPage backgroundColor={t.bgPage}>
      <StyledPage.Header.Full>
        <RenderHeader showLogo={true} />
      </StyledPage.Header.Full>

      <Stack flex={1} horizontal backgroundColor={t.bgPage}>
        <SideBarAdapter
          selectedMenu={1}
          key={focused}
          collapse={collapseSidebar}
        />

        <Stack flex={1} vertical backgroundColor={t.bgPage} minWidth={0}>
          <ScrollView
            vertical
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: contentPadding,
              paddingBottom: 32,
              flexGrow: 1,
            }}>
            <Tiles />

            <DailyTransactionChart />

            {!showRightRail && (
              <Stack
                horizontal={!isCompact}
                gap={16}
                marginTop={16}
                alignItems="stretch">
                <Stack flex={1} minWidth={isCompact ? '100%' : 0}>
                  <PopularDishes />
                </Stack>
                <Stack flex={1} minWidth={isCompact ? '100%' : 0}>
                  <LowStockItems />
                </Stack>
              </Stack>
            )}

            <StyledSpacer marginVertical={8} />
            <RecentOrder />
          </ScrollView>
        </Stack>

        {showRightRail && (
          <Stack width={280} paddingRight={16} paddingLeft={0} gap={16} vertical>
            <ScrollView vertical showsVerticalScrollIndicator={false}>
              <PopularDishes />
              <StyledSpacer marginVertical={8} />
              <LowStockItems />
            </ScrollView>
          </Stack>
        )}
      </Stack>
    </StyledPage>
  );
};

export default Dashboard;
