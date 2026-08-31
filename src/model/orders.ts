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

// Deletes an order along with everything that references it (its
// OrderItems, and — restaurant mode — its KitchenTicket/KitchenItems).
//
// This used to refuse to delete any order that still had OrderItems, which
// is every real, placed order. The "+ Order" flow (add more items to an
// already-placed order) calls this expecting it to clear the old order
// before recreating it with the updated cart — but since it always failed
// silently (the caller ignored the rejection and proceeded anyway), every
// "add more items" actually left the original order + its kitchen ticket
// orphaned in the database and created a brand-new duplicate order with the
// same items instead of updating it. That duplicate never gets paid off or
// closed out, so it sits inflating the "In progress" count and — in
// restaurant mode — the kitchen would see the same food ticketed twice.
const deleteOrder = async (order_id: string): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const order = realm.objectForPrimaryKey<Order>('Order', order_id);
        if (!order) {
          throw new Error('Order not found');
        }

        realm.delete(
          realm.objects('OrderItem').filtered('order_id == $0', order_id),
        );

        // KitchenTicket.ticket_id === order_id (see createKitchenTicket).
        const ticket = realm.objectForPrimaryKey('KitchenTicket', order_id);
        if (ticket) {
          realm.delete(
            realm.objects('KitchenItem').filtered('ticket_id == $0', order_id),
          );
          realm.delete(ticket);
        }

        realm.delete(order);
      });
      resolve(true);
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