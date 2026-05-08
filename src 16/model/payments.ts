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

export interface PaymentsPageParams {
  page: number;
  pageSize: number;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaymentsPage {
  data: Payment[];
  totalCount: number;
  grandTotal: number;
}

const queryPaymentsPaginated = async (params: PaymentsPageParams): Promise<PaymentsPage> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const {page, pageSize, sortKey, sortDir, search, startDate, endDate} = params;

      let results = realm.objects<Payment>('Payment');

      // Date range filter
      if (startDate && endDate) {
        results = results.filtered('date >= $0 && date <= $1', startDate, endDate) as any;
      }

      // Search by payment_method or order_id
      if (search) {
        results = results.filtered(
          'payment_method CONTAINS[c] $0 OR order_id CONTAINS[c] $0',
          search,
        ) as any;
      }

      const totalCount = results.length;

      // Sort
      const key = (sortKey || 'date') as keyof Payment;
      const descending = sortDir === 'desc' || !sortDir;
      const sorted = results.sorted(key as string, descending);

      // Slice page — only load current page into JS
      const data = sorted
        .slice(page * pageSize, (page + 1) * pageSize)
        .map(p => ({
          id:             p.id,
          order_id:       p.order_id,
          amount:         p.amount,
          payment_method: p.payment_method,
          date:           p.date,
        }));

      // Compute grand total using Realm's native sum (same filter, no JS loop)
      let grandTotal = 0;
      try {
        grandTotal = (results.sum('amount') as number) || 0;
      } catch (_) {}

      resolve({data, totalCount, grandTotal});
    } catch (error) {
      reject(error);
    }
  });
};

export {queryPaymentsPaginated};

/**
 * queryPaymentsTotal
 * Returns the sum of all payment amounts (optionally filtered by date range).
 * Used by DownloadButton to show the grand total without loading all rows.
 */
const queryPaymentsTotal = async (params: {startDate?: Date; endDate?: Date} = {}): Promise<number> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      let results = realm.objects<Payment>('Payment');
      if (params.startDate && params.endDate) {
        results = results.filtered('date >= $0 && date <= $1', params.startDate, params.endDate) as any;
      }
      const total = results.sum('amount') as number;
      resolve(total || 0);
    } catch (error) {
      reject(error);
    }
  });
};

export {queryPaymentsTotal};