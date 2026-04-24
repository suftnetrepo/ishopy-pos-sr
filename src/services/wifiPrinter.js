import TcpSocket from 'react-native-tcp-socket';
import { Buffer } from 'buffer';

const DEFAULT_PORT = 9100;

const textEncoder = (value = '') => {
  return Buffer.from(value, 'ascii');
};

const writeToSocket = (client, payload) =>
  new Promise((resolve, reject) => {
    client.write(payload, error => {
      if (error) {
        reject(error);
        return;
      }
      resolve(true);
    });
  });

const connectToPrinter = ({ host, port = DEFAULT_PORT, timeout = 5000 }) =>
  new Promise((resolve, reject) => {
    const client = TcpSocket.createConnection(
      {
        host,
        port,
        timeout,
      },
      () => resolve(client)
    );

    client.on('error', error => {
      reject(error);
    });

    client.on('timeout', () => {
      client.destroy();
      reject(new Error('WiFi printer connection timed out'));
    });
  });

const disconnectPrinter = client => {
  try {
    client.destroy();
  } catch (error) {
    console.log('disconnectPrinter error', error);
  }
};

const printerInit = () => Buffer.from([0x1b, 0x40]);
const alignLeft = () => Buffer.from([0x1b, 0x61, 0x00]);
const alignCenter = () => Buffer.from([0x1b, 0x61, 0x01]);
const cutPaper = () => Buffer.from([0x1d, 0x56, 0x41, 0x00]);

const buildWifiReceiptBuffer = receipt => {
  const chunks = [];

  chunks.push(printerInit());

  chunks.push(alignCenter());
  chunks.push(textEncoder(`${receipt.name || ''}\n`));
  chunks.push(textEncoder(`${receipt.address || ''}\n`));
  chunks.push(textEncoder(`Email : ${receipt.email || ''}\n`));
  chunks.push(textEncoder(`TEL : ${receipt.phone || ''}\n\n`));

  chunks.push(alignLeft());
  chunks.push(textEncoder(`Order #: ${receipt.orderNumber || ''}\n`));
  chunks.push(textEncoder(`Table #: ${receipt.table_name || ''}\n`));
  chunks.push(textEncoder(`Date : ${receipt.date || ''}\n`));
  chunks.push(textEncoder(`Cashier: ${receipt.cashier || ''}\n\n`));

  const receiptWidth = 48;

  const padRight = (str, length) =>
    str.length >= length ? str : str + ' '.repeat(length - str.length);

  const padLeft = (str, length) =>
    str.length >= length ? str : ' '.repeat(length - str.length) + str;

  for (const item of receipt.items || []) {
    const itemName = `${item.quantity} ${item.name}`;
    const itemTotal = Number(item.price || 0).toFixed(2);
    const itemLine = `${padRight(itemName, receiptWidth - 8)}${padLeft(itemTotal, 8)}\n`;
    chunks.push(textEncoder(itemLine));

    if (item?.addOns?.length) {
      for (const addon of item.addOns) {
        const addonName = `${addon.quantity} ${addon.name}`;
        const addonTotal = Number(addon.price || 0).toFixed(2);
        const addonLine = `${padRight(addonName, receiptWidth - 8)}${padLeft(addonTotal, 8)}\n`;
        chunks.push(textEncoder(addonLine));
      }
    }
  }

  chunks.push(textEncoder('\n'));

  const totals = [
    ['Subtotal :', receipt.subtotal],
    ['Tax :', receipt.tax],
    ['Discount :', receipt.discount],
    ['Total :', receipt.total],
  ];

  totals.forEach(([label, amount]) => {
    if (amount !== undefined && amount !== null && amount !== '') {
      const line = `${padRight(label, receiptWidth - 8)}${padLeft(Number(amount).toFixed(2), 8)}\n`;
      chunks.push(textEncoder(line));
    }
  });

  chunks.push(textEncoder('\n'));
  chunks.push(alignCenter());
  chunks.push(textEncoder(`${receipt.footerMessage || ''}\n`));
  chunks.push(textEncoder('\n\n\n'));
  chunks.push(cutPaper());

  return Buffer.concat(chunks);
};

const buildWifiKitchenTicketBuffer = ticket => {
  const chunks = [];

  chunks.push(printerInit());
  chunks.push(alignCenter());
  chunks.push(textEncoder('Kitchen Order\n\n'));

  chunks.push(alignLeft());
  chunks.push(textEncoder(`Table #: ${ticket.table_name || ''}\n`));
  chunks.push(textEncoder(`Date : ${ticket.date || ''}\n`));
  chunks.push(textEncoder(`Cashier: ${ticket.cashier || ''}\n\n`));

  const receiptWidth = 48;

  const padRight = (str, length) =>
    str.length >= length ? str : str + ' '.repeat(length - str.length);

  const padLeft = (str, length) =>
    str.length >= length ? str : ' '.repeat(length - str.length) + str;

  for (const item of ticket.items || []) {
    const itemName = `${item.quantity} ${item.name}`;
    const itemTotal = Number(item.price || 0).toFixed(2);
    const itemLine = `${padRight(itemName, receiptWidth - 8)}${padLeft(itemTotal, 8)}\n`;
    chunks.push(textEncoder(itemLine));

    if (item?.addOns?.length) {
      for (const addon of item.addOns) {
        const addonName = `${addon.quantity} ${addon.name || addon.addOnName || ''}`;
        const addonTotal = Number(addon.price || 0).toFixed(2);
        const addonLine = `${padRight(addonName, receiptWidth - 8)}${padLeft(addonTotal, 8)}\n`;
        chunks.push(textEncoder(addonLine));
      }
    }
  }

  chunks.push(textEncoder('\n\n\n'));
  chunks.push(cutPaper());

  return Buffer.concat(chunks);
};

const printWifiReceipt = async (printer, receiptData) => {
  const client = await connectToPrinter(printer);

  try {
    const payload = buildWifiReceiptBuffer(receiptData);
    await writeToSocket(client, payload);
    disconnectPrinter(client);
    return true;
  } catch (error) {
    disconnectPrinter(client);
    throw error;
  }
};

const printWifiKitchenTicket = async (printer, ticketData) => {
  const client = await connectToPrinter(printer);

  try {
    const payload = buildWifiKitchenTicketBuffer(ticketData);
    await writeToSocket(client, payload);
    disconnectPrinter(client);
    return true;
  } catch (error) {
    disconnectPrinter(client);
    throw error;
  }
};

const testWifiPrinterConnection = async printer => {
  const client = await connectToPrinter(printer);
  disconnectPrinter(client);
  return true;
};

export {
  DEFAULT_PORT,
  printWifiReceipt,
  printWifiKitchenTicket,
  testWifiPrinterConnection,
};