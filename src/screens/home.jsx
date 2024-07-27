/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */

import React, { useCallback } from 'react';
import {
  YStack,
  XStack,
  StyledSafeAreaView,
  StyledCycle,
  StyledText,
  StyledHeader,
  StyledSpacer,
  StyledButton,
  StyledDialog
} from 'fluent-styles';
import { BarChart } from 'react-native-gifted-charts';
import { StyledMIcon } from '../components/icon';
import { fontStyles, theme } from '../configs/theme';
import { useNavigation } from '@react-navigation/native';
import {
  useWeeklyTransactions,
  useTransactionTrend,
} from '../hooks/useDashboard';
import { useAppContext } from '../hooks/appContext';
import { formatCurrency, getGreetings, toWordCase } from '../utils/help';
import { ScrollView } from 'react-native';
import { SalesTrend } from './home/salesTrend';
import { PurchaseButton } from './home/purchaseButton';
import { state, useUtil } from '../store';
import { useSelector } from '@legendapp/state/react';
import { PurchaseSuccess } from './home/purchaseSuccess';

const Home = () => {
  const navigate = useNavigation();
  const { user, shop } = useAppContext();  
  const {setPaymentStatus} = useUtil()
  const { payment_status, purchase_status} = useSelector(() => state.get());
  const { data } = useWeeklyTransactions();
  const { trend, dailyTransaction, percentageChange } = useTransactionTrend()
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const chart = useCallback(() => {
    const currentDate = new Date()
    const chartData = labels.map((label, index) => {
      const dayData = data?.find(day => day.weekday === index);
      return {
        label,
        value: dayData ? dayData.total : 0,
        frontColor: index === currentDate.getDay() ? '#916aff' : '#d3d3d3',
      };
    });

    return chartData;
  }, [data, labels]);

  const RenderHeader = () => {
    return (
      <XStack
        flex={1}
        backgroundColor={theme.colors.gray[100]}
        justifyContent="space-between"
        alignItems="center"
        paddingVertical={8}
        paddingHorizontal={16}>
        <YStack>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.normal}
            fontWeight={theme.fontWeight.normal}
            color={theme.colors.gray[400]}>
            {getGreetings()}
          </StyledText>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.normal}
            fontWeight={theme.fontWeight.bold}
            color={theme.colors.gray[800]}>
            {toWordCase(user.first_name)} {toWordCase(user.last_name)}
          </StyledText>

        </YStack>

        <XStack>
          <StyledCycle
            paddingHorizontal={10}
            borderWidth={1}
            borderColor={theme.colors.gray[1]}>
            <StyledMIcon
              size={30}
              name="lock-clock"
              color={theme.colors.gray[800]}
              onPress={() =>
                navigate.reset({
                  index: 0,
                  routes: [{ name: 'keypad' }],
                })
              }
            />
          </StyledCycle>
          <StyledSpacer marginHorizontal={4} />
          <StyledCycle
            paddingHorizontal={10}
            borderWidth={1}
            borderColor={theme.colors.gray[1]}>
            <StyledMIcon
              size={30}
              name="exit-to-app"
              color={theme.colors.gray[800]}
              onPress={() =>
                navigate.reset({
                  index: 0,
                  routes: [{ name: 'login' }],
                })
              }
            />
          </StyledCycle>
        </XStack>
      </XStack>
    );
  };

  return (
    <StyledSafeAreaView>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }}>
        <StyledHeader.Full>
          <RenderHeader />
        </StyledHeader.Full>
      </StyledHeader>
      <ScrollView>
        <YStack
          flex={1}
          marginHorizontal={16}
          justifyContent="flex-start"
          alignItems="flex-start"
          backgroundColor={theme.colors.gray[1]}
          borderRadius={32}
          paddingHorizontal={8}
          paddingVertical={8}>
          <StyledSpacer marginVertical={2} />
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.large}
            fontWeight={theme.fontWeight.normal}
            paddingHorizontal={16}
            color={theme.colors.gray[800]}>
            Daily transaction
          </StyledText>
          <XStack justifyContent="flex-start"
            alignItems="center">
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontSize={theme.fontSize.xxxlarge}
              fontWeight={theme.fontWeight.bold}
              paddingHorizontal={16}
              color={theme.colors.gray[800]}>
              {formatCurrency(shop.currency || '£', dailyTransaction)}
            </StyledText>        
            <StyledButton backgroundColor={trend === "up" ? theme.colors.green[500] : theme.colors.red[400]} borderColor={trend === "up" ? theme.colors.green[500] : theme.colors.red[400]}>
              <XStack justifyContent="flex-start" paddingHorizontal={8} paddingVertical={1}
                alignItems="center">
                <StyledMIcon size={24} name={trend === "up" ? 'arrow-upward' : 'arrow-downward'} color={theme.colors.gray[1]} />
                <StyledSpacer marginHorizontal={1} />
                <StyledText
                  fontFamily={fontStyles.Roboto_Regular}
                  fontSize={theme.fontSize.small}
                  fontWeight={theme.fontWeight.bold}
                  color={theme.colors.gray[1]}>
                  {percentageChange}%
                </StyledText>
              </XStack>
            </StyledButton>
          </XStack>
          <StyledSpacer marginVertical={8} />
          <BarChart
            barWidth={22}
            noOfSections={3}
            barBorderRadius={4}
            frontColor="lightgray"
            data={chart()}
            yAxisThickness={0}
            xAxisThickness={0}
            key={data}
          />

        </YStack>
        <StyledSpacer marginVertical={4} />
        <SalesTrend />       
      </ScrollView>
      {
        !purchase_status && (
          <PurchaseButton />
        )
      }
      {payment_status &&
        <StyledDialog visible>
          <PurchaseSuccess setPaymentStatus={setPaymentStatus} />
        </StyledDialog>}

    </StyledSafeAreaView>
  );
};

export default Home;
