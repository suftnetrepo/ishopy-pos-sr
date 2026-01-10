/* eslint-disable prettier/prettier */
import Realm, { ObjectSchema } from 'realm';
import { createRealmContext } from '@realm/react';
import { migration, SCHEMA_VERSION } from './migration';

let realmInstance: Realm | null = null;

export const TableSchema: ObjectSchema = {
  name: 'Table',
  primaryKey: 'table_id',
  properties: {
    table_id: 'string',
    tableName: 'string',
    isOccupied: { type: 'int', default: 0 },
    status: { type: 'int', default: 1 },
    size: { type: 'int', default: 0 },
    location: 'string?',      // Add this
    guest_count: 'int?',      // Add this
    guest_name: 'string?',    // Add this
    start_time: 'string?',    // Add this
  },
};

export const AddOnSchema: ObjectSchema = {
  name: 'AddOn',
  primaryKey: 'addOn_id',
  properties: {
    addOn_id: 'string',
    addOnName: 'string',
    price: 'double',
    menu_id: 'string',
    status: {type: 'int', default: 0},
  },
};

export const MenuSchema: ObjectSchema = {
  name: 'Menu',
  primaryKey: 'menu_id',
  properties: {
    menu_id: 'string',
    name: 'string',
    bar_code: 'string?',
    color_code: 'string?',
    icon_name :'string?',
    price: 'double',
    price_offer: {type: 'double', default: 0},
    cost: {type: 'double', default: 0},
    stock: {type: 'int', default: 0},
    category_id: 'string?',
    status: {type: 'int', default: 0},
    description: 'string?',
    addOn_id: 'string?',
  },
};

export const StockSchema: ObjectSchema = {
  name: 'Stock',
  primaryKey: 'stock_id',
  properties: {
    stock_id: 'string',
    menu_id: 'string',
    stock: {type: 'int', default: 0},
    date: 'string',
  },
};

export const IconSchema: ObjectSchema = {
  name: 'Icon',
  embedded: true, 
  properties: {
    name: 'string',
    library: 'string', 
    label: 'string',
    type: 'string'
  }
};

export const CategorySchema: ObjectSchema = {
  name: 'Category',
  primaryKey: 'category_id',
  properties: {
    category_id: 'string',
    name: 'string',
    color_code: 'string?',
    icon: 'mixed',
    icon_name :'string?',
    description: 'string?',
    sort_order: { type: 'int', default: 0 },
    status: { type: 'int', default: 0 },
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
    table_id: 'string',
    table_name: 'string',
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
    menu_id: 'string',
    menu_name: 'string',
    menu_icon_name :'string?',
    quantity: 'int',
    price: 'double',
    date: 'date',
    addOns: 'string?',
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
    MenuSchema,
    CategorySchema,
    CustomerSchema,
    StockSchema,
    UserSchema,
    OrderItemSchema,
    OrderSchema,
    ShopSchema,
    DiscountSchema,
    TaxSchema,
    AddOnSchema,
  ],
  deleteRealmIfMigrationNeeded: true,
});

const schema = [
  PaymentSchema,
  MenuSchema,
  CategorySchema,
  CustomerSchema,
  StockSchema,
  UserSchema,
  OrderItemSchema,
  OrderSchema,
  ShopSchema,
  DiscountSchema,
  TaxSchema,
  TableSchema,
  AddOnSchema
];

const RealmOptions = () => {
  return {
    path: '_pos__j_.realm',
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
