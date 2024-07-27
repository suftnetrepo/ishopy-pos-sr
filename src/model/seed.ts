/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { getRealmInstance } from './store';
import {
  Order,
  OrderItem,
  Product,
  Customer,
  Category,
  User,
  Payment,
  Stock,
  Tax,
  Discount,
  Shop,
} from './types';

const colorPalettes = {
  rose: ['#e11d48', '#be123c'],
  pink: ['#db2777', '#be185d'],
  fuchsia: ['#c026d3', '#a21caf'],
  purple: ['#9333ea', '#7e22ce'],
  violet: ['#7c3aed', '#6d28d9'],
  indigo: ['#4f46e5', '#4338ca'],
  blue: ['#2563eb', '#1d4ed8'],
  lightBlue: ['#0284c7', '#0369a1'],
  darkBlue: ['#005db4', '#004282'],
  cyan: ['#0891b2', '#0e7490'],
  teal: ['#0d9488', '#0f766e'],
  emerald: ['#059669', '#047857'],
  green: ['#16a34a', '#15803d'],
  lime: ['#65a30d', '#4d7c0f'],
  yellow: ['#ca8a04', '#a16207'],
  amber: ['#d97706', '#b45309'],
  orange: ['#ea580c', '#c2410c'],
  red: ['#dc2626', '#b91c1c'],
  warmGray: ['#57534e', '#44403c'],
  trueGray: ['#525252', '#404040'],
  gray: ['#52525b', '#3f3f46'],
  coolGray: ['#4b5563', '#374151'],
  blueGray: ['#475569', '#334155'],
};

const getRandomColorCode = () => {
  const colors = Object.values(colorPalettes);
  const randomPalette = colors[Math.floor(Math.random() * colors.length)];
  return randomPalette[Math.floor(Math.random() * randomPalette.length)];
};

const clearSeedData = async () => {
  const realm = await getRealmInstance();
  realm.write(() => {
    realm.deleteAll();
  })
}
const prepareSeedData = async () => {
  const realm = await getRealmInstance();
  try {
    realm.write(() => {

     realm.delete(realm.objects('Category'));
     realm.delete(realm.objects('Tax'));
     realm.delete(realm.objects('Discount'));
     realm.delete(realm.objects('Product'));
     realm.delete(realm.objects('Customer'));
     realm.delete(realm.objects('Order'));
     realm.delete(realm.objects('OrderItem'));
     realm.delete(realm.objects('Payment'));

      console.log('Database seeds deleted successfully');
    });
  } catch (error) {
    console.log('..................', error);
  }
};
const seedData = async () => {
  const realm = await getRealmInstance();
  try {
    realm.write(() => {
      realm.deleteAll();

      // Seed Users
      const users: User[] = [
        {
          user_id: guid(),
          first_name: 'james',
          last_name: 'micheal',
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          pass_code: 1234,
        },
        {
          user_id: guid(),
          first_name: 'ema',
          last_name: 'dam',
          username: 'user',
          password: 'user123',
          role: 'user',
          pass_code: 1234,
        },
      ];
      users.forEach(user => realm.create('User', user));

      // // Seed Categories
      const categories: Category[] = [
        {
          category_id: guid(),
          name: 'Electronics',
          status: 1,
          color_code: '#e11d48',
        },
        { category_id: guid(), name: 'Books', status: 1, color_code: '#be123c' },
        {
          category_id: guid(),
          name: 'Clothing',
          status: 1,
          color_code: '#db2777',
        },
        {
          category_id: guid(),
          name: 'Furniture',
          status: 1,
          color_code: '#c026d3',
        },
        { category_id: guid(), name: 'Toys', status: 1, color_code: '#7e22ce' },
        {
          category_id: guid(),
          name: 'Groceries',
          status: 1,
          color_code: '#9333ea',
        },
        {
          category_id: guid(),
          name: 'Jewelry',
          status: 1,
          color_code: '#6d28d9',
        },
        { category_id: guid(), name: 'Sports', status: 1, color_code: '#4338ca' },
        { category_id: guid(), name: 'Beauty', status: 1, color_code: '#005db4' },
        {
          category_id: guid(),
          name: 'Automotive',
          status: 1,
          color_code: '#0f766e',
        },
      ];
      categories.forEach(category => realm.create('Category', category));

      // Seed Taxes
      const taxes: Tax[] = [
        { tax_id: guid(), name: 'VAT', rate: 2.5, status: 1 },
        { tax_id: guid(), name: 'State Tax', rate: 1.6, status: 1 },
      ];
      taxes.forEach(tax => realm.create('Tax', tax));

      // Seed Discounts
      const discounts: Discount[] = [
        { discount_id: guid(), name: 'Season', rate: 2, status: 1 },
        { discount_id: guid(), name: 'State Tax', rate: 3, status: 1 },
      ];
      discounts.forEach(discount => realm.create('Discount', discount));

      // Seed Shop
      const shops: Shop[] = [
        {
          shop_id: guid(),
          name: 'Shop A',
          email: 'kabelsus@yahoo.com',
          mobile: '1234566778',
          description: 'No thing',
          address: '12 High Street, Cambridge, CB2 3QZ, United Kingdom',
          currency: '£',
        },
      ];
      shops.forEach(shop => realm.create('Shop', shop));

      // Seed Products
      const products: Product[] = Array.from({ length: 50 }, (_, i) => ({
        product_id: guid(),
        name: `Product ${i + 1}`,
        bar_code: `${1000000000 + i}`,
        color_code: getRandomColorCode(),
        price: parseFloat((Math.random() * 900 + 100).toFixed(2)),
        price_offer: parseFloat((Math.random() * 800 + 100).toFixed(2)),
        cost: parseFloat((Math.random() * 700 + 100).toFixed(2)),
        stock: Math.floor(Math.random() * 200 + 1),
        category_id: categories[i % 10].category_id,
        status: 1,
      }));
      products.forEach(product => realm.create('Product', product));

      // Seed Customers
      const customers: Customer[] = [
        {
          id: guid(),
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '123-456-7890',
        },
        {
          id: guid(),
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '098-765-4321',
        },
      ];
      customers.forEach(customer => realm.create('Customer', customer));

      // Seed Orders
      const orders: Order[] = [];
      const now = new Date();

      for (let i = 1; i <= 20; i++) {
        const orderDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - Math.floor(Math.random() * 7),
          Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 60),
          Math.floor(Math.random() * 60)
        );

        orders.push({
          order_id: guid(),
          user_id: users[i % 2].user_id,
          total_price: Math.floor(Math.random() * 1000) + 100,
          total: Math.floor(Math.random() * 200) + 100,
          status: i % 2 === 0 ? 'completed' : 'pending',
          tax: 10,
          discount: 20,
          date: orderDate,
        });
      }

      orders.forEach(order => realm.create('Order', order));

      // Seed OrderItems
      const orderItems: OrderItem[] = [];
      for (let i = 1; i <= 20; i++) {
        const orderItemDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - Math.floor(Math.random() * 7),
          Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 60),
          Math.floor(Math.random() * 60)
        );

        orderItems.push({
          detail_id: guid(),
          order_id: orders[Math.floor((i - 1) / 2)].order_id,
          product_id: products[i % 50].product_id,
          product_name: products[i % 50].name,
          quantity: Math.floor(Math.random() * 5) + 1,
          price: Math.floor(Math.random() * 500) + 50,
          date: orderItemDate,
        });
      }

      orderItems.forEach(orderItem => realm.create('OrderItem', orderItem));

      const stock: Stock[] = products.map(product => ({
        stock_id: guid(),
        product_id: product.product_id,
        stock: product.stock, // Ensure stock is a number
        date: new Date().toISOString(),
      }));
      stock.forEach(stockItem => realm.create('Stock', stockItem));

      // Seed Payments
      const payments: Payment[] = [];
      for (let i = 1; i <= 20; i++) {
        payments.push({
          id: guid(),
          order_id: orders[i - 1].order_id,
          amount: Math.floor(Math.random() * 1000) + 100,
          payment_method: i % 2 === 0 ? 'credit_card' : 'paypal',
          date: new Date(),
        });
      }
      payments.forEach(payment => realm.create('Payment', payment));

      console.log('Database seeded successfully');
    });
  } catch (error) {
    console.log('..................', error);
  }
};

export { seedData, clearSeedData, prepareSeedData };
