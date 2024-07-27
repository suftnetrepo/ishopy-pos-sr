/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import {getRealmInstance} from './store';

export interface Order {
  order_id: string;
  user_id?: string;
  total_price: number;
  total: number;
  status: string;
  date: Date;
  tax?: number;
  discount?: number;
}

const insertOrder = async (order: Omit<Order, 'order_id'>): Promise<Order> => {
     const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {          
      realm.write(() => {
        const newOrder: Order = {
          order_id: guid(),
          ...order,
        };
        realm.create('Order', newOrder);     
        resolve(newOrder);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryAllOrders = async(): Promise<Order[]> => {
       const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const orders = realm
        .objects<Order>('Order')
        .sorted('date', true)
        .map(order => ({
          order_id: order.order_id,
          user_id: order.user_id,
          total_price: order.total_price,
          total: order.total,
          status: order.status,
          date: order.date,
          tax: order.tax,
          discount: order.discount,
        }));
      resolve(orders);
    } catch (error) {
      reject(error);
    } 
  });
};

const queryOrdersByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<Order[]> => {
  const realm = await getRealmInstance();
   return new Promise((resolve, reject) => {
    try {
      const orders = realm
        .objects<Order>('Order')
        .filtered('date >= $0 AND date <= $1', startDate, endDate)
        .sorted('date', true)
        .map(order => ({
          order_id: order.order_id,
          user_id: order.user_id,
          total_price: order.total_price,
          total: order.total,
          status: order.status,
          date: order.date,
          tax: order.tax,
          discount: order.discount,
        }));     
      resolve(orders);
    } catch (error) {
      reject(error);
    }
  });
};

const queryOrderById = async(order_id: string): Promise<Order | null> => {
       const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const order = realm.objectForPrimaryKey<Order>('Order', order_id);
      resolve(
        order
          ? {
              order_id: order.order_id,
              user_id: order.user_id,
              total_price: order.total_price,
              total: order.total,
              status: order.status,
              date: order.date,
              tax: order.tax,
              discount: order.discount,
            }
          : null
      );
    } catch (error) {
      reject(error);
    } 
  });
};

const deleteOrder = async (order_id: string): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const orderItemsCount = realm
        .objects('OrderItem')
        .filtered('order_id == $0', order_id).length;
      if (orderItemsCount > 0) {
        reject(
          new Error(
            'Cannot delete order: Order items are associated with this order.'
          )
        );
      } else {
        realm.write(() => {
          const order = realm.objectForPrimaryKey<Order>('Order', order_id);
          if (order) {
            realm.delete(order);
            resolve(true);
          } else {
            reject(new Error('Order not found'));
          }
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertOrder,
  deleteOrder,
  queryAllOrders,
  queryOrderById,
  queryOrdersByDateRange,
};
