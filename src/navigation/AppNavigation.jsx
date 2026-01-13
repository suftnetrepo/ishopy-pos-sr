/* eslint-disable prettier/prettier */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/login';
import Keypad from '../screens/lock';
import BottomTabs from './BottomNavigation';
import SignUp from '../screens/signUp';
import Printer from '../screens/account/printer';
import Dashboard from '../screens/big/dashboard';
import BigMenu from '../screens/big/menu';
import BigTable from '../screens/big/table';
import BigOrder from '../screens/big/order';
import BigSettings from '../screens/big/settings';
import BigCategory from '../screens/big/settings/category';
import BigTax from '../screens/big/settings/tax';
import BigDiscount from '../screens/big/settings/discount';
import BigItem from '../screens/big/settings/item';
import BigUser from '../screens/big/settings/user';
import BigPayment from '../screens/big/settings/payment';
import FAQ from '../screens/account/faq';
import HelpCenter from '../screens/account/helpCenter';
import Start from '../screens/start';

const Stack = createStackNavigator();
function Navigator() {

  return (
    <Stack.Navigator initialRouteName={"big-start"}>
      <Stack.Screen
        name="big-dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
       <Stack.Screen
        name="big-start"
        component={Start}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="big-payment"
        component={BigPayment}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="big-user"
        component={BigUser}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="big-item"
        component={BigItem}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="big-table"
        component={BigTable}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="big-menu"
        component={BigMenu}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="big-orders"
        component={BigOrder}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="big-settings"
        component={BigSettings}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="big-category"
        component={BigCategory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="big-tax"
        component={BigTax}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="big-discount"
        component={BigDiscount}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="bottom-tabs"
        component={BottomTabs}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="faq"
        component={FAQ}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="help-center"
        component={HelpCenter}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="keypad"
        component={Keypad}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-up"
        component={SignUp}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="printer"
        component={Printer}
        options={{
          headerShown: false,
        }}
      />


    </Stack.Navigator>
  );
}

export { Navigator }
