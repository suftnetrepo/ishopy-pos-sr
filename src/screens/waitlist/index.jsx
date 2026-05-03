/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {ScrollView, Switch as RNSwitch, TextInput} from 'react-native';
import {
  StyledPage, StyledText, StyledPressable, StyledSpinner, Stack, theme,
} from 'fluent-styles';
import SideBarAdapter from '../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../components/tablet/header';
import {useAppTheme} from '../../theme';
import {useNavigation} from '@react-navigation/native';
import useWaitlist from '../../hooks/useWaitlist';
import { useFocus } from '../../hooks/useFocus';


const PREFERENCES = [
  {key: 'none',    label: 'No pref.'},
  {key: 'window',  label: 'Window'},
  {key: 'outside', label: 'Outside'},
  {key: 'bar',     label: 'Bar seat'},
  {key: 'quiet',   label: 'Quiet'},
];
const SIZES = [1, 2, 3, 4, 5];

const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');

const waitInfo = (joinedAt, t) => {
  const mins  = Math.floor((Date.now() - new Date(joinedAt).getTime()) / 60000);
  const label = mins < 1 ? 'Just arrived' : `${mins} min`;
  const color = mins > 20 ? t.dangerColor : mins > 10 ? t.brandPrimary : t.successColor;
  return {label, color};
};

const AVATAR_COLORS = [
  {bg: '#fef3c7', text: '#b45309'},
  {bg: '#dbeafe', text: '#1d4ed8'},
  {bg: '#f3e8ff', text: '#7c3aed'},
  {bg: '#dcfce7', text: '#15803d'},
  {bg: '#fee2e2', text: '#b91c1c'},
];
const avatarColor = idx => AVATAR_COLORS[idx % AVATAR_COLORS.length];

// ─── Queue card ───────────────────────────────────────────────────────────────
const QueueCard = ({entry, position, onSeatNow, onNotify, onRemove, t}) => {
  const {label: timeLabel, color: timeColor} = waitInfo(entry.joined_at, t);
  const isNotified = entry.status === 'notified';
  const ac         = avatarColor(position);
  const pref       = PREFERENCES.find(p => p.key === entry.preference);
  const isFirst    = position === 0;

  return (
    <Stack
      horizontal alignItems="center" gap={10}
      backgroundColor={t.bgCard}
      borderRadius={12}
      borderTopWidth={0.5} borderRightWidth={0.5} borderBottomWidth={0.5}
      borderLeftWidth={isFirst ? 3 : 0.5}
      borderTopColor={t.borderDefault} borderRightColor={t.borderDefault}
      borderBottomColor={t.borderDefault}
      borderLeftColor={isFirst ? t.brandPrimary : isNotified ? t.successColor : t.borderDefault}
      paddingHorizontal={12} paddingVertical={10}
      marginBottom={7}>

      {/* Avatar */}
      <Stack width={34} height={34} borderRadius={17}
        backgroundColor={ac.bg} alignItems="center" justifyContent="center" flexShrink={0}>
        <StyledText fontSize={12} fontWeight={theme.fontWeight.semiBold} color={ac.text}>
          {initials(entry.guest_name) || String(position + 1)}
        </StyledText>
      </Stack>

      {/* Info */}
      <Stack vertical flex={1} gap={3}>
        <StyledText fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.semiBold}
          color={t.textPrimary} numberOfLines={1}>
          {entry.guest_name || `Party of ${entry.party_size}`}
        </StyledText>
        <Stack horizontal alignItems="center" gap={5} flexWrap="wrap">
          <StyledText fontSize={10} color={t.textSecondary}>
            {entry.party_size} {entry.party_size === 1 ? 'guest' : 'guests'}
          </StyledText>
          {pref && pref.key !== 'none' && (
            <>
              <Stack width={3} height={3} borderRadius={2} backgroundColor={t.textMuted} />
              <StyledText fontSize={10} color={t.textSecondary}>{pref.label}</StyledText>
            </>
          )}
          <Stack width={3} height={3} borderRadius={2} backgroundColor={t.textMuted} />
          <StyledText fontSize={10} color={timeColor}>{timeLabel}</StyledText>
        </Stack>
      </Stack>

      {/* Status tag */}
      {isNotified ? (
        <Stack paddingHorizontal={8} paddingVertical={3} borderRadius={20}
          backgroundColor={t.successBg}>
          <StyledText fontSize={10} fontWeight={theme.fontWeight.semiBold} color={t.successColor}>
            Notified
          </StyledText>
        </Stack>
      ) : (
        <Stack paddingHorizontal={8} paddingVertical={3} borderRadius={20}
          backgroundColor={t.bgPage} borderWidth={0.5} borderColor={t.borderDefault}>
          <StyledText fontSize={10} color={t.textMuted}>
            ~{(position + 1) * 8} min
          </StyledText>
        </Stack>
      )}

      {/* Actions */}
      <Stack horizontal gap={5}>
        <StyledPressable
          onPress={() => onSeatNow(entry)}
          backgroundColor={t.brandPrimary}
          paddingHorizontal={12} paddingVertical={5} borderRadius={20}>
          <StyledText fontSize={11} fontWeight={theme.fontWeight.semiBold} color={t.textOnAmber}>
            Seat now
          </StyledText>
        </StyledPressable>
        <StyledPressable
          onPress={() => onNotify(entry)}
          borderWidth={0.5}
          borderColor={entry.notify_sms ? t.brandPrimary : t.borderDefault}
          backgroundColor={entry.notify_sms ? `${t.brandPrimary}15` : t.bgPage}
          paddingHorizontal={10} paddingVertical={5} borderRadius={20}>
          <StyledText fontSize={11} color={entry.notify_sms ? t.brandPrimary : t.textSecondary}>
            {entry.notify_sms ? '📱 SMS' : 'Notify'}
          </StyledText>
        </StyledPressable>
        <StyledPressable
          onPress={() => onRemove(entry.waitlist_id)}
          borderWidth={0.5} borderColor={t.dangerBg}
          backgroundColor={t.dangerBg}
          paddingHorizontal={10} paddingVertical={5} borderRadius={20}>
          <StyledText fontSize={11} color={t.dangerColor}>Remove</StyledText>
        </StyledPressable>
      </Stack>
    </Stack>
  );
};

// ─── Add form ─────────────────────────────────────────────────────────────────
const AddForm = ({onAdd, t}) => {
  const [name,       setName]       = useState('');
  const [partySize,  setPartySize]  = useState(2);
  const [preference, setPreference] = useState('none');
  const [phone,      setPhone]      = useState('');
  const [notifySms,  setNotifySms]  = useState(false);

  const handleAdd = () => {
    onAdd({guest_name: name.trim(), party_size: partySize, preference, phone, notify_sms: notifySms, notes: ''});
    setName(''); setPartySize(2); setPreference('none'); setPhone(''); setNotifySms(false);
  };

  const inputStyle = {
    borderWidth: 0.5, borderColor: t.borderDefault, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8,
    fontSize: theme.fontSize.small, color: t.textPrimary,
    backgroundColor: t.bgPage,
  };

  return (
    <Stack vertical gap={12} padding={16} backgroundColor={t.bgCard}
      borderRadius={14} borderWidth={0.5} borderColor={t.borderDefault}>

      <StyledText fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.semiBold} color={t.textPrimary}>
        Add to waitlist
      </StyledText>

      <Stack vertical gap={4}>
        <StyledText fontSize={11} color={t.textSecondary}>Guest name (optional)</StyledText>
        <TextInput style={inputStyle} placeholder="e.g. Smith party"
          placeholderTextColor={t.textMuted} value={name} onChangeText={setName} />
      </Stack>

      <Stack vertical gap={4}>
        <StyledText fontSize={11} color={t.textSecondary}>Party size</StyledText>
        <Stack horizontal gap={5}>
          {SIZES.map(s => (
            <StyledPressable key={s} flex={1} onPress={() => setPartySize(s)}
              paddingVertical={7} borderRadius={8} borderWidth={0.5} alignItems="center"
              borderColor={partySize === s ? t.brandPrimary : t.borderDefault}
              backgroundColor={partySize === s ? t.brandPrimaryBg : t.bgPage}>
              <StyledText fontSize={12}
                fontWeight={partySize === s ? theme.fontWeight.semiBold : theme.fontWeight.normal}
                color={partySize === s ? t.brandPrimaryText : t.textSecondary}>
                {s === 5 ? '5+' : s}
              </StyledText>
            </StyledPressable>
          ))}
        </Stack>
      </Stack>

      <Stack vertical gap={4}>
        <StyledText fontSize={11} color={t.textSecondary}>Seating preference</StyledText>
        <Stack horizontal flexWrap="wrap" gap={5}>
          {PREFERENCES.map(p => (
            <StyledPressable key={p.key} onPress={() => setPreference(p.key)}
              paddingHorizontal={10} paddingVertical={4} borderRadius={20} borderWidth={0.5}
              borderColor={preference === p.key ? t.brandPrimary : t.borderDefault}
              backgroundColor={preference === p.key ? t.brandPrimaryBg : t.bgPage}>
              <StyledText fontSize={11}
                color={preference === p.key ? t.brandPrimaryText : t.textSecondary}>
                {p.label}
              </StyledText>
            </StyledPressable>
          ))}
        </Stack>
      </Stack>

      <Stack vertical gap={4}>
        <StyledText fontSize={11} color={t.textSecondary}>Phone (optional)</StyledText>
        <TextInput style={inputStyle} placeholder="+44 7..."
          placeholderTextColor={t.textMuted} keyboardType="phone-pad"
          value={phone} onChangeText={setPhone} />
      </Stack>

      <Stack horizontal alignItems="center" justifyContent="space-between"
        paddingTop={8} borderTopWidth={0.5} borderColor={t.borderDefault}>
        <StyledText fontSize={12} color={t.textPrimary}>SMS when table ready</StyledText>
        <RNSwitch value={notifySms} onValueChange={setNotifySms}
          trackColor={{false: t.borderDefault, true: t.brandPrimary}}
          thumbColor={t.bgCard} />
      </Stack>

      <StyledPressable
        onPress={handleAdd}
        backgroundColor={t.brandPrimary}
        borderRadius={10} paddingVertical={11} alignItems="center">
        <StyledText fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.semiBold}
          color={t.textOnAmber}>
          Add to waitlist
        </StyledText>
      </StyledPressable>
    </Stack>
  );
};

// ─── Stat tile ────────────────────────────────────────────────────────────────
const StatTile = ({value, unit, label, t}) => (
  <Stack flex={1} vertical backgroundColor={t.bgCard}
    borderRadius={12} borderWidth={0.5} borderColor={t.borderDefault}
    paddingHorizontal={14} paddingVertical={10}>
    <Stack horizontal alignItems="baseline" gap={4}>
      <StyledText fontSize={26} fontWeight={theme.fontWeight.semiBold} color={t.textPrimary}>
        {value}
      </StyledText>
      {unit && <StyledText fontSize={12} color={t.textSecondary}>{unit}</StyledText>}
    </Stack>
    <StyledText fontSize={11} color={t.textSecondary}>{label}</StyledText>
  </Stack>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
const WaitlistScreen = () => {
  const focused = useFocus();
  const {t}        = useAppTheme();
  const navigation = useNavigation();
  const {entries, loading, addToQueue, notifyGuest, removeGuest} = useWaitlist(focused);

  const avgWait = entries.length > 0 ? entries.length * 8 : 0;

  const handleSeatNow = entry => {
    navigation.navigate('big-table', {waitlistEntry: entry});
  };

  return (
    <StyledPage backgroundColor={t.bgPage}>
      <StyledPage.Header.Full>
        <RenderHeader showBackButton showLogo={false} showTitle title="Waitlist" />
      </StyledPage.Header.Full>

      <Stack flex={1} horizontal>
        <SideBarAdapter selectedMenu={7} showMenu={false} collapse />

        {/* Queue */}
        <Stack flex={2.5} vertical paddingHorizontal={14}>
          <Stack horizontal gap={10} marginBottom={14}>
            <StatTile value={entries.length} label="In queue" t={t} />
            <StatTile value={`~${avgWait}`} unit="min" label="Est. wait" t={t} />
            <StatTile value={entries.filter(e => e.party_size <= 2).length} label="Small parties" t={t} />
          </Stack>

          <ScrollView showsVerticalScrollIndicator={false}>
            {entries.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" paddingVertical={60}
                vertical gap={8} backgroundColor={t.bgCard} borderRadius={14}
                borderWidth={0.5} borderColor={t.borderDefault}>
                <StyledText fontSize={28}>🪑</StyledText>
                <StyledText fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.semiBold} color={t.textPrimary}>
                  No one waiting
                </StyledText>
                <StyledText fontSize={theme.fontSize.small} color={t.textSecondary}>
                  Add guests using the form
                </StyledText>
              </Stack>
            ) : entries.map((entry, idx) => (
              <QueueCard
                key={entry.waitlist_id}
                entry={entry}
                position={idx}
                onSeatNow={handleSeatNow}
                onNotify={notifyGuest}
                onRemove={removeGuest}
                t={t}
              />
            ))}
          </ScrollView>
        </Stack>

        {/* Form */}
        <Stack flex={1.2}  paddingBottom={16} marginRight={16}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <AddForm onAdd={addToQueue} t={t} />
          </ScrollView>
        </Stack>
      </Stack>

      {loading && <StyledSpinner />}
    </StyledPage>
  );
};

export default WaitlistScreen;