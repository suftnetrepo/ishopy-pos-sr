import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Navigator} from './src/navigation/AppNavigation';
import {RealmProvider} from './src/model/store';
import AppProvider from './src/hooks/appContext';
import {BluetoothPrinterProvider} from './src/hooks/bluetoothPrinterProvider';
import {withIAPContext} from 'react-native-iap';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {glueStackConfigUi} from './gluestack-ui.config';
import {GlobalPortalProvider, PortalManager} from 'fluent-styles';
import {ThemeProvider} from './src/theme';

function App() {
  return (
    <ThemeProvider>
      <RealmProvider>
        <GluestackUIProvider config={glueStackConfigUi}>
          <GlobalPortalProvider>
            <PortalManager>
              <AppProvider>
                <BluetoothPrinterProvider>
                    <NavigationContainer>
                        <Navigator />
                      </NavigationContainer>
                  </BluetoothPrinterProvider>
              </AppProvider>
            </PortalManager>
          </GlobalPortalProvider>
        </GluestackUIProvider>
      </RealmProvider>
    </ThemeProvider>
  );
}

export default withIAPContext(App);
