/* eslint-disable prettier/prettier */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ToastProvider } from 'react-native-toast-notifications'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Navigator } from './src/navigation/AppNavigation';
import { RealmProvider } from './src/model/store'

import { StyledToast } from './src/components/toast'
import AppProvider from './src/hooks/appContext'
import RadioProvider from './src/hooks/radioContext';
import {BluetoothPrinterProvider} from './src/hooks/bluetoothPrinterProvider';
import { withIAPContext } from 'react-native-iap';

function App(): React.JSX.Element {
 
   return (
    <RealmProvider>
      <AppProvider>
        <ToastProvider dangerIcon={<Icon name="close" color="#fff" />}
          successIcon={<Icon name="check" color="#fff" size={18} />}
          offset={10}
          renderType={{
            custom_toast: (toast) => (
              <StyledToast toast={toast} />
            ),
          }}
        >
          <BluetoothPrinterProvider>
            <RadioProvider>
              <NavigationContainer>
                <Navigator />
              </NavigationContainer>
            </RadioProvider>
          </BluetoothPrinterProvider>
        </ToastProvider>
      </AppProvider>
    </RealmProvider>
  );
}

export default withIAPContext(App);
