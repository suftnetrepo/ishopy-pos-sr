/* eslint-disable prettier/prettier */
import React, { useState, ReactNode, useContext } from "react";
import { User, Shop, CartItem } from '../model/types'
import { useCart } from "./useCart";
import { useInAppPurchase } from "./useInAppPurchase";

interface CartActions {
    addItem: (id: string,
        name: string,
        price: number,
        quantity: number) => Promise<void>;
    updateItem: (item: CartItem) => void;
    deleteItem: (id: string) => void;
    setDiscount: (discount: number) => void;
    setTax: (tax: number) => void;
    getItemCount: () => number;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    getTotal: () => number;
    getTotalDiscount: () => number;
    getTotalTax: () => number;
    clearItem: () => void;
    getItems: () => CartItem[];
}

interface Actions extends CartActions {
    login: (params: { user: User, shop: Shop }) => Promise<void>;
    logout: () => Promise<void>;
    updateCurrentUser: (user: User) => void;
    updateCurrentShop: (shop: Shop) => void   
}

interface State {
    user: User | null;
    shop: Shop | null;  
    purchase_status: boolean;
    payment_status: boolean;
}

interface AppProviderProps {
    children: ReactNode;
}

export const AppContext = React.createContext<Actions & State | undefined>(undefined);

const initialState: State = {
    user: null,
    shop: null,
    purchase_status: false,
    payment_status: false  
};

const AppProvider = ({ children }: AppProviderProps) => {
    const [state, setState] = useState<State>(initialState); 
    const { payment_status, purchase_status} = useInAppPurchase()
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
        getTotalPrice } = useCart()

    const actions: Actions = {
        login: async (params: { user: User, shop: Shop }) => {
            const { shop, user } = params;
            setState((prevState) => ({
                ...prevState,
                shop,
                user,
            }));
        },

        logout: async () => {
            setState(initialState);
        },

        updateCurrentUser: (updatedUser) => {
            setState((prevState) => ({
                ...prevState,
                user: updatedUser,
            }));
        },

        updateCurrentShop: (updatedShop) => {
            setState((prevState) => ({
                ...prevState,
                shop: updatedShop,
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
        getItems       
    };

    return (
        <AppContext.Provider value={{
            ...state, ...actions,
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
            payment_status,
            purchase_status          
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;

export const useAppContext = (): Actions & State => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
