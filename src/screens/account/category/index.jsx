/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { YStack, XStack, StyledConfirmDialog, StyledCycle, StyledHeader, StyledSafeAreaView, StyledSpinner, StyledOkDialog, StyledSpacer, StyledText } from 'fluent-styles';
import { theme, fontStyles } from '../../../configs/theme';
import { StyledMIcon } from '../../../components/icon';
import { useNavigation } from '@react-navigation/native';
import { useCategories, useDeleteCategory } from '../../../hooks/useCategory';
import { FlatList } from 'react-native';
import { toWordCase } from '../../../utils/help';
import { StyledStack } from '../../../components/stack';
import { convertJsonToCsv } from '../../../utils/convertJsonToCsv';

const Category = () => {
  const navigator = useNavigation()
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [category, setCategory] = useState()
  const { data, error, loading, loadCategories, resetHandler } = useCategories()
  const { deleteCategory, error : deleteError } = useDeleteCategory()

  const onConfirm = () => {
    deleteCategory(category?.category_id).then(async (result) => {
      result && (
        loadCategories()
      )
      setIsDialogVisible(false)
    })
  }

  const RenderCard = ({ item }) => {
    return (
      <StyledStack status={item.status === 1 ? '1': '0'} paddingHorizontal={8} backgroundColor={theme.colors.gray[1]}
        paddingVertical={8} justifyContent='flex-start' marginBottom={8} borderRadius={16} alignItems='center' >
        <YStack flex={2}>
          <StyledText paddingHorizontal={8} fontFamily={fontStyles.FontAwesome5_Regular} fontWeight={theme.fontWeight.medium} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
            {toWordCase(item.name)} 
          </StyledText>         
        </YStack>
        <XStack flex={1} justifyContent='flex-end' alignItems='center'>
          <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon size={24} name='edit' color={theme.colors.gray[600]} onPress={() => navigator.navigate("edit-category", {
              category :item
            })} />
          </StyledCycle>
          <StyledSpacer marginHorizontal={4} />
          <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon size={32} name='delete-outline' color={theme.colors.gray[600]} onPress={() =>
              { 
                setIsDialogVisible(true)
                setCategory(item)}
                } />
          </StyledCycle>
        </XStack>
      </StyledStack>
    )
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={() => navigator.navigate("bottom-tabs", { screen: 'Settings'})} title='Categories' icon cycleProps={{
          borderColor: theme.colors.gray[300],
          marginRight: 8
        }} rightIcon={
          <XStack flex={1} justifyContent='flex-end' alignItems='center' paddingHorizontal={16}>
            <StyledCycle borderWidth={1} borderColor={theme.colors.cyan[400]} backgroundColor={theme.colors.cyan[500]}>
              <StyledMIcon size={24} name='add' color={theme.colors.gray[1]} onPress={() => navigator.navigate("add-category")} />
            </StyledCycle>
            <StyledSpacer marginHorizontal={2} />
            <StyledCycle borderWidth={1} borderColor={theme.colors.gray[500]} backgroundColor={theme.colors.gray[1]}>
              <StyledMIcon size={24} name='share' color={theme.colors.gray[800]} onPress={async () => data?.length && await convertJsonToCsv(data)} />
            </StyledCycle>
          </XStack>
        } />
      </StyledHeader>
      <YStack flex={1} paddingHorizontal={8} paddingVertical={8} backgroundColor={theme.colors.gray[100]}>
        <FlatList
          data={data}
          initialNumToRender={100}
          keyExtractor={(item) => item.category_id}
          renderItem={({ item, index }) => {
            return (
              <RenderCard item={item} key={index} />
            )
          }}
        />
      </YStack>
      {
        (error || deleteError) && (
          <StyledOkDialog title={error?.message || deleteError?.message} description='please try again' visible={true} onOk={() => {
            resetHandler()
          }} />
        )
      }
      {
        (loading) && (
          <StyledSpinner />
        )
      }
      {isDialogVisible &&
        <StyledConfirmDialog
          visible
          description='Are you sure you want to delete this category?'
          confirm='Yes'
          cancel='No'
          title={'Confirmation'}
          onCancel={() => setIsDialogVisible(false)}
          onConfirm={() => onConfirm()}
        />}
    </StyledSafeAreaView>
  );
}

export default Category