/* eslint-disable prettier/prettier */
import {observable} from '@legendapp/state';
import {useSelector} from '@legendapp/state/react';

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
};

const cartState = observable<CartState>(initialize);

const useCart = () => {
  const cart = useSelector(() => cartState.get());

  const clearItem = () => {
    cartState.set(initialize);
  };

  const addItem = async (
    id: string,
    name: string,
    price: number,
    quantity: number
  ) => {
    cartState.items.set([
      ...cartState.items.get(),
      {id, name, price, quantity},
    ]);
  };

  const updateItem = (updatedItem: CartItem) => {
    cartState.items.set(
      cartState.items
        .get()
        .map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const deleteItem = (id: string) => {
    cartState.items.set(cartState.items.get().filter(item => item.id !== id));
  };

  const setDiscount = (discount: number) => {
    cartState.discount.set(discount);
  };

  const setTax = (tax: number) => {
    cartState.tax.set(tax);
  };

  const getItemCount = () => {
    return cartState.items
      .get()
      .reduce((count, item) => count + item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartState.items.get().length;
  };

  const getTotalTax = () => {
    const total = cartState.items
      .get()
      .reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = (total * cartState.tax.get()) / 100;
    return tax;
  };

  const getTotalDiscount = () => {
    const total = cartState.items
      .get()
      .reduce((total, item) => total + item.price * item.quantity, 0);
    const discount = (total * cartState.discount.get()) / 100;
    return discount;
  };

  const getTotal = () => {
    return cartState.items
      .get()
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalPrice = () => {
    const total = cartState.items
      .get()
      .reduce((total, item) => total + item.price * item.quantity, 0);
    const discount = (total * cartState.discount.get()) / 100;
    const tax = (total * cartState.tax.get()) / 100;
    return total - discount + tax;
  };

  const getItems = () => {
    return [...cartState.items.get()].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  };

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
  };
};

export {useCart};
