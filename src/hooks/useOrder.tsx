
import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import {
  queryAllOrders,
  queryOrderById,
  insertOrder,
  deleteOrder,
  queryOrdersByDateRange,
  getOrderStatusAggregate,
  updateOrderStatus
} from '../model/orders';
import { Order, OrderItem, CartItem } from '../model/types';
import { insertOrderItem } from '../model/orderItems';
import { AddOn } from '../model/addOn';
import { useAppContext } from './appContext';
import { guid } from '../utils/help';
import { printReceipt } from '../utils/printReceipt';
import { OrderStatusAggregate } from '../model/orders';

interface Initialize {
  data: Order[] | null | Order | [] | boolean | OrderStatusAggregate | null;
  copyData? : Order[] | null | Order | [] | boolean | OrderStatusAggregate | null;
  error: Error | null;
  loading: boolean;
  success: boolean
}

const order: Order = {
  order_id: '',
  user_id: '',
  total_price: 0,
  table_id: '',
  total: 0,
  status: 'pending',
  tax: 0,
  discount: 0,
  date: new Date(),
};

const useOrderStatusAggregate = () => {
  const [data, setData] = useState<Initialize>({
    data: null,
    error: null,
    loading: true,
    success: false
  });

  async function load() {
    try {
      const result = await getOrderStatusAggregate();
      setData(prev => ({
        ...prev,
        data: result,
        loading: false,
      }));
    } catch (error) {
      setData({
        data: null,
        error: error as Error,
        loading: false,
        success: false
      });
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    data: data.data as OrderStatusAggregate,
    error: data.error,
    loading: data.loading,
  };
};

const useOrders = (load: boolean) => {
  const [data, setData] = useState<Initialize>({
    data: [],
    copyData : [],
    error: null,
    loading: true,
    success: false
  });

   async function filterOrders(status : string) {
     setData(prev => ({
        ...prev,
        data: Array.isArray(prev.copyData) 
          ? (prev.copyData as Order[]).filter((j: Order) => j.status?.toLowerCase() === status.toLowerCase())
          : [],
        loading: false,
      }));
  }

    async function restoreOrders() {
     setData(prev => ({
        ...prev,
        data: Array.isArray(prev.copyData) ? prev.copyData : [],
        loading: false,
      }));
  }

  async function loadOrders() {
    try {
      const result = await queryAllOrders();
      setData(prev => ({
        ...prev,
        data: result,
        copyData: result,
        loading: false,
      }));
    } catch (error) {
      setData({
        data: null,
        copyData: [],
        error: error as Error,
        loading: false,
        success: false
      });
    }
  }

  useEffect(() => {
    loadOrders();
  }, [load]);

  async function loadOrdersByDateRange(startDate: Date, endDate: Date) {
    try {
      const result = await queryOrdersByDateRange(startDate, endDate);
      setData(prev => ({
        ...prev,
        data: result,
        copyData: result,
        loading: false,
      }));
    } catch (error) {
      setData({
        data: null,
        error: error as Error,
        loading: false,
        success: false
      });
    }
  }

  const resetHandler = () => {
    setData({
      data: null,
      error: null,
      loading: false,
      success: false
    });
  };

  return {
    ...data,
    resetHandler,
    loadOrdersByDateRange,
    filterOrders,
    restoreOrders,
    loadOrders
  };
};

const useQueryOrderById = (order_id: string) => {
  const [data, setData] = useState<Initialize>({
    data: [],
    error: null,
    loading: false,
    success: false
  });

  useEffect(() => {
    async function load() {
      try {
        const result = await queryOrderById(order_id);
        setData(prev => ({
          ...prev,
          data: result,
          loading: false,
        }));
      } catch (error) {
        setData({
          data: null,
          error: error as Error,
          loading: false,
          success: false
        });
      }
    }
    load();
  }, []);

  return {
    ...data,
  };
};

const useInsertOrder = (table_id: string, table_name:string) => {
  const {
    user,
    getItems,
    getTotal,
    getTotalPrice,
    getTotalTax,
    getTotalDiscount,
    shop,
  } = useAppContext();
  const items = getItems(table_id);
  const [data, setData] = useState<Initialize>({
    data: null,
    error: null,
    loading: false,
    success: false
  });

  const insertHandler = async (order: Order) => {
    setData(prev => ({ ...prev, loading: true }));

    try {
      const result = await insertOrder(order);
      setData({
        data: result,
        error: null,
        loading: false,
        success: true
      });
    } catch (error) {
      setData({
        data: null,
        error: error as Error,
        loading: false,
        success: false
      });
    }
  };

  const orderHandler = async () => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      order.order_id = guid();
      order.user_id = user?.user_id;
      order.discount = getTotalDiscount(table_id) || 0;
      order.tax = getTotalTax(table_id) || 0;
      order.total = getTotal(table_id) || 0;
      order.table_id = table_id;
      order.table_name = table_name;
      order.status = 'progress';
      order.total_price = getTotalPrice(table_id) || 0;

      const orderResult = await insertOrder(order);

      if (orderResult) {
        for (const item of items?.items || []) {
          const orderItem: OrderItem = {
            detail_id: guid(),
            order_id: orderResult.order_id,
            price: item.price,
            menu_id: item.id,
            menu_name: item.name,
            quantity: 1,
            date: new Date(),
            addOns:
              (item.addOns || []).length > 0 ? JSON.stringify(item.addOns) : '',
          };

          await insertOrderItem(orderItem);
        }
      }

      setData({
        data: orderResult,
        error: null,
        loading: false,
        success: true
      });
      
      return orderResult.order_id;
    } catch (error) {
      setData({
        data: null,
        error: error as Error,
        loading: false,
        success: false
      });
    }
  };

  const deleteHandler = async (order_id: string) => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const result = await deleteOrder(order_id);
      setData({
        data: result,
        error: null,
        loading: false,
         success: true
      });
      return true
    } catch (error) {
      setData({
        data: false,
        error: error as Error,
        loading: false,
         success: false
      });
      return false
    }
  };

  async function queryOrderByIdhandler(order_id :string) {
      try {
        const result = await queryOrderById(order_id);
        setData(prev => ({
          ...prev,
          data: result,
          loading: false,
              success: true
        }));
      } catch (error) {
        setData({
          data: null,
          error: error as Error,
          loading: false,
          success: false
        });
      }
    }

  const printHandler = (table_name: string, order: Order) => {
    try {
      const receiptData = {
        name: shop?.name,
        address: shop?.address,
        phone: shop?.mobile,
        email: shop?.email,
        orderNumber: order.order_id.slice(0, 8),
        table_name: table_name,
        date: order.date,
        cashier: `${user?.first_name} ${user?.last_name}`,
        items: items?.items?.map((item: CartItem) => {
          const addOnDetails =
            item.addOns?.map((addOn: AddOn) => ({
              quantity: addOn.quantity,
              name: addOn.addOnName,
              price: addOn.price * (addOn.quantity || 0),
            })) || [];

          return {
            quantity: item.quantity,
            name: item.name,
            price: item.price,
            addOns: addOnDetails,
          };
        }),
        subtotal: getTotal(table_id),
        tax: getTotalTax(table_id),
        discount: getTotalDiscount(table_id),
        total: getTotalPrice(table_id),
        footerMessage:
          'Your satisfaction is our priority. Thank you for Dining with us!',
      };

      printReceipt(receiptData);
    } catch (error) {
      setData({
        data: null,
        error: error as Error,
        loading: false,
        success:false
      });
    }
  };

  const shareReceipt = async (table_name: string, order: Order) => {
    const receiptData = {
      name: shop?.name,
      address: shop?.address,
      phone: shop?.mobile,
      email: shop?.email,
      orderNumber: order.order_id.slice(0, 8),
      date: order.date,
      cashier: `${user?.first_name} ${user?.last_name}`,
      items: items?.items?.map((item: CartItem) => {
        const addOnDetails =
          item.addOns?.map((addOn: AddOn) => ({
            quantity: addOn.quantity,
            name: addOn.addOnName,
            price: addOn.price * (addOn.quantity || 0),
          })) || [];

        return {
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          addOns: addOnDetails,
        };
      }),
      subtotal: getTotal(table_id),
      tax: getTotalTax(table_id),
      discount: getTotalDiscount(table_id),
      total: getTotalPrice(table_id),
      footerMessage:
        'Your satisfaction is our priority. Thank you for shopping with us!',
    };
    const {
      name,
      address,
      phone,
      email,
      cashier,
      date,
      orderNumber,
      subtotal,
      tax,
      total,
      footerMessage,
    } = receiptData;
    const receiptText =
      `Receipt from ${name}\n\n` +
      `Order Number: ${orderNumber}\n` +
      `Table Number: ${table_name}\n` +
      `Date: ${new Date(date).toLocaleString()}\n` +
      `Cashier: ${cashier}\n\n` +
      `Items:\n` +
      items?.items?.map((item: CartItem) => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        const addOnsText =
          item.addOns
            ?.map(
              (addOn: AddOn) =>
                `${addOn.quantity} ${addOn.addOnName} - ${(
                  addOn.price * (addOn.quantity || 0)
                ).toFixed(2)}\n`
            )
            .join('') || '';
        return `${item.quantity} ${item.name} - ${itemTotal}\n${addOnsText}`;
      })
        .join('') +
      `\nSubtotal: ${subtotal.toFixed(2)}\n` +
      `Tax: ${tax.toFixed(2)}\n` +
      `Total: ${total.toFixed(2)}\n\n` +
      `Address: ${address}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n\n` +
      `${footerMessage}`;

    try {
      const result = await Share.share({
        title: 'Receipt',
        message: receiptText,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared via activity type
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      setData({
        data: null,
        error: error as Error,
        loading: false,
        success :false
      });
    }
  };

  const resetHandler = () => {
    setData({
      data: null,
      error: null,
      loading: false,
      success:false
    });
  };

  return {
    ...data,
    insert: insertHandler,
    orderHandler,
    resetHandler,
    printHandler,
    shareReceipt,
    deleteHandler,
    queryOrderByIdhandler,
  };
};

const useDeleteOrder = () => {
  const [data, setData] = useState<{
    data: boolean;
    error: Error | null;
    loading: boolean;
  }>({
    data: false,
    error: null,
    loading: false,
  });

  const deleteHandler = async (order_id: string) => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const result = await deleteOrder(order_id);
      setData({
        data: result,
        error: null,
        loading: false,
      });
    } catch (error) {
      setData({
        data: false,
        error: error as Error,
        loading: false,
      });
    }
  };

  return {
    ...data,
    delete: deleteHandler,
  };
};

  const updataStatusHandler = async (order_id: string, status : string) => {
    try {

           console.log("........updateStatusHandler", order_id)
                 console.log("........updateStatusHandler", status)
      const result = await updateOrderStatus(order_id, status);
    console.log("........result", result)
      return true
    } catch (error) {
       if(__DEV__) {
        console.log("Error", error)
       }
      return false
    }
  };

export {
  useDeleteOrder,
  useInsertOrder,
  useQueryOrderById,
  useOrders,
  useOrderStatusAggregate,
  updataStatusHandler
};
