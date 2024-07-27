/* eslint-disable prettier/prettier */
import { observable } from '@legendapp/state';

interface appState {
  payment_status: boolean;
  purchase_status: boolean;
}

const initialize = {
  payment_status: false,
  purchase_status: false
};

const state = observable<appState>(initialize);

const useUtil = () => {
    const clear = () => {
        state.set(initialize);
    };

    const setPaymentStatus = (value: boolean) => {
        state.payment_status.set(value);
    };

    const getPaymentStatus = () => {
      return state.payment_status.get();
    };

    const setPurchaseStatus = (value: boolean) => {
      state.purchase_status.set(value);
    };

    const getPurchaseStatus = () => {
      return state.purchase_status.get();
    };

    return {
      clear,
      getPaymentStatus,
      setPaymentStatus,
      setPurchaseStatus,
      getPurchaseStatus,
    };
}

export {useUtil, state};