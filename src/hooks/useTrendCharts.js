/* eslint-disable prettier/prettier */
/**
 * useTrendCharts.js
 * React hooks that supply data to the Week / Month / Year trend charts.
 */
import {useEffect, useState} from 'react';
import {getMonthlyDailyTotals, getYearlyMonthlyTotals} from '../model/dashboardTrend';
import {getWeeklyTransactions} from '../model/dashboard';

// ─── Shared initial state ────────────────────────────────────────────────────
const initial = {data: [], labels: [], total: 0, loading: true, error: null};

// ─── Weekly trend (reuses existing getWeeklyTransactions) ───────────────────
export const useWeekTrend = () => {
  const [state, setState] = useState(initial);

  useEffect(() => {
    (async () => {
      try {
        const raw = await getWeeklyTransactions();

        // raw = [{weekday: 0..6, total}]  – fill any missing days with 0
        const weekTotals = Array(7).fill(0);
        raw.forEach(item => {
          weekTotals[item.weekday] = item.total;
        });

        const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const total = weekTotals.reduce((s, v) => s + v, 0);

        setState({data: weekTotals, labels, total, loading: false, error: null});
      } catch (error) {
        setState({data: [], labels: [], total: 0, loading: false, error});
      }
    })();
  }, []);

  return state;
};

// ─── Monthly trend (day-by-day for the current month) ───────────────────────
export const useMonthTrend = () => {
  const [state, setState] = useState(initial);

  useEffect(() => {
    (async () => {
      try {
        const raw = await getMonthlyDailyTotals();
        // Show every 5th day label to avoid crowding
        const labels = raw.map(item => (item.day % 5 === 1 ? String(item.day) : ''));
        const data = raw.map(item => item.total);
        const total = data.reduce((s, v) => s + v, 0);

        setState({data, labels, total, loading: false, error: null});
      } catch (error) {
        setState({data: [], labels: [], total: 0, loading: false, error});
      }
    })();
  }, []);

  return state;
};

// ─── Yearly trend (month-by-month for the current year) ─────────────────────
export const useYearTrend = () => {
  const [state, setState] = useState(initial);

  useEffect(() => {
    (async () => {
      try {
        const raw = await getYearlyMonthlyTotals();
        const labels = raw.map(item => item.label);
        const data = raw.map(item => item.total);
        const total = data.reduce((s, v) => s + v, 0);

        setState({data, labels, total, loading: false, error: null});
      } catch (error) {
        setState({data: [], labels: [], total: 0, loading: false, error});
      }
    })();
  }, []);

  return state;
};
