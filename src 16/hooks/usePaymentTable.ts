/* eslint-disable prettier/prettier */
import {useCallback, useState} from 'react';
import {usePaginatedQuery} from 'fluent-styles';
import {queryPaymentsPaginated} from '../model/payments';
import {convertDateFilter} from '../utils/help';

interface UsePaymentTableOptions {
  dateFilter?: {startDate: string; endDate: string};
  pageSize?: number;
}

const usePaymentTable = ({
  dateFilter,
  pageSize = 10,
}: UsePaymentTableOptions) => {
  const [grandTotal, setGrandTotal] = useState(0);

  const fetcher = useCallback(
    async ({page, pageSize: ps, sortKey, sortDir, search}: any) => {
      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (dateFilter?.startDate && dateFilter?.endDate) {
        try {
          const converted = convertDateFilter(dateFilter.startDate, dateFilter.endDate);
          startDate = converted.startDate;
          endDate   = converted.endDate;
        } catch (_) {}
      }

      const result = await queryPaymentsPaginated({
        page,
        pageSize: ps,
        sortKey,
        sortDir,
        search,
        startDate,
        endDate,
      });

      // grandTotal comes back atomically with the page — no extra async call
      setGrandTotal(result.grandTotal ?? 0);

      return result;
    },
    [dateFilter],
  );

  const {tableProps, totalCount, loading, error, refresh} = usePaginatedQuery({
    pageSize,
    fetcher,
    initialSortKey: 'date',
    initialSortDir: 'desc',
  });

  return {tableProps, totalCount, grandTotal, loading, error, refresh};
};

export default usePaymentTable;