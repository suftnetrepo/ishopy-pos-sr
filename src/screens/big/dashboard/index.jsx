import React from 'react';
import {
  StyledSafeAreaView,
  StyledText,
  StyledSpacer,
  StyledHeader,
  StyledCycle,
} from 'fluent-styles';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {Stack} from '../../../components/package/stack';
import {fontStyles, theme} from '../../../utils/theme';
import {StyledImage} from '../../../components/package/image';
import {StyledButton} from '../../../components/package/button';
import {StyledIcon} from '../../../components/package/icon';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import PopularDishes from '../../../components/tablet/popularDishes';
import LowStockItems from '../../../components/tablet/lowStockItems';
import DailyTransactionChart from '../../../components/tablet/chart';
import Tiles from '../../../components/tablet/tiles';
import SideBar from '../../../components/tablet/sideBar';
import Logo from '../../../components/tablet/logo';
import {useAppContext} from '../../../hooks/appContext';
import RecentOrder from '../../../components/tablet/recentOrder';
import {ScrollView} from 'react-native-gesture-handler';
import {toWordCase} from '../../../utils/help';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';

const Dashboard = () => {
  const navigate = useNavigation();
  const {user} = useAppContext();

  console.log('.............', user);

  const RenderHeader = () => {
    return (
      <Stack
        horizonal
        flex={1}
        backgroundColor={theme.colors.gray[1]}
        justifyContent="flex-start"
        alignItems="center"
        paddingVertical={8}
        marginTop={14}
        marginBottom={14}
        marginHorizontal={16}
        borderRadius={30}
        shadowOpacity={0.1}
        shadowColor={theme.colors.gray[600]}
        shadowRadius={30}
        paddingHorizontal={8}>
        <Logo />
        <Stack vertical marginLeft={16}>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.normal}
            fontWeight={theme.fontWeight.normal}
            color={theme.colors.gray[400]}></StyledText>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.normal}
            fontWeight={theme.fontWeight.bold}
            color={theme.colors.gray[800]}></StyledText>
        </Stack>
        <StyledSpacer flex={1} />
        <Stack
          horizonal
          paddingHorizontal={20}
          justifyContent="flex-start"
          alignItems="center">
          <StyledImage
            source={require('./../../../../assets/img/doctor_1.png')}
            size={50}
            cycle
            resizeMode="contain"></StyledImage>
          <Stack
            vertical
            marginLeft={8}
            justifyContent="flex-start"
            alignItems="flex-start">
            <StyledText
              color={theme.colors.gray[900]}
              fontSize={theme.fontSize.small}
              fontWeight={theme.fontWeight.semiBold}>
              Gladina Samantha
            </StyledText>
            <StyledText
              color={theme.colors.gray[500]}
              fontSize={theme.fontSize.small}
              fontWeight={theme.fontWeight.medium}>
              Waiter
            </StyledText>
          </Stack>
        </Stack>
        <Stack horizonal>
          <StyledCycle
            paddingHorizontal={10}
            borderWidth={1}
            height={48}
            width={48}
            borderColor={theme.colors.gray[300]}>
            <Icon
              size={24}
              name="exit-to-app"
              color={theme.colors.gray[800]}
              onPress={() => {
                navigate.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'keypad'}],
                  })
                );
              }}
            />
          </StyledCycle>
        </Stack>
      </Stack>
    );
  };

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
      <StyledHeader borderRadius={30} statusProps={{translucent: true}}>
        <StyledHeader.Full>
          <RenderHeader />
        </StyledHeader.Full>
      </StyledHeader>
      <Stack flex={1.5} horizonal backgroundColor={theme.colors.gray[100]}>
        <SideBarAdapter collapse={false} />

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

export default Dashboard;
