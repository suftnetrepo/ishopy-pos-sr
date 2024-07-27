/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import {getRealmInstance} from './store';

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  date: Date;
}

const insertPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
  const realm = await getRealmInstance()
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const newPayment: Payment = {
          id:guid(),
          ...payment,
        };
        realm.create('Payment', newPayment);
        resolve(newPayment);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryAllPayments = async (): Promise<Payment[]> => {
    const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const payments = realm.objects<Payment>('Payment').sorted('date', true).map(payment => ({
        id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount,
        payment_method: payment.payment_method,
        date: payment.date,
      }));
      resolve(payments);
    } catch (error) {
      reject(error);
    }
  });
};

const queryPaymentsByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<Payment[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const payments = realm
        .objects<Payment>('Payment')
        .filtered('date >= $0 AND date <= $1', startDate, endDate)
        .sorted('date', true)
        .map(payment => ({
          id: payment.id,
          order_id: payment.order_id,
          amount: payment.amount,
          payment_method: payment.payment_method,
          date: payment.date,
        }));
      resolve(payments);
    } catch (error) {
      reject(error);
    }
  });
};

const queryPaymentsByOrderId = async (order_id: number): Promise<Payment[]> => {
    const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const payments = realm
        .objects<Payment>('Payment')
        .filtered('order_id == $0', order_id)
        .map(payment => ({
          id: payment.id,
          order_id: payment.order_id,
          amount: payment.amount,
          payment_method: payment.payment_method,
          date: payment.date,
        }));
      resolve(payments);
    } catch (error) {
      reject(error);
    }
  });
};

const deletePayment = async (id: number): Promise<boolean> => {
    const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const payment = realm.objectForPrimaryKey<Payment>('Payment', id);
        if (payment) {
          realm.delete(payment);
          resolve(true);
        } else {
          reject(new Error('Payment not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertPayment,
  queryAllPayments,
  queryPaymentsByOrderId, 
  deletePayment,
  queryPaymentsByDateRange,
};
