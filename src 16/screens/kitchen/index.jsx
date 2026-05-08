/* eslint-disable prettier/prettier */
import React, {useMemo} from 'react';
import {ScrollView, useWindowDimensions} from 'react-native';
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

const parseAddOns = value => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value !== 'string') return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getItemAddOns = item => {
  return parseAddOns(
    item?.addOns ||
      item?.addons ||
      item?.add_ons ||
      item?.addOn ||
      item?.addon ||
      item?.modifier ||
      item?.modifiers,
  );
};

const cleanMenuName = name => {
  if (!name) return '';
  return String(name).replace(/\s*\[{"addOnName".*$/s, '').trim();
};

const formatAddOnName = addon => {
  const name =
    addon?.displayName ||
    addon?.addOnName ||
    addon?.name ||
    addon?.title ||
    '';

  return String(name)
    .replace(/^Sides:\s*/i, 'Side: ')
    .replace(/^Sauce:\s*/i, 'Sauce: ')
    .trim();
};

// ─── Item row ─────────────────────────────────────────────────────────────────
const ItemRow = ({item, onPress}) => {
  const dotColor =
    {pending: K.pending, cooking: K.cooking, ready: K.ready}[item.item_status] ||
    K.muted;

  const isDone = item.item_status === 'ready';
  const addOns = getItemAddOns(item);
  const menuName = cleanMenuName(item.menu_name);

  return (
    <StyledPressable onPress={() => onPress(item.ki_id, item.item_status)}>
      <Stack horizontal alignItems="flex-start" gap={12} paddingVertical={8}>
        <Stack
          width={10}
          height={10}
          borderRadius={5}
          marginTop={6}
          flexShrink={0}
          backgroundColor={dotColor}
        />

        <Stack vertical flex={1} minWidth={0}>
          <StyledText
            fontSize={16}
            fontWeight={theme.fontWeight.medium}
            color={isDone ? K.muted : K.text}
            style={isDone ? {textDecorationLine: 'line-through'} : {}}
            numberOfLines={1}>
            {menuName}
            {item.quantity > 1 ? ` ×${item.quantity}` : ''}
          </StyledText>

          {addOns.length > 0 && (
            <Stack vertical marginTop={6} gap={3}>
              {addOns.slice(0, 5).map((addon, index) => {
                const label = formatAddOnName(addon);
                const quantity = Number(addon?.quantity || 1);

                if (!label) return null;

                return (
                  <StyledText
                    key={`${label}-${index}`}
                    fontSize={11}
                    lineHeight={15}
                    color={K.subtext}
                    numberOfLines={1}>
                    • {label}
                    {quantity > 1 ? ` ×${quantity}` : ''}
                  </StyledText>
                );
              })}

              {addOns.length > 5 && (
                <StyledText fontSize={11} color={K.warning}>
                  +{addOns.length - 5} more add-ons
                </StyledText>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>
    </StyledPressable>
  );
};

// ─── Ticket card ──────────────────────────────────────────────────────────────
const TicketCard = ({group, cardWidth, onItemPress, onBump, onServed, onRecall, elapsedMinutes, ticketUrgency}) => {
  const {ticket, items} = group;
  const mins     = elapsedMinutes(ticket.order_time);
  const urgency  = ticket.kitchen_status === 'ready' ? 'ready' : ticketUrgency(ticket.order_time);
  const allReady = items.every(i => i.item_status === 'ready');

  const borderColor = {new: K.cooking, warning: K.warning, urgent: K.urgent, ready: K.ready}[urgency];
  const timer       = {new: K.timerNew, warning: K.timerWarning, urgent: K.timerUrgent, ready: K.timerReady}[urgency];
  const headerBg    = borderColor + '18'; // 10% opacity tint

  return (
    <Stack
      vertical width={cardWidth}
      borderRadius={14} overflow="hidden"
      borderWidth={1.5} borderColor={borderColor}
      backgroundColor={K.card}
      margin={8}
      flex={1}
      maxHeight={520}>

      {/* Header */}
      <Stack horizontal alignItems="center" justifyContent="space-between"
        paddingHorizontal={14} paddingVertical={12}
        backgroundColor={headerBg}
        borderBottomWidth={1} borderColor={K.divider}
        flexShrink={0}>
        <Stack vertical gap={2}>
          <StyledText fontSize={16} fontWeight={theme.fontWeight.bold} color={K.text}>
            {ticket.table_name}
          </StyledText>
          <StyledText fontSize={11} color={K.subtext}>
            {ticket.guest_count} {ticket.guest_count === 1 ? 'guest' : 'guests'}
          </StyledText>
        </Stack>
        <Stack paddingHorizontal={12} paddingVertical={5} borderRadius={20}
          backgroundColor={timer.bg}>
          <StyledText fontSize={13} fontWeight={theme.fontWeight.bold} color={timer.text}>
            {ticket.kitchen_status === 'ready' ? '✓ Ready' : `${mins}m`}
          </StyledText>
        </Stack>
      </Stack>

      {/* Items — scrollable */}
      <ScrollView 
        style={{flex: 1}} 
        scrollEnabled={items.length > 4}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <Stack vertical paddingHorizontal={14} paddingVertical={8}
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
      </ScrollView>

      {/* Actions — pinned at bottom */}
      <Stack horizontal gap={8} paddingHorizontal={12} paddingVertical={12}
        backgroundColor={K.card}
        flexShrink={0}
        borderTopWidth={1} borderColor={K.divider}>
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
  const screenWidth = useWindowDimensions().width;
  const {tickets, loading, refresh, onItemPress, onBump, onServed, onRecall, elapsedMinutes, ticketUrgency} = useKitchen();

  // Calculate responsive columns and card dimensions
  const {columns, cardWidth, containerPadding} = useMemo(() => {
    const padH = 28; // left + right padding (14 + 14)
    const availableWidth = screenWidth - padH;
    const cardGap = 16; // margin between cards
    
    if (screenWidth < 600) {
      // Compact / split-view: 1 column
      return {
        columns: 1,
        cardWidth: availableWidth,
        containerPadding: 14,
      };
    } else if (screenWidth < 1200) {
      // Medium: 2 columns
      const w = (availableWidth - cardGap) / 2;
      return {
        columns: 2,
        cardWidth: w,
        containerPadding: 14,
      };
    } else {
      // Large landscape: 3 columns
      const w = (availableWidth - cardGap * 2) / 3;
      return {
        columns: 3,
        cardWidth: w,
        containerPadding: 14,
      };
    }
  }, [screenWidth]);

  console.log('KDS HEADER FILE LOADED');

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
            Kitchen Display....
          </StyledText>
          {urgent > 0 && (
            <Stack paddingHorizontal={12} paddingVertical={4} borderRadius={20}
              backgroundColor={K.urgent}>
              {/* <StyledText fontSize={12} fontWeight={theme.fontWeight.bold} color="#fff">
                {urgent} urgent
              </StyledText> */}
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
          <Stack vertical paddingHorizontal={containerPadding} paddingTop={16} paddingBottom={8}>
            <StyledText fontSize={10} color={K.muted} letterSpacing={1.2} marginBottom={12}
              paddingHorizontal={6}>
              ACTIVE ORDERS ({active.length})
            </StyledText>
            <Stack horizontal flexWrap="wrap" justifyContent="flex-start">
              {active.map(group => (
                <TicketCard
                  key={group.ticket.ticket_id}
                  group={group}
                  cardWidth={cardWidth}
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
          <Stack vertical paddingHorizontal={containerPadding} paddingTop={8} paddingBottom={24}>
            <Stack height={1} backgroundColor={K.divider} marginBottom={16} marginHorizontal={6} />
            <StyledText fontSize={10} color={K.ready} letterSpacing={1.2} marginBottom={12}
              paddingHorizontal={6}>
              READY TO SERVE ({ready.length})
            </StyledText>
            <Stack horizontal flexWrap="wrap" justifyContent="flex-start">
              {ready.map(group => (
                <TicketCard
                  key={group.ticket.ticket_id}
                  group={group}
                  cardWidth={cardWidth}
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