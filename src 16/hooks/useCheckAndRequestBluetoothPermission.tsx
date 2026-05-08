/* eslint-disable prettier/prettier */
/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

const useCheckAndRequestBluetoothPermission = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    const checkAndRequestBluetoothPermission = async () => {
        if (Platform.OS === 'android') {
            return await checkAndRequestBluetoothPermissionAndroid();
        } else if (Platform.OS === 'ios') {

        } else {
            throw new Error('Bluetooth permission is not available on this platform');
        }
    };

    const checkAndRequestBluetoothPermissionAndroid = async () => {
        let allPermissionsGranted = true;

        try {
           
            const permissions = [
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ];

            const grantedPermissions = await Promise.all(permissions.map(permission =>
                PermissionsAndroid.check(permission)
            ));

            const permissionsToRequest = permissions.filter((_, index) => !grantedPermissions[index]);

            if (permissionsToRequest.length > 0) {
                const results = await PermissionsAndroid.requestMultiple(permissionsToRequest);;

                for (const [status] of Object.entries(results)) {
                    if (status !== PermissionsAndroid.RESULTS.GRANTED) {
                        allPermissionsGranted = false;
                    }
                }
            }
            return allPermissionsGranted
        } catch (error) {
            if (__DEV__) {
                console.error('Error checking Bluetooth permissions:', error);
            }
            return false;
        }
    };

    useEffect(() => {
        const requestBluetoothPermission = async () => {
            const result = await checkAndRequestBluetoothPermission() || false;
            setIsEnabled(result)    
        };

        requestBluetoothPermission();
    }, []);
    

    return {
        isEnabled        
    };
};

export default useCheckAndRequestBluetoothPermission;