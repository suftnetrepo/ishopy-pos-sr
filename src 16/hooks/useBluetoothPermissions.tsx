/* eslint-disable prettier/prettier */
/* eslint-disable no-empty */
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
              
            }
        };
        checkBluetoothState();
    }, []);
   

    const requestPermissions = async () => {
        try {
            const state = await BluetoothManager.getState();  
            if (state === 'PoweredOff')  {               
             await BluetoothManager.enable();               
            } else if (state === 'PoweredOn') {
                setIsEnabled(true);
            }
           
        } catch (error) {
                   
        }
    };

    return {
        isEnabled,       
        requestPermissions,
    };
};

export default useBluetoothPermission;