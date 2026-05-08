import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

interface UseResponsiveGridOptions {
  sidebarWidth?: number;
  horizontalPadding?: number;
  gap?: number;
}

interface ResponsiveGridResult {
  columns: number;
  cardWidth: number;
  contentWidth: number;
}

/**
 * Hook to calculate responsive grid columns and card widths based on available space.
 * 
 * @param options - Configuration options
 * @param options.sidebarWidth - Width of sidebar (default: 84px)
 * @param options.horizontalPadding - Total horizontal padding (default: 16px)
 * @param options.gap - Gap between cards (default: 8px)
 * 
 * @returns { columns, cardWidth, contentWidth }
 * 
 * @example
 * const { columns, cardWidth } = useResponsiveGrid();
 * 
 * @example
 * const { columns, cardWidth } = useResponsiveGrid({
 *   sidebarWidth: 100,
 *   horizontalPadding: 20,
 *   gap: 12,
 * });
 */
export const useResponsiveGrid = ({
  sidebarWidth = 84,
  horizontalPadding = 16,
  gap = 8,
}: UseResponsiveGridOptions = {}): ResponsiveGridResult => {
  const { width } = useWindowDimensions();

  const contentWidth = useMemo(
    () => width - sidebarWidth - horizontalPadding,
    [width, sidebarWidth, horizontalPadding]
  );

  const columns = useMemo(() => {
    return contentWidth >= 1200 ? 4 :
           contentWidth >= 900 ? 3 :
           contentWidth >= 700 ? 2 : 1;
  }, [contentWidth]);

  const cardWidth = useMemo(() => {
    return (contentWidth - gap * (columns - 1)) / columns;
  }, [contentWidth, columns, gap]);

  return { columns, cardWidth, contentWidth };
};
