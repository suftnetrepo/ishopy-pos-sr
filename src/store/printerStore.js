import AsyncStorage from '@react-native-async-storage/async-storage';

const SELECTED_PRINTER_KEY = 'selectedPrinter';

const printerStore = {
  async getSelectedPrinter() {
    try {
      const value = await AsyncStorage.getItem(SELECTED_PRINTER_KEY);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.log('getSelectedPrinter error:', error);
      return null;
    }
  },

  async saveSelectedPrinter(printer) {
    try {
      await AsyncStorage.setItem(
        SELECTED_PRINTER_KEY,
        JSON.stringify(printer)
      );
      return printer;
    } catch (error) {
      console.log('saveSelectedPrinter error:', error);
      throw error;
    }
  },

  async clearSelectedPrinter() {
    try {
      await AsyncStorage.removeItem(SELECTED_PRINTER_KEY);
      return true;
    } catch (error) {
      console.log('clearSelectedPrinter error:', error);
      return false;
    }
  },
};

export { printerStore };