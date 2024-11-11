/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */
/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { AddOn, queryAddonByMenuId } from './addOn';
import { getRealmInstance} from './store';
import { Category } from './types';

export interface Menu {
  menu_id: string;
  name: string;
  bar_code?: string;
  color_code?: string;
  price: number;
  price_offer?: number;
  cost?: number;
  stock?: number;
  category_id?: string;
  category_name?: string;
  status?: number;
  description?: string;
  addOns?: AddOn[]
}

const insertMenu = async (
  menu: Omit<Menu, 'menu_id'>
): Promise<Menu> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const newMenu: Menu = {
          menu_id: guid(),
          ...menu,
        };
        realm.create('Menu', newMenu);
        resolve(newMenu);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryAllMenus = async (
  sortBy: keyof Menu = 'menu_id',
  sortOrder: 'ASC' | 'DESC' = 'ASC'
): Promise<Menu[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const menus = realm
        .objects<Menu>('Menu')
        .sorted(sortBy, sortOrder === 'ASC')
        .map(menu => ({
          menu_id: menu.menu_id,
          name: menu.name,
          bar_code: menu.bar_code,
          color_code: menu.color_code,
          price: menu.price,
          price_offer: menu.price_offer,
          cost: menu.cost,
          stock: menu.stock,
          category_id: menu.category_id,
          status: menu.status,
          description: menu.description,
        }));

      const categories = realm.objects<Category>('Category');
      const categoryMap = categories.reduce(
        (acc: {[key: string]: string}, category) => {
          acc[category.category_id] = category.name;
          return acc;
        },
        {}
      );

      const enrichedMenus = menus.map(menu => ({
        ...menu,
        category_name:
          categoryMap[menu?.category_id || 0] || 'Unknown Category',
      }));

      resolve(enrichedMenus);
    } catch (error) {
      reject(error);
    }
  });
};

const queryMenuByStatus = async (status: number = 1): Promise<Menu[]> => {
  try {
    const realm = await getRealmInstance();
    const menus = realm
      .objects<Menu>('Menu')
      .filtered('status == $0', status)
      .sorted('name');
   
    const menusWithAddOns = await Promise.all(
      menus.map(async menu => {
        const addOns = await queryAddonByMenuId(menu.menu_id);           
        return {
          menu_id: menu.menu_id,
          name: menu.name,
          bar_code: menu.bar_code,
          color_code: menu.color_code,
          price: menu.price,
          price_offer: menu.price_offer,
          cost: menu.cost,
          stock: menu.stock,
          category_id: menu.category_id,
          status: menu.status,
          description: menu.description,
          addOns: addOns,
        };
      })
    );

    return menusWithAddOns;
  } catch (error) {
     throw error;
  }
};

const queryMenuByName = async (name: string): Promise<Menu[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const nameFilter = 'name CONTAINS[c] $0';
      const menusQuery = realm
        .objects<Menu>('Menu')
        .filtered(nameFilter, name);

      const menus = menusQuery.sorted('name').map(menu => ({
        menu_id: menu.menu_id,
        name: menu.name,
        bar_code: menu.bar_code,
        color_code: menu.color_code,
        price: menu.price,
        price_offer: menu.price_offer,
        cost: menu.cost,
        stock: menu.stock,
        category_id: menu.category_id,
        status: menu.status,
        description: menu.description,
      }));

      resolve(menus);
    } catch (error) {
      reject(error);
    }
  });
};


const queryMenuByCategory = async (category_id: string): Promise<Menu[]> => {
  try {
    const realm = await getRealmInstance();
    const menus = realm
    .objects<Menu>('Menu')
    .filtered('category_id == $0', category_id)
    .sorted('name')
   
    const menusWithAddOns = await Promise.all(
      menus.map(async menu => {
        const addOns = await queryAddonByMenuId(menu.menu_id);           
        return {
          menu_id: menu.menu_id,
          name: menu.name,
          bar_code: menu.bar_code,
          color_code: menu.color_code,
          price: menu.price,
          price_offer: menu.price_offer,
          cost: menu.cost,
          stock: menu.stock,
          category_id: menu.category_id,
          status: menu.status,
          description: menu.description,
          addOns: addOns,
        };
      })
    );

    return menusWithAddOns;
  } catch (error) {
     throw error;
  }
};

const queryMenuById = async (menu_id: number): Promise<Menu | null> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const menu = realm.objectForPrimaryKey<Menu>('Menu', menu_id);
      resolve(
        menu
          ? {
              menu_id: menu.menu_id,
              name: menu.name,
              bar_code: menu.bar_code,
              color_code: menu.color_code,
              price: menu.price,
              price_offer: menu.price_offer,
              cost: menu.cost,
              stock: menu.stock,
              category_id: menu.category_id,
              status: menu.status,
              description: menu.description,
            }
          : null
      );
    } catch (error) {
      reject(error);
    }
  });
};

const queryMenuByBarCode = async (bar_code: string): Promise<Menu | null> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const menu = realm
        .objects<Menu>('Menu')
        .filtered('bar_code == $0', bar_code)[0];
      resolve(
        menu
          ? {
              menu_id: menu.menu_id,
              name: menu.name,
              bar_code: menu.bar_code,
              color_code: menu.color_code,
              price: menu.price,
              price_offer: menu.price_offer,
              cost: menu.cost,
              stock: menu.stock,
              category_id: menu.category_id,
              status: menu.status,
              description: menu.description,
            }
          : null
      );
    } catch (error) {
      reject(error);
    }
  });
};

const updateMenu = async (menu_id: number, menu: Menu): Promise<Menu> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const existingMenu = realm.objectForPrimaryKey<Menu>('Menu', menu_id);
        if (existingMenu) {
          existingMenu.name = menu.name;
          existingMenu.bar_code = menu.bar_code;
          existingMenu.color_code = menu.color_code;
          existingMenu.price = menu.price;
          existingMenu.price_offer = menu.price_offer;
          existingMenu.cost = menu.cost;
          existingMenu.stock = menu.stock;
          existingMenu.category_id = menu.category_id;
          existingMenu.status = menu.status;
          existingMenu.description = menu.description;
          resolve(existingMenu);
        } else {
          reject(new Error('Menu not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};


const deleteMenu = async (menu_id: number): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const menu = realm.objectForPrimaryKey<Menu>('Menu', menu_id);
        if (menu) {
          realm.delete(menu);
          resolve(true);
        } else {
          reject(new Error('Menu not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertMenu,
  updateMenu,
  queryAllMenus,
  queryMenuByStatus,
  deleteMenu,
  queryMenuByBarCode,
  queryMenuByCategory,
  queryMenuById,
  queryMenuByName,
};
