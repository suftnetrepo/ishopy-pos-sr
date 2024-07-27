/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { getRealmInstance } from './store';

export interface Table {
  table_id: string;
  tableName: string;
  status: number;
  isOccupied: number;
  size: number;
} 

const insertTable = async (
  tableName: string,
  status: number = 0,
  isOccupied: number = 0,
  size: number = 0
): Promise<Table> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const table: Table = {
          table_id: guid(),
          tableName,
          status,
          isOccupied,
          size,
        };
        realm.create('Table', table);
        resolve(table);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryAllTables = async (): Promise<Table[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const tables = realm
        .objects<Table>('Table')
        .sorted('tableName')
        .map(table => ({
          table_id: table.table_id,
          tableName: table.tableName,
          status: table.status,
          isOccupied: table.isOccupied,
          size: table.size,
        }));
      resolve(tables);
    } catch (error) {
      reject(error);
    }
  });
};

const queryTablesByStatus = async (status: number): Promise<Table[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const tables = realm
        .objects<Table>('Table')
        .filtered('status == $0', status)
        .sorted('tableName')
        .map(table => ({
          table_id: table.table_id,
          tableName: table.tableName,
          status: table.status,
          isOccupied: table.isOccupied,
          size: table.size,
        }));

      resolve(tables);
    } catch (error) {
      reject(error);
    }
  });
};

const updateTable = async (
  table_id: number,
  tableName: string,
  status: number = 0,
  isOccupied: number = 0,
  size: number = 0
): Promise<Table> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const table = realm.objectForPrimaryKey<Table>('Table', table_id);

        if (table) {
          table.tableName = tableName;
          table.status = status;
          table.isOccupied = isOccupied;
          table.size = size;
          resolve(table);
        } else {
          reject(new Error('Table not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteTable = async (table_id: number): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
       realm.write(() => {
         const table = realm.objectForPrimaryKey<Table>('Table', table_id);
         if (table) {
           realm.delete(table);
           resolve(true);
         } else {
           reject(new Error('Table not found'));
         }
       });
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertTable,
  updateTable,
  queryTablesByStatus,
  queryAllTables,
  deleteTable
};