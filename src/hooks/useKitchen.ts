
import {useState, useCallback, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  KitchenTicket, KitchenItem,
  queryActiveTickets, updateItemStatus,
  bumpTicket, markServed, recallTicket,
} from '../model/kitchen';

interface TicketGroup {
  ticket: KitchenTicket;
  items:  KitchenItem[];
}

interface UseKitchenReturn {
  tickets:         TicketGroup[];
  loading:         boolean;
  refresh:         () => Promise<void>;
  onItemPress:     (ki_id: string, current: string) => Promise<void>;
  onBump:          (ticket_id: string) => Promise<void>;
  onServed:        (ticket_id: string) => Promise<void>;
  onRecall:        (ticket_id: string) => Promise<void>;
  elapsedMinutes:  (order_time: string) => number;
  ticketUrgency:   (order_time: string) => 'new' | 'warning' | 'urgent';
}

const NEXT_STATUS: Record<string, 'pending' | 'cooking' | 'ready'> = {
  pending: 'cooking',
  cooking: 'ready',
  ready:   'pending', 
};

const useKitchen = (): UseKitchenReturn => {
  const [tickets, setTickets] = useState<TicketGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await queryActiveTickets();
      setTickets(data);
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll every 10 seconds for new orders
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Refetch orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const onItemPress = useCallback(async (ki_id: string, current: string) => {
    await updateItemStatus(ki_id, NEXT_STATUS[current] || 'pending');
    await refresh();
  }, [refresh]);

  const onBump = useCallback(async (ticket_id: string) => {
    await bumpTicket(ticket_id);
    await refresh();
  }, [refresh]);

  const onServed = useCallback(async (ticket_id: string) => {
    await markServed(ticket_id);
    await refresh();
  }, [refresh]);

  const onRecall = useCallback(async (ticket_id: string) => {
    await recallTicket(ticket_id);
    await refresh();
  }, [refresh]);

  const elapsedMinutes = (order_time: string) =>
    Math.floor((Date.now() - new Date(order_time).getTime()) / 60000);

  const ticketUrgency = (order_time: string): 'new' | 'warning' | 'urgent' => {
    const mins = elapsedMinutes(order_time);
    if (mins >= 20) return 'urgent';
    if (mins >= 12) return 'warning';
    return 'new';
  };

  return {tickets, loading, refresh, onItemPress, onBump, onServed, onRecall, elapsedMinutes, ticketUrgency};
};

export default useKitchen;
