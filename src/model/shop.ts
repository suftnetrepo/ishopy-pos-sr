/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { getRealmInstance } from './store';

export interface Shop {
  shop_id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  description?: string;
  currency?: string;
}

const insertShop = async (
  shop: Omit<Shop, 'shop_id'>
): Promise<Shop> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const newShop = {
          shop_id: guid(),
          ...shop,
        };
        realm.create('Shop', newShop);
        resolve(newShop);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryAllShops = async (): Promise<Shop> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const shops = realm
        .objects<Shop>('Shop')
        .sorted('name')
        .map(shop => ({
          shop_id: shop.shop_id,
          name: shop.name,
          mobile: shop.mobile,
          email: shop.email,
          address: shop.address,
          description: shop.description,
          currency: shop.currency,
        }))[0];  
      resolve(shops || null);
    } catch (error) {
      reject(error);
    }
  });
};

const queryShopById = async (shop_id: string): Promise<Shop | null> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const shop = realm.objectForPrimaryKey<Shop>('Shop', shop_id);
      resolve(
        shop
          ? {
              shop_id: shop.shop_id,
              name: shop.name,
              mobile: shop.mobile,
              email: shop.email,
              address: shop.address,
              description: shop.description,
              currency: shop.currency,
            }
          : null
      );
    } catch (error) {
      reject(error);
    }
  });
};

const updateShop = async (
 shop : Shop
): Promise<Shop> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const updateShop = realm.objectForPrimaryKey<Shop>('Shop', shop.shop_id);
        if (updateShop) {
          (updateShop.name = shop.name),
            (updateShop.mobile = shop.mobile),
            (updateShop.email = shop.email),
            (updateShop.address = shop.address),
            (updateShop.description = shop.description),
              (updateShop.currency= shop.currency)
            resolve(updateShop);
        } else {
          reject(new Error('Shop not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteShop = async (shop_id: string): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const shop = realm.objectForPrimaryKey<Shop>('Shop', shop_id);
        if (shop) {
          realm.delete(shop);
          resolve(true);
        } else {
          reject(new Error('Shop not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertShop,
  updateShop,
  queryAllShops,
  deleteShop,
  queryShopById,
};