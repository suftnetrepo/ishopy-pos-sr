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

export interface OrdersPageParams {
  page: number;
  pageSize: number;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  status?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface OrdersPage {
  data: Order[];
  totalCount: number;
}

const queryOrdersPaginated = async (params: OrdersPageParams): Promise<OrdersPage> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const {page, pageSize, sortKey, sortDir, status, search, startDate, endDate} = params;

      let results = realm.objects<Order>('Order');

      // Status filter
      if (status && status !== 'All') {
        results = results.filtered('status ==[c] $0', status) as any;
      }

      // Date range filter
      if (startDate && endDate) {
        results = results.filtered('date >= $0 && date <= $1', startDate, endDate) as any;
      }

      // Search by table name
      if (search) {
        results = results.filtered('table_name CONTAINS[c] $0', search) as any;
      }

      const totalCount = results.length;

      // Sort
      const key = (sortKey || 'date') as keyof Order;
      const descending = sortDir === 'desc' || !sortDir;
      const sorted = results.sorted(key as string, descending);

      // Slice page
      const data = sorted
        .slice(page * pageSize, (page + 1) * pageSize)
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
          table_name: order.table_name,
          id: order.order_id,
        }));

      resolve({data, totalCount});
    } catch (error) {
      reject(error);
    }
  });
};

export {queryOrdersPaginated};