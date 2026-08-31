/* eslint-disable prettier/prettier */
import {guid} from '../utils/help';
import {getRealmInstance} from './store';

export interface WaitlistEntry {
  waitlist_id: string;
  guest_name:  string;
  party_size:  number;
  preference:  string;   // 'window' | 'outside' | 'bar' | 'quiet' | 'none'
  phone:       string;
  notify_sms:  boolean;
  joined_at:   string;   // ISO timestamp
  status:      string;   // 'waiting' | 'seated' | 'removed' | 'notified'
  notes:       string;
}

// ─── Insert ───────────────────────────────────────────────────────────────────
export const insertWaitlistEntry = async (
  entry: Omit<WaitlistEntry, 'waitlist_id' | 'joined_at' | 'status'>,
): Promise<WaitlistEntry> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const record: WaitlistEntry = {
          waitlist_id: guid(),
          joined_at:   new Date().toISOString(),
          status:      'waiting',
          ...entry,
        };
        realm.create('Waitlist', record);
        resolve(record);
      });
    } catch (e) { reject(e); }
  });
};

// ─── Query all waiting ────────────────────────────────────────────────────────
// Includes 'notified' as well as 'waiting' — a guest who's been texted that
// their table is ready still needs to show up in the active queue (with the
// "Notified" badge) so staff can find them again to tap Seat now. Filtering
// to 'waiting' only made them vanish from the list the instant they were
// notified, with no way back in.
export const queryWaiting = async (): Promise<WaitlistEntry[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const results = realm
        .objects<WaitlistEntry>('Waitlist')
        .filtered("status == 'waiting' OR status == 'notified'")
        .map(e => ({...e}))
        .sort((a, b) => a.joined_at.localeCompare(b.joined_at));
      resolve(results);
    } catch (e) { reject(e); }
  });
};

// ─── Update status ────────────────────────────────────────────────────────────
export const updateWaitlistStatus = async (
  waitlist_id: string,
  status: 'seated' | 'removed' | 'notified',
): Promise<void> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const entry = realm.objectForPrimaryKey<WaitlistEntry>('Waitlist', waitlist_id);
        if (entry) entry.status = status;
      });
      resolve();
    } catch (e) { reject(e); }
  });
};

// ─── Wait time estimate (2 min per table turn, avg 30 min dining) ─────────────
export const estimateWaitMinutes = (position: number): number =>
  Math.max(5, position * 8);
