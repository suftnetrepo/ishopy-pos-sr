import React, {useState, useEffect} from 'react';
import {FlatList, Pressable} from 'react-native';
import {
  StyledText,
  StyledSpacer,
  StyledCycle,
  YStack,
  StyledEmptyState,
} from 'fluent-styles';
import {Box, Text, ScrollView} from '@gluestack-ui/themed';
import {Stack} from '../../package/stack';
import {theme, fontStyles} from '../../../utils/theme';
import {
  colorCodeStatus,
  convertDateFilter,
  getLastChars,
  formatDate,
  statusOptions,
} from '../../../utils/help';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useOrders} from '../../../hooks/useOrder';
import {useAppContext} from '../../../hooks/appContext';
import EmptyView from '../../utils/empty';

export default function OrderCard({onOrderChange, onHandleFilter}) {
  const {updateSelectedOrder, date_filter, updateDateFilter} = useAppContext();
  const [state, setState] = useState('All');
  const {data, filterOrders, restoreOrders, loadOrdersByDateRange, loadOrders} =
    useOrders(true);
  const hasActiveFilter = date_filter?.startDate && date_filter?.endDate;

  useEffect(() => {
    if (date_filter?.startDate && date_filter?.endDate) {
      try {
        const {startDate, endDate} = convertDateFilter(
          date_filter.startDate,
          date_filter.endDate
        );
        loadOrdersByDateRange(startDate, endDate);
      } catch (error) {
        if (__DEV__) console.error('Error parsing dates:', error);
      }
    }
  }, [date_filter?.startDate, date_filter?.endDate]);

  const handleFilter = async status => {
    setState(status);
    if (status === 'All') {
      restoreOrders();
      return;
    }

    await filterOrders(status);
  };

  const handleOrder = order => {
    updateSelectedOrder(order);
    onOrderChange('basket');
  };

  const handleClearDateFilter = async () => {
    try {
      await loadOrders();
      updateDateFilter({startDate: '', endDate: ''});
      setState('All');
    } catch (error) {
      if (__DEV__) console.error('Error clearing date filter:', error);
    }
  };

  if (data?.length === 0) {
    return (
     <YStack
        flex={1}
        px={16}
        py={16}
        space="lg"
        backgroundColor={theme.colors.gray[1]}
        borderRadius={16}
        borderWidth={1}
        borderColor={theme.colors.gray[200]}
        justifyContent="center"
        alignItems="center">
        <EmptyView
          color={theme.colors.gray[400]}
          title="Your Order list is empty"
          description="Orders will appear here once added."
        />
      </YStack>
    );
  }

  const Card = ({order}) => {
    return (
      <Stack
        flex={1}
        backgroundColor={theme.colors.gray[1]}
        borderRadius={16}
        paddingHorizontal={8}
        paddingVertical={8}
        marginVertical={4}
        marginHorizontal={4}
        shadowColor="black"
        shadowOffset={{width: 0, height: 1}}
        shadowOpacity={0.1}
        shadowRadius={2}
        elevation={3}
        status={colorCodeStatus(order?.status)}
        vertical
        onTouchStart={() => handleOrder(order)}>
        <Stack
          horizontal
          flex={1}
          justifyContent="space-between"
          alignItems="center">
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.small}
            fontWeight={theme.fontWeight.normal}
            color={theme.colors.gray[600]}>
            #{getLastChars(order?.order_id, 8)}
          </StyledText>
          <StyledCycle
            borderWidth={1}
            height={24}
            width={24}
            backgroundColor={theme.colors.gray[50]}
            borderColor={theme.colors.gray[400]}>
            <MaterialIcon
              name="chevron-right"
              size={12}
              color={theme.colors.gray[500]}
            />
          </StyledCycle>
        </Stack>
        <Stack vertical>
          <Stack gap={4} horizontal alignItems="center">
            <MaterialIcon
              name="access-time"
              size={18}
              color={theme.colors.gray[600]}
            />
            <StyledText
              color={theme.colors.gray[400]}
              fontSize={theme.fontSize.small}>
              {formatDate(order?.date)}
            </StyledText>
          </Stack>
        </Stack>
      </Stack>
    );
  };

  return (
    <ScrollView flex={3} showsVerticalScrollIndicator={false}>
      <Stack
        marginBottom={8}
        flex={1}
        marginLeft={8}
        marginRight={24}
        horizontal
        justifyContent="space-between"
        alignItems="center">
        <Stack gap={8} horizontal>
          {statusOptions.map(status => {
            const isActive = status === state;
            return (
              <Pressable
                key={status}
                onPress={async () => {
                  await handleFilter(status);
                }}>
                <Box
                  px="$4"
                  py="$2"
                  borderRadius="$full"
                  bg={isActive ? '$green600' : '$gray200'}>
                  <Text color={isActive ? '$white' : '$black'} fontWeight="300">
                    {status}
                  </Text>
                </Box>
              </Pressable>
            );
          })}
        </Stack>
        <StyledSpacer flex={1} />
        {hasActiveFilter && (
          <Pressable onPress={handleClearDateFilter}>
            <StyledCycle
              paddingHorizontal={10}
              borderWidth={1}
              height={48}
              width={48}
              backgroundColor={theme.colors.gray[100]}
              borderColor={theme.colors.gray[400]}>
              <MaterialIcon
                size={24}
                name="close"
                color={theme.colors.gray[800]}
              />
            </StyledCycle>
          </Pressable>
        )}
        <StyledSpacer marginHorizontal={4} />
        <Pressable
          onPress={() => {
            onHandleFilter('filter');
          }}>
          <StyledCycle
            paddingHorizontal={10}
            borderWidth={1}
            height={48}
            width={48}
            backgroundColor={theme.colors.gray[100]}
            borderColor={theme.colors.gray[400]}>
            <MaterialIcon
              size={24}
              name="filter-list"
              color={theme.colors.gray[800]}
            />
          </StyledCycle>
        </Pressable>
      </Stack>
      <FlatList
        data={data}
        keyExtractor={item => item.order_id}
        scrollEnabled={false}
        numColumns={4}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => <Card key={item.order_id} order={item} />}
      />
    </ScrollView>
  );
}
