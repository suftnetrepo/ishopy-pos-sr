/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { getRealmInstance } from './store';

export interface AddOn {
  menu_id: string;
  addOnName: string;
  price: number;
  addOn_id: string;
  quantity?: number;
  status: number;
}

const insertAddon = async (
  menu_id: string,
  addOnName: string,
  price: number,
  status : number
): Promise<AddOn> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const addOn: AddOn = {
          addOn_id: guid(),
          addOnName,
          price,
          menu_id,
          status,
        };
        realm.create('AddOn', addOn);
        resolve(addOn);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryAddonByMenuId = async (menu_id: string): Promise<AddOn[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const addOns = realm
        .objects<AddOn>('AddOn')
        .filtered('menu_id == $0', menu_id)
        .map(addOn => ({
          addOn_id: addOn.addOn_id,
          addOnName: addOn.addOnName,
          menu_id: addOn.menu_id,
          price: addOn.price,
          status :addOn.status
        }));
      resolve(addOns);
    } catch (error) {
      reject(error);
    }
  });
};

const updateAddOn = async (
  addOn_id: number,
  addOnName: string,
  price: number,
  status: number
): Promise<AddOn> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const addOn = realm.objectForPrimaryKey<AddOn>('AddOn', addOn_id);
        if (addOn) {        
          addOn.addOnName = addOnName;
          addOn.price = price;
          addOn.status = status;
          resolve(addOn);
        } else {
          reject(new Error('AddOn not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteAddOn = async (addOn_id: string): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
     realm.write(() => {
       const addOn = realm.objectForPrimaryKey<AddOn>(
         'AddOn',
         addOn_id
       );
       if (addOn) {
         realm.delete(addOn);
         resolve(true);
       } else {
         reject(new Error('AddOn not found'));
       }
     });
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertAddon,
  updateAddOn,
  queryAddonByMenuId,
  deleteAddOn 
};