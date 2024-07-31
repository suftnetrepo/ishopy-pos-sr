/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BluetoothManager } from 'tp-react-native-bluetooth-printer';
import { printReceipt, receiptTestData } from '../utils/printReceipt';
import useBluetoothPermissions from './useBluetoothPermissions';

const useBluetoothPrinter = () => { 
    const [devices, setDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null)
    const [selectedPrinter, setSelectedPrinter] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const { requestPermissions, isEnabled } = useBluetoothPermissions()

    useEffect(() => {
        !isEnabled && requestPermissions();
        loadSelectedPrinter();
    }, [isEnabled]);
   
    const enableBluetooth = () => {
        BluetoothManager.enableBluetooth().then(devices => {
            setDevices(devices.map(deviceStr => JSON.parse(deviceStr)));
        }).catch(err => setError(err));
    };

    const connectDevice = (device) => {
        setLoading(true)
        BluetoothManager.connect(device.address)
            .then(() => {
                setConnectedDevice(device);
                saveSelectedPrinter(device);
            })
            .catch(err => setError(err)).finally(() => {
                setLoading(false)
            })
    };

    const loadSelectedPrinter = async () => {
        try {
            const printer = await AsyncStorage.getItem('selectedPrinter');
            if (printer) {
                const parsedPrinter = JSON.parse(printer);
                setSelectedPrinter(parsedPrinter);
                connectDevice(parsedPrinter);
            }
        } catch (err) {
            setError(err);
        }
    };

    const saveSelectedPrinter = async (printer) => {
        try {
            await AsyncStorage.setItem('selectedPrinter', JSON.stringify(printer));
            setSelectedPrinter(printer);
        } catch (err) {
            setError(err);
        }
    };

    const testPrint = () => {
        try {
            printReceipt(receiptTestData)
        } catch (err) {
            setError(err);
        }
    };

    const print = (receiptData) => {
        try {
            printReceipt(receiptData)
        } catch (err) {
            setError(err);
        }
    };

    return {
        isEnabled,
        devices,
        connectedDevice,
        enableBluetooth,
        connectDevice,
        testPrint,
        print,
        error,
        setError,
        loading,
        selectedPrinter
    }
}

export { useBluetoothPrinter }
