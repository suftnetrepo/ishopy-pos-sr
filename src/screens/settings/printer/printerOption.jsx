/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {Alert, ActivityIndicator, TextInput, Platform, ScrollView} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {StyledText, StyledPressable, Stack} from 'fluent-styles';
import {theme} from '../../../utils/theme';
import {useBluetoothPrinterContext} from '../../../hooks/bluetoothPrinterProvider';
import {useAppTheme} from '../../../theme';

const CONNECTION_TYPES = Platform.OS === 'ios' ? ['wifi'] : ['wifi', 'bluetooth'];

const inputStyle = {
  borderWidth: 1, borderColor: '#d4d4d8', borderRadius: 12,
  paddingHorizontal: 12, paddingVertical: 12,
};

export default function PrinterOptions() {
  const {devices, selectedPrinter, loading, enableBluetooth, connectDevice,
         connectWifiPrinter, disconnectPrinter, testPrint} = useBluetoothPrinterContext();

  const [connectionType,    setConnectionType]    = useState('wifi');
  const [scanning,          setScanning]          = useState(false);
  const [availablePrinters, setAvailablePrinters] = useState([]);
  const {t} = useAppTheme();
  const [wifiName,          setWifiName]          = useState('');
  const [wifiHost,          setWifiHost]          = useState('');
  const [wifiPort,          setWifiPort]          = useState('9100');

  useEffect(() => { if (Platform.OS === 'ios') setConnectionType('wifi'); }, []);

  useEffect(() => {
    if (selectedPrinter?.type === 'wifi') {
      setWifiName(selectedPrinter.name || '');
      setWifiHost(selectedPrinter.host || '');
      setWifiPort(String(selectedPrinter.port || 9100));
    }
  }, [selectedPrinter]);

  const handleScan = async () => {
    if (Platform.OS === 'ios') { Alert.alert('Bluetooth not supported', 'Please use WiFi on iPad.'); return; }
    if (connectionType !== 'bluetooth') return;
    setScanning(true); setAvailablePrinters([]);
    try {
      const scannedDevices = await enableBluetooth();
      setAvailablePrinters(Array.isArray(scannedDevices) ? scannedDevices : devices || []);
    } catch (error) {
      Alert.alert('Bluetooth Error', error?.message || 'Unable to scan devices');
    } finally { setScanning(false); }
  };

  const handleBluetoothConnect = printer => {
    Alert.alert('Connect Printer', `Connect to ${printer.name}?`, [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Connect', onPress: () => { connectDevice(printer); setAvailablePrinters([]); }},
    ]);
  };

  const handleWifiConnect = async () => {
    if (!wifiHost.trim()) { Alert.alert('Validation', 'Please enter printer IP address'); return; }
    try {
      await connectWifiPrinter({
        type: 'wifi',
        name: wifiName.trim() || `WiFi Printer (${wifiHost.trim()})`,
        host: wifiHost.trim(),
        port: Number(wifiPort || 9100),
      });
      Alert.alert('Success', 'WiFi printer connected. Tap Test Print.');
    } catch (error) { Alert.alert('WiFi Error', error?.message || 'Unable to connect printer'); }
  };

  const handleDisconnect = () => {
    if (!selectedPrinter) return;
    Alert.alert('Disconnect Printer', selectedPrinter.name || 'Selected printer', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Disconnect', style: 'destructive', onPress: disconnectPrinter},
    ]);
  };

  return (
    <ScrollView>
      <Stack vertical gap={16} paddingHorizontal={20} paddingBottom={40}>

        <StyledText color={t.textSecondary}>
          {Platform.OS === 'ios'
            ? 'Connect your receipt printer via WiFi/LAN on iPad'
            : 'Connect your receipt printer via WiFi or Bluetooth'}
        </StyledText>

        {/* Connected printer */}
        {selectedPrinter && (
          <Stack backgroundColor={t.successBg} padding={16} borderRadius={12} vertical gap={12}>
            <Stack horizontal alignItems="center" gap={12}>
              <MIcon name="print" size={28} color="green" />
              <Stack vertical flex={1}>
                <StyledText fontWeight={theme.fontWeight.bold}>{selectedPrinter.name}</StyledText>
                <StyledText fontSize={theme.fontSize.small} color={t.textSecondary}>
                  {selectedPrinter.type === 'wifi'
                    ? `${selectedPrinter.host}:${selectedPrinter.port || 9100}`
                    : selectedPrinter.address}
                </StyledText>
              </Stack>
              <MIcon name="check-circle" size={22} color="green" />
            </Stack>
            <Stack horizontal gap={8}>
              <StyledPressable flex={1} backgroundColor={t.successColor}
                paddingVertical={10} borderRadius={8} alignItems="center" onPress={testPrint}>
                <StyledText color={t.bgCard}>Test Print</StyledText>
              </StyledPressable>
              <StyledPressable flex={1} backgroundColor={t.dangerBg}
                paddingVertical={10} borderRadius={8} alignItems="center" onPress={handleDisconnect}>
                <StyledText color={t.dangerColor}>Disconnect</StyledText>
              </StyledPressable>
            </Stack>
          </Stack>
        )}

        <StyledText fontWeight={theme.fontWeight.semiBold}>Connection Type</StyledText>

        {/* Connection type selector */}
        <Stack horizontal gap={8}>
          {CONNECTION_TYPES.map(type => (
            <StyledPressable
              key={type} flex={1}
              onPress={() => { setConnectionType(type); setAvailablePrinters([]); }}
              padding={16} borderRadius={12} alignItems="center"
              backgroundColor={connectionType === type ? t.infoBg : t.bgPage}>
              <MIcon name={type === 'wifi' ? 'wifi' : 'bluetooth'} size={30}
                color={connectionType === type ? t.infoColor : t.textSecondary} />
              <StyledText marginTop={8}>{type.toUpperCase()}</StyledText>
            </StyledPressable>
          ))}
        </Stack>

        {/* iOS note */}
        {Platform.OS === 'ios' && (
          <Stack backgroundColor={t.infoBg} padding={16} borderRadius={12}>
            <StyledText color={t.infoColor}>
              On iPad, use a WiFi/LAN receipt printer. Bluetooth is Android only.
            </StyledText>
          </Stack>
        )}

        {/* WiFi setup */}
        {connectionType === 'wifi' && (
          <Stack backgroundColor={t.bgCard} padding={16} borderRadius={12} vertical gap={12}>
            <Stack vertical gap={6}>
              <StyledText>Printer Name</StyledText>
              <TextInput value={wifiName} onChangeText={setWifiName}
                placeholder="Front Desk Printer" style={inputStyle} />
            </Stack>
            <Stack vertical gap={6}>
              <StyledText>Printer IP Address</StyledText>
              <TextInput value={wifiHost} onChangeText={setWifiHost}
                placeholder="192.168.1.100" autoCapitalize="none"
                keyboardType="numbers-and-punctuation" style={inputStyle} />
            </Stack>
            <Stack vertical gap={6}>
              <StyledText>Port</StyledText>
              <TextInput value={wifiPort} onChangeText={setWifiPort}
                placeholder="9100" keyboardType="number-pad" style={inputStyle} />
            </Stack>
            <StyledPressable
              borderRadius={30} paddingVertical={12} alignItems="center"
              backgroundColor={t.textPrimary} disabled={loading}
              onPress={handleWifiConnect}>
              <StyledText color={t.bgCard}>
                {loading ? 'Connecting...' : 'Connect WiFi Printer'}
              </StyledText>
            </StyledPressable>
          </Stack>
        )}

        {/* Bluetooth scan */}
        {Platform.OS === 'android' && connectionType === 'bluetooth' && (
          <Stack vertical gap={12}>
            <StyledPressable
              borderRadius={30} paddingVertical={12} alignItems="center"
              backgroundColor={t.textPrimary}
              disabled={scanning || loading} onPress={handleScan}>
              <StyledText color={t.bgCard}>
                {scanning ? 'Scanning…' : 'Scan for Bluetooth Printers'}
              </StyledText>
            </StyledPressable>

            {(scanning || loading) && (
              <Stack alignItems="center"><ActivityIndicator /></Stack>
            )}

            {availablePrinters.length > 0 && (
              <Stack vertical gap={8}>
                <StyledText fontWeight={theme.fontWeight.semiBold}>
                  Available Printers ({availablePrinters.length})
                </StyledText>
                {availablePrinters.map(printer => (
                  <StyledPressable
                    key={printer.address} onPress={() => handleBluetoothConnect(printer)}
                    padding={16} backgroundColor={t.bgCard}
                    borderRadius={12} borderWidth={1} borderColor={t.borderDefault} vertical>
                    <StyledText fontWeight={theme.fontWeight.bold}>{printer.name}</StyledText>
                    <StyledText fontSize={theme.fontSize.small} color={t.textSecondary}>
                      {printer.address}
                    </StyledText>
                  </StyledPressable>
                ))}
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </ScrollView>
  );
}
