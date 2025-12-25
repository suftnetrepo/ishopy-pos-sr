import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import {
  Box,
  Text,
  Pressable,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  HStack,
  VStack,
  Divider,
} from '@gluestack-ui/themed';

const DateRangeFilter = ({ visible, setVisible, onApplyFilter }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return 'Select';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const onDayPress = (day) => {
    const selected = day.dateString;

    if (!startDate || (startDate && endDate)) {
      setStartDate(selected);
      setEndDate(null);
      setMarkedDates({
        [selected]: {
          startingDay: true,
          color: '#3b82f6',
          textColor: 'white',
        },
      });
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
    const startD = new Date(start);
    const endD = new Date(end);

    for (let d = new Date(startD); d <= endD; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];

      if (dateStr === start) {
        marked[dateStr] = {
          startingDay: true,
          color: '#3b82f6',
          textColor: 'white',
        };
      } else if (dateStr === end) {
        marked[dateStr] = {
          endingDay: true,
          color: '#3b82f6',
          textColor: 'white',
        };
      } else {
        marked[dateStr] = {
          color: '#bfdbfe',
          textColor: '#1e40af',
        };
      }
    }

    setMarkedDates(marked);
  };

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setMarkedDates({});
  };

  const applyFilter = () => {
    setVisible(false);
    onApplyFilter?.({ startDate, endDate });
  };

  return (
    <Box>
      {/* Modal */}
      <Modal isOpen={visible} onClose={() => setVisible(false)}>
        <ModalBackdrop />

        <ModalContent w="90%" maxWidth={400} bg="white" rounded="$xl">
          <ModalHeader>


            <ModalCloseButton onPress={() => setVisible(false)}>
              <Text fontSize="$2xl" color="$trueGray500">✕</Text>
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            {/* Date Display */}
            <HStack justifyContent="space-around" alignItems="center" mb="$4">
              <VStack alignItems="center">
                <Text fontSize="$xs" color="$trueGray500">Start Date</Text>
                <Text fontSize="$sm" fontWeight="$semibold">
                  {formatDate(startDate)}
                </Text>
              </VStack>

              <Text fontSize="$lg" color="$trueGray400">→</Text>

              <VStack alignItems="center">
                <Text fontSize="$xs" color="$trueGray500">End Date</Text>
                <Text fontSize="$sm" fontWeight="$semibold">
                  {formatDate(endDate)}
                </Text>
              </VStack>
            </HStack>

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
          </ModalBody>

          <Divider />

          <ModalFooter gap="$3">
            <Button
              action="secondary"
              variant="outline"
                  borderRadius={8}
              flex={1}
              onPress={clearDates}
            >
              <Text color="$trueGray600" fontWeight="$semibold">
                Clear
              </Text>
            </Button>

            <Button
              flex={1}
              borderRadius={8}
              bg={startDate && endDate ? "$yellow400" : "$trueGray400"}
              disabled={!startDate || !endDate}
              onPress={applyFilter}
            >
              <Text color="black" fontWeight="$semibold">
                Apply Filter
              </Text>
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DateRangeFilter;
