import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BluetoothManager} from 'tp-react-native-bluetooth-printer';
import {printReceipt, receiptTestData} from '../utils/printReceipt';
import {testPrinterConnection} from '../services';
import useCheckAndRequestBluetoothPermission from './useCheckAndRequestBluetoothPermission';

const STORAGE_KEY = 'selectedPrinter';

const useBluetoothPrinter = () => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {isEnabled} = useCheckAndRequestBluetoothPermission();

  useEffect(() => {
    loadSelectedPrinter();
  }, []);

  const enableBluetooth = async () => {
    try {
      const devicesList = await BluetoothManager.enableBluetooth();
      const parsed = devicesList.map(deviceStr => {
        const item = JSON.parse(deviceStr);
        return {
          ...item,
          type: 'bluetooth',
        };
      });
      setDevices(parsed);
      return parsed;
    } catch (err) {
      setError(err);
    }
  };

  const connectBluetoothDevice = device => {
    setLoading(true);

    BluetoothManager.connect(device.address)
      .then(() => {
        const printer = {
          ...device,
          type: 'bluetooth',
        };
        setConnectedDevice(printer);
        saveSelectedPrinter(printer);
      })
      .catch(err => setError(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const connectWifiPrinter = async printer => {
    setLoading(true);

    try {
      const wifiPrinter = {
        ...printer,
        type: 'wifi',
        port: Number(printer.port || 9100),
      };

      await testPrinterConnection(wifiPrinter);
      setConnectedDevice(wifiPrinter);
      await saveSelectedPrinter(wifiPrinter);
      return true;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const disconnectPrinter = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setConnectedDevice(null);
      setSelectedPrinter(null);
    } catch (err) {
      setError(err);
    }
  };

  const loadSelectedPrinter = async () => {
    try {
      const printer = await AsyncStorage.getItem(STORAGE_KEY);

      if (!printer) return;

      const parsedPrinter = JSON.parse(printer);
      setSelectedPrinter(parsedPrinter);
      setConnectedDevice(parsedPrinter);
    } catch (err) {
      setError(err);
    }
  };

  const saveSelectedPrinter = async printer => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(printer));
      setSelectedPrinter(printer);
    } catch (err) {
      setError(err);
    }
  };

  const testPrint = async () => {
    try {
      if (!selectedPrinter) {
        throw new Error('No printer selected');
      }

      await printReceipt(selectedPrinter, receiptTestData);
    } catch (err) {
      setError(err);
    }
  };

  const print = async receiptData => {
    try {
      if (!selectedPrinter) {
        throw new Error('No printer selected');
      }

      await printReceipt(selectedPrinter, receiptData);
    } catch (err) {
      setError(err);
    }
  };

  return {
    isEnabled,
    devices,
    connectedDevice,
    selectedPrinter,
    enableBluetooth,
    connectDevice: connectBluetoothDevice,
    connectWifiPrinter,
    disconnectPrinter,
    testPrint,
    print,
    error,
    setError,
    loading,
  };
};

export {useBluetoothPrinter};
