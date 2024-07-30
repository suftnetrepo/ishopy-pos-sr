/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { getRealmInstance } from './store';
import { 
  Customer, 
  Stock,
  Tax,
  Discount,
  Shop, 
  Payment
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


// Helper functions
const randomItem = (items: string | any[]) => items[Math.floor(Math.random() * items.length)];
const randomPrice = () => parseFloat((Math.random() * (20 - 5) + 5).toFixed(2));
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = () => new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
const randomColor = () => {
  const colors = Object.values(colorPalettes);
  const randomPalette = colors[Math.floor(Math.random() * colors.length)];
  return randomPalette[Math.floor(Math.random() * randomPalette.length)];
};

// Sample data pools
const userNames = ["Alice", "Bob", "Charlie", "Diana"];
const paymentMethods = ["Cash", "Credit Card", "PayPal"];
const categoryNames = ['Main Course', 'Dessert', 'Drinks', 'Appetizers'];
const cuisines = [
  'Italian',
  'Mexican',
  'American',
  'Japanese',
  'Chinese',
  'Indian',
  'French',
  'Mediterranean',
  'Thai',
  'Greek',
];

// List of dish types
const dishTypes = [
  'Pizza',
  'Taco',
  'Burger',
  'Sushi',
  'Noodles',
  'Curry',
  'Salad',
  'Soup',
  'Steak',
  'Sandwich',
];

const addOnTypes = [
  'Extra Cheese',
  'Extra Sauce',
  'Side Salad',
  'Drink',
  'Dessert',
];

const generateAddOns = (menus: any[]) => {
  let addOns: {
    quantity: number;
    addOn_id: string;
    addOnName: string;
    price: number;
    menu_id: any;
    status: number;
  }[] = [];
  menus.forEach((menu: { name: any; menu_id: any; }) => {
    const numberOfAddOns = Math.floor(Math.random() * 3) + 1; // Each menu can have 1 to 3 add-ons
    for (let i = 0; i < numberOfAddOns; i++) {
      addOns.push({
        addOn_id: guid(),
        addOnName: `${randomItem(addOnTypes)} for ${menu.name}`,
        price: parseFloat((Math.random() * 5).toFixed(2)),
        menu_id: menu.menu_id,
        quantity : 1,
        status:1,
      });
    }
  });
  return addOns;
};

function generateMenuItemNames() {
  let menuNames: string[] = [];
  let attempts = 0;

  while (menuNames.length < 50 && attempts < 500) {
    let cuisine = randomItem(cuisines);
    let dishType = randomItem(dishTypes);
    let menuItemName = `${cuisine} ${dishType}`;

    // Ensure uniqueness
    if (!menuNames.includes(menuItemName)) {
      menuNames.push(menuItemName);
    }
    attempts++;
  }

  return menuNames;
}

// Generate Categories
const generateCategories = () => {
  return categoryNames.map((name, _) => ({
    category_id: guid(),
    name: name,
    color_code: randomColor(),
    status:1,
  }));
};

// Generate Menu Items
const generateMenuItems = (categories: { category_id: string; name: string; color_code: string; status: number; }[]) => {
  let menus = [];
  let menuNames = generateMenuItemNames(); 
  for (let i = 0; i < 50; i++) {
    menus.push({
      menu_id: guid(),
      name: menuNames[i],
      bar_code: Math.random() < 0.5 ? guid() : null,
      color_code: randomColor(),
      price: randomPrice(),
      price_offer: randomPrice(),
      cost: randomPrice(),
      stock: Math.floor(Math.random() * 100),
      category_id: randomItem(categories).category_id,
      status: Math.random() < 0.5 ? 1 : 0,
      description: `Description for menu item ${i + 1}`
    });
  }
  return menus;
};

// Generate sample users
const generateUsers = () => {
  return userNames.map(name => ({
    user_id: guid(),
    username: "user",
    password: "user123",
    first_name: name,
    last_name: 'Smith',
    pass_code: 1234,
    status: 1,
    role: 'user',
  }));
};

// Generate sample tables
const generateTables = () => {
  const tableNames =[]
   for (let i = 1; i < 20; i++) {
      tableNames.push(`Table ${i}`);
   }
  return tableNames.map(name => ({
    table_id: guid(),
    tableName: name,
    isOccupied: 0,
    status: randomInt(0, 1),
    size: randomInt(2, 8),
  }));
};

// Generate Orders
const generateOrders = (users: { user_id: string; username: string; password: string; first_name: string; last_name: string; pass_code: any; status: number; role: string; }[], tables: { table_id: string; tableName: string; isOccupied: any; status: any; size: any; }[]) => {
  let orders = [];
  for (let i = 0; i < 20; i++) {
    const user = randomItem(users);
    const table = randomItem(tables);
    const total_price = randomPrice() + randomPrice();
    orders.push({
      order_id: guid(),
      user_id: user.user_id,
      table_id: table.table_id,
      total_price: total_price,
      tax: total_price * 0.1,
      discount: total_price * 0.05,
      status: randomItem(['Pending', 'Completed', 'Cancelled']),
      date: randomDate(),
    });
  }
  return orders;
};

// Generate OrderItems
const generateOrderItems = (orders: any[], menus: any[], addOns: any[]) => {
  let orderItems: {
    detail_id: string;
    order_id: string;
    menu_id: string;
    menu_name: string;
    quantity: number;
    price: number;
    date: Date;
    addOns: string;
  }[] = [];

  orders.forEach((order: {order_id: any; date: any}) => {
    const numberOfItems = randomInt(1, 5); // Each order can have between 1 and 5 items
    for (let i = 0; i < numberOfItems; i++) {
      const menu = randomItem(menus);
      const applicableAddOns = addOns?.filter(
        (addOn: {menu_id: string}) => addOn.menu_id === menu.menu_id
      );

      // Ensure exactly 2 add-ons are selected
      let selectedAddOns: any[] = [];
      if (applicableAddOns && applicableAddOns.length >= 2) {
        while (selectedAddOns.length < 2) {
          const randomAddOn = randomItem(applicableAddOns);
          if (!selectedAddOns.includes(randomAddOn)) {
            selectedAddOns.push(randomAddOn);
          }
        }
      } else {
        // Handle cases where there are less than 2 applicable add-ons
        selectedAddOns = applicableAddOns;
      }
  
      orderItems.push({
        detail_id: guid(),
        order_id: order.order_id,
        menu_id: menu.menu_id,
        menu_name: menu.name,
        quantity: randomInt(1, 3),
        price: menu.price,
        date: order.date,
        addOns: selectedAddOns.length ? JSON.stringify(selectedAddOns) : '',
      });
    }
  });

  return orderItems;
};

// Generate Payments
const generatePayments = (orders: any[]) => {
  return orders.map((order: { order_id: any; total_price: number; discount: number; tax: number; date: any; }) => ({
    id: guid(),
    order_id: order.order_id,
    amount: order.total_price - order.discount + order.tax,
    payment_method: randomItem(paymentMethods),
    date: order.date,
  }));
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
     realm.delete(realm.objects('Menu'));
     realm.delete(realm.objects('Stock'));
     realm.delete(realm.objects('Table'));
     realm.delete(realm.objects('AddOn'));
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

  const users = generateUsers();
  const tables = generateTables();
  const categories = generateCategories();
  const menus = generateMenuItems(categories);
  const addOns = generateAddOns(menus);
  const orders = generateOrders(users, tables);
  const orderItems = generateOrderItems(orders, menus, addOns);
  const payments = generatePayments(orders);

  try {
    realm.write(() => {
      realm.deleteAll();  

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
    
      const stock: Stock[] = menus.map(menu => ({
        stock_id: guid(),
        menu_id: menu.menu_id,
        stock: menu.stock, 
        date: new Date().toISOString(),
      }));
      stock.forEach(stockItem => realm.create('Stock', stockItem));

      users.forEach(user => realm.create('User', user));
      tables.forEach(table => realm.create('Table', table));
      categories.forEach(category => realm.create('Category', category));
      menus.forEach(menu => realm.create('Menu', menu));
      addOns.forEach(addOn => realm.create('AddOn', addOn));
      orders.forEach(order => realm.create('Order', order));
      orderItems.forEach(item => realm.create('OrderItem', item));
      payments.forEach((payment:Payment) => realm.create('Payment', payment));

      console.log('Database seeded successfully');
    });
  } catch (error) {
    console.log('..................', error);
  }
};

export { seedData, clearSeedData, prepareSeedData };
