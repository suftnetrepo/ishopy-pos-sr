import {
  printBluetoothReceipt,
  printBluetoothKitchenTicket,
} from './bluetoothPrinter';

import {
  printWifiReceipt,
  printWifiKitchenTicket,
  testWifiPrinterConnection,
} from './wifiPrinter';

const validatePrinter = printer => {
  if (!printer) {
    throw new Error('No printer selected');
  }

  if (printer.type === 'wifi' && !printer.host) {
    throw new Error('WiFi printer IP address is required');
  }

  if (printer.type === 'bluetooth' && !printer.address) {
    throw new Error('Bluetooth printer address is required');
  }
};

const printReceiptByPrinter = async (printer, receiptData) => {
  validatePrinter(printer);

  if (printer.type === 'wifi') {
    return printWifiReceipt(printer, receiptData);
  }

  return printBluetoothReceipt(receiptData);
};

const printKitchenTicketByPrinter = async (printer, ticketData) => {
  validatePrinter(printer);

  if (printer.type === 'wifi') {
    return printWifiKitchenTicket(printer, ticketData);
  }

  return printBluetoothKitchenTicket(ticketData);
};

const testPrinterConnection = async printer => {
  validatePrinter(printer);

  if (printer.type === 'wifi') {
    return testWifiPrinterConnection(printer);
  }

  return true;
};

export {
  printReceiptByPrinter,
  printKitchenTicketByPrinter,
  testPrinterConnection,
};