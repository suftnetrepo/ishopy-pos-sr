/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { useState } from "react";
import { AddOn, CartItem } from "../model/types";

interface CartState {
	items: CartItem[];
	discount: number;
	tax: number;
}

const initialize = {
	items: [],
	discount: 0,
	tax: 0,
};

const useCart = () => {
	const [carts, setCarts] = useState<Record<string, CartState>>({});
	
	const getCart = (table_id: string): CartState => {
		return carts[table_id] || initialize;
	};

	const clearItem = (table_id: string) => {
		setCarts((prev) => ({
			...prev,
			[table_id]: initialize
		}));
	};

	const addItem = async (
		id: string,
		name: string,
		price: number,
		quantity: number,
		table_id: string,
		addOns?: AddOn[]
	) => {
		setCarts((prev) => {
			const currentCart = getCart(table_id);
			const updatedCart = {
				...currentCart,
				items: [...currentCart.items, { id, name, price, quantity, addOns }]
			};
		
			return {
				...prev,
				[table_id]: updatedCart
			};
		});
	};

	const updateItem = (updatedItem: CartItem, table_id: string) => {
		setCarts((prev) => {
			const currentCart = getCart(table_id);
			return {
				...prev,
				[table_id]: {
					...currentCart,
					items: currentCart.items.map((item) =>
						item.id === updatedItem.id ? updatedItem : item
					)
				}
			};
		});
	};

	const deleteItem = (id: string, table_id: string) => {
		setCarts((prev) => {
			const currentCart = getCart(table_id);
			return {
				...prev,
				[table_id]: {
					...currentCart,
					items: currentCart.items.filter((item) => item.id !== id)
				}
			};
		});
	};

	const setDiscount = (discount: number, table_id: string) => {
		setCarts((prev) => {
			const currentCart = getCart(table_id);
			return {
				...prev,
				[table_id]: {
					...currentCart,
					discount
				}
			};
		});
	};

	const setTax = (tax: number, table_id: string) => {
		setCarts((prev) => {
			const currentCart = getCart(table_id);
			return {
				...prev,
				[table_id]: {
					...currentCart,
					tax
				}
			};
		});
	};

	const getItemCount = (table_id: string) => {
		const cart = getCart(table_id);	
		return cart.items.reduce((count, item) => count + item.quantity, 0);
	};

	const getTotalItems = (table_id: string) => {
		const cart = getCart(table_id);
		return cart.items.length;
	};

	const getTotalTax = (table_id: string) => {
		const cart = getCart(table_id);
		const total = cart.items.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);
		return (total * cart.tax) / 100;
	};

	const getTotalDiscount = (table_id: string) => {
		const cart = getCart(table_id);
		const total = cart.items.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);
		return (total * cart.discount) / 100;
	};

	const calculateTotalAddOnsPrice = (addOns: any[]) => {
		return addOns.reduce((total, addOn) => {
			return (
				total + parseFloat(addOn.price || 0) * parseInt(addOn.quantity || 0)
			);
		}, 0);
	};

	const getTotal = (table_id: string) => {
		const cart = getCart(table_id);
		return cart.items.reduce((total, item) => {
			const itemTotal = item.price * item.quantity;
			const addOnsTotal = item.addOns
				? calculateTotalAddOnsPrice(item.addOns)
				: 0;
			return total + itemTotal + addOnsTotal;
		}, 0);
	};

	const getTotalPrice = (table_id: string) => {
		const cart = getCart(table_id);
		const total = cart.items.reduce((total, item) => {
			const itemTotal = item.price * item.quantity;
			const addOnsTotal = item.addOns
				? calculateTotalAddOnsPrice(item.addOns)
				: 0;
			return total + itemTotal + addOnsTotal;
		}, 0);
		const discount = (total * cart.discount) / 100;
		const tax = (total * cart.tax) / 100;
		return total - discount + tax;
	};

	const getItems = (table_id: string) => {
		const cart = getCart(table_id);
		return cart.items.sort((a, b) => a.name.localeCompare(b.name));
	};

	const addAddOn = (itemId: string, addOns: AddOn[], table_id: string) => {
		setCarts((prev) => {
			const currentCart = getCart(table_id);		
			return {
				...prev,
				[table_id]: {
					...currentCart,
					items: currentCart.items.map((item) =>
						item.id === itemId
							? { ...item, addOns: [...(item.addOns || []), ...addOns] }
							: item
					)
				}
			};
		});
	};

	const deleteAddOn = (itemId: string, addOnId: string, table_id: string) => {
		setCarts((prev) => {
			const currentCart = getCart(table_id);
			return {
				...prev,
				[table_id]: {
					...currentCart,
					items: currentCart.items.map((item) =>
						item.id === itemId
							? {
								...item,
								addOns: item.addOns?.filter(
									(addOn) => addOn.addOn_id !== addOnId
								)
							}
							: item
					)
				}
			};
		});
	};

	return {
		carts,
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
		addAddOn,
		deleteAddOn,
	};
};

export { useCart };
