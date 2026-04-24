import {BluetoothEscposPrinter, ALIGN} from 'tp-react-native-bluetooth-printer';

const padRight = (str, length) =>
  str.length >= length ? str : str + ' '.repeat(length - str.length);

const padLeft = (str, length) =>
  str.length >= length ? str : ' '.repeat(length - str.length) + str;

const printBluetoothReceipt = async receiptData => {
  const {
    name,
    address,
    phone,
    email,
    orderNumber,
    table_name,
    date,
    cashier,
    items,
    subtotal,
    tax,
    discount,
    total,
    footerMessage,
  } = receiptData;

  const receiptWidth = 48;

  await BluetoothEscposPrinter.printerInit();

  await BluetoothEscposPrinter.printerAlign(ALIGN.CENTER);
  await BluetoothEscposPrinter.printText(`${name}\n`, {fonttype: 3});
  await BluetoothEscposPrinter.printText(`${address}\n`, {});
  await BluetoothEscposPrinter.printText(`Email : ${email}\n`, {});
  await BluetoothEscposPrinter.printText(`TEL : ${phone}\n\n`, {});

  await BluetoothEscposPrinter.printerAlign(ALIGN.LEFT);
  await BluetoothEscposPrinter.printText(
    `${receiptData.orderLabel || 'Order #'}: ${orderNumber}\n`,
    {}
  );

  if (receiptData.receiptType === 'restaurant') {
    await BluetoothEscposPrinter.printText(
      `${receiptData.tableLabel || 'Table #'}: ${table_name}\n`,
      {}
    );
  }
  await BluetoothEscposPrinter.printText(`Date : ${date}\n`, {});
  await BluetoothEscposPrinter.printText(`Cashier: ${cashier}\n\n`, {});

  for (const item of items || []) {
    const itemName = `${item.quantity} ${item.name}`;
    const itemTotal = Number(item.price || 0).toFixed(2);
    const itemLine = `${padRight(itemName, receiptWidth - 8)}${padLeft(
      itemTotal,
      8
    )}\n`;
    await BluetoothEscposPrinter.printText(itemLine, {});

    if (item?.addOns?.length) {
      for (const addon of item.addOns) {
        const addonName = `${addon.quantity} ${addon.name}`;
        const addonTotal = Number(addon.price || 0).toFixed(2);
        const addonLine = `${padRight(addonName, receiptWidth - 8)}${padLeft(
          addonTotal,
          8
        )}\n`;
        await BluetoothEscposPrinter.printText(addonLine, {});
      }
    }
  }

  await BluetoothEscposPrinter.printText('\n', {});

  const printTotalLine = async (label, amount) => {
    if (amount === undefined || amount === null || amount === '') return;
    const totalLine = `${padRight(label, receiptWidth - 8)}${padLeft(
      Number(amount).toFixed(2),
      8
    )}\n`;
    await BluetoothEscposPrinter.printText(totalLine, {});
  };

  await printTotalLine('Subtotal :', subtotal);
  await printTotalLine('Tax :', tax);
  await printTotalLine('Discount :', discount);
  await printTotalLine('Total :', total);

  await BluetoothEscposPrinter.printText('\n', {});
  await BluetoothEscposPrinter.printerAlign(ALIGN.CENTER);
  await BluetoothEscposPrinter.printText(`${footerMessage}\n`, {});
  await BluetoothEscposPrinter.printText('\n\n\n', {});
  await BluetoothEscposPrinter.cutLine(1);
};

const printBluetoothKitchenTicket = async ticket => {
  const {table_name, date, cashier, items} = ticket;
  const receiptWidth = 48;

  await BluetoothEscposPrinter.printerInit();
  await BluetoothEscposPrinter.printerAlign(ALIGN.CENTER);
  await BluetoothEscposPrinter.printText(`Kitchen Order\n\n`, {fonttype: 3});

  await BluetoothEscposPrinter.printerAlign(ALIGN.LEFT);
  await BluetoothEscposPrinter.printText(`Table #: ${table_name}\n`, {});
  await BluetoothEscposPrinter.printText(`Date : ${date}\n`, {});
  await BluetoothEscposPrinter.printText(`Cashier: ${cashier}\n\n`, {});

  for (const item of items || []) {
    const itemName = `${item.quantity} ${item.name}`;
    const itemTotal = Number(item.price || 0).toFixed(2);
    const itemLine = `${padRight(itemName, receiptWidth - 8)}${padLeft(
      itemTotal,
      8
    )}\n`;
    await BluetoothEscposPrinter.printText(itemLine, {});

    if (item?.addOns?.length) {
      for (const addon of item.addOns) {
        const addonName = `${addon.quantity} ${
          addon.name || addon.addOnName || ''
        }`;
        const addonTotal = Number(addon.price || 0).toFixed(2);
        const addonLine = `${padRight(addonName, receiptWidth - 8)}${padLeft(
          addonTotal,
          8
        )}\n`;
        await BluetoothEscposPrinter.printText(addonLine, {});
      }
    }
  }

  await BluetoothEscposPrinter.printText('\n\n\n', {});
  await BluetoothEscposPrinter.cutLine(1);
};

export {printBluetoothReceipt, printBluetoothKitchenTicket};
