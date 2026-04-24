import React, {useState,  useEffect} from 'react';
import {Alert, ActivityIndicator, Switch, TextInput} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {
  Box,
  Text,
  ScrollView,
  VStack,
  HStack,
  Pressable,
  Button,
  ButtonText,
  Center,
  Divider,
} from '@gluestack-ui/themed';

import {useBluetoothPrinterContext} from '../../../hooks/bluetoothPrinterProvider';

export default function PrinterOptions() {
  const {
    devices,
    selectedPrinter,
    loading,
    enableBluetooth,
    connectDevice,
    connectWifiPrinter,
    disconnectPrinter,
    testPrint,
  } = useBluetoothPrinterContext();

  const [connectionType, setConnectionType] = useState('wifi');
  const [scanning, setScanning] = useState(false);
  const [availablePrinters, setAvailablePrinters] = useState([]);
  const [autoPrint, setAutoPrint] = useState(true);
  const [printCopies, setPrintCopies] = useState(1);

  const [wifiName, setWifiName] = useState('');
  const [wifiHost, setWifiHost] = useState('');
  const [wifiPort, setWifiPort] = useState('9100');

  useEffect(() => {
    if (selectedPrinter?.type === 'wifi') {
      setWifiName(selectedPrinter.name || '');
      setWifiHost(selectedPrinter.host || '');
      setWifiPort(String(selectedPrinter.port || 9100));
    }
  }, [selectedPrinter]);

  console.log('Available selectedPrinter:', selectedPrinter);

  const handleScan = async () => {
    if (connectionType !== 'bluetooth') return;

    setScanning(true);
    setAvailablePrinters([]);

    try {
      const scannedDevices = await enableBluetooth();
      const list = Array.isArray(scannedDevices)
        ? scannedDevices
        : devices || [];
      setAvailablePrinters(list);
    } catch (error) {
      Alert.alert(
        'Bluetooth Error',
        error?.message || 'Unable to scan devices'
      );
    } finally {
      setScanning(false);
    }
  };

  const handleBluetoothConnect = printer => {
    Alert.alert('Connect Printer', `Connect to ${printer.name}?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Connect',
        onPress: () => {
          connectDevice(printer);
          setAvailablePrinters([]);
        },
      },
    ]);
  };

  const handleWifiConnect = async () => {
    try {
      if (!wifiHost.trim()) {
        Alert.alert('Validation', 'Please enter printer IP address');
        return;
      }

      const printer = {
        type: 'wifi',
        name: wifiName.trim() || `WiFi Printer (${wifiHost.trim()})`,
        host: wifiHost.trim(),
        port: Number(wifiPort || 9100),
      };

      await connectWifiPrinter(printer);

      Alert.alert('Success', 'WiFi printer connected. Please tap Test Print.');
    } catch (error) {
      Alert.alert('WiFi Error', error?.message || 'Unable to connect printer');
    }
  };

  const handleDisconnect = () => {
    if (!selectedPrinter) return;

    Alert.alert(
      'Disconnect Printer',
      selectedPrinter.name || 'Selected printer',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => disconnectPrinter(),
        },
      ]
    );
  };

  return (
    <ScrollView>
      <VStack space="lg" px="$5" pb="$10">
        <Text color="$coolGray500">
          Connect your receipt printer via WiFi or Bluetooth
        </Text>

        {selectedPrinter && (
          <Box bg="$green50" p="$4" borderRadius="$xl">
            <HStack alignItems="center" space="md">
              <MIcon name="print" size={28} color="green" />
              <VStack flex={1}>
                <Text fontWeight="$bold">{selectedPrinter.name}</Text>
                <Text fontSize="$sm" color="$coolGray500">
                  {selectedPrinter.type === 'wifi'
                    ? `${selectedPrinter.host}:${selectedPrinter.port || 9100}`
                    : selectedPrinter.address}
                </Text>
              </VStack>
              <MIcon name="check-circle" size={22} color="green" />
            </HStack>

            <HStack space="sm" mt="$4">
              <Button flex={1} bg="$green600" onPress={testPrint}>
                <ButtonText>Test Print</ButtonText>
              </Button>

              <Button flex={1} bg="$red100" onPress={handleDisconnect}>
                <ButtonText color="$red600">Disconnect</ButtonText>
              </Button>
            </HStack>
          </Box>
        )}

        <Text fontWeight="$semibold">Connection Type</Text>

        <HStack space="sm">
          {['wifi', 'bluetooth'].map(type => (
            <Pressable
              key={type}
              flex={1}
              onPress={() => {
                setConnectionType(type);
                setAvailablePrinters([]);
              }}>
              <Box
                p="$4"
                borderRadius="$xl"
                alignItems="center"
                bg={connectionType === type ? '$primary100' : '$coolGray100'}>
                <MIcon
                  name={type === 'wifi' ? 'wifi' : 'bluetooth'}
                  size={30}
                />
                <Text mt="$2">{type.toUpperCase()}</Text>
              </Box>
            </Pressable>
          ))}
        </HStack>

        {connectionType === 'wifi' && (
          <Box bg="$white" p="$4" borderRadius="$xl">
            <VStack space="md">
              <Box>
                <Text mb="$2">Printer Name</Text>
                <TextInput
                  value={wifiName}
                  onChangeText={setWifiName}
                  placeholder="Front Desk Printer"
                  style={{
                    borderWidth: 1,
                    borderColor: '#d4d4d8',
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                  }}
                />
              </Box>

              <Box>
                <Text mb="$2">Printer IP Address</Text>
                <TextInput
                  value={wifiHost}
                  onChangeText={setWifiHost}
                  placeholder="192.168.1.100"
                  autoCapitalize="none"
                  keyboardType="numbers-and-punctuation"
                  style={{
                    borderWidth: 1,
                    borderColor: '#d4d4d8',
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                  }}
                />
              </Box>

              <Box>
                <Text mb="$2">Port</Text>
                <TextInput
                  value={wifiPort}
                  onChangeText={setWifiPort}
                  placeholder="9100"
                  keyboardType="number-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: '#d4d4d8',
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                  }}
                />
              </Box>

              <Button
                borderRadius={30}
                onPress={handleWifiConnect}
                isDisabled={loading}>
                <ButtonText>
                  {loading ? 'Connecting...' : 'Connect WiFi Printer'}
                </ButtonText>
              </Button>
            </VStack>
          </Box>
        )}

        {connectionType === 'bluetooth' && (
          <>
            <Button
              borderRadius={30}
              onPress={handleScan}
              isDisabled={scanning || loading}>
              <ButtonText>
                {scanning ? 'Scanning…' : 'Scan for Bluetooth Printers'}
              </ButtonText>
            </Button>

            {(scanning || loading) && (
              <Center>
                <ActivityIndicator />
              </Center>
            )}

            {availablePrinters.length > 0 && (
              <>
                <Text fontWeight="$semibold">
                  Available Printers ({availablePrinters.length})
                </Text>

                <VStack space="sm">
                  {availablePrinters.map(printer => (
                    <Pressable
                      key={printer.address}
                      onPress={() => handleBluetoothConnect(printer)}>
                      <Box
                        p="$4"
                        bg="$white"
                        borderRadius="$xl"
                        borderWidth={1}
                        borderColor="$coolGray200">
                        <Text fontWeight="$bold">{printer.name}</Text>
                        <Text fontSize="$sm" color="$coolGray500">
                          {printer.address}
                        </Text>
                      </Box>
                    </Pressable>
                  ))}
                </VStack>
              </>
            )}
          </>
        )}

        <Text fontWeight="$semibold">Printer Settings</Text>

        <Box bg="$white" borderRadius="$xl">
          <HStack alignItems="center" justifyContent="space-between" p="$4">
            <VStack>
              <Text>Auto-print receipts</Text>
              <Text fontSize="$sm" color="$coolGray500">
                Print after payment
              </Text>
            </VStack>
            <Switch value={autoPrint} onValueChange={setAutoPrint} />
          </HStack>

          <Divider />

          <HStack alignItems="center" justifyContent="space-between" p="$4">
            <Text>Copies</Text>
            <HStack space="md" alignItems="center">
              <Pressable
                onPress={() => setPrintCopies(Math.max(1, printCopies - 1))}>
                <MIcon name="remove-circle-outline" size={28} />
              </Pressable>

              <Text fontWeight="$bold">{printCopies}</Text>

              <Pressable
                onPress={() => setPrintCopies(Math.min(5, printCopies + 1))}>
                <MIcon name="add-circle-outline" size={28} />
              </Pressable>
            </HStack>
          </HStack>
        </Box>
      </VStack>
    </ScrollView>
  );
}
