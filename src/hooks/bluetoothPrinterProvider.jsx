/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useMemo } from 'react';
import { useBluetoothPrinter } from './useBluetoothPrinter';

const BluetoothPrinterContext = createContext();

export const BluetoothPrinterProvider = ({ children }) => {
    const bluetoothPrinter = useBluetoothPrinter();
    const value = useMemo(() => bluetoothPrinter, [bluetoothPrinter]);

    return (
        <BluetoothPrinterContext.Provider value={value}>
            {children}
        </BluetoothPrinterContext.Provider>
    );
};

export const useBluetoothPrinterContext = () => {
    const context = useContext(BluetoothPrinterContext);
    if (!context) {
        throw new Error('useBluetoothPrinterContext must be used within a BluetoothPrinterProvider');
    }
    return context;
};
