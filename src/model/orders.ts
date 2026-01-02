/* eslint-disable prettier/prettier */
import {guid} from '../utils/help';
import {getRealmInstance} from './store';

export interface Order {
  order_id: string;
  user_id?: string;
  table_id: string;
  table_name?: string;
  total_price: number;
  total: number;
  status: string;
  date: Date;
  tax?: number;
  discount?: number;
}

export interface OrderStatusAggregate {
  Pending: number;
  Progress: number;
  Completed: number;
  Cancelled: number;
  total: number;
}

let cachedAggregate: OrderStatusAggregate | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

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

const updateOrderStatus = async (
  order_id: string,
  status: string,
): Promise<boolean> => {
  const realm = await getRealmInstance();
  
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const updateOrder = realm.objectForPrimaryKey<Order>('Order', order_id);
        
        if (updateOrder) {
          updateOrder.status = status;
        } else {
          throw new Error('order_id not found');
        }
      });
      
      // Resolve after write transaction completes successfully
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

const getOrderStatusAggregate = async (forceRefresh: boolean = false): Promise<OrderStatusAggregate> => {
  const realm = await getRealmInstance();
  
  return new Promise((resolve, reject) => {
    try {
      const now = Date.now();
      
      // Return cached result if still valid
      if (!forceRefresh && cachedAggregate && (now - cacheTimestamp) < CACHE_DURATION) {
        resolve(cachedAggregate);
        return;
      }
      
      // Use Realm's optimized filtered queries with case-insensitive matching
      const aggregate: OrderStatusAggregate = {
        Pending: realm.objects<Order>('Order').filtered('status ==[c] "pending"').length,
        Progress: realm.objects<Order>('Order').filtered('status ==[c] "progress"').length,
        Completed: realm.objects<Order>('Order').filtered('status ==[c] "completed"').length,
        Cancelled: realm.objects<Order>('Order').filtered('status ==[c] "cancelled"').length,
        total: realm.objects<Order>('Order').length,
      };
      
      // Update cache
      cachedAggregate = aggregate;
      cacheTimestamp = now;
      
      resolve(aggregate);
    } catch (error) {
      reject(error);
    }
  });
};

const queryAllOrders = async (): Promise<Order[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const orders = realm
        .objects<Order>('Order')
        .sorted('date', true)
        .map(order => ({
          order_id: order.order_id,
          user_id: order.user_id,
          table_id: order.table_id,
          total_price: order.total_price,
          total: order.total,
          status: order.status,
          date: order.date,
          tax: order.tax,
          discount: order.discount,
          table_name:order.table_name
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
          table_id: order.table_id,
          total_price: order.total_price,
          total: order.total,
          status: order.status,
          date: order.date,
          tax: order.tax,
          discount: order.discount,
          table_name:order.table_name
        }));
      resolve(orders);
    } catch (error) {
      reject(error);
    }
  });
};

const queryOrderById = async (order_id: string): Promise<Order | null> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const order = realm.objectForPrimaryKey<Order>('Order', order_id);
      resolve(
        order
          ? {
              order_id: order.order_id,
              user_id: order.user_id,
              table_id: order.table_id,
              total_price: order.total_price,
              total: order.total,
              status: order.status,
              date: order.date,
              tax: order.tax,
              discount: order.discount,
              table_name:order.table_name
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
  getOrderStatusAggregate,
  updateOrderStatus
};
