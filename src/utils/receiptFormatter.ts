import {Order} from '../model/types';
import {AddOn} from '../model/addOn';
import {queryOrderItemByOrderId} from '../model/orderItems';

type ReceiptFormatterParams = {
  order: Order;
  tableName?: string;
  shop?: any;
  user?: any;
  footerMessage?: string;
};

export const formatReceiptData = async ({
  order,
  tableName,
  shop,
  user,
  footerMessage = 'Your satisfaction is our priority. Thank you for Dining with us!',
}: ReceiptFormatterParams) => {
  const orderItems = await queryOrderItemByOrderId(order.order_id);

  return {
    name: shop?.name || '',
    address: shop?.address || '',
    phone: shop?.mobile || '',
    email: shop?.email || '',
    orderNumber: order.order_id?.slice(0, 8) || '',
    table_name: tableName || order.table_name || '',
    date: order.date
      ? new Date(order.date).toLocaleString()
      : new Date().toLocaleString(),
    cashier: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),

    items: orderItems.map(item => {
      let addOns: AddOn[] = [];

      try {
        addOns = item.addOns ? JSON.parse(item.addOns) : [];
      } catch {
        addOns = [];
      }

      const addOnDetails = addOns.map(addOn => ({
        quantity: addOn.quantity || 1,
        name: addOn.addOnName || '',
        price: Number(addOn.price || 0) * Number(addOn.quantity || 1),
      }));

      return {
        quantity: item.quantity || 1,
        name: item.menu_name || '',
        price: Number(item.price || 0),
        addOns: addOnDetails,
      };
    }),

    subtotal: Number(order.total || 0),
    tax: Number(order.tax || 0),
    discount: Number(order.discount || 0),
    total: Number(order.total_price || 0),

    footerMessage,
  };
};
