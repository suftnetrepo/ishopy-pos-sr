/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import BluetoothManager  from 'react-native-bluetooth-state-manager';

const useBluetoothPermission = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        const checkBluetoothState = async () => {
            try {
                const state = await BluetoothManager.getState();               
                setIsEnabled(state === 'PoweredOn');
            } catch (error) {
                console.error('Error fetching Bluetooth state:', error);
            }
        };
        checkBluetoothState();
    }, []);
   

    const requestPermissions = async () => {
        try {
            const result = await BluetoothManager.requestToEnable();
            if (result) {
                setIsEnabled(true);
            } 
        } catch (error) {
            console.error('Error requesting Bluetooth enable:', error);          
        }
    };

    return {
        isEnabled,       
        requestPermissions,
    };
};

export default useBluetoothPermission;