/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useRef} from 'react';
import {Alert, ActivityIndicator, TextInput, Platform, ScrollView} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {StyledText, StyledPressable, Stack, theme} from 'fluent-styles';
import {useBluetoothPrinterContext} from '../../../hooks/bluetoothPrinterProvider';
import {useAppTheme} from '../../../theme';

const CONNECTION_TYPES = Platform.OS === 'ios' ? ['wifi'] : ['wifi', 'bluetooth'];

export default function PrinterOptions() {
  const {devices, selectedPrinter, loading, enableBluetooth, connectDevice,
         connectWifiPrinter, disconnectPrinter, testPrint} = useBluetoothPrinterContext();
  const {t} = useAppTheme();

  const [connectionType,    setConnectionType]    = useState('wifi');
  const [scanning,          setScanning]          = useState(false);
  const [availablePrinters, setAvailablePrinters] = useState([]);
  const [wifiName,          setWifiName]          = useState('');
  const [wifiHost,          setWifiHost]          = useState('');
  const [wifiPort,          setWifiPort]          = useState('9100');
  const [focusedInput,      setFocusedInput]      = useState(null);

  // Refs for smart input focus
  const hostInputRef = useRef(null);
  const portInputRef = useRef(null);

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

  // Validate IP format (basic)
  const isValidIP = (ip) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    const parts = ip.split('.');
    return parts.every(p => {
      const num = parseInt(p, 10);
      return num >= 0 && num <= 255;
    });
  };

  const handleWifiConnect = async () => {
    if (!wifiHost.trim()) {
      Alert.alert('Validation', 'Please enter printer IP address');
      return;
    }
    if (!isValidIP(wifiHost.trim())) {
      Alert.alert('Validation', 'Please enter a valid IP address (e.g., 192.168.1.100)');
      return;
    }
    try {
      await connectWifiPrinter({
        type: 'wifi',
        name: wifiName.trim() || `WiFi Printer (${wifiHost.trim()})`,
        host: wifiHost.trim(),
        port: Number(wifiPort || 9100),
      });
      Alert.alert('Success', 'WiFi printer connected. You can now run a test print.');
    } catch (error) { Alert.alert('WiFi Error', error?.message || 'Unable to connect printer'); }
  };

  const handleDisconnect = () => {
    if (!selectedPrinter) return;
    Alert.alert('Disconnect Printer', selectedPrinter.name || 'Selected printer', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Disconnect', style: 'destructive', onPress: disconnectPrinter},
    ]);
  };

  const isConnectDisabled = !wifiHost.trim() || !isValidIP(wifiHost.trim());

  return (
    <ScrollView>
      <Stack vertical gap={20} paddingHorizontal={16} paddingVertical={16} paddingBottom={40}>

        {/* ─── Success state: Connected printer ─────────────────────────────── */}
        {selectedPrinter && (
          <Stack
            backgroundColor={`${t.successColor}15`}
            borderWidth={1}
            borderColor={`${t.successColor}40`}
            padding={16}
            borderRadius={14}
            vertical
            gap={12}>
            <Stack horizontal alignItems="center" gap={12}>
              <Stack
                width={44}
                height={44}
                borderRadius={22}
                backgroundColor={`${t.successColor}25`}
                alignItems="center"
                justifyContent="center">
                <MIcon name="print" size={24} color={t.successColor} />
              </Stack>
              <Stack vertical flex={1}>
                <StyledText fontWeight={theme.fontWeight.semiBold} color={t.textPrimary}>
                  {selectedPrinter.name}
                </StyledText>
                <StyledText fontSize={12} color={t.textSecondary}>
                  {selectedPrinter.type === 'wifi'
                    ? `${selectedPrinter.host}:${selectedPrinter.port || 9100}`
                    : selectedPrinter.address}
                </StyledText>
              </Stack>
              <MIcon name="check-circle" size={24} color={t.successColor} />
            </Stack>
            <Stack horizontal gap={8}>
              <StyledPressable
                flex={1}
                backgroundColor={`${t.successColor}25`}
                borderWidth={1}
                borderColor={t.successColor}
                paddingVertical={12}
                borderRadius={10}
                alignItems="center"
                onPress={testPrint}>
                <StyledText color={t.successColor} fontWeight={theme.fontWeight.medium}>
                  Test Print
                </StyledText>
              </StyledPressable>
              <StyledPressable
                flex={1}
                backgroundColor={`${t.dangerColor}15`}
                borderWidth={1}
                borderColor={`${t.dangerColor}40`}
                paddingVertical={12}
                borderRadius={10}
                alignItems="center"
                onPress={handleDisconnect}>
                <StyledText color={t.dangerColor} fontWeight={theme.fontWeight.medium}>
                  Disconnect
                </StyledText>
              </StyledPressable>
            </Stack>
          </Stack>
        )}

        {/* ─── Info banner (subtle) ───────────────────────────────────────── */}
        <Stack
          backgroundColor={t.bgInput}
          borderRadius={10}
          paddingVertical={10}
          paddingHorizontal={12}
          horizontal
          alignItems="center"
          gap={8}
          opacity={0.85}>
          <MIcon name="info" size={16} color={t.textSecondary} />
          <StyledText fontSize={12} color={t.textSecondary} flex={1}>
            {Platform.OS === 'ios'
              ? 'iPad supports WiFi/LAN printers only.'
              : 'Connect via WiFi or Bluetooth for receipt printing.'}
          </StyledText>
        </Stack>

        {/* ─── Connection Type Card ───────────────────────────────────────── */}
        {!selectedPrinter && (
          <>
            <Stack vertical gap={8}>
              <StyledText
                fontWeight={theme.fontWeight.semiBold}
                color={t.textPrimary}
                fontSize={14}
                letterSpacing={0.5}>
                CONNECTION TYPE
              </StyledText>
              <StyledText fontSize={12} color={t.textSecondary}>
                Choose how your printer connects to this device
              </StyledText>
            </Stack>
              
            <Stack
              horizontal
              gap={10}
              style={{
                backgroundColor: t.bgCard,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: t.borderDefault,
                padding: 12,
              }}>
              {CONNECTION_TYPES.map(type => (
                <StyledPressable
                  key={type}
                  flex={1}
                  onPress={() => { setConnectionType(type); setAvailablePrinters([]); }}
                  padding={14}
                  borderRadius={12}
                  alignItems="center"
                  vertical
                  gap={8}
                  backgroundColor={connectionType === type ? `${t.brandPrimary}08` : 'transparent'}
                  borderWidth={1}
                  borderColor={connectionType === type ? t.brandPrimary : t.borderDefault}
                  shadowColor={connectionType === type ? t.brandPrimary : 'transparent'}
                  shadowOpacity={connectionType === type ? 0.15 : 0}
                  shadowRadius={8}
                  elevation={connectionType === type ? 2 : 0}>
                  <MIcon
                    name={type === 'wifi' ? 'wifi' : 'bluetooth-audio'}
                    size={28}
                    color={connectionType === type ? t.brandPrimary : t.textSecondary}
                  />
                  <StyledText
                    fontSize={12}
                    fontWeight={theme.fontWeight.medium}
                    color={connectionType === type ? t.brandPrimary : t.textSecondary}>
                    {type === 'wifi' ? 'WiFi/LAN' : 'Bluetooth'}
                  </StyledText>
                  {type === 'wifi' && (
                    <StyledText fontSize={10} color={t.textMuted}>
                      Recommended
                    </StyledText>
                  )}
                </StyledPressable>
              ))}
            </Stack>

            {/* ─── Printer Details Card ───────────────────────────────────── */}
            {connectionType === 'wifi' && (
              <Stack
                vertical
                gap={14}
                backgroundColor={t.bgCard}
                borderRadius={14}
                borderWidth={1}
                borderColor={t.borderDefault}
                padding={16}>
                <Stack vertical gap={8}>
                  <StyledText
                    fontWeight={theme.fontWeight.semiBold}
                    color={t.textPrimary}
                    fontSize={14}
                    letterSpacing={0.5}>
                    PRINTER DETAILS
                  </StyledText>
                  <StyledText fontSize={12} color={t.textSecondary}>
                    Enter your printer network information
                  </StyledText>
                </Stack>

                {/* Printer Name input */}
                <Stack vertical gap={6}>
                  <StyledText fontSize={12} fontWeight={theme.fontWeight.medium} color={t.textSecondary}>
                    Printer Name
                  </StyledText>
                  <Stack
                    horizontal
                    alignItems="center"
                    backgroundColor={t.bgInput}
                    borderRadius={10}
                    borderWidth={1}
                    borderColor={focusedInput === 'name' ? t.brandPrimary : t.borderDefault}
                    paddingHorizontal={12}
                    gap={8}
                    shadowColor={focusedInput === 'name' ? t.brandPrimary : 'transparent'}
                    shadowOpacity={focusedInput === 'name' ? 0.15 : 0}
                    shadowRadius={6}
                    elevation={focusedInput === 'name' ? 2 : 0}>
                    <MIcon name="local-printshop" size={18} color={t.textMuted} />
                    <TextInput
                      placeholder="Front Desk Printer"
                      placeholderTextColor={t.textMuted}
                      returnKeyType="next"
                      onFocus={() => setFocusedInput('name')}
                      onBlur={() => setFocusedInput(null)}
                      onSubmitEditing={() => hostInputRef.current?.focus()}
                      value={wifiName}
                      onChangeText={setWifiName}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        color: t.textPrimary,
                        fontSize: 14,
                      }}
                    />
                  </Stack>
                </Stack>

                {/* IP Address input */}
                <Stack vertical gap={6}>
                  <StyledText fontSize={12} fontWeight={theme.fontWeight.medium} color={t.textSecondary}>
                    IP Address
                  </StyledText>
                  <Stack
                    horizontal
                    alignItems="center"
                    backgroundColor={t.bgInput}
                    borderRadius={10}
                    borderWidth={1}
                    borderColor={
                      focusedInput === 'host'
                        ? t.brandPrimary
                        : wifiHost && !isValidIP(wifiHost)
                        ? t.dangerColor
                        : t.borderDefault
                    }
                    paddingHorizontal={12}
                    gap={8}
                    shadowColor={focusedInput === 'host' ? t.brandPrimary : 'transparent'}
                    shadowOpacity={focusedInput === 'host' ? 0.15 : 0}
                    shadowRadius={6}
                    elevation={focusedInput === 'host' ? 2 : 0}>
                    <MIcon name="language" size={18} color={t.textMuted} />
                    <TextInput
                      ref={hostInputRef}
                      placeholder="192.168.1.100"
                      placeholderTextColor={t.textMuted}
                      autoCapitalize="none"
                      keyboardType="numbers-and-punctuation"
                      returnKeyType="next"
                      onFocus={() => setFocusedInput('host')}
                      onBlur={() => setFocusedInput(null)}
                      onSubmitEditing={() => portInputRef.current?.focus()}
                      value={wifiHost}
                      onChangeText={setWifiHost}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        color: t.textPrimary,
                        fontSize: 14,
                      }}
                    />
                    {wifiHost && !isValidIP(wifiHost) && (
                      <MIcon name="error" size={16} color={t.dangerColor} />
                    )}
                  </Stack>
                  {wifiHost && !isValidIP(wifiHost) && (
                    <StyledText fontSize={11} color={t.dangerColor}>
                      Invalid IP address
                    </StyledText>
                  )}
                </Stack>

                {/* Port input */}
                <Stack vertical gap={6}>
                  <StyledText fontSize={12} fontWeight={theme.fontWeight.medium} color={t.textSecondary}>
                    Port (default: 9100)
                  </StyledText>
                  <Stack
                    horizontal
                    alignItems="center"
                    backgroundColor={t.bgInput}
                    borderRadius={10}
                    borderWidth={1}
                    borderColor={focusedInput === 'port' ? t.brandPrimary : t.borderDefault}
                    paddingHorizontal={12}
                    gap={8}
                    shadowColor={focusedInput === 'port' ? t.brandPrimary : 'transparent'}
                    shadowOpacity={focusedInput === 'port' ? 0.15 : 0}
                    shadowRadius={6}
                    elevation={focusedInput === 'port' ? 2 : 0}>
                    <MIcon name="router" size={18} color={t.textMuted} />
                    <TextInput
                      ref={portInputRef}
                      placeholder="9100"
                      placeholderTextColor={t.textMuted}
                      keyboardType="number-pad"
                      onFocus={() => setFocusedInput('port')}
                      onBlur={() => setFocusedInput(null)}
                      value={wifiPort}
                      onChangeText={setWifiPort}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        color: t.textPrimary,
                        fontSize: 14,
                      }}
                    />
                  </Stack>
                </Stack>
              </Stack>
            )}

            {/* ─── Primary CTA ───────────────────────────────────────────── */}
            {connectionType === 'wifi' && (
              <Stack vertical gap={10}>
                <StyledPressable
                  onPress={handleWifiConnect}
                  disabled={isConnectDisabled || loading}
                  backgroundColor={t.brandPrimary}
                  borderRadius={12}
                  paddingVertical={14}
                  alignItems="center"
                  justifyContent="center"
                  opacity={isConnectDisabled ? 0.4 : 1}
                  shadowColor={t.brandPrimary}
                  shadowOpacity={isConnectDisabled ? 0 : 0.25}
                  shadowRadius={8}
                  elevation={isConnectDisabled ? 0 : 5}>
                  <Stack horizontal alignItems="center" gap={8}>
                    <MIcon
                      name="print"
                      size={20}
                      color={t.textInverse}
                    />
                    <StyledText
                      color={t.textInverse}
                      fontWeight={theme.fontWeight.semiBold}
                      fontSize={15}>
                      {loading ? 'Connecting...' : 'Connect Printer'}
                    </StyledText>
                  </Stack>
                </StyledPressable>
              </Stack>
            )}

            {/* ─── Bluetooth scan section ─────────────────────────────────── */}
            {Platform.OS === 'android' && connectionType === 'bluetooth' && (
              <Stack vertical gap={14}>
                <StyledPressable
                  onPress={handleScan}
                  disabled={scanning || loading}
                  backgroundColor={t.brandPrimary}
                  borderRadius={12}
                  paddingVertical={14}
                  alignItems="center"
                  justifyContent="center">
                  <StyledText color={t.textInverse} fontWeight={theme.fontWeight.semiBold}>
                    {scanning ? 'Scanning…' : 'Scan for Bluetooth Printers'}
                  </StyledText>
                </StyledPressable>

                {(scanning || loading) && (
                  <Stack alignItems="center">
                    <ActivityIndicator color={t.brandPrimary} />
                  </Stack>
                )}

                {availablePrinters.length > 0 && (
                  <Stack vertical gap={10}>
                    <StyledText fontWeight={theme.fontWeight.semiBold} color={t.textPrimary}>
                      Available Printers ({availablePrinters.length})
                    </StyledText>
                    {availablePrinters.map(printer => (
                      <StyledPressable
                        key={printer.address}
                        onPress={() => handleBluetoothConnect(printer)}
                        padding={14}
                        backgroundColor={t.bgCard}
                        borderRadius={12}
                        borderWidth={1}
                        borderColor={t.borderDefault}
                        vertical
                        gap={4}>
                        <StyledText fontWeight={theme.fontWeight.semiBold} color={t.textPrimary}>
                          {printer.name}
                        </StyledText>
                        <StyledText fontSize={12} color={t.textSecondary}>
                          {printer.address}
                        </StyledText>
                      </StyledPressable>
                    ))}
                  </Stack>
                )}
              </Stack>
            )}
          </>
        )}
      </Stack>
    </ScrollView>
  );
}
