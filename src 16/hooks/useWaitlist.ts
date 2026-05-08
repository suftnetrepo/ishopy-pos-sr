/* eslint-disable prettier/prettier */
import {useState, useEffect, useCallback} from 'react';
import {Linking, Alert, Platform} from 'react-native';
import {
  WaitlistEntry,
  insertWaitlistEntry,
  queryWaiting,
  updateWaitlistStatus,
  estimateWaitMinutes,
} from '../model/waitlist';

// ─── Phone number normalization ────────────────────────────────────────────────
// Convert UK local format (07...) to international format (+447...)
const normalizePhoneNumber = (phone: string): string => {
  const trimmed = phone.trim();
  
  // Already in international format
  if (trimmed.startsWith('+')) {
    return trimmed;
  }
  
  // UK local format: 07... → +447...
  if (trimmed.startsWith('0')) {
    return '+44' + trimmed.substring(1);
  }
  
  // Return as-is if already looks international (no + but starts with country code digits)
  return trimmed;
};

interface UseWaitlistReturn {
  entries:      WaitlistEntry[];
  loading:      boolean;
  error:        string | null;
  addToQueue:   (entry: Omit<WaitlistEntry, 'waitlist_id' | 'joined_at' | 'status'>) => Promise<void>;
  seatGuest:    (waitlist_id: string) => Promise<void>;
  notifyGuest:  (entry: WaitlistEntry) => Promise<void>;
  removeGuest:  (waitlist_id: string) => Promise<void>;
  refresh:      () => Promise<void>;
  waitMinutes:  (position: number) => number;
}

const useWaitlist = (focused: boolean): UseWaitlistReturn => {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await queryWaiting();
      setEntries(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load waitlist');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (focused) refresh(); }, [focused]);

  const addToQueue = useCallback(async (
    entry: Omit<WaitlistEntry, 'waitlist_id' | 'joined_at' | 'status'>,
  ) => {
    setLoading(true);
    try {
      await insertWaitlistEntry(entry);
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to add guest');
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const seatGuest = useCallback(async (waitlist_id: string) => {
    await updateWaitlistStatus(waitlist_id, 'seated');
    await refresh();
  }, [refresh]);

  const notifyGuest = useCallback(async (entry: WaitlistEntry) => {
    // Only send SMS if phone is available and SMS notification is enabled
    if (entry.phone && entry.notify_sms) {
      try {
        // Validate and normalize phone number
        let phone = entry.phone.trim();
        if (!phone || phone.length === 0) {
          throw new Error('Phone number is empty after trimming');
        }
        
        // Convert UK local format (07...) to international format (+447...)
        phone = normalizePhoneNumber(phone);

        // Build SMS message
        const message = `Hi ${entry.guest_name || 'Guest'}, your table is ready! Please proceed to the host stand.`;

        // Use platform-specific separator: iOS uses &, Android uses ?
        const separator = Platform.OS === 'ios' ? '&' : '?';
        
        // Build SMS URL: phone number is NOT encoded, only body is encoded
        const smsUrl = `sms:${phone}${separator}body=${encodeURIComponent(message)}`;

        // Log SMS attempt for debugging
        console.log('Opening SMS:', { originalPhone: entry.phone, normalizedPhone: phone, url: smsUrl, message });

        // Open native SMS composer
        const canOpen = await Linking.canOpenURL(smsUrl);
        if (canOpen) {
          await Linking.openURL(smsUrl);
          // Mark as notified after SMS composer opens
          await updateWaitlistStatus(entry.waitlist_id, 'notified');
          await refresh();
        } else {
          // Fallback: SMS not available on this device
          console.warn('SMS not available on this device');
          Alert.alert('SMS Not Available', 'This device cannot send SMS messages. Please notify the guest manually.', [
            {text: 'OK', onPress: async () => {
              // Still mark as notified even if SMS failed
              await updateWaitlistStatus(entry.waitlist_id, 'notified');
              await refresh();
            }},
          ]);
        }
      } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : 'Failed to open SMS composer';
        console.error('SMS notification error:', errMsg);
        Alert.alert('Notification Failed', errMsg, [
          {text: 'OK', onPress: async () => {
            // Still mark as notified
            await updateWaitlistStatus(entry.waitlist_id, 'notified');
            await refresh();
          }},
        ]);
      }
    } else if (entry.phone && !entry.notify_sms) {
      // Phone available but SMS disabled — just mark as notified without SMS
      console.log('SMS disabled for guest:', entry.guest_name);
      await updateWaitlistStatus(entry.waitlist_id, 'notified');
      await refresh();
    } else if (!entry.phone) {
      // No phone number — show alert and mark as notified
      Alert.alert('No Phone Number', `No phone number for ${entry.guest_name || 'Guest'}. Please notify manually.`, [
        {text: 'OK', onPress: async () => {
          await updateWaitlistStatus(entry.waitlist_id, 'notified');
          await refresh();
        }},
      ]);
    }
  }, [refresh]);

  const removeGuest = useCallback(async (waitlist_id: string) => {
    await updateWaitlistStatus(waitlist_id, 'removed');
    await refresh();
  }, [refresh]);

  return {
    entries,
    loading,
    error,
    addToQueue,
    seatGuest,
    notifyGuest,
    removeGuest,
    refresh,
    waitMinutes: estimateWaitMinutes,
  };
};

export default useWaitlist;
