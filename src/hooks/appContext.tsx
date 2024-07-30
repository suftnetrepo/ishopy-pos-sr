/* eslint-disable prettier/prettier */
import React, { useState, ReactNode, useContext } from "react";
import { User, Shop, CartItem } from "../model/types";
import { useCart } from "./useCart";
import { useInAppPurchase } from "./useInAppPurchase";
import { AddOn } from "../model/types";

interface CartActions {
	addItem: (
		id: string,
		name: string,
		price: number,
		quantity: number,
		table_id: string,
	) => Promise<void>;
	updateItem: (item: CartItem, table_id: string) => void;
	deleteItem: (id: string, table_id: string) => void;
	setDiscount: (discount: number, table_id: string) => void;
	setTax: (tax: number, table_id: string) => void;
	getItemCount: (table_id: string) => number;
	getTotalItems: (table_id: string) => number;
	getTotalPrice: (table_id: string) => number;
	getTotal: (table_id: string) => number;
	getTotalDiscount: (table_id: string) => number;
	getTotalTax: (table_id: string) => number;
	clearItem: (table_id: string) => void;
	getItems: (table_id: string) => CartItem[];
	deleteAddOn: (itemId: string, addOnId: string, table_id: string) => void;
	addAddOn: (itemId: string, addOns: AddOn[], table_id: string) => void;
}

interface Actions extends CartActions {
	login: (params: { user: User; shop: Shop }) => Promise<void>;
	logout: () => Promise<void>;
	updateCurrentUser: (user: User) => void;
	updateCurrentShop: (shop: Shop) => void;
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

export const AppContext = React.createContext<(Actions & State) | undefined>(
	undefined,
);

const initialState: State = {
	user: null,
	shop: null,
	purchase_status: false,
	payment_status: false,
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
	} = useCart();

	const actions: Actions = {
		login: async (params: { user: User; shop: Shop }) => {
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
		getItems,
		deleteAddOn,
		addAddOn,
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
				payment_status,
				purchase_status,
			}}
		>
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
