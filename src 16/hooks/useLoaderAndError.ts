import { useMemo, useEffect } from 'react';
import { useLoaderBinding, toastService } from 'fluent-styles';

/**
 * Custom hook to handle loader binding and error toast with reset.
 * @param loading - Loading state boolean
 * @param error - Error object (with .message)
 * @param resetHandler - Function to reset error state
 * @param loaderConfig - Optional loader config override
 */
type LoaderVariant = 'circular' | 'spinner' | 'pulse' | 'dots';
type LoaderTheme = 'light' | 'dark' | 'system';

export function useLoaderAndError(
  loading: boolean,
  error: any,
  resetHandler?: () => void,
  loaderConfig?: { variant?: LoaderVariant; theme?: LoaderTheme }
) {
  const loaderOptions = useMemo(
    () => ({
      variant: loaderConfig?.variant ?? 'circular',
      theme: loaderConfig?.theme ?? 'dark',
    }),
    [loaderConfig]
  );

  useLoaderBinding(loading, loaderOptions);

  useEffect(() => {
    if (error) {
      const id = toastService.error(error?.message || 'An error occurred. Please try again');
      if (id && resetHandler) {
        resetHandler();
      }
    }
    // Only run when error changes
  }, [error, resetHandler]);
}
