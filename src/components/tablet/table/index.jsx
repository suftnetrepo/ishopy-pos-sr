/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useMemo} from 'react';
import {FlatList} from 'react-native';
import {StyledSpacer, StyledText, StyledChip} from 'fluent-styles';
import {ScrollView} from 'react-native';
import {useAppContext} from '../../../hooks/appContext';
import {Stack} from '../../package/stack';
import {theme, fontStyles} from '../../../utils/theme';
import {StyledIcon} from '../../package/icon';
import {useNavigation} from '@react-navigation/native';
import {useFocus} from '../../../hooks/useFocus';
import {guid} from '../../../utils/help';
import {useAppTheme} from '../../../theme';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  occupied: {
    borderColor: theme.colors.green[600],
    badgeBg:     theme.colors.green[50],
    badgeColor:  theme.colors.green[700],
    iconColor:   theme.colors.green[600],
    label:       'Occupied',
    icon:        'groups',
  },
  available: {
    borderColor: theme.colors.gray[200],
    badgeBg:     theme.colors.gray[100],
    badgeColor:  theme.colors.gray[500],
    iconColor:   theme.colors.gray[400],
    label:       'Available',
    icon:        'event-seat',
  },
  reserved: {
    borderColor: theme.colors.blue[400],
    badgeBg:     theme.colors.blue[50],
    badgeColor:  theme.colors.blue[600],
    iconColor:   theme.colors.blue[500],
    label:       'Reserved',
    icon:        'event-seat',
  },
};

const getStatus = table => {
  if (table?.isReserved === 1) return STATUS.reserved;
  if (table?.isOccupied === 1) return STATUS.occupied;
  return STATUS.available;
};

// ─── Location config ──────────────────────────────────────────────────────────
const LOCATIONS = [
  {key: 'All',      label: 'All',      icon: 'table-restaurant'},
  {key: 'Dine In',  label: 'Dine In',  icon: 'table-restaurant'},
  {key: 'Bar',      label: 'Bar',      icon: 'local-bar'},
  {key: 'Takeaway', label: 'Takeaway', icon: 'takeout-dining'},
];

const LOCATION_ICON = {
  'Dine In':  'table-restaurant',
  'Bar':      'local-bar',
  'Takeaway': 'takeout-dining',
};

const LOCATION_STYLE = {
  'Bar':      {bg: theme.colors.purple[50], color: theme.colors.purple[700]},
  'Takeaway': {bg: theme.colors.amber[500],  color: theme.colors.amber[700]},
  'Dine In':  null,
};

// ─── Individual card ──────────────────────────────────────────────────────────
const Card = ({table, onPress, t, waitlistEntry}) => {
  const s        = getStatus(table);
  const location = table?.location || 'Dine In';
  const locStyle = LOCATION_STYLE[location];
  const locIcon  = LOCATION_ICON[location];

  // Waitlist mode: dim tables that are occupied or too small
  const isWaitlistMode = !!waitlistEntry;
  const fits  = !isWaitlistMode || (table.isOccupied !== 1 && table.size >= waitlistEntry.party_size);
  const dimmed = isWaitlistMode && !fits;

  return (
    <Stack
      flex={1}
      backgroundColor={t.bgCard}
      borderRadius={12}
      paddingVertical={10}
      paddingHorizontal={12}
      marginBottom={8}
      marginHorizontal={4}
      horizontal
      justifyContent="space-between"
      alignItems="center"
      opacity={dimmed ? 0.35 : 1}
      onTouchStart={() => !dimmed && onPress(table)}>

      {/* Left col */}
      <Stack flex={1} vertical gap={6}>
        {/* Table name + location tag */}
        <Stack horizontal alignItems="center" gap={6}>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.medium}
            fontWeight={theme.fontWeight.semiBold}
            color={t.textPrimary}>
            {table.tableName}
          </StyledText>

          {/* Only show location pill for Bar / Takeaway */}
          {locStyle && (
            <Stack
              paddingHorizontal={7}
              paddingVertical={2}
              borderRadius={20}
              backgroundColor={locStyle.bg}
              horizontal
              alignItems="center"
              gap={3}>
              <StyledIcon name={locIcon} size={11} color={locStyle.color} />
              <StyledText fontSize={10} fontWeight={theme.fontWeight.semiBold} color={locStyle.color}>
                {location}
              </StyledText>
            </Stack>
          )}
        </Stack>

        {/* Guest count + time */}
        <Stack horizontal alignItems="center" gap={10}>
          <Stack horizontal alignItems="center" gap={3}>
            <StyledIcon name="person" size={14} color={t.textMuted} />
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontSize={theme.fontSize.small}
              color={t.textSecondary}>
              {table.guest_count || 0}
            </StyledText>
          </Stack>
          <Stack horizontal alignItems="center" gap={3}>
            <StyledIcon name="access-time" size={14} color={t.textMuted} />
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontSize={theme.fontSize.small}
              color={t.textSecondary}>
              {table.start_time || '--:--'}
            </StyledText>
          </Stack>
        </Stack>

        {/* Status badge */}
        <Stack
          paddingHorizontal={8}
          paddingVertical={3}
          borderRadius={20}
          backgroundColor={s.label === 'Available' ? t.bgPage : s.badgeBg}
          borderWidth={0.5}
          borderColor={s.label === 'Available' ? t.borderDefault : s.badgeBg}
          alignSelf="flex-start">
          <StyledText
            fontSize={10}
            fontWeight={theme.fontWeight.semiBold}
            color={s.label === 'Available' ? t.textMuted : s.badgeColor}>
            {s.label}
          </StyledText>
        </Stack>
      </Stack>

      {/* Right — icon */}
      <Stack
        width={40}
        height={40}
        borderRadius={20}
        borderWidth={1}
        borderColor={locStyle ? locStyle.bg : t.borderDefault}
        backgroundColor={locStyle ? locStyle.bg : t.bgPage}
        alignItems="center"
        justifyContent="center">
        <StyledIcon
          size={20}
          name={locStyle ? locIcon : s.icon}
          color={locStyle ? locStyle.color : s.iconColor}
        />
      </Stack>
    </Stack>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function TableCard({data, onTableSelect, waitlistEntry}) {
  const focused = useFocus();
  const {updateCurrentMenu} = useAppContext();
  const {t} = useAppTheme();
  const navigation = useNavigation();
  const [activeLocation, setActiveLocation] = useState('All');

  useEffect(() => {
    updateCurrentMenu(4);
  }, [focused]);

  const handlePress = table => {
    const location = table?.location || 'Dine In';

    // Bar & Takeaway — skip the guest dialog, go straight to menu
    if (location === 'Bar' || location === 'Takeaway') {
      navigation.navigate('big-menu', {
        table_id:   table.table_id,
        table_name: table.tableName,
        order_type: location,
      });
      return;
    }

    // Dine In occupied — go straight to the existing order on that table
    if (table?.isOccupied === 1) {
      navigation.navigate('big-menu', {
        table_id:   table.table_id,
        table_name: table.tableName,
        order_type: 'Dine In',
      });
      return;
    }

    // Dine In available — open KeyCard to enter guest details first
    onTableSelect(table);
  };

  // Derive available location tabs from actual data
  const locationTabs = useMemo(() => {
    const found = new Set((data || []).map(t => t?.location || 'Dine In'));
    return LOCATIONS.filter(l => l.key === 'All' || found.has(l.key));
  }, [data]);

  // Filter tables by selected location
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (activeLocation === 'All') return data;
    return data.filter(t => (t?.location || 'Dine In') === activeLocation);
  }, [data, activeLocation]);

  return (
    <Stack vertical flex={1}>

      {/* Waitlist banner — only shown when coming from waitlist */}
      {waitlistEntry && (
        <Stack
          horizontal alignItems="center" gap={8}
          backgroundColor={t.brandPrimaryBg}
          borderRadius={10} paddingHorizontal={14} paddingVertical={8}
          marginBottom={10} marginHorizontal={4}
          borderWidth={0.5} borderColor={t.brandPrimary}>
          <StyledIcon name="person" size={16} color={t.brandPrimaryText} />
          <StyledText fontSize={theme.fontSize.small} color={t.brandPrimaryText}>
            Seating {waitlistEntry.guest_name || 'Guest'} · {waitlistEntry.party_size}{' '}
            {waitlistEntry.party_size === 1 ? 'guest' : 'guests'} — tap a highlighted table
          </StyledText>
        </Stack>
      )}

      {/* Location filter chips */}
      {locationTabs.length > 1 && (
        <Stack horizontal gap={8} alignItems="center" marginBottom={12} marginHorizontal={4}>
          {locationTabs.map(loc => (
            <StyledChip
              key={loc.key}
              label={loc.label}
              variant="ingredient"
              size="sm"
              selected={activeLocation === loc.key}
              showCheck={activeLocation === loc.key}
              onPress={() => setActiveLocation(loc.key)}
            />
          ))}
        </Stack>
      )}

      {/* Summary counts */}
      <Stack horizontal gap={16} marginBottom={10} marginHorizontal={4}>
        {[
          {label: 'Occupied',  count: filteredData.filter(t => t.isOccupied === 1).length, color: t.successColor},
          {label: 'Available', count: filteredData.filter(t => t.isOccupied !== 1).length, color: t.textSecondary},
        ].map(item => (
          <Stack key={item.label} horizontal alignItems="center" gap={4}>
            <Stack width={8} height={8} borderRadius={4} backgroundColor={item.color} />
            <StyledText fontSize={theme.fontSize.small} color={t.textSecondary}>
              {item.count} {item.label}
            </StyledText>
          </Stack>
        ))}
      </Stack>

      {/* Table grid */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <FlatList
          data={filteredData}
          keyExtractor={item => item.table_id}
          scrollEnabled={false}
          numColumns={4}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <Card
              key={item.table_id}
              table={item}
              onPress={handlePress}
              t={t}
              waitlistEntry={waitlistEntry}
            />
          )}
        />
      </ScrollView>
    </Stack>
  );
}