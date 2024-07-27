/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { XStack, StyledSpacer, StyledText, StyledButton } from 'fluent-styles';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from '../configs/theme';
import Home from '../screens/home';
import Sales from '../screens/sales';
import Account from '../screens/account';
import Order from '../screens/order';
import Payment from '../screens/payment';


const Tab = createBottomTabNavigator();

const Tabs = ({ state, descriptors, navigation }) => {
  {
    return (
      <XStack justifyContent='space-between' borderRadius={32} backgroundColor={theme.colors.gray[1]} alignItems='center' paddingHorizontal={8} paddingVertical={8}>
        {
          state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const BarIcon = options.tabBarIcon
            const focused = state.index === index

            const handlePress = () => {
              if (route.name === 'sales') {
              navigation.push(route.name);
            } else {
              navigation.navigate(route.name);
            }             
          };

            return (
              <StyledButton key={index} onPress={() =>handlePress()} >
                <XStack justifyContent='space-between' borderRadius={32} backgroundColor={focused ? theme.colors.blueGray[800] : theme.colors.gray[1]} alignItems='center' paddingHorizontal={12} paddingVertical={8}>
                  <BarIcon focused={focused} size={24} color={focused ? theme.colors.gray[1] : theme.colors.gray[800]} />
                  {
                    focused && (
                      <>
                        <StyledSpacer marginHorizontal={4} />
                        <StyledText fontWeight={theme.fontWeight.bold} color={focused ? theme.colors.gray[1] : theme.colors.gray[800]}>{route.name}</StyledText>
                      </>
                    )
                  }
                </XStack>
              </StyledButton>
            )
          })
        }
      </XStack>
    )
  }
}

export default function BottomTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <Tabs {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name='Home' component={Home} options={{
        tabBarIcon: ({ focused, size, color }) => {
          return (
            <Icon focused={focused} color={color} size={size} name='home' />
          )
        }
      }} />

      <Tab.Screen name='Sales' component={Sales} options={{
        tabBarIcon: ({ size, color }) => {
          return (
            <Icon color={color} size={size} name='basket-outline' />
          )
        }
      }} />

      <Tab.Screen name='Orders' component={Order} options={{
        tabBarIcon: ({ size, color }) => {
          return (
            <Icon color={color} size={size} name='square-outline' />
          )
        }
      }} />   
      <Tab.Screen name='Payments' component={Payment} options={{
        tabBarIcon: ({ size, color }) => {
          return (
            <Icon color={color} size={size} name='cash-plus' />
          )
        }
      }} />    

      <Tab.Screen name='Settings' component={Account} options={{
        tabBarIcon: ({ size, color }) => {
          return (
            <Icon color={color} size={size} name='application-settings' />
          )
        }
      }} />
    </Tab.Navigator>
  );
}
