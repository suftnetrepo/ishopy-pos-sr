/* eslint-disable prettier/prettier */
import { Menu } from './menu';
import {User} from './user';
import { Category } from './category';
import {Customer} from './customer';
import {Order} from './orders';
import {OrderItem} from './orderItems';
import {Stock} from './stock';
import {Payment} from './payments';
import {Shop} from './shop';
import {Discount} from './discount';
import {Tax} from './tax';
import {Table} from './table';
import {AddOn} from './addOn';
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  addOns?: AddOn[] 
}

export type {
  Menu,
  Category,
  Customer,
  Order,
  OrderItem,
  Stock,
  User,
  Payment,
  Tax,
  Discount,
  Shop,
  CartItem,
  Table,
  AddOn,
};
