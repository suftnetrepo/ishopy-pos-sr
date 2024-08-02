/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  YStack,
  XStack,
  StyledSafeAreaView,
  StyledText,
  StyledCycle,
  StyledBadge,
  StyledHeader,
  StyledSpinner,
  StyledOkDialog,
  StyledSpacer,
} from 'fluent-styles';
import {useNavigation} from '@react-navigation/native';
import {fontStyles, theme} from '../../configs/theme';
import {useQueryTablesByStatus} from '../../hooks/useTable';
import {FlatList} from 'react-native';
import {StyledMIcon} from '../../components/icon';
import {StyledStack} from '../../components/stack';

const DineTable = () => {
  const navigator = useNavigation();
    const [_, forceUpdate] = useState(0)
  const {data, error, loading, resetHandler, updateOccupancy} =
    useQueryTablesByStatus();

  const RenderCard = ({item}) => {
    return (
      <StyledStack
        occupied={item.isOccupied === 1 ? '1' : '0'}
        flex={1}
        marginHorizontal={4}
        paddingHorizontal={8}
        backgroundColor={theme.colors.gray[1]}
        paddingVertical={8}
        marginBottom={8}
        borderRadius={16}
        justifyContent="space-between"
        alignItems="center">
        <YStack justifyContent="flex-start" alignItems="flex-start">
          <XStack justifyContent="flex-start" alignItems="center">
            <StyledMIcon
              size={16}
              name="table-view"
              color={theme.colors.gray[600]}
            />
            <StyledText
              fontWeight={theme.fontWeight.normal}
              fontSize={theme.fontSize.normal}
              paddingHorizontal={4}
              paddingVertical={1}
              fontFamily={fontStyles.Roboto_Regular}>
              {item.tableName}
            </StyledText>
          </XStack>
          <StyledSpacer marginVertical={1} />
          <XStack justifyContent="flex-start" alignItems="center">
            <StyledBadge
              color={theme.colors.orange[800]}
              backgroundColor={theme.colors.orange[100]}
              fontWeight={theme.fontWeight.normal}
              fontSize={theme.fontSize.normal}
              paddingHorizontal={10}
              paddingVertical={1}>
              Size : {item.size}
            </StyledBadge>
          </XStack>
        </YStack>
        <StyledCycle borderWidth={1} borderColor={item.isOccupied === 1 ? theme.colors.teal[600] : theme.colors.gray[400]} backgroundColor={item.isOccupied === 1 ? theme.colors.teal[600] : theme.colors.gray[1]} >
          <StyledMIcon
            size={24}
            name={item.isOccupied === 1 ? 'menu-open' : 'restaurant-menu'}
            color= { item.isOccupied === 1 ? theme.colors.gray[1] : theme.colors.gray[400] }
            onLongPress={() => {
                updateOccupancy(item.table_id, 0).then(() => {
                    forceUpdate(prev => prev + 1);
                });              
            }}
            onPress={() => {
                updateOccupancy(item.table_id, 1).then(() => {});
              navigator.navigate('sales', {
                table: item,
              });
            }}
          />
        </StyledCycle>
      </StyledStack>
    );
  };

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
      <StyledHeader marginHorizontal={8} statusProps={{translucent: true}}>
        <StyledHeader.Header
          backgroundColor={theme.colors.gray[1]}
          onPress={() => navigator.navigate('bottom-tabs', {screen: 'Home'})}
          title="Tables"
          icon
          cycleProps={{
            borderColor: theme.colors.gray[300],
            marginRight: 8,
          }}
        />
      </StyledHeader>
      <StyledSpacer marginVertical={4} />
      <YStack
        flex={1}
        paddingHorizontal={8}
        backgroundColor={theme.colors.gray[100]}>
        <FlatList
          data={data}
          keyExtractor={item => item.table_id}
          initialNumToRender={100}
          renderItem={({item, index}) => <RenderCard key={index} item={item} />}
          showsVerticalScrollIndicator={false}
          numColumns={2}
        />
        {loading && <StyledSpinner />}
        {error && (
          <StyledOkDialog
            title={error?.message}
            description="please try again"
            visible={true}
            onOk={() => {
              resetHandler();
            }}
          />
        )}
      </YStack>
    </StyledSafeAreaView>
  );
};

export default DineTable;
