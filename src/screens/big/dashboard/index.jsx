import React from 'react';
import {StyledSafeAreaView, StyledText, StyledSpacer} from 'fluent-styles';
import {Stack} from '../../../components/package/stack';
import {theme} from '../../../utils/theme';
import {StyledImage} from '../../../components/package/image';
import {StyledButton} from '../../../components/package/button';
import {StyledIcon} from '../../../components/package/icon';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, CommonActions} from '@react-navigation/native';
import PopularDishes from '../../../components/tablet/popularDishes';
import LowStockItems from '../../../components/tablet/lowStockItems';
import DailyTransactionChart from '../../../components/tablet/chart';
import Tiles from '../../../components/tablet/tiles';
import SideBar from '../../../components/tablet/sideBar';
import Logo from '../../../components/tablet/logo';
import { useAppContext } from '../../../hooks/appContext';

const Dashboard = () => {
  const navigate = useNavigation();
  const { user } = useAppContext()

  console.log(".............", user)

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <Stack flex={1} horizonal backgroundColor={theme.colors.gray[300]}>
        <Stack
          flex={1}
          alignItems="flex-start"
          justifyContent="flex-start"
          vertical
          paddingHorizontal={10}
          backgroundColor={theme.colors.gray[1]}>
          <StyledSpacer marginVertical={7} />
          <Logo />
          <StyledSpacer marginVertical={7} />
          <SideBar />
          <StyledSpacer flex={1} />
          <Stack
            horizonal
            paddingHorizontal={20}
            justifyContent="flex-start"
            alignItems="center">
            <StyledImage
              source={require('./../../../../assets/img/doctor_1.png')}
              size={40}
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
                fontWeight={theme.fontWeight.medium}>
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
          <StyledButton
            marginTop={20}
            paddingVertical={5}
            paddingHorizontal={20}
            borderWidth={0}
            onPress={() =>
              navigate.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'keypad'}],
                })
              )
            }>
            <Icon
              name="logout-variant"
              size={28}
              color={theme.colors.gray[500]}
            />
            <StyledText
              color={theme.colors.gray[500]}
              fontSize={16}
              fontWeight={theme.fontWeight.medium}
              marginLeft={10}>
              Logout
            </StyledText>
          </StyledButton>
        </Stack>

        <Stack flex={2.5} vertical backgroundColor={theme.colors.transparent}>
          <Tiles />
          <DailyTransactionChart />
        </Stack>
        <Stack
          flex={1.5}
          padding={16}
          gap={16}
          vertical
          backgroundColor={theme.colors.gray[300]}>
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
