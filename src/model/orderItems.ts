/* eslint-disable prettier/prettier */
import {getRealmInstance} from './store';
import {Order} from './orders';

export interface OrderItem {
  detail_id: string;
  order_id: string;
  menu_id: string;
  menu_name: string;
  quantity: number;
  price: number;
  date: Date;
  addOns: string;
}

export interface RecentOrderDisplay {
  menu_name: string;
  quantity: number;
  status: string;
  latest_date: Date;
  order_count: number;
}

export interface PopularMenuItem {
  menu_id: string;
  menu_name: string;
  total_quantity: number;
  order_count: number;
  total_revenue: number;
  average_price: number;
}

const insertOrderItem = async(
  orderItem: OrderItem
): Promise<OrderItem> => {
       const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const newOrderItem: OrderItem = {        
          ...orderItem,
        };
        realm.create('OrderItem', newOrderItem);
        resolve(newOrderItem);
      });
    } catch (error) {
      reject(error);
    } 
  });
};

const queryOrderItemByOrderId = async(order_id: string): Promise<OrderItem[]> => {
       const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const orderItems = realm
        .objects<OrderItem>('OrderItem')
        .filtered('order_id == $0', order_id)
        .sorted('date', true)
        .map(orderItem => ({
          detail_id: orderItem.detail_id,
          order_id: orderItem.order_id,
          menu_id: orderItem.menu_id,
          menu_name: orderItem.menu_name,
          quantity: orderItem.quantity,
          price: orderItem.price,
          date: orderItem.date,
          addOns :orderItem.addOns
        }));     

      resolve(orderItems);
    } catch (error) {
      reject(error);
    } 
  });
};

const queryOrderItemById = async(detail_id: string): Promise<OrderItem | null> => {
       const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const orderItem = realm.objectForPrimaryKey<OrderItem>(
        'OrderItem',
        detail_id
      );
      resolve(
        orderItem
          ? {
              detail_id: orderItem.detail_id,
              order_id: orderItem.order_id,
              menu_id: orderItem.menu_id,
              menu_name: orderItem.menu_name,
              quantity: orderItem.quantity,
              price: orderItem.price,
              date: orderItem.date,
              addOns: orderItem.addOns,
            }
          : null
      );
    } catch (error) {
      reject(error);
    } 
  });
};

const deleteOrderItem = async (detail_id: string): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const orderItem = realm.objectForPrimaryKey<OrderItem>(
          'OrderItem',
          detail_id
        );
        if (orderItem) {
          realm.delete(orderItem);
          resolve(true);
        } else {
          reject(new Error('OrderItem not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getMostPopularMenuByQuantity = async (limit: number = 10): Promise<PopularMenuItem[]> => {
  const realm = await getRealmInstance();
  
  return new Promise((resolve, reject) => {
    try {
      const orderItems = realm.objects<OrderItem>('OrderItem');
      
      // Optimization 1: Use a plain object instead of Map for better performance
      const menuStats: Record<string, PopularMenuItem> = {};
      
      // Optimization 2: Use for-of loop which is generally faster than forEach
      for (const item of orderItems) {
        const key = item.menu_id;
        const existing = menuStats[key];
        
        if (existing) {
          existing.total_quantity += item.quantity;
          existing.order_count += 1;
          existing.total_revenue += (item.price * item.quantity);
        } else {
          menuStats[key] = {
            menu_id: item.menu_id,
            menu_name: item.menu_name,
            total_quantity: item.quantity,
            order_count: 1,
            total_revenue: item.price * item.quantity,
            average_price: 0, // Optimization 3: Defer average_price calculation to final step
          };
        }
      }
      
      // Optimization 4: Convert to array and process in one pass
      const popularItems = Object.values(menuStats)
        .map(item => ({
          ...item,
          average_price: item.total_revenue / item.total_quantity,
        }))
        // Optimization 5: Use more efficient sorting for large datasets
        .sort((a, b) => {
          // Compare total_quantity first (descending)
          if (a.total_quantity !== b.total_quantity) {
            return b.total_quantity - a.total_quantity;
          }
          // Fallback to revenue if quantities are equal
          return b.total_revenue - a.total_revenue;
        })
        .slice(0, limit);
        
      resolve(popularItems);
    } catch (error) {
      reject(error);
    }
  });
};

const queryRecentOrders = async (limit: number = 50): Promise<RecentOrderDisplay[]> => {
  const realm = await getRealmInstance();

  return new Promise((resolve, reject) => {
    try {
      // Optimization 1: Query only recent orders to reduce dataset size
      const recentOrders = realm.objects<Order>('Order')
        .sorted('date', true)
        .slice(0, limit * 5); // Get more orders than needed to ensure good coverage

      // Optimization 2: Create order map only for recent orders
      const orderMap = new Map<string, Order>();
      for (const order of recentOrders) {
        orderMap.set(order.order_id, order);
      }

      // Optimization 3: Query only items from recent orders
      const orderIds = Array.from(orderMap.keys());
      const recentItems = realm.objects<OrderItem>('OrderItem')
        .filtered('order_id IN $0', orderIds);

      // Optimization 4: Use plain object for grouping (faster than Map)
      const grouped: Record<string, RecentOrderDisplay> = {};

      for (const item of recentItems) {
        const order = orderMap.get(item.order_id);
        if (!order) continue;

        const key = item.menu_name;
        const existing = grouped[key];

        if (!existing) {
          grouped[key] = {
            menu_name: item.menu_name,
            quantity: item.quantity,
            status: order.status,
            latest_date: order.date,
            order_count: 1
          };
        } else {
          grouped[key] = {
            ...existing,
            quantity: existing.quantity + item.quantity,
            latest_date: order.date > existing.latest_date ? order.date : existing.latest_date,
            status: order.date > existing.latest_date ? order.status : existing.status,
            order_count: existing.order_count + 1
          };
        }
      }

      // Optimization 5: Sort by most recently ordered and limit results
      const result = Object.values(grouped)
        .sort((a, b) => b.latest_date.getTime() - a.latest_date.getTime())
        .slice(0, limit);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertOrderItem,
  deleteOrderItem,
  queryOrderItemById,
  queryOrderItemByOrderId,
  getMostPopularMenuByQuantity,
  queryRecentOrders
};
