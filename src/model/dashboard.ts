/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import {getRealmInstance} from './store';

import { Order } from './orders';
import { Product } from './product';
import { OrderItem } from './orderItems';

export interface ProductSalesData {
    product_id: string;
    name: string;
    total_sold: number;
}

export interface WeeklyTransactionsData {
  weekday: number;
  total: number;
}

const getBestSellingProducts = async (
  limit: number = 10
): Promise<ProductSalesData[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const orderItems = realm.objects<OrderItem>('OrderItem');
      const productSales: {
        [key: string]: {
          product_id: string;
          name: string;
          total_sold: number;
        };
      } = {};

      orderItems.forEach(orderItem => {
        if (productSales[orderItem.product_id]) {
          productSales[orderItem.product_id].total_sold += orderItem.quantity;
        } else {
          const product = realm.objectForPrimaryKey<Product>(
            'Product',
            orderItem.product_id
          );
          productSales[orderItem.product_id] = {
            product_id: orderItem.product_id,
            name: product ? product.name : 'Unknown',
            total_sold: orderItem.quantity,
          };
        }
      });

      const sortedProducts = Object.values(productSales)
        .sort((a, b) => b.total_sold - a.total_sold)
        .slice(0, limit);
      resolve(sortedProducts);
    } catch (error) {
      reject(error);
    }
  });
};


const getDailyTransaction = async (): Promise<number> => {
    const realm = await getRealmInstance();
    return new Promise((resolve, reject) => {
        try {
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0); 

          const endOfDay = new Date();
          endOfDay.setHours(23, 59, 59, 999); 
          const result = realm
            .objects<Order>('Order')
            .filtered('date >= $0 && date <= $1', startOfDay, endOfDay)
            .sum('total_price');     

          resolve(result);
        } catch (error) {
            reject(error);
        } 
    });
};

const getDailyTransactionPercentageChange = async (): Promise<number> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const startOfYesterday = new Date(yesterday);
      startOfYesterday.setHours(0, 0, 0, 0);
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);

      const todayTotal = realm
        .objects<Order>('Order')
        .filtered('date >= $0 && date <= $1', today, endOfToday)
        .sum('total_price');
      const yesterdayTotal = realm
        .objects<Order>('Order')
        .filtered('date >= $0 && date <= $1', startOfYesterday, endOfYesterday)
        .sum('total_price');

      const percentageChange =
        yesterdayTotal === 0
          ? 0
          : ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
      resolve(percentageChange);
    } catch (error) {
      reject(error);
    }
  });
};

const getMonthlySales = async (): Promise<number> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      const result = realm
        .objects<Order>('Order')
        .filtered('date >= $0 && date <= $1', startOfMonth, endOfMonth)
        .sum('total_price');
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const getLowStocks = async (threshold: number = 10): Promise<number> => {
    const realm = await getRealmInstance();
    return new Promise((resolve, reject) => {
        try {
            const result = realm
                .objects<Product>('Product')
                .filtered('stock < $0', threshold);
            resolve(result.length);
        } catch (error) {
            reject(error);
        } 
    });
};

const getWeeklySales = async (): Promise<number> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const now = new Date();
      const startOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay()
      );
      const endOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay() + 6,
        23,
        59,
        59,
        999
      );

      const result = realm
        .objects<Order>('Order')
        .filtered('date >= $0 && date <= $1', startOfWeek, endOfWeek)
        .sum('total_price');
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const getWeeklyTransactions = async (): Promise<WeeklyTransactionsData[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 6);
      lastWeek.setHours(0, 0, 0, 0);

      const orders = realm
        .objects<Order>('Order')
        .filtered('date >= $0', lastWeek);

      const result = orders
        .map(order => ({
          weekday: new Date(order.date).getDay(),
          total: order.total_price,
        }))
        .reduce<{weekday: number; total: number}[]>((acc, curr) => {
          const existingDay = acc.find(day => day.weekday === curr.weekday);
          if (existingDay) {
            existingDay.total += curr.total;
          } else {
            acc.push({weekday: curr.weekday, total: curr.total});
          }
          return acc;
        }, [])
        .sort((a, b) => a.weekday - b.weekday);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const getPreviousDayTransaction = async (): Promise<number> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0); // Start of yesterday
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999); // End of yesterday

      const result = realm
        .objects<Order>('Order')
        .filtered('date >= $0 && date <= $1', yesterday, endOfYesterday)
        .sum('total_price');

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const getDailyTransactionTrend = (): Promise<{
  dailyTransaction: number;
  trend: string;
  percentageChange: number;
}> => {
  return new Promise((resolve, reject) => {
    Promise.all([getDailyTransaction(), getPreviousDayTransaction()])
      .then(([dailyTransaction, previousDayTransaction]) => {
        let trend = 'neutral';
        let percentageChange = 0;

        if (previousDayTransaction === 0) {         
          percentageChange = dailyTransaction === 0 ? 0 : 100;
          trend = dailyTransaction === 0 ? 'neutral' : 'up';
        } else {
        
          percentageChange =
            ((dailyTransaction - previousDayTransaction) /
              previousDayTransaction) *
            100;
          percentageChange = Math.round(percentageChange * 100) / 100; 
          if (dailyTransaction > previousDayTransaction) {
            trend = 'up';
          } else if (dailyTransaction < previousDayTransaction) {
            trend = 'down';
          }
        }

        resolve({dailyTransaction, trend, percentageChange});
      })
      .catch(error => reject(error));
  });
};



export {
  getBestSellingProducts,
  getDailyTransactionPercentageChange,
  getLowStocks,
  getMonthlySales,
  getWeeklyTransactions,
  getDailyTransaction,
  getPreviousDayTransaction,
  getDailyTransactionTrend,
  getWeeklySales
};
