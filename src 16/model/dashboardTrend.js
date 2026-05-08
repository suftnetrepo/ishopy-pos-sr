/* eslint-disable prettier/prettier */
import {getRealmInstance} from './store';

export const getMonthlyDailyTotals = async () => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const now         = new Date();
      const year        = now.getFullYear();
      const month       = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
      const endOfMonth   = new Date(year, month, daysInMonth, 23, 59, 59, 999);

      const result = realm
        .objects('Order')
        .filtered('date >= $0 && date <= $1', startOfMonth, endOfMonth);

      const dayTotals = Array(daysInMonth).fill(0);
      result.map(order => ({
        day:   new Date(order.date).getDate(),
        total: order.total_price,
      })).forEach(item => {
        dayTotals[item.day - 1] += item.total;
      });

      resolve(
        dayTotals.map((total, i) => ({
          day:   i + 1,
          total: parseFloat(total.toFixed(2)),
        })),
      );
    } catch (error) {
      reject(error);
    }
  });
};

export const getYearlyMonthlyTotals = async () => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const year        = new Date().getFullYear();
      const startOfYear = new Date(year, 0,  1,  0,  0,  0,   0);
      const endOfYear   = new Date(year, 11, 31, 23, 59, 59, 999);

      const result = realm
        .objects('Order')
        .filtered('date >= $0 && date <= $1', startOfYear, endOfYear);

      const monthTotals = Array(12).fill(0);
      result.map(order => ({
        month: new Date(order.date).getMonth(),
        total: order.total_price,
      })).forEach(item => {
        monthTotals[item.month] += item.total;
      });

      const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      resolve(
        monthTotals.map((total, i) => ({
          month: i + 1,
          label: monthLabels[i],
          total: parseFloat(total.toFixed(2)),
        })),
      );
    } catch (error) {
      reject(error);
    }
  });
};