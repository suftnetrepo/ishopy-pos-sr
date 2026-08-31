/* eslint-disable prettier/prettier */
import React from 'react';
import {ScrollView} from 'react-native';
import {
  StyledPage, StyledText, StyledPressable, StyledSpinner, Stack, theme,
} from 'fluent-styles';
import {useAppTheme} from '../../theme';
import {useNavigation} from '@react-navigation/native';
import useKitchen from '../../hooks/useKitchen';
import {StyledIcon} from '../../components/package/icon';

// ─── Fixed palette for KDS (always dark regardless of app theme) ──────────────
const K = {
  bg:         '#0f0f0f',
  card:       '#1a1a1a',
  cardBorder: '#2a2a2a',
  header:     '#141414',
  text:       '#f5f5f5',
  subtext:    '#888888',
  muted:      '#444444',
  divider:    '#222222',

  pending:    '#f59e0b',
  cooking:    '#3b82f6',
  ready:      '#22c55e',
  urgent:     '#ef4444',
  warning:    '#f97316',

  timerNew:     {bg: '#1e3a5f', text: '#60a5fa'},
  timerWarning: {bg: '#431407', text: '#fb923c'},
  timerUrgent:  {bg: '#450a0a', text: '#f87171'},
  timerReady:   {bg: '#052e16', text: '#4ade80'},
};

// ─── Item row ─────────────────────────────────────────────────────────────────
const ItemRow = ({item, onPress}) => {
  const dotColor = {pending: K.pending, cooking: K.cooking, ready: K.ready}[item.item_status] || K.muted;
  const isDone   = item.item_status === 'ready';

  return (
    <StyledPressable onPress={() => onPress(item.ki_id, item.item_status)}>
      <Stack horizontal alignItems="flex-start" gap={12} paddingVertical={8}>
        <Stack width={10} height={10} borderRadius={5} marginTop={5} flexShrink={0}
          backgroundColor={dotColor} />
        <Stack vertical flex={1}>
          <StyledText
            fontSize={16} fontWeight={theme.fontWeight.medium}
            color={isDone ? K.muted : K.text}
            style={isDone ? {textDecorationLine: 'line-through'} : {}}>
            {item.menu_name}{item.quantity > 1 ? `  ×${item.quantity}` : ''}
          </StyledText>
          {Array.isArray(item.addOns) && item.addOns.length > 0 && (
            <Stack
              marginTop={8}
              gap={6}
              padding={8}
              borderRadius={10}
              backgroundColor="rgba(255,255,255,0.04)"
              borderWidth={1}
              borderColor="rgba(255,255,255,0.08)">
              
              <StyledText fontSize={11} color={K.subtext} fontWeight={theme.fontWeight.bold}>
                Add-ons
              </StyledText>

              {item.addOns.map((addon, index) => (
                <Stack
                  key={addon.addOn_id ?? `${addon.addOnName}-${index}`}
                  horizontal
                  justifyContent="space-between"
                  alignItems="center">
                  
                  <StyledText fontSize={12} color={K.text}>
                    {addon.displayName || addon.addOnName}
                  </StyledText>

                  {addon.quantity > 1 && (
                    <StyledText fontSize={11} color={K.subtext}>
                      ×{addon.quantity}
                    </StyledText>
                  )}
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </StyledPressable>
  );
};

// ─── Ticket card ──────────────────────────────────────────────────────────────
const TicketCard = ({group, onItemPress, onBump, onServed, onRecall, elapsedMinutes, ticketUrgency}) => {
  const {ticket, items} = group;
  const mins     = elapsedMinutes(ticket.order_time);
  const urgency  = ticket.kitchen_status === 'ready' ? 'ready' : ticketUrgency(ticket.order_time);
  const allReady = items.every(i => i.item_status === 'ready');

  const borderColor = {new: K.cooking, warning: K.warning, urgent: K.urgent, ready: K.ready}[urgency];
  const timer       = {new: K.timerNew, warning: K.timerWarning, urgent: K.timerUrgent, ready: K.timerReady}[urgency];
  const headerBg    = borderColor + '18'; // 10% opacity tint

  return (
    <Stack
      vertical width="30%" minWidth={260}
      borderRadius={14} overflow="hidden"
      borderWidth={1.5} borderColor={borderColor}
      backgroundColor={K.card}
      margin={8}>

      {/* Header */}
      <Stack horizontal alignItems="center" justifyContent="space-between"
        paddingHorizontal={14} paddingVertical={12}
        backgroundColor={headerBg}
        borderBottomWidth={1} borderColor={K.divider}>
        <Stack vertical gap={2}>
          <Stack horizontal alignItems="center" gap={6}>
            <StyledText fontSize={16} fontWeight={theme.fontWeight.bold} color={K.text}>
              {ticket.table_name}
            </StyledText>
            {ticket.order_type && ticket.order_type !== 'Dine In' && (
              <Stack paddingHorizontal={7} paddingVertical={2} borderRadius={20}
                backgroundColor="rgba(255,255,255,0.08)">
                <StyledText fontSize={10} fontWeight={theme.fontWeight.bold} color={K.subtext}>
                  {ticket.order_type.toUpperCase()}
                </StyledText>
              </Stack>
            )}
          </Stack>
          {ticket.guest_count > 0 && (
            <StyledText fontSize={11} color={K.subtext}>
              {ticket.guest_count} {ticket.guest_count === 1 ? 'guest' : 'guests'}
            </StyledText>
          )}
        </Stack>
        <Stack paddingHorizontal={12} paddingVertical={5} borderRadius={20}
          backgroundColor={timer.bg}>
          <StyledText fontSize={13} fontWeight={theme.fontWeight.bold} color={timer.text}>
            {ticket.kitchen_status === 'ready' ? '✓ Ready' : `${mins}m`}
          </StyledText>
        </Stack>
      </Stack>

      {/* Items */}
      <Stack vertical paddingHorizontal={14} paddingVertical={8} flex={1}
        borderBottomWidth={1} borderColor={K.divider}>
        {items.map((item, i) => (
          <React.Fragment key={item.ki_id}>
            <ItemRow item={item} onPress={onItemPress} />
            {i < items.length - 1 && (
              <Stack height={1} backgroundColor={K.divider} />
            )}
          </React.Fragment>
        ))}
      </Stack>

      {/* Actions */}
      <Stack horizontal gap={8} paddingHorizontal={12} paddingVertical={12}>
        <StyledPressable
          flex={1} paddingVertical={10} borderRadius={10}
          alignItems="center" justifyContent="center"
          onPress={() => onRecall(ticket.ticket_id)}
          borderWidth={1} borderColor={K.muted} backgroundColor="transparent">
          <StyledText fontSize={12} fontWeight={theme.fontWeight.medium} color={K.subtext}>
            Recall
          </StyledText>
        </StyledPressable>

        {ticket.kitchen_status === 'ready' ? (
          <StyledPressable
            flex={2} paddingVertical={10} borderRadius={10}
            alignItems="center" justifyContent="center"
            backgroundColor={K.ready}
            onPress={() => onServed(ticket.ticket_id)}>
            <StyledText fontSize={13} fontWeight={theme.fontWeight.bold} color="#ffffff">
              Served ✓
            </StyledText>
          </StyledPressable>
        ) : (
          <StyledPressable
            flex={2} paddingVertical={10} borderRadius={10}
            alignItems="center" justifyContent="center"
            backgroundColor={allReady ? K.ready : K.muted}
            onPress={() => onBump(ticket.ticket_id)}>
            <StyledText fontSize={13} fontWeight={theme.fontWeight.bold}
              color={allReady ? '#ffffff' : K.subtext}>
              {allReady ? 'Bump ↑' : 'Bump'}
            </StyledText>
          </StyledPressable>
        )}
      </Stack>
    </Stack>
  );
};

// ─── Legend ───────────────────────────────────────────────────────────────────
const Legend = () => (
  <Stack horizontal gap={20} alignItems="center">
    {[
      {color: K.pending, label: 'Pending — tap to start'},
      {color: K.cooking, label: 'Cooking — tap when ready'},
      {color: K.ready,   label: 'Ready'},
    ].map(l => (
      <Stack key={l.label} horizontal alignItems="center" gap={7}>
        <Stack width={9} height={9} borderRadius={5} backgroundColor={l.color} />
        <StyledText fontSize={11} color={K.subtext}>{l.label}</StyledText>
      </Stack>
    ))}
  </Stack>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
const KitchenScreen = () => {
  const navigation = useNavigation();
  const {tickets, loading, refresh, onItemPress, onBump, onServed, onRecall, elapsedMinutes, ticketUrgency} = useKitchen();

  const active = tickets.filter(g => g.ticket.kitchen_status !== 'ready');
  const ready  = tickets.filter(g => g.ticket.kitchen_status === 'ready');
  const urgent = active.filter(g => ticketUrgency(g.ticket.order_time) === 'urgent').length;

  return (
    <StyledPage backgroundColor={K.bg}>

      {/* Header */}
      <Stack horizontal alignItems="center" justifyContent="space-between"
        backgroundColor={K.header} paddingHorizontal={20} paddingVertical={14}
        borderBottomWidth={1} borderColor={K.divider}>

        {/* Back */}
        <StyledPressable
          onPress={() => navigation.goBack()}
          width={40} height={40} borderRadius={20}
          borderWidth={1} borderColor={K.muted}
          alignItems="center" justifyContent="center">
          <StyledIcon pointerEvents="none" name="arrow-back" size={20} color={K.text} />
        </StyledPressable>

        {/* Title */}
        <Stack horizontal alignItems="center" gap={12} flex={1} justifyContent="center">
          <StyledText fontSize={20} fontWeight={theme.fontWeight.bold} color={K.text}>
            Kitchen Display
          </StyledText>
          {urgent > 0 && (
            <Stack paddingHorizontal={12} paddingVertical={4} borderRadius={20}
              backgroundColor={K.urgent}>
              <StyledText fontSize={12} fontWeight={theme.fontWeight.bold} color="#fff">
                {urgent} urgent
              </StyledText>
            </Stack>
          )}
        </Stack>

        {/* Stats + Refresh */}
        <Stack horizontal gap={10} alignItems="center">
          <Stack horizontal gap={16} paddingHorizontal={16} paddingVertical={8}
            borderRadius={10} backgroundColor={K.card}
            borderWidth={1} borderColor={K.cardBorder}>
            {[
              {n: active.length, l: 'Active',  c: active.length > 0 ? K.cooking : K.subtext},
              {n: ready.length,  l: 'Ready',   c: ready.length  > 0 ? K.ready   : K.subtext},
            ].map(s => (
              <Stack key={s.l} vertical alignItems="center" gap={1}>
                <StyledText fontSize={18} fontWeight={theme.fontWeight.bold} color={s.c}>
                  {s.n}
                </StyledText>
                <StyledText fontSize={10} color={K.subtext}>{s.l}</StyledText>
              </Stack>
            ))}
          </Stack>
          <StyledPressable onPress={refresh}
            width={40} height={40} borderRadius={20}
            borderWidth={1} borderColor={K.muted}
            alignItems="center" justifyContent="center">
            <StyledIcon name="refresh" size={20} color={K.subtext} />
          </StyledPressable>
        </Stack>
      </Stack>

      {/* Legend bar */}
      <Stack paddingHorizontal={20} paddingVertical={10}
        borderBottomWidth={1} borderColor={K.divider}>
        <Legend />
      </Stack>

      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>

        {/* Active orders */}
        {active.length > 0 && (
          <Stack vertical paddingHorizontal={14} paddingTop={16} paddingBottom={8}>
            <StyledText fontSize={10} color={K.muted} letterSpacing={1.2} marginBottom={12}
              paddingHorizontal={6}>
              ACTIVE ORDERS ({active.length})
            </StyledText>
            <Stack horizontal flexWrap="wrap">
              {active.map(group => (
                <TicketCard
                  key={group.ticket.ticket_id}
                  group={group}
                  onItemPress={onItemPress}
                  onBump={onBump}
                  onServed={onServed}
                  onRecall={onRecall}
                  elapsedMinutes={elapsedMinutes}
                  ticketUrgency={ticketUrgency}
                />
              ))}
            </Stack>
          </Stack>
        )}

        {/* Ready to serve */}
        {ready.length > 0 && (
          <Stack vertical paddingHorizontal={14} paddingTop={8} paddingBottom={24}>
            <Stack height={1} backgroundColor={K.divider} marginBottom={16} marginHorizontal={6} />
            <StyledText fontSize={10} color={K.ready} letterSpacing={1.2} marginBottom={12}
              paddingHorizontal={6}>
              READY TO SERVE ({ready.length})
            </StyledText>
            <Stack horizontal flexWrap="wrap">
              {ready.map(group => (
                <TicketCard
                  key={group.ticket.ticket_id}
                  group={group}
                  onItemPress={onItemPress}
                  onBump={onBump}
                  onServed={onServed}
                  onRecall={onRecall}
                  elapsedMinutes={elapsedMinutes}
                  ticketUrgency={ticketUrgency}
                />
              ))}
            </Stack>
          </Stack>
        )}

        {/* Empty state */}
        {tickets.length === 0 && !loading && (
          <Stack flex={1} alignItems="center" justifyContent="center"
            paddingVertical={100} vertical gap={14}>
            <StyledText fontSize={48}>👨‍🍳</StyledText>
            <StyledText fontSize={18} fontWeight={theme.fontWeight.semiBold} color={K.subtext}>
              No active orders
            </StyledText>
            <StyledText fontSize={13} color={K.muted}>
              New orders appear here automatically every 10s
            </StyledText>
          </Stack>
        )}
      </ScrollView>

      {loading && <StyledSpinner />}
    </StyledPage>
  );
};

export default KitchenScreen;