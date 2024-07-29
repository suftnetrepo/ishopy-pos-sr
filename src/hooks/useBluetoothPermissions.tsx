/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import { BluetoothManager } from 'tp-react-native-bluetooth-printer';
import { useState } from 'react';

const useBluetoothPermissions = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [error, setError] = useState(null);

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
                        checkBluetoothStatus();
                    } else {
                        showAlert();
                    }
                } catch (err) {
                    console.error('Failed to request permissions', err);
                    Alert.alert('Permission Request Failed', 'An error occurred while requesting Bluetooth permissions.');
                }
            } else {
                // Android 9 and below do not require runtime permission requests
                checkBluetoothStatus();
            }
        } else {
            checkBluetoothStatus();  // Call function if not Android
        }
    };

    const checkBluetoothStatus = () => {       
        Promise.resolve(BluetoothManager.isBluetoothEnabled())
            .then(enabled => {
                setIsEnabled(enabled);
            })
            .catch(err => setError(err));
    };

    const showAlert = () => {
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
    };

    return { requestPermissions, isEnabled, error };
};

export default useBluetoothPermissions;
