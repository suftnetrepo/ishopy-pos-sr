/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { getRealmInstance } from './store';

export interface Discount {
  discount_id: string;
  name: string;
  status: number;
  rate: number;
}

const insertDiscount = async (
  discount: Omit<Discount, 'discount_id'>
): Promise<Discount> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const newDiscount = {
          discount_id: guid(),
          ...discount,
        };
        realm.create('Discount', newDiscount);
        resolve(newDiscount);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryAllDiscounts = async (): Promise<Discount[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const discounts = realm
        .objects<Discount>('Discount')
        .sorted('name')
        .map(discount => ({
          discount_id: discount.discount_id,
          name: discount.name,
          rate: discount.rate,
          status: discount.status,
        }));
      resolve(discounts);
    } catch (error) {
      reject(error);
    }
  });
};

const queryByStatus = async (status: number): Promise<Discount[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const discounts = realm
        .objects<Discount>('Discount')
        .filtered('status == $0', status)
        .sorted('name')
        .map(discount => ({
          discount_id: discount.discount_id,
          name: discount.name,
          rate: discount.rate,
          status: discount.status,
        }));
      resolve(discounts);
    } catch (error) {
      reject(error);
    }
  });
};

const queryDiscountById = async (discount_id: number): Promise<Discount | null> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const discount = realm.objectForPrimaryKey<Discount>(
        'Discount',
        discount_id
      );
      resolve(
        discount
          ? {
              discount_id: discount.discount_id,
              name: discount.name,
              rate: discount.rate,
              status: discount.status,
            }
          : null
      );
    } catch (error) {
      reject(error);
    }
  });
};

const updateDiscount = async (
  discount_id: number,
  name: string,
  status: number,
  rate: number
): Promise<Discount> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const discount = realm.objectForPrimaryKey<Discount>(
          'Discount',
          discount_id
        );
        if (discount) {
          discount.name = name;
          discount.status = status;
          discount.rate = rate;
          resolve(discount);
        } else {
          reject(new Error('Discount not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteDiscount = async (discount_id: number): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const discount = realm.objectForPrimaryKey<Discount>(
          'Discount',
          discount_id
        );
        if (discount) {
          realm.delete(discount);
          resolve(true);
        } else {
          reject(new Error('Discount not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertDiscount,
  updateDiscount,
  queryByStatus,
  queryAllDiscounts,
  deleteDiscount,
  queryDiscountById,
};