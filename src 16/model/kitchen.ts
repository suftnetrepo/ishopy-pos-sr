/* eslint-disable prettier/prettier */
import {getRealmInstance} from './store';
import type {Order} from './orders';
import type {OrderItem} from './orderItems';

export interface KitchenTicket {
  ticket_id:  string;  // same as order_id
  table_name: string;
  guest_count: number;
  order_time: string;
  kitchen_status: string; // 'new' | 'cooking' | 'ready' | 'served'
  bumped_at?: string;
}

export interface KitchenItem {
  ki_id:          string;  // detail_id from OrderItem
  ticket_id:      string;  // order_id
  menu_name:      string;
  quantity:       number;
  addOns:         string;
  item_status:    string;  // 'pending' | 'cooking' | 'ready'
}

// ─── Create ticket when order is placed ──────────────────────────────────────
export const createKitchenTicket = async (
  order_id: string,
  table_name: string,
  guest_count: number,
  items: Array<{detail_id: string; menu_name: string; quantity: number; addOns?: string}>,
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
// CRITICAL: Queries the main Order table (not KitchenTicket schema which is unused)
export const queryActiveTickets = async (): Promise<{
  ticket: KitchenTicket;
  items: KitchenItem[];
}[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      // Normalize status for comparison
      const normalizeStatus = (status?: string) =>
        String(status || '').trim().toLowerCase();

      // Kitchen-active statuses (matches Orders screen)
      const KDS_STATUSES = ['progress', 'pending', 'preparing', 'active'];

      if (__DEV__) console.log('🔍 KDS: Fetching active orders from Order table...');

      // Query main Order table (source of truth)
      const allOrders = Array.from(
        realm.objects<Order>('Order')
      );
      if (__DEV__) console.log('📊 Orders screen orders total:', allOrders.length, allOrders.map(o => ({id: o.order_id, status: o.status})));

      // Filter by active kitchen status
      const activeOrders = allOrders.filter(order =>
        KDS_STATUSES.includes(normalizeStatus(order.status))
      );
      if (__DEV__) console.log('✅ KDS raw orders (filtered):', activeOrders.length, activeOrders.map(o => ({id: o.order_id, status: o.status, table: o.table_name})));

      // Transform to KitchenTicket/KitchenItem format
      const result = activeOrders.map(order => {
        // Fetch order items for this order
        const items = Array.from(
          realm.objects<OrderItem>('OrderItem')
            .filtered('order_id == $0', order.order_id)
        ).map(item => ({
          ki_id: item.detail_id,
          ticket_id: order.order_id,
          menu_name: item.menu_name,
          quantity: item.quantity,
          addOns: item.addOns || '',
          item_status: 'pending' as const, // Default to pending (actual status stored in OrderItem if needed)
        }));

        const ticket: KitchenTicket = {
          ticket_id: order.order_id,
          table_name: order.table_name || `Table ${order.table_id}`,
          guest_count: 0, // TODO: get from order if available
          order_time: order.date.toISOString(),
          kitchen_status: 'new', // Status derived from Order.status in UI
        };

        return {ticket, items};
      });

      if (__DEV__) console.log('🎫 Kitchen tickets to display:', result.length);
      resolve(result);
    } catch (e) {
      if (__DEV__) console.error('❌ queryActiveTickets error:', e);
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
