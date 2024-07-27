/* eslint-disable prettier/prettier */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/login';
import Keypad from '../screens/lock';
import BottomTabs from './BottomNavigation';
import SignUp from '../screens/signUp';
import Printer from '../screens/account/printer';
import User from '../screens/account/user'
import Discount from '../screens/account/discount'
import Tax from '../screens/account/tax'
import Shop from '../screens/account/shop'
import AddUser from '../screens/account/user/add'
import EditUser from '../screens/account/user/edit'
import AddTax from '../screens/account/tax/add'
import EditTax from '../screens/account/tax/edit'
import AddDiscount from '../screens/account/discount/add'
import EditDiscount from '../screens/account/discount/edit'
import Product from '../screens/account/product';
import AddProduct from '../screens/account/product/add';
import EditProduct from '../screens/account/product/edit';
import Category from '../screens/account/category';
import AddCategory from '../screens/account/category/add';
import EditCategory from '../screens/account/category/edit';
import AddStock from '../screens/account/stock/add';
import Stock from '../screens/account/stock';
import Sales from '../screens/sales';
import CheckOut from '../screens/checkout';
import Order from '../screens/order';
import HelpCenter from '../screens/account/helpCenter';
import FAQ from '../screens/account/faq';

const Stack = createStackNavigator();
function Navigator() {
  return (
    <Stack.Navigator initialRouteName="login">
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
        name="orders"
        component={Order}
        options={{
          headerShown: false,
        }}
      />
       <Stack.Screen
        name="checkout"
        component={CheckOut}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sales"
        component={Sales}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="stocks"
        component={Stock}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-stock"
        component={AddStock}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit-category"
        component={EditCategory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-category"
        component={AddCategory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="products"
        component={Product}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="categories"
        component={Category}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-product"
        component={AddProduct}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit-product"
        component={EditProduct}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-discount"
        component={AddDiscount}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit-discount"
        component={EditDiscount}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-tax"
        component={AddTax}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit-tax"
        component={EditTax}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit-user"
        component={EditUser}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-user"
        component={AddUser}
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
      <Stack.Screen
        name="users"
        component={User}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="tax"
        component={Tax}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="discount"
        component={Discount}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="shop"
        component={Shop}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export { Navigator }
