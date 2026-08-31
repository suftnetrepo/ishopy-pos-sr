/* eslint-disable prettier/prettier */
import {getRealmInstance} from './store';

export interface KitchenTicket {
  ticket_id:  string;  // same as order_id
  table_name: string;
  guest_count: number;
  order_time: string;
  kitchen_status: string; // 'new' | 'cooking' | 'ready' | 'served'
  bumped_at?: string;
  order_type?: string; // 'Dine In' | 'Bar' | 'Takeaway'
}

export interface KitchenItem {
  ki_id:          string;  // detail_id from OrderItem
  ticket_id:      string;  // order_id
  menu_name:      string;
  quantity:       number;
  addOns:         Array<Record<string, any>>;
  item_status:    string;  // 'pending' | 'cooking' | 'ready'
}

const safeParseAddOns = (raw?: string): Array<Record<string, any>> => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// ─── Create ticket when order is placed ──────────────────────────────────────
export const createKitchenTicket = async (
  order_id: string,
  table_name: string,
  guest_count: number,
  items: Array<{detail_id: string; menu_name: string; quantity: number; addOns?: string}>,
  order_type?: string,
): Promise<void> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        realm.create('KitchenTicket', {
          ticket_id:      order_id,
          table_name,
          guest_count,
          order_time:     new Date().toISOString(),
          kitchen_status: 'new',
          order_type,
        }, Realm.UpdateMode.Modified);

        items.forEach(item => {
          realm.create('KitchenItem', {
            ki_id:       item.detail_id,
            ticket_id:   order_id,
            menu_name:   item.menu_name,
            quantity:    item.quantity,
            addOns:      item.addOns || '',
            item_status: 'pending',
          }, Realm.UpdateMode.Modified);
        });
      });
      resolve();
    } catch (e) { reject(e); }
  });
};

// ─── Query active tickets ─────────────────────────────────────────────────────
// Reads directly from the KitchenTicket/KitchenItem schema — the same records
// that onItemPress/onBump/onServed/onRecall write to — so status changes made
// on this screen actually persist and are reflected on the next refresh.
// A ticket reaches a terminal state (and drops off the board) entirely on its
// own kitchen_status, independent of the underlying Order's status.
export const queryActiveTickets = async (): Promise<{
  ticket: KitchenTicket;
  items: KitchenItem[];
}[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const tickets = Array.from(
        realm.objects<KitchenTicket>('KitchenTicket')
          .filtered('kitchen_status != "served"')
      );

      const result = tickets.map(ticket => {
        const items = Array.from(
          realm.objects<any>('KitchenItem')
            .filtered('ticket_id == $0', ticket.ticket_id)
        ).map(item => ({
          ki_id:       item.ki_id,
          ticket_id:   item.ticket_id,
          menu_name:   item.menu_name,
          quantity:    item.quantity,
          addOns:      safeParseAddOns(item.addOns),
          item_status: item.item_status,
        }));

        return {
          ticket: {
            ticket_id:      ticket.ticket_id,
            table_name:     ticket.table_name,
            guest_count:    ticket.guest_count,
            order_time:     ticket.order_time,
            kitchen_status: ticket.kitchen_status,
            bumped_at:      ticket.bumped_at,
            order_type:     ticket.order_type,
          },
          items,
        };
      });

      resolve(result);
    } catch (e) {
      if (__DEV__) console.error('queryActiveTickets error:', e);
      reject(e);
    }
  });
};


// ─── Update item status ───────────────────────────────────────────────────────
export const updateItemStatus = async (
  ki_id: string,
  status: 'pending' | 'cooking' | 'ready',
): Promise<void> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const item = realm.objectForPrimaryKey<KitchenItem>('KitchenItem', ki_id);
        if (__DEV__) console.log('DEBUG updateItemStatus:', ki_id, '->', status, 'found:', !!item);
        if (item) item.item_status = status;
        else if (__DEV__) console.warn('KitchenItem not found for ki_id:', ki_id);
      });
      resolve();
    } catch (e) { reject(e); }
  });
};

// ─── Bump ticket (all ready → served) ────────────────────────────────────────
export const bumpTicket = async (ticket_id: string): Promise<void> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const ticket = realm.objectForPrimaryKey<KitchenTicket>('KitchenTicket', ticket_id);
        if (ticket) {
          ticket.kitchen_status = 'ready';
          ticket.bumped_at = new Date().toISOString();
        }
        // Mark all items ready
        const items = realm.objects<KitchenItem>('KitchenItem')
          .filtered('ticket_id == $0', ticket_id);
        items.forEach(item => { item.item_status = 'ready'; });
      });
      resolve();
    } catch (e) { reject(e); }
  });
};

// ─── Mark served ─────────────────────────────────────────────────────────────
export const markServed = async (ticket_id: string): Promise<void> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const ticket = realm.objectForPrimaryKey<KitchenTicket>('KitchenTicket', ticket_id);
        if (ticket) ticket.kitchen_status = 'served';
      });
      resolve();
    } catch (e) { reject(e); }
  });
};

// ─── Recall ticket ────────────────────────────────────────────────────────────
export const recallTicket = async (ticket_id: string): Promise<void> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const ticket = realm.objectForPrimaryKey<KitchenTicket>('KitchenTicket', ticket_id);
        if (ticket) { ticket.kitchen_status = 'cooking'; ticket.bumped_at = undefined; }
        const items = realm.objects<KitchenItem>('KitchenItem')
          .filtered('ticket_id == $0', ticket_id);
        items.forEach(item => { if (item.item_status === 'ready') item.item_status = 'cooking'; });
      });
      resolve();
    } catch (e) { reject(e); }
  });
};
