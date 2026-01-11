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
  mode?: string;
  theme?: string;
  receipt_header?: string;
  receipt_footer?: string;
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

const queryAllShops = async (): Promise<Shop | null> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      // Since there's only ever one shop, get the first one
      const shopObj = realm.objects<Shop>('Shop')[0];
      
      if (!shopObj) {
        resolve(null);
        return;
      }

      const shop: Shop = {
        shop_id: shopObj.shop_id,
        name: shopObj.name,
        mobile: shopObj.mobile,
        email: shopObj.email,
        address: shopObj.address,
        description: shopObj.description,
        currency: shopObj.currency,
        mode: shopObj.mode,
        theme: shopObj.theme,
        receipt_header: shopObj.receipt_header,
        receipt_footer: shopObj.receipt_footer,
      };
      
      resolve(shop);
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
              mode: shop.mode,
              theme: shop.theme,
              receipt_header: shop.receipt_header,
              receipt_footer: shop.receipt_footer,
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
        // Since there's only ever one shop in the database, get the first (and only) shop
        const allShops = realm.objects<Shop>('Shop');
        
        if (allShops.length === 0) {
          reject(new Error('No shop found in database'));
          return;
        }

        const existingShop = allShops[0];
        
        // Update all shop properties (DO NOT update shop_id - it's the primary key)
        existingShop.name = shop.name;
        existingShop.mobile = shop.mobile;
        existingShop.email = shop.email;
        existingShop.address = shop.address;
        existingShop.description = shop.description;
        existingShop.currency = shop.currency;
        existingShop.mode = shop.mode;
        existingShop.theme = shop.theme;
        existingShop.receipt_header = shop.receipt_header;
        existingShop.receipt_footer = shop.receipt_footer;
        
        // Create a copy of the object data before the transaction ends
        const updatedShop: Shop = {
          shop_id: existingShop.shop_id,
          name: existingShop.name,
          mobile: existingShop.mobile,
          email: existingShop.email,
          address: existingShop.address,
          description: existingShop.description,
          currency: existingShop.currency,
          mode: existingShop.mode,
          theme: existingShop.theme,
          receipt_header: existingShop.receipt_header,
          receipt_footer: existingShop.receipt_footer,
        };
        
        resolve(updatedShop);
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