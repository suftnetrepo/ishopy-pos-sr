/* eslint-disable prettier/prettier */
import {getRealmInstance} from './store';

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

export {
  insertOrderItem,
  deleteOrderItem,
  queryOrderItemById,
  queryOrderItemByOrderId,
};
