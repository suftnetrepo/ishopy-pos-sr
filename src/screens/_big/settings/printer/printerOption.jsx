import React, { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

export default function PrinterOptions({ navigation }) {
  const [connectionType, setConnectionType] = useState('wifi');
  const [scanning, setScanning] = useState(false);
  const [connectedPrinter, setConnectedPrinter] = useState(null);
  const [availablePrinters, setAvailablePrinters] = useState([]);
  const [autoPrint, setAutoPrint] = useState(true);
  const [printCopies, setPrintCopies] = useState(1);

  /* ---------------- MOCK DATA ---------------- */

  const mockPrinters = {
    wifi: [
      { id: '1', name: 'Epson TM-T88VI', address: '192.168.1.100', signalStrength: 85 },
      { id: '2', name: 'Star TSP143IIIU', address: '192.168.1.101', signalStrength: 92 },
    ],
    bluetooth: [
      { id: '3', name: 'Star SM-L200', address: '00:11:62:A3:F1', signalStrength: 88 },
      { id: '4', name: 'Zebra ZQ520', address: '00:11:62:B4:D2', signalStrength: 75 },
    ],
    usb: [
      { id: '5', name: 'Epson TM-T20III', address: 'USB Port 1' },
    ],
  };

  /* ---------------- HANDLERS ---------------- */

  const handleScan = () => {
    setScanning(true);
    setAvailablePrinters([]);

    setTimeout(() => {
      setAvailablePrinters(mockPrinters[connectionType]);
      setScanning(false);
    }, 1500);
  };

  const handleConnect = printer => {
    Alert.alert(
      'Connect Printer',
      `Connect to ${printer.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: () => {
            setConnectedPrinter(printer);
            setAvailablePrinters([]);
          },
        },
      ]
    );
  };

  const handleDisconnect = () => {
    if (!connectedPrinter) return;

    Alert.alert(
      'Disconnect Printer',
      connectedPrinter.name,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => setConnectedPrinter(null),
        },
      ]
    );
  };

  /* ---------------- UI ---------------- */

  return (
     <ScrollView>
        <VStack space="lg" px="$5" pb="$10">

          <Text color="$coolGray500">
            Connect your receipt printer via WiFi, Bluetooth, or USB
          </Text>

          {/* Connected Printer */}
          {connectedPrinter && (
            <Box bg="$green50" p="$4" borderRadius="$xl">
              <HStack alignItems="center" space="md">
                <MIcon name="print" size={28} color="green" />
                <VStack flex={1}>
                  <Text fontWeight="$bold">{connectedPrinter.name}</Text>
                  <Text fontSize="$sm" color="$coolGray500">
                    {connectedPrinter.address}
                  </Text>
                </VStack>
                <MIcon name="check-circle" size={22} color="green" />
              </HStack>

              <HStack space="sm" mt="$4">
                <Button flex={1} bg="$green600">
                  <ButtonText>Test Print</ButtonText>
                </Button>

                <Button
                  flex={1}
                  bg="$red100"
                  onPress={handleDisconnect}
                >
                  <ButtonText color="$red600">
                    Disconnect
                  </ButtonText>
                </Button>
              </HStack>
            </Box>
          )}

          {/* Connection Type */}
          <Text fontWeight="$semibold">
            Connection Type
          </Text>

          <HStack space="sm">
            {['wifi', 'bluetooth', 'usb'].map(type => (
              <Pressable
                key={type}
                flex={1}
                onPress={() => {
                  setConnectionType(type);
                  setAvailablePrinters([]);
                }}
              >
                <Box
                  p="$4"
                  borderRadius="$xl"
                  alignItems="center"
                  bg={
                    connectionType === type
                      ? '$primary100'
                      : '$coolGray100'
                  }
                >
                  <MIcon
                    name={
                      type === 'wifi'
                        ? 'wifi'
                        : type === 'bluetooth'
                        ? 'bluetooth'
                        : 'usb'
                    }
                    size={30}
                  />
                  <Text mt="$2">
                    {type.toUpperCase()}
                  </Text>
                </Box>
              </Pressable>
            ))}
          </HStack>

          {/* Scan */}
          <Button
          borderRadius={30}
            onPress={handleScan}
            isDisabled={scanning}
          >
            <ButtonText>
              {scanning ? 'Scanning…' : 'Scan for Printers'}
            </ButtonText>
          </Button>

          {scanning && (
            <Center>
              <ActivityIndicator />
            </Center>
          )}

          {/* Available Printers */}
          {availablePrinters.length > 0 && (
            <>
              <Text fontWeight="$semibold">
                Available Printers ({availablePrinters.length})
              </Text>

              <VStack space="sm">
                {availablePrinters.map(printer => (
                  <Pressable
                    key={printer.id}
                    onPress={() => handleConnect(printer)}
                  >
                    <Box
                      p="$4"
                      bg="$white"
                      borderRadius="$xl"
                      borderWidth={1}
                      borderColor="$coolGray200"
                    >
                      <Text fontWeight="$bold">
                        {printer.name}
                      </Text>
                      <Text
                        fontSize="$sm"
                        color="$coolGray500"
                      >
                        {printer.address}
                      </Text>
                    </Box>
                  </Pressable>
                ))}
              </VStack>
            </>
          )}

          {/* Settings */}
          <Text fontWeight="$semibold">
            Printer Settings
          </Text>

          <Box bg="$white" borderRadius="$xl">
            <HStack
              alignItems="center"
              justifyContent="space-between"
              p="$4"
            >
              <VStack>
                <Text>Auto-print receipts</Text>
                <Text
                  fontSize="$sm"
                  color="$coolGray500"
                >
                  Print after payment
                </Text>
              </VStack>
              <Switch
                value={autoPrint}
                onValueChange={setAutoPrint}
              />
            </HStack>

            <Divider />

            <HStack
              alignItems="center"
              justifyContent="space-between"
              p="$4"
            >
              <Text>Copies</Text>
              <HStack space="md" alignItems="center">
                <Pressable
                  onPress={() =>
                    setPrintCopies(Math.max(1, printCopies - 1))
                  }
                >
                  <MIcon
                    name="remove-circle-outline"
                    size={28}
                  />
                </Pressable>

                <Text fontWeight="$bold">
                  {printCopies}
                </Text>

                <Pressable
                  onPress={() =>
                    setPrintCopies(Math.min(5, printCopies + 1))
                  }
                >
                  <MIcon
                    name="add-circle-outline"
                    size={28}
                  />
                </Pressable>
              </HStack>
            </HStack>
          </Box>

        </VStack>
      </ScrollView>
  );
}
