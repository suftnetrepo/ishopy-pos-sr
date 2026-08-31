import React, {useCallback, useState} from 'react';
import {RefreshControl, useWindowDimensions} from 'react-native';
import {StyledSpacer, StyledPage} from 'fluent-styles';
import {useFocusEffect} from '@react-navigation/native';
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

  // Pull-to-refresh: every widget below loads its own data on mount via
  // useEffect, so bumping this key remounts them all and re-runs those
  // fetches — same pattern already used for the sidebar's `key={focused}`.
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // React Navigation keeps the Dashboard mounted in the stack, so navigating
  // back here (e.g. after completing an order elsewhere) does NOT remount it
  // or re-run those mount-time fetches on its own — it just re-shows the
  // same, now-stale widgets. Bump the same remount key on every focus so the
  // numbers are current the moment the screen comes back into view, without
  // requiring a manual pull-to-refresh.
  useFocusEffect(
    useCallback(() => {
      setRefreshKey(k => k + 1);
    }, []),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey(k => k + 1);
    // Realm reads are effectively synchronous, so the remount above already
    // has fresh data by the next frame — this short delay just keeps the
    // pull indicator visible long enough to read as a deliberate refresh.
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={t.brandPrimary}
      colors={[t.brandPrimary]}
    />
  );

  return (
    <StyledPage backgroundColor={t.bgPage} paddingHorizontal={16}>
      <StyledPage.Header.Full>
        <RenderHeader showLogo={true} />
      </StyledPage.Header.Full>

      <Stack flex={1} horizontal gap={8} backgroundColor={t.bgPage}>
        <SideBarAdapter
          selectedMenu={1}
          key={focused}
          collapse={collapseSidebar}
        />

        <Stack flex={1} vertical backgroundColor={t.bgPage} minWidth={0}>
          <ScrollView
            vertical
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
            contentContainerStyle={{
              paddingBottom: 32,
              flexGrow: 1,
            }}>
            <Stack key={refreshKey} vertical>
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
            </Stack>
          </ScrollView>
        </Stack>

        {showRightRail && (
          <Stack
            width={isCompact ? 0 : isMedium ? 260 : 280}
            paddingLeft={0}
            gap={12}
            vertical>
            <ScrollView
              vertical
              showsVerticalScrollIndicator={false}
              refreshControl={refreshControl}
              contentContainerStyle={{gap: 12}}>
              <Stack key={refreshKey} vertical gap={12}>
                <PopularDishes />
                <LowStockItems />
              </Stack>
            </ScrollView>
          </Stack>
        )}
      </Stack>
    </StyledPage>
  );
};

export default Dashboard;
