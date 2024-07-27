/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import {getRealmInstance} from './store';

export interface Stock {
  stock_id: string;
  product_id: string;
  stock: number | undefined;
  date: string;
}

const insertStock = async (
  product_id: string,
  stock: number = 0
): Promise<Stock> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const newStock: Stock = {
          stock_id: guid(),
          product_id,
          stock,
          date: new Date().toISOString(),
        };
        realm.create('Stock', newStock);
        resolve(newStock);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryStockById = async (stock_id: string): Promise<Stock | null> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const stock = realm.objectForPrimaryKey<Stock>('Stock', stock_id);
      resolve(
        stock
          ? {
              stock_id: stock.stock_id,
              product_id: stock.product_id,
              stock: stock.stock,
              date: stock.date,
            }
          : null
      );
    } catch (error) {
      reject(error);
    }
  });
};

const queryStockByProductId = async (product_id: string): Promise<Stock[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const stocks = realm
        .objects<Stock>('Stock')
        .filtered('product_id == $0', product_id)
        .map(stock => ({
          stock_id: stock.stock_id,
          product_id: stock.product_id,
          stock: stock.stock,
          date: stock.date,
        }));
      resolve(stocks);
    } catch (error) {
      reject(error);
    }
  });
};

const updateStock = async (
  stock_id: string,
  product_id: string,
  stock: number
): Promise<Stock> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const existingStock = realm.objectForPrimaryKey<Stock>(
          'Stock',
          stock_id
        );
        if (existingStock) {
          existingStock.product_id = product_id;
          existingStock.stock = stock;
          resolve(existingStock);
        } else {
          reject(new Error('Stock not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteStock = async (stock_id: number): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const stock = realm.objectForPrimaryKey<Stock>('Stock', stock_id);
        if (stock) {
          realm.delete(stock);
          resolve(true);
        } else {
          reject(new Error('Stock not found'));
        }
      });
    } catch (error) {
      reject(error);
    } 
  });
};

export {
  insertStock,
  updateStock,
  deleteStock,
  queryStockById,
  queryStockByProductId,
};


