/* eslint-disable prettier/prettier */
import React, { useState, ReactNode, useContext, useEffect } from 'react';
import { User, Shop, CartItem } from '../model/types';
import { useCart } from './useCart';
import { useInAppPurchase } from './_useInAppPurchase';
import { AddOn } from '../model/types';
import { useShop } from './useShop';

interface CartActions {
  addItem: (
    index: number,
    id: string,
    name: string,
    price: number,
    quantity: number,
    table_id: string,
    addOns?: AddOn[],
    icon?: string
  ) => Promise<void>;
  updateItem: (item: CartItem, table_id: string) => void;
  deleteItem: (id: string, table_id: string) => void;
  removeItem: (id: number, table_id: string) => void;
  setDiscount: (discount: number, table_id: string) => void;
  setTax: (tax: number, table_id: string) => void;
  getItemCount: (table_id: string) => number;
  getTotalItems: (table_id: string) => number;
  getTotalPrice: (table_id: string) => number;
  getTotal: (table_id: string) => number;
  getTotalDiscount: (table_id: string) => number;
  getTotalTax: (table_id: string) => number;
  clearItem: (table_id: string) => void;
  getItems: (table_id: string) => any;
  deleteAddOn: (itemId: string, addOnId: string, table_id: string) => void;
  addAddOn: (itemId: string, addOns: AddOn[], table_id: string) => void;
  getCartItemByIndex: (index: number, table_id: string) => CartItem | undefined;
  updateOrderId: (order_id: string, table_id: string) => void
}

type date_filter = {
  startDate: string,
  endDate: string
}

interface Actions extends CartActions {
  login: (params: { user: User; shop: Shop }) => Promise<void>;
  logout: () => Promise<void>;
  updateCurrentUser: (user: User) => void;
  updateCurrentShop: (shop: Shop) => void;
  updateCurrentMenu: (id: number) => void;
  updateSelectedCategory: (category_id: string) => void;
  updateSelectedItem: (item: any) => void;
  updateMenuQuery: (menuQuery: string) => void;
  updateSelectedOrder: (order: any) => void;
  updateDateFilter: (date_filter: date_filter) => void
  updateShop: () => void; 
}

interface State {
  user: User | null;
  shop: Shop | null;
  order: any | null;
  date_filter: date_filter
  purchase_status: boolean;
  payment_status: boolean;
  selectedMenu: number;
  category_id: string;
  previousSelectedMenu: number;
  selectedItem: any;
  menuQuery?: string;
}

interface AppProviderProps {
  children: ReactNode;
}

export const AppContext = React.createContext<(Actions & State) | undefined>(
  undefined
);

const initialState: State = {
  user: null,
  shop: null,
  order: null,
  purchase_status: false,
  payment_status: false,
  selectedMenu: 1,
  previousSelectedMenu: 1,
  selectedItem: null,
  category_id: '',
  menuQuery: '',
  date_filter: {
    startDate: '',
    endDate: ''
  }
};

const AppProvider = ({ children }: AppProviderProps) => {
  const [state, setState] = useState<State>(initialState);
  const { payment_status, purchase_status } = useInAppPurchase();

  const {
    addItem,
    updateItem,
    deleteItem,
    setDiscount,
    setTax,
    getItemCount,
    getTotalItems,
    clearItem,
    getItems,
    getTotal,
    getTotalDiscount,
    getTotalTax,
    deleteAddOn,
    addAddOn,
    getTotalPrice,
    removeItem,
    getCartItemByIndex,
    updateOrderId
  } = useCart();

  const { data: shopData, load } = useShop();
  useEffect(() => {
    if (shopData) {
      setState(prevState => ({
        ...prevState,
        shop: shopData as Shop,
      }));
    }
  }, [shopData]);

  const actions: Actions = {
    login: async (params: { user: User; }) => {
      const { user } = params;
      setState(prevState => ({
        ...prevState,
        user,
      }));
    },

    updateShop: async() => {
      const data = await load();
     setState(prevState => ({
        ...prevState,
        shop: data as Shop,
      }));
    },

    logout: async () => {
      setState(initialState);
    },

    updateCurrentMenu: (id: number) => {
      setState(prevState => ({
        ...prevState,
        previousSelectedMenu: prevState.selectedMenu,
        selectedMenu: id,
      }));
    },
    updateCurrentUser: updatedUser => {
      setState(prevState => ({
        ...prevState,
        user: updatedUser,
      }));
    },

    updateCurrentShop: updatedShop => {
      setState(prevState => ({
        ...prevState,
        shop: updatedShop,
      }));
    },

    updateSelectedCategory: id => {
      setState(prevState => ({
        ...prevState,
        category_id: id,
      }));
    },

    updateSelectedItem: item => {
      setState(prevState => ({
        ...prevState,
        selectedItem: item,
      }));
    },

    updateMenuQuery: menuQuery => {
      setState(prevState => ({
        ...prevState,
        menuQuery,
      }));
    },

    updateSelectedOrder: order => {
      setState(prevState => ({
        ...prevState,
        order,
      }));
    },

    updateDateFilter: date_filter => {
      setState(prevState => ({
        ...prevState,
        date_filter,
      }));
    },

    addItem,
    updateItem,
    deleteItem,
    setDiscount,
    setTax,
    getItemCount,
    getTotalItems,
    getTotalPrice,
    clearItem,
    getTotal,
    getTotalDiscount,
    getTotalTax,
    getItems,
    deleteAddOn,
    addAddOn,
    removeItem,
    getCartItemByIndex,
    updateOrderId
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        ...actions,
        addItem,
        updateItem,
        deleteItem,
        setDiscount,
        setTax,
        getItemCount,
        getTotalItems,
        getTotalPrice,
        clearItem,
        getItems,
        getTotal,
        getTotalDiscount,
        getTotalTax,
        deleteAddOn,
        addAddOn,
        removeItem,
        payment_status,
        purchase_status,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = (): Actions & State => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
