import { printReceiptByPrinter, printKitchenTicketByPrinter } from '../services';

const receiptTestData = {
  name: 'Shop Business Center',
  address: '23232, JAVA CITY, SELANGOR',
  phone: '03-435435435',
  email: 'tester@test.com',
  orderNumber: '622967',
  table_name: 'Table 7',
  date: '11/01/2020',
  cashier: 'David Smith',
  items: [
    { quantity: 4, name: 'Chinese Buffet', price: 51.96 },
    { quantity: 4, name: 'Soda', price: 7.96 },
    { quantity: 4, name: 'Desserts', price: 15.56 },
  ],
  subtotal: 75.48,
  tax: 2.9,
  discount: 1.28,
  total: 79.66,
  footerMessage: 'We value your patronage! Thank you for choosing our store.',
};

const printReceipt = async (printer, receiptData) => {
  return printReceiptByPrinter(printer, receiptData);
};

const printKitchenTicket = async (printer, ticketData) => {
  return printKitchenTicketByPrinter(printer, ticketData);
};

export { printReceipt, receiptTestData, printKitchenTicket };