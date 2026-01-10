/* eslint-disable prettier/prettier */
import {getRealmInstance} from './store';
import {Order} from './orders';

type RecentOrderWithItemCount = {
  order: Order;
  item_count: number;
};

export interface OrderItem {
  detail_id: string;
  order_id: string;
  menu_id: string;
  menu_name: string;
  menu_icon_name? : string;
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
  menu_icon_name? : string;
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
          menu_icon_name: orderItem.menu_icon_name,
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
              menu_icon_name: orderItem.menu_icon_name,
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
      
      // Return empty array if no order items exist
      if (orderItems.length === 0) {
        resolve([]);
        return;
      }
      
      // Use a plain object for better performance
      const menuStats: Record<string, PopularMenuItem> = {};
      
      // Aggregate data for each menu item
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
            menu_icon_name :item.menu_icon_name,
            total_quantity: item.quantity,
            order_count: 1,
            total_revenue: item.price * item.quantity,
            average_price: 0,
          };
        }
      }
      
      // Convert to array, calculate average price, sort, and limit
      const popularItems = Object.values(menuStats)
        .map(item => ({
          ...item,
          average_price: item.total_revenue / item.total_quantity,
        }))
        .sort((a, b) => {
          // Sort by total_quantity first (descending)
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

const queryRecentOrders = async (
  limit: number = 5
): Promise<RecentOrderWithItemCount[]> => {
  const realm = await getRealmInstance();

  return new Promise((resolve, reject) => {
    try {
      // 1️⃣ Get latest N orders
      const recentOrders = realm
        .objects<Order>('Order')
        .sorted('date', true) // DESC → latest first
        .slice(0, limit);

      if (recentOrders.length === 0) {
        resolve([]);
        return;
      }

      // 2️⃣ Collect order IDs
      const orderIds = recentOrders.map(o => o.order_id);

      // 3️⃣ Fetch items only for those orders
      const orderItems = realm
        .objects<OrderItem>('OrderItem')
        .filtered('order_id IN $0', orderIds);

      // 4️⃣ Count items per order
      const itemCountMap: Record<string, number> = {};

      for (const item of orderItems) {
        itemCountMap[item.order_id] =
          (itemCountMap[item.order_id] ?? 0) + item.quantity;
      }

      // 5️⃣ Build final response (order + item count)
      const result: RecentOrderWithItemCount[] = recentOrders.map(order => ({
        order,
        item_count: itemCountMap[order.order_id] ?? 0,
      }));

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
