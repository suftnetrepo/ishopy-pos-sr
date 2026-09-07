import {
  printWifiReceipt,
  printWifiKitchenTicket,
  testWifiPrinterConnection,
} from './wifiPrinter';

const validatePrinter = printer => {
  if (!printer) {
    throw new Error('No printer selected');
  }

  if (!printer.host) {
    throw new Error('WiFi printer IP address is required');
  }
};

const printReceiptByPrinter = async (printer, receiptData) => {
  validatePrinter(printer);

  return printWifiReceipt(printer, {
    ...receiptData,
    receiptWidth: printer.receiptWidth || 48,
  });
};

const printKitchenTicketByPrinter = async (printer, ticketData) => {
  validatePrinter(printer);

  return printWifiKitchenTicket(printer, ticketData);
};

const testPrinterConnection = async printer => {
  validatePrinter(printer);

  return testWifiPrinterConnection(printer);
};

export {
  printReceiptByPrinter,
  printKitchenTicketByPrinter,
  testPrinterConnection,
};
