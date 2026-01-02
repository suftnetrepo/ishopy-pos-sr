/* eslint-disable prettier/prettier */
import {guid} from '../utils/help';
import {getRealmInstance} from './store';
import {Menu} from './menu';

export interface Stock {
  stock_id: string;
  menu_id: string;
  stock: number | undefined;
  date: string;
}

export interface LowStockItem {
  stock_id: string;
  menu_id: string;
  menu_name: string;
  bar_code?: string;
  color_code?: string;
  price: number;
  price_offer?: number;
  cost?: number;
  category_id?: string;
  category_name?: string;
  description?: string;
  current_stock: number;
  menu_stock?: number;
  date: string;
  status: 'Critical' | 'Low' | 'Warning';
  revenue_impact: number;
}

// Interface for stock levels configuration
interface StockLevels {
  critical: number; // Stock <= this number is critical (red)
  low: number; // Stock <= this number is low (orange)
  warning: number; // Stock <= this number is warning (yellow)
}

// Default stock levels - you can customize these
const DEFAULT_STOCK_LEVELS: StockLevels = {
  critical: 1,
  low: 5,
  warning: 20,
};

const insertStock = async (
  menu_id: string,
  stock: number = 0
): Promise<Stock> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const newStock: Stock = {
          stock_id: guid(),
          menu_id,
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
              menu_id: stock.menu_id,
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

const queryStockByProductId = async (menu_id: string): Promise<Stock[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const stocks = realm
        .objects<Stock>('Stock')
        .filtered('menu_id == $0', menu_id)
        .map(stock => ({
          stock_id: stock.stock_id,
          menu_id: stock.menu_id,
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
  menu_id: string,
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
          existingStock.menu_id = menu_id;
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

const getLowStockItems = async (
  limit: number = 20,
  stockLevels: StockLevels = DEFAULT_STOCK_LEVELS
): Promise<LowStockItem[]> => {
  const realm = await getRealmInstance();
  
  return new Promise((resolve, reject) => {
    try {
      const allMenus = realm.objects<Menu>('Menu');
      
      // Return empty array if no menus exist
      if (allMenus.length === 0) {
        resolve([]);
        return;
      }
      
      // Filter for low stock items
      const lowStockItems: LowStockItem[] = [];
      
      for (const menu of allMenus) {
        const currentStock = menu.stock ?? 0;
        
        // Only include items at or below warning threshold
        if (currentStock <= stockLevels.warning) {
          // Determine status based on stock levels
          let status: 'Critical' | 'Low' | 'Warning';
          if (currentStock <= stockLevels.critical) {
            status = 'Critical';
          } else if (currentStock <= stockLevels.low) {
            status = 'Low';
          } else {
            status = 'Warning';
          }
          
          // Calculate potential revenue impact
          const effectivePrice = menu.price_offer ?? menu.price;
          const revenueImpact = currentStock * effectivePrice;
          
          lowStockItems.push({
            stock_id: menu.menu_id,
            menu_id: menu.menu_id,
            menu_name: menu.name,
            bar_code: menu.bar_code,
            color_code: menu.color_code,
            price: menu.price,
            price_offer: menu.price_offer,
            cost: menu.cost,
            category_id: menu.category_id,
            category_name: menu.category_name,
            description: menu.description,
            current_stock: currentStock,
            menu_stock: currentStock,
            date: new Date().toISOString(),
            status,
            revenue_impact: revenueImpact,
          });
        }
      }
      
      // Sort by stock level (lowest first) and limit to top N
      const result = lowStockItems
        .sort((a, b) => a.current_stock - b.current_stock)
        .slice(0, limit);
      
      resolve(result);
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
  getLowStockItems,
  DEFAULT_STOCK_LEVELS
};
