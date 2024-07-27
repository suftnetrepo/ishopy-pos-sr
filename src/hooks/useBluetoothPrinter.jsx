/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BluetoothManager } from 'tp-react-native-bluetooth-printer';
import { printReceipt, receiptTestData } from '../utils/printReceipt';

const useBluetoothPrinter = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [devices, setDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null)
    const [selectedPrinter, setSelectedPrinter] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        requestPermissions();
        loadSelectedPrinter();
    }, []);

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 29) { // Android 10 and above
                try {
                    const permissions = [
                        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    ];

                    const granted = await PermissionsAndroid.requestMultiple(permissions);

                    const bluetoothScanGranted = granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED;
                    const bluetoothConnectGranted = granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED;

                    if (bluetoothScanGranted && bluetoothConnectGranted) {
                        checkBluetoothStatus();  // Call function if permissions granted
                    } else {
                        Alert.alert(
                            'Permission Required',
                            'Bluetooth permissions are required to enable printing. Please grant these permissions.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Open Settings',
                                    onPress: () => {
                                        Linking.openSettings().catch(() => {
                                            Alert.alert('Unable to open settings');
                                        });
                                    },
                                },
                            ]
                        );
                    }
                } catch (err) {
                    console.error('Failed to request permissions', err);  // Log the error for debugging
                    Alert.alert('Permission Request Failed', 'An error occurred while requesting Bluetooth permissions.');
                }
            } else {
                // Android 8 and below do not require runtime permission requests
                checkBluetoothStatus();  // Call function directly
            }
        } else {
            checkBluetoothStatus();  // Call function if not Android
        }
    };

    const checkBluetoothStatus = () => {
        BluetoothManager.isBluetoothEnabled().then(enabled => {
            setIsEnabled(enabled);
        }).catch(err => setError(err));
    };

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
