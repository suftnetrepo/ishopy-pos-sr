/* eslint-disable prettier/prettier */
import Realm, { ObjectSchema } from 'realm';
import { createRealmContext } from '@realm/react';
import { migration, SCHEMA_VERSION } from './migration';

let realmInstance: Realm | null = null;

export const ProductSchema: ObjectSchema = {
  name: 'Product',
  primaryKey: 'product_id',
  properties: {
    product_id: 'string',
    name: 'string',
    bar_code: 'string?',
    color_code: 'string?',
    price: 'double',
    price_offer: {type: 'double', default: 0},
    cost: {type: 'double', default: 0},
    stock: {type: 'int', default: 0},
    category_id: 'string?',
    status: {type: 'int', default: 0},
    description: 'string?',
  },
};

export const StockSchema: ObjectSchema = {
  name: 'Stock',
  primaryKey: 'stock_id',
  properties: {
    stock_id: 'string',
    product_id: 'string',
    stock: {type: 'int', default: 0},
    date: 'string',
  },
};

export const CategorySchema: ObjectSchema = {
  name: 'Category',
  primaryKey: 'category_id',
  properties: {
    category_id: 'string',
    name: 'string',
    color_code: 'string?',
    status: {type: 'int', default: 0},
  },
};

export const TaxSchema: ObjectSchema = {
  name: 'Tax',
  primaryKey: 'tax_id',
  properties: {
    tax_id: 'string',
    name: 'string',
    rate: 'double',
    status: {type: 'int', default: 0},
  },
};

export const DiscountSchema: ObjectSchema = {
  name: 'Discount',
  primaryKey: 'discount_id',
  properties: {
    discount_id: 'string',
    name: 'string',
    rate: 'double',
    status: {type: 'int', default: 0},
  },
};

export const OrderSchema: ObjectSchema = {
  name: 'Order',
  primaryKey: 'order_id',
  properties: {
    order_id: 'string',
    user_id: 'string?',
    total: 'double?',
    tax: 'double?',
    discount: 'double?',
    total_price: 'double',
    status: 'string?',
    date: 'date',
  },
};

export const OrderItemSchema: ObjectSchema = {
  name: 'OrderItem',
  primaryKey: 'detail_id',
  properties: {
    detail_id: 'string',
    order_id: 'string',
    product_id: 'string',
    product_name: 'string',
    quantity: 'int',
    price: 'double',
    date: 'date',
  },
};

export const UserSchema: ObjectSchema = {
  name: 'User',
  primaryKey: 'user_id',
  properties: {
    user_id: 'string',
    username: 'string',
    password: 'string',
    first_name: 'string',
    last_name: 'string',
    pass_code: 'int',
    status: {type: 'int', default: 0},
    role: 'string',
  },
};

export const ShopSchema: ObjectSchema = {
  name: 'Shop',
  primaryKey: 'shop_id',
  properties: {
    shop_id: 'string',
    name: 'string',
    mobile: 'string',
    email: 'string',
    address: 'string',
    currency: 'string?',
    description: 'string?',
  },
};

export const CustomerSchema: ObjectSchema = {
  name: 'Customer',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string?',
    email: 'string?',
    phone: 'string?',
  },
};

export const PaymentSchema: ObjectSchema = {
  name: 'Payment',
  primaryKey: 'id',
  properties: {
    id: 'string',
    order_id: 'string',
    amount: 'double',
    payment_method: 'string?',
    date: 'date',
  },
};

const {useRealm, useQuery, RealmProvider} = createRealmContext({
  schema: [
    PaymentSchema,
    ProductSchema,
    CategorySchema,
    CustomerSchema,
    StockSchema,
    UserSchema,
    OrderItemSchema,
    OrderSchema,
    ShopSchema,
    DiscountSchema,
    TaxSchema,
  ],
  deleteRealmIfMigrationNeeded: true,
});

const schema = [
  PaymentSchema,
  ProductSchema,
  CategorySchema,
  CustomerSchema,
  StockSchema,
  UserSchema,
  OrderItemSchema,
  OrderSchema,
  ShopSchema,
  DiscountSchema,
  TaxSchema,
];

const RealmOptions = () => {
  return {
    path: 'k_____pos______k.realm',
    schema: schema,
    schemaVersion: SCHEMA_VERSION,
    migration 
  };
};

const RealmOpen = async () => {
  return await Realm.open(RealmOptions());
}

const getRealmInstance = async () => {
  if (!realmInstance) {
    realmInstance = await RealmOpen();
  }
  return realmInstance;
};

export {
  schema,
  RealmOpen,
  RealmOptions,
  useRealm,
  useQuery,
  RealmProvider,
  Realm,
  getRealmInstance,
 
};
