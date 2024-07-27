/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { getRealmInstance } from './store';

export interface Tax {
  tax_id: string;
  name: string;
  status: number;
  rate: number;
}

const insertTax = async (
  tax: Omit<Tax,'tax_id'>
): Promise<Tax> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const newTax = {
          tax_id: guid(), 
          ...tax,
        };
        realm.create('Tax', newTax);
        resolve(newTax);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryAllTaxes = async (): Promise<Tax[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const taxes = realm
        .objects<Tax>('Tax')
        .sorted('name')
        .map(tax => ({
          tax_id: tax.tax_id,
          name: tax.name,
          rate: tax.rate,
          status: tax.status,
        }));
      resolve(taxes);
    } catch (error) {
      reject(error);
    }
  });
};

const queryByStatus = async (status: number): Promise<Tax[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const taxes = realm
        .objects<Tax>('Tax')
        .filtered('status == $0', status)
        .sorted('name')
        .map(tax => ({
          tax_id: tax.tax_id,
          name: tax.name,
          rate: tax.rate,
          status: tax.status,
        }));
      resolve(taxes);
    } catch (error) {
      reject(error);
    }
  });
};

const queryTaxById = async (tax_id: number): Promise<Tax | null> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const tax = realm.objectForPrimaryKey<Tax>('Tax', tax_id);
      resolve(
        tax
          ? {
              tax_id: tax.tax_id,
              name: tax.name,
              rate: tax.rate,
              status: tax.status,
            }
          : null
      );
    } catch (error) {
      reject(error);
    }
  });
};

const updateTax = async (
  tax_id: number,
  name: string,
  status: number,
  rate: number
): Promise<Tax> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const tax = realm.objectForPrimaryKey<Tax>(
          'Tax',
          tax_id
        );
        if (tax) {
          tax.name = name;
          tax.status = status;
          tax.rate = rate;
          resolve(tax);
        } else {
          reject(new Error('Tax not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteTax = async (tax_id: number): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const tax = realm.objectForPrimaryKey<Tax>('Tax', tax_id);
        if (tax) {
          realm.delete(tax);
          resolve(true);
        } else {
          reject(new Error('Tax not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertTax,
  updateTax,
  queryByStatus,
  queryTaxById,
  deleteTax,
  queryAllTaxes,
};