/* eslint-disable prettier/prettier */
import {guid} from '../utils/help';
import {getRealmInstance} from './store';
import { Menu} from './menu'

export interface Icon {
  name: string;
  library: string;
  label: string;
  type: string;
}
export interface Category {
  category_id: string;
  name: string;
  status: number;
  color_code?: string;
  icon_name? : string;
  total_menu?: number; // Optional, used for categories with menu count
}

const insertCategory = async (
  name: string,
  status: number = 0,
  color_code: string,
  icon_name? : string

): Promise<Category> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const category: Category = {
          category_id: guid(),
          name,
          status,
          color_code,
          icon_name
        };
        realm.create('Category', category);
        resolve(category);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryCategoriesWithMenuCount = async (): Promise<Category[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const categories = realm
        .objects<Category>('Category')
        .filtered('status == 1') 
        .sorted('name')
        .map(category => {
          const menuCount = realm
            .objects<Menu>('Menu')
            .filtered('category_id == $0', category.category_id)
            .length;

          return {
            category_id: category.category_id,
            name: category.name,
            status: category.status,
            color_code: category.color_code,
            icon_name: category.icon_name,
            total_menu: menuCount,
          };
        });
      resolve(categories);
    } catch (error) {
      reject(error);
    }
  });
};

const queryAllCategories = async (): Promise<Category[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const categories = realm
        .objects<Category>('Category')
        .sorted('name')
        .map(category => ({
          category_id: category.category_id,
          name: category.name,
          status: category.status,
          color_code: category.color_code,
          icon_name: category.icon_name,
        }));
      resolve(categories);
    } catch (error) {
      reject(error);
    }
  });
};

const queryCategoriesByStatus = async (status: number): Promise<Category[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const categories = realm
        .objects<Category>('Category')
        .filtered('status == $0', status)
        .sorted('name')
        .map(category => ({
          category_id: category.category_id,
          name: category.name,
          status: category.status,
          color_code: category.color_code,
          icon_name: category.icon_name,
        }));

      resolve(categories);
    } catch (error) {
      reject(error);
    }
  });
};

const queryCategoryById = async (
  category_id: string
): Promise<Category | null> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const category = realm.objectForPrimaryKey<Category>(
        'Category',
        category_id
      );
      resolve(
        category
          ? {
              category_id: category.category_id,
              name: category.name,
              status: category.status,
              color_code: category.color_code,
              icon_name: category.icon_name,
            }
          : null
      );
    } catch (error) {
      reject(error);
    }
  });
};

const updateCategory = async (
  category_id: string,
  name: string,
  status: number,
  color_code: string,
  icon_name? : string
): Promise<Category> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const category = realm.objectForPrimaryKey<Category>(
          'Category',
          category_id
        );

        if (category) {
          category.name = name;
          category.status = status;
          category.color_code = color_code;
          category.icon_name= icon_name,
          resolve(category);
        } else {
          reject(new Error('Category not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteCategory = async (category_id: string): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const products = realm
        .objects('Menu')
        .filtered('category_id == $0', category_id);
      if (products.length > 0) {
        reject(
          new Error(
            'Cannot delete category: Menu are associated with this category.'
          )
        );
      } else {
        realm.write(() => {
          const category = realm.objectForPrimaryKey<Category>(
            'Category',
            category_id
          );
          if (category) {
            realm.delete(category);
            resolve(true);
          } else {
            reject(new Error('Category not found'));
          }
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertCategory,
  updateCategory,
  queryAllCategories,
  queryCategoryById,
  deleteCategory,
  queryCategoriesByStatus,
  queryCategoriesWithMenuCount
};
