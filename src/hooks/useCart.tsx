/* eslint-disable prettier/prettier */
import { useState, useCallback } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    discount: number;
    tax: number;
}

const initialize = {
    items: [],
    discount: 0,
    tax: 0,
}
const useCart = () => {
    const [cart, setCart] = useState<CartState>(initialize);

    const clearItem = () => {
        setCart(initialize);
    };

    const addItem = async (id: string,
        name: string,
        price: number,
        quantity: number) => {
        setCart({ ...cart, items: [...cart.items, { id, name, price, quantity }] });
    };


    const updateItem = useCallback((updatedItem: CartItem) => {
        setCart((cart) => {
            return {
                ...cart,
                items: cart.items.map(item =>
                    item.id === updatedItem.id ? item : updatedItem
                )
            }
        })
    }, []);

    const deleteItem = useCallback((id: string) => {      
        setCart((cart) => {
            return {
                ...cart,
                items: cart.items.filter(item => item.id !== id)
            }
        })
    }, []);

    const setDiscount = useCallback((discount: number) => {
        setCart((cart) => {
            return {
                ...cart,
                discount
            }
        })
    }, []);

    const setTax = useCallback((tax: number) => {
        setCart((cart) => {
            return {
                ...cart,
                tax
            }
        })
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
            0
        );  
        
        const tax = (total * cart.tax) / 100;
        return tax;
    }, [cart.items, cart.tax]);

    const getTotalDiscount = useCallback(() => {
        const total = cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        const discount = (total * cart.discount) / 100;
        return discount;
    }, [cart.items, cart.discount]);

    const getTotal = useCallback(() => {
        const total = cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );  
        return total;
    }, [cart.items, cart.discount]);

    const getTotalPrice = useCallback(() => {
        const total = cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
        const discount = (total * cart.discount) / 100;
        const tax = (total * cart.tax) / 100;
        return total - discount + tax;
    }, [cart.items, cart.discount, cart.tax]);

    const getItems = useCallback(() => {
        return [...cart.items].sort((a, b) => a.name.localeCompare(b.name));
    }, [cart.items]);

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
        getTotalDiscount ,
        getTotalTax       
    };
};

export { useCart };
