/* eslint-disable prettier/prettier */
/**
 * usePremium
 * Single hook for checking premium status and gating features.
 *
 * Usage:
 *   const { isPremium, requirePremium } = usePremium();
 *
 *   // Gate an action
 *   requirePremium(() => navigation.navigate('big-backup'));
 *
 *   // Render a locked state
 *   if (!isPremium && itemCount >= FREE_LIMITS.items) return <LockedBanner feature="items" />;
 */
import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from '@legendapp/state/react';
import {state} from '../store';

// ─── Free tier limits ─────────────────────────────────────────────────────────
export const FREE_LIMITS = {
  items:      10,
  tables:     5,
  users:      1,
  orderDays:  30,   // order history visible for last N days
} as const;

// ─── Hook ─────────────────────────────────────────────────────────────────────
const usePremium = () => {
  const navigation = useNavigation<any>();
  const {purchase_status} = useSelector(() => state.get());
  const isPremium = !!purchase_status;

  /**
   * requirePremium
   * If premium → runs the callback immediately.
   * If not    → navigates to the paywall instead.
   */
  const requirePremium = useCallback(
    (onUnlocked?: () => void) => {
      if (isPremium) {
        onUnlocked?.();
      } else {
        navigation.navigate('big-purchase');
      }
    },
    [isPremium, navigation],
  );

  /**
   * checkLimit
   * Returns true if the user is allowed to add more.
   * If over limit and not premium, navigates to paywall and returns false.
   */
  const checkLimit = useCallback(
    (type: keyof typeof FREE_LIMITS, currentCount: number): boolean => {
      if (isPremium) return true;
      if (currentCount < FREE_LIMITS[type]) return true;
      navigation.navigate('big-purchase');
      return false;
    },
    [isPremium, navigation],
  );

  return {isPremium, requirePremium, checkLimit, FREE_LIMITS};
};

export default usePremium;
