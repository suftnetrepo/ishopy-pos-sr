/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Modal} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {StyledPressable, StyledDivider, Stack} from 'fluent-styles';
import Text from '../../components/text';
import {useAppContext} from '../../hooks/appContext';
import {theme} from '../../utils/theme';
import {useAppTheme} from '../../theme';

const OrderDateFilter = ({visible, setVisible}) => {
  const {updateDateFilter} = useAppContext();
  const {t} = useAppTheme();
  const [startDate,   setStartDate]   = useState(null);
  const [endDate,     setEndDate]     = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  const formatDate = dateString => {
    if (!dateString) return 'Select';
    return new Date(dateString).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  const onDayPress = day => {
    const selected = day.dateString;
    if (!startDate || (startDate && endDate)) {
      setStartDate(selected);
      setEndDate(null);
      setMarkedDates({[selected]: {startingDay: true, color: '#3b82f6', textColor: 'white'}});
    } else if (startDate && !endDate) {
      if (new Date(selected) < new Date(startDate)) {
        setEndDate(startDate);
        setStartDate(selected);
        createMarkedDates(selected, startDate);
      } else {
        setEndDate(selected);
        createMarkedDates(startDate, selected);
      }
    }
  };

  const createMarkedDates = (start, end) => {
    const marked = {};
    for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (dateStr === start)     marked[dateStr] = {startingDay: true, color: '#3b82f6', textColor: 'white'};
      else if (dateStr === end)  marked[dateStr] = {endingDay:   true, color: '#3b82f6', textColor: 'white'};
      else                       marked[dateStr] = {color: '#bfdbfe', textColor: '#1e40af'};
    }
    setMarkedDates(marked);
  };

  const clearDates = () => { setStartDate(null); setEndDate(null); setMarkedDates({}); };
  const applyFilter = () => { setVisible(false); updateDateFilter({startDate, endDate}); };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
      <Stack
        flex={1} alignItems="center" justifyContent="center"
        backgroundColor="rgba(0,0,0,0.5)">
        <Stack
          width="90%" maxWidth={400}
          backgroundColor={t.bgCard}
          borderRadius={16} overflow="hidden">

          {/* Header */}
          <Stack horizontal justifyContent="space-between" alignItems="center"
            paddingHorizontal={20} paddingVertical={16}>
            <Text variant="title" color={t.textPrimary}>
              Filter by date
            </Text>
            <StyledPressable onPress={() => setVisible(false)} padding={4}>
              <Text variant="title" color={t.textSecondary}>✕</Text>
            </StyledPressable>
          </Stack>

          {/* Date display */}
          <Stack horizontal justifyContent="space-around" alignItems="center"
            paddingHorizontal={20} paddingBottom={16}>
            <Stack vertical alignItems="center">
              <Text variant="caption" color={t.textSecondary}>Start Date</Text>
              <Text variant="label" color={t.textPrimary}>
                {formatDate(startDate)}
              </Text>
            </Stack>
            <Text variant="caption" color={t.textMuted}>→</Text>
            <Stack vertical alignItems="center">
              <Text variant="caption" color={t.textSecondary}>End Date</Text>
              <Text variant="label" color={t.textPrimary}>
                {formatDate(endDate)}
              </Text>
            </Stack>
          </Stack>

          {/* Calendar */}
          <Calendar
            onDayPress={onDayPress}
            markingType="period"
            markedDates={markedDates}
            theme={{
              selectedDayBackgroundColor: '#3b82f6',
              todayTextColor: '#3b82f6',
              arrowColor: '#3b82f6',
            }}
          />

          <StyledDivider />

          {/* Footer */}
          <Stack horizontal gap={12} paddingHorizontal={20} paddingVertical={16}>
            <StyledPressable
              flex={1} borderRadius={8} paddingVertical={12} alignItems="center"
              borderWidth={1} borderColor={t.textMuted}
              backgroundColor={t.bgCard}
              onPress={clearDates}>
              <Text variant="button" color={t.textSecondary}>
                Clear
              </Text>
            </StyledPressable>
            <StyledPressable
              flex={1} borderRadius={8} paddingVertical={12} alignItems="center"
              backgroundColor={startDate && endDate ? t.brandPrimary : t.borderDefault}
              disabled={!startDate || !endDate}
              onPress={applyFilter}>
              <Text variant="button" color={t.textPrimary}>
                Apply Filter
              </Text>
            </StyledPressable>
          </Stack>

        </Stack>
      </Stack>
    </Modal>
  );
};

export default OrderDateFilter;
