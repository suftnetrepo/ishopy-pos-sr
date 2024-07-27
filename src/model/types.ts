/* eslint-disable prettier/prettier */
import { Product } from './product';
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
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type {
  Product,
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
};
