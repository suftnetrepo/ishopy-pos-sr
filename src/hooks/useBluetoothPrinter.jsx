import {useState, useEffect} from 'react';
import {BluetoothManager} from 'tp-react-native-bluetooth-printer';
import {printReceipt, receiptTestData} from '../utils/printReceipt';
import {testPrinterConnection} from '../services';
import useCheckAndRequestBluetoothPermission from './useCheckAndRequestBluetoothPermission';
import {printerStore} from '../store/printerStore';

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

  const connectBluetoothDevice = async device => {
    setLoading(true);

    try {
      await BluetoothManager.connect(device.address);

      const printer = {
        ...device,
        type: 'bluetooth',
        paperSize: '80mm',
        receiptWidth: 48,
      };

      await printerStore.saveSelectedPrinter(printer);

      setConnectedDevice(printer);
      setSelectedPrinter(printer);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const connectWifiPrinter = async printer => {
    setLoading(true);

    try {
      const wifiPrinter = {
        type: 'wifi',
        name: printer.name || `WiFi Printer (${printer.host})`,
        host: printer.host,
        port: Number(printer.port || 9100),
        paperSize: printer.paperSize || '80mm',
        receiptWidth: printer.receiptWidth || 48,
      };

      await testPrinterConnection(wifiPrinter);

      await printerStore.saveSelectedPrinter(wifiPrinter);

      setSelectedPrinter(wifiPrinter);
      setConnectedDevice(wifiPrinter);

      console.log('Saved WiFi printer:', wifiPrinter);

      return wifiPrinter;
    } catch (err) {
      console.log('connectWifiPrinter error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const disconnectPrinter = async () => {
    try {
      await printerStore.clearSelectedPrinter();
      setConnectedDevice(null);
      setSelectedPrinter(null);
    } catch (err) {
      setError(err);
    }
  };

 const loadSelectedPrinter = async () => {
  try {
    const printer = await printerStore.getSelectedPrinter();

    console.log('Loaded selectedPrinter:', printer);

    if (!printer) return;

    setSelectedPrinter(printer);
    setConnectedDevice(printer);
  } catch (err) {
    console.log('loadSelectedPrinter error:', err);
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
