/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import { BluetoothEscposPrinter, ALIGN } from 'tp-react-native-bluetooth-printer';

// Helper function to pad strings
const padRight = (str, length) => str.length >= length ? str : str + ' '.repeat(length - str.length);
const padLeft = (str, length) => str.length >= length ? str : ' '.repeat(length - str.length) + str;

const printReceipt = async (receiptData) => {
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
        footerMessage
    } = receiptData;

    try {
        await BluetoothEscposPrinter.printerInit();

        // Print Business Header
        await BluetoothEscposPrinter.printerAlign(ALIGN.CENTER);
        await BluetoothEscposPrinter.printText(`${name}\n`, { fonttype: 3 });
        const paddedAddress = padRight(address, receiptWidth);
        await BluetoothEscposPrinter.printText(`${paddedAddress}\n`, {});
        await BluetoothEscposPrinter.printText(`Email : ${email}\n`, {});
        await BluetoothEscposPrinter.printText(`TEL : ${phone}\n\n`, {});

        // Print Table and Check Info
        await BluetoothEscposPrinter.printerAlign(ALIGN.LEFT);
        await BluetoothEscposPrinter.printText(`Order #: ${orderNumber} \n`, {});
        await BluetoothEscposPrinter.printText(`Table #: ${table_name} \n`, {});
        await BluetoothEscposPrinter.printText(`Date : ${date}\n`, {});
        await BluetoothEscposPrinter.printText(`Cashier: ${cashier}\n\n`, {});
       
        const receiptWidth = 48; 
        for (const item of items) {
            const itemName = `${item.quantity} ${item.name}`;
            const itemTotal = item.price.toFixed(2);
            const itemLine = `${padRight(itemName, receiptWidth - 8)}${padLeft(itemTotal, 8)}\n`;

            try {
                await BluetoothEscposPrinter.printText(itemLine, {});
            } catch (error) {
                console.error("Error printing item:", error);
            }
          
            if (item?.addOns) {
                for (const addon of item.addOns) {
                    const addonName = `${addon.quantity} ${addon.name}`;
                    const addonTotal = addon.price.toFixed(2);
                    const addonLine = `${padRight(addonName, receiptWidth - 8)}${padLeft(addonTotal, 8)}\n`;

                    try {
                        await BluetoothEscposPrinter.printText(addonLine, {});
                    } catch (error) {
                        console.error("Error printing add-on:", error);
                    }
                }
            }
        }

        await BluetoothEscposPrinter.printText("\n", {});
       
        const printTotalLine = async (label, amount) => {
            const totalLine = `${padRight(label, receiptWidth - 8)}${padLeft(amount.toFixed(2), 8)}\n`;
            await BluetoothEscposPrinter.printText(totalLine, {});
        };

        await printTotalLine('Subtotal :', subtotal);
        if (tax) {
            await printTotalLine('Tax :', tax);
        }

        if (discount) {
            await printTotalLine('discount :', discount);
        }

        await printTotalLine('Total :', total);

        // Print Footer
        await BluetoothEscposPrinter.printText("\n", {});
        await BluetoothEscposPrinter.printerAlign(ALIGN.CENTER);
        await BluetoothEscposPrinter.printText(`${footerMessage}\n`, {});

        await BluetoothEscposPrinter.printText("\n\n\n", {}); // Add some space at the end of the receipt

        // Cut the paper
        await BluetoothEscposPrinter.cutLine(1);

    } catch (error) {
        throw new Error(error.message);
    }
};

const printKitchenTicket = async (ticket) => {
    const {            
        table_name,
        date,
        cashier,
        items,        
    } = ticket;

    try {
        await BluetoothEscposPrinter.printerInit();

        // Print Business Header
        await BluetoothEscposPrinter.printerAlign(ALIGN.CENTER);
        await BluetoothEscposPrinter.printText(`Kitchen Order\n\n`, { fonttype: 3 });     
      
        // Print Table and Check Info
        await BluetoothEscposPrinter.printerAlign(ALIGN.LEFT);    
        await BluetoothEscposPrinter.printText(`Table #: ${table_name} \n`, {});
        await BluetoothEscposPrinter.printText(`Date : ${date}\n`, {});
        await BluetoothEscposPrinter.printText(`Cashier: ${cashier}\n\n`, {});
       
        const receiptWidth = 48; 
        for (const item of items) {
            const itemName = `${item.quantity} ${item.name}`;
            const itemTotal = item.price.toFixed(2);
            const itemLine = `${padRight(itemName, receiptWidth - 8)}${padLeft(itemTotal, 8)}\n`;

            try {
                await BluetoothEscposPrinter.printText(itemLine, {});
            } catch (error) {
                console.error("Error printing item:", error);
            }
          
            if (item?.addOns) {
                for (const addon of item.addOns) {
                    const addonName = `${addon.quantity} ${addon.addOnName}`;
                    const addonTotal = addon.price.toFixed(2);
                    const addonLine = `${padRight(addonName, receiptWidth - 8)}${padLeft(addonTotal, 8)}\n`;

                    try {
                        await BluetoothEscposPrinter.printText(addonLine, {});
                    } catch (error) {
                        console.error("Error printing add-on:", error);
                    }
                }
            }
        }

        await BluetoothEscposPrinter.printText("\n", {});      
      
        // Cut the paper
        await BluetoothEscposPrinter.cutLine(1);

    } catch (error) {
        throw new Error(error.message);
    }
};

const receiptTestData = {
    name: 'Shop Business Center',
    address: '23232, JAVA CITY, SELANGOR',
    phone: '03-435435435',
    email: 'tester@test.com',
    orderNumber: '622967',
    date: '11/01/2020',
    cashier: 'David Smith',
    items: [
        { quantity: 4, name: 'Chinese Buffet', total: 51.96 },
        { quantity: 4, name: 'Soda', total: 7.96 },
        { quantity: 4, name: 'Desserts', total: 15.56 }
    ],
    subtotal: 75.48,
    Tax: 2.90,
    Discount: 1.28,
    total: 79.66,
    footerMessage: 'We value your patronage! Thank you for choosing our store.'
};

export { printReceipt, receiptTestData, printKitchenTicket };
