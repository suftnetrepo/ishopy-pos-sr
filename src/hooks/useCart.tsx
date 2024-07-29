/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { useState, useCallback } from "react";
import { AddOn, CartItem } from "../model/types";
interface CartState {
	items: CartItem[];
	discount: number;
	tax: number;
	addOns?: AddOn[];
}

const initialize = {
	items: [],
	discount: 0,
	tax: 0,
	addOns: []
};
const useCart = () => {
	const [cart, setCart] = useState<CartState>(initialize);

	const clearItem = () => {
		setCart(initialize);
	};

	const addItem = async (
		id: string,
		name: string,
		price: number,
		quantity: number,
		addOns?: AddOn[],
	) => {
		setCart({
			...cart,
			items: [...cart.items, { id, name, price, quantity, addOns }],
		});
	};

	const updateItem = useCallback((updatedItem: CartItem) => {
		setCart((cart) => {
			return {
				...cart,
				items: cart.items.map((item) =>
					item.id === updatedItem.id ? updatedItem : item,
				),
			};
		});
	}, []);

	const deleteItem = useCallback((id: string) => {
		setCart((cart) => {
			return {
				...cart,
				items: cart.items.filter((item) => item.id !== id),
			};
		});
	}, []);

	const setDiscount = useCallback((discount: number) => {
		setCart((cart) => {
			return {
				...cart,
				discount,
			};
		});
	}, []);

	const setTax = useCallback((tax: number) => {
		setCart((cart) => {
			return {
				...cart,
				tax,
			};
		});
	}, []);

	const getItemCount = useCallback(() => {
		return cart.items.reduce((count, item) => count + item.quantity, 0);
	}, [cart.items]);

	const getTotalItems = useCallback(() => {
		return cart.items.length;
	}, [cart.items]);

	const getTotalTax = useCallback(() => {
		const total = cart.items.reduce(
			(total, item) => total + item.price * item.quantity,
			0,
		);

		const tax = (total * cart.tax) / 100;
		return tax;
	}, [cart.items, cart.tax]);

	const getTotalDiscount = useCallback(() => {
		const total = cart.items.reduce(
			(total, item) => total + item.price * item.quantity,
			0,
		);

		const discount = (total * cart.discount) / 100;
		return discount;
	}, [cart.items, cart.discount]);

	const calculateTotalAddOnsPrice = (addOns: any[]) => {
		return addOns.reduce((total, addOn) => {
			return (
				total + parseFloat(addOn.price || 0) * parseInt(addOn.quantity || 0)
			);
		}, 0);
	};

	const getTotal = useCallback(() => {
		const total = cart.items.reduce((total, item) => {
			const itemTotal = item.price * item.quantity;
			const addOnsTotal = item.addOns
				? calculateTotalAddOnsPrice(item.addOns)
				: 0;
			return total + itemTotal + addOnsTotal;
		}, 0);

		return total;
	}, [cart.items]);

	const getTotalPrice = useCallback(() => {
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
	}, [cart.items, cart.discount, cart.tax]);

	const getItems = useCallback(() => {
		return cart.items.sort((a, b) => a.name.localeCompare(b.name));
	}, [cart.items]);

	const addAddOn = useCallback((itemId: string, addOns: AddOn[]) => {
		setCart((cart) => {
			return {
				...cart,
				items: cart.items.map((item) =>
					item.id === itemId
						? { ...item, addOns: [...(item.addOns || []), ...addOns] }
						: item,
				),
			};
		});
	}, []);

	const deleteAddOn = useCallback((itemId: string, addOnId: string) => {
		setCart((cart) => {
			return {
				...cart,
				items: cart.items.map((item) =>
					item.id === itemId
						? {
								...item,
								addOns: item.addOns?.filter(
									(addOn) => addOn.addOn_id !== addOnId,
								),
						  }
						: item,
				),
			};
		});
	}, []);

	return {
		cart,
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
