/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

const useBluetoothPermission = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'android') {
            checkPermissions();
        } else {
            setIsEnabled(false);
        }
    }, []);

    const checkPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
            );
            if (granted) {
                setIsEnabled(true);
            }
        } catch (error) {
            console.error('Permission check error:', error);
        }
    };

    const requestPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                {
                    title: 'Bluetooth Permission',
                    message: 'This app needs access to your Bluetooth.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setIsEnabled(true);
            } 
        } catch (error) {
            console.error('Permission request error:', error);
        }
    };

    return {
        isEnabled,
        checkPermissions,
        requestPermissions,
    };
};

export default useBluetoothPermission;