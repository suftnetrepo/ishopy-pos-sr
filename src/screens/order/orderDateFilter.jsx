/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Modal} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {StyledText, StyledPressable, StyledDivider, Stack} from 'fluent-styles';
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
            <StyledText fontSize={theme.fontSize.large} fontWeight={theme.fontWeight.bold}>
              Filter by date
            </StyledText>
            <StyledPressable onPress={() => setVisible(false)} padding={4}>
              <StyledText fontSize={20} color={t.textSecondary}>✕</StyledText>
            </StyledPressable>
          </Stack>

          {/* Date display */}
          <Stack horizontal justifyContent="space-around" alignItems="center"
            paddingHorizontal={20} paddingBottom={16}>
            <Stack vertical alignItems="center">
              <StyledText fontSize={theme.fontSize.micro} color={t.textSecondary}>Start Date</StyledText>
              <StyledText fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.semiBold}>
                {formatDate(startDate)}
              </StyledText>
            </Stack>
            <StyledText fontSize={theme.fontSize.large} color={t.textMuted}>→</StyledText>
            <Stack vertical alignItems="center">
              <StyledText fontSize={theme.fontSize.micro} color={t.textSecondary}>End Date</StyledText>
              <StyledText fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.semiBold}>
                {formatDate(endDate)}
              </StyledText>
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
              <StyledText color={t.textSecondary} fontWeight={theme.fontWeight.semiBold}>
                Clear
              </StyledText>
            </StyledPressable>
            <StyledPressable
              flex={1} borderRadius={8} paddingVertical={12} alignItems="center"
              backgroundColor={startDate && endDate ? t.brandPrimary : t.borderDefault}
              disabled={!startDate || !endDate}
              onPress={applyFilter}>
              <StyledText color={t.textPrimary} fontWeight={theme.fontWeight.semiBold}>
                Apply Filter
              </StyledText>
            </StyledPressable>
          </Stack>

        </Stack>
      </Stack>
    </Modal>
  );
};

export default OrderDateFilter;
