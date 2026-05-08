/* eslint-disable prettier/prettier */
import {useCallback} from 'react';
import {usePaginatedQuery} from 'fluent-styles';
import {queryOrdersPaginated} from '../model/orders';
import {convertDateFilter} from '../utils/help';

interface UseOrderTableOptions {
  dateFilter?: {startDate: string; endDate: string};
  pageSize?: number;
}

/**
 * useOrderTable
 * Server-side pagination for the Orders table.
 * Status filter is passed via `filters` param so usePaginatedQuery
 * detects the change and re-fetches automatically.
 *
 * Usage:
 *   const {tableProps, setStatusFilter} = useOrderTable({dateFilter});
 *   <StyledTable columns={columns} {...tableProps} />
 */
const useOrderTable = ({
  dateFilter,
  pageSize = 8,
}: UseOrderTableOptions) => {

  const fetcher = useCallback(
    async ({page, pageSize: ps, sortKey, sortDir, search, filters}: any) => {
      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (dateFilter?.startDate && dateFilter?.endDate) {
        try {
          const converted = convertDateFilter(dateFilter.startDate, dateFilter.endDate);
          startDate = converted.startDate;
          endDate   = converted.endDate;
        } catch (_) {}
      }

      // status comes in via filters object — set by setFilters() in the component
      const status = filters?.status;

      return queryOrdersPaginated({
        page,
        pageSize: ps,
        sortKey,
        sortDir,
        status,
        search,
        startDate,
        endDate,
      });
    },
    [dateFilter],
  );

  const {tableProps, totalCount, loading, error, refresh, setFilters} =
    usePaginatedQuery({
      pageSize,
      fetcher,
      initialSortKey: 'date',
      initialSortDir: 'desc',
      initialFilters: {status: undefined},
    });

  // Convenience wrapper — sets the status filter and resets to page 0
  const setStatusFilter = (status: string) => {
    setFilters({status: status === 'All' ? undefined : status});
  };

  return {tableProps, totalCount, loading, error, refresh, setStatusFilter};
};

export default useOrderTable;