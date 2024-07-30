/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { YStack, XStack, StyledConfirmDialog, StyledCycle, StyledBadge, StyledHeader, StyledSafeAreaView, StyledSpinner, StyledOkDialog, StyledSpacer, StyledText } from 'fluent-styles';
import { theme, fontStyles } from '../../../configs/theme';
import { StyledMIcon } from '../../../components/icon';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAddOns, useDeleteAddOn } from '../../../hooks/useAddon';
import { FlatList } from 'react-native';
import { formatCurrency, toWordCase } from '../../../utils/help';
import { StyledStack } from '../../../components/stack';
import { useAppContext } from '../../../hooks/appContext';

const AddOn = () => {
  const navigator = useNavigation()
  const route = useRoute()
  const { shop } = useAppContext()
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [addOn, setAddOn] = useState()
  const { data, error, loading, loadAddons, resetHandler } = useAddOns()
  const { deleteAddOn, error: deleteError } = useDeleteAddOn()
  const { menu } = route.params

  useEffect(() => {
    loadAddons(menu.menu_id)
  }, [menu.menu_id])

  const onConfirm = () => {
    deleteAddOn(addOn?.addOn_id).then(async (result) => {
      result && (
        loadAddons(menu.menu_id)
      )
      setIsDialogVisible(false)
    })
  }

  const RenderCard = ({ item }) => {
    return (
      <StyledStack paddingHorizontal={8} backgroundColor={theme.colors.gray[1]}
        paddingVertical={8} justifyContent='flex-start' marginBottom={8} borderRadius={16} alignItems='center' >
        <YStack flex={2}>
          <StyledText paddingHorizontal={8} fontFamily={fontStyles.FontAwesome5_Regular} fontWeight={theme.fontWeight.medium} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
            {toWordCase(item.addOnName)} 
          </StyledText>
          <XStack>
            <StyledBadge
              color={theme.colors.orange[800]}
              backgroundColor={theme.colors.orange[100]}
              fontWeight={theme.fontWeight.normal}
              fontSize={theme.fontSize.medium}
              paddingHorizontal={10}
              paddingVertical={1}
            >
              {formatCurrency(shop.currency || "£", item.price)}
            </StyledBadge>
            <StyledSpacer marginHorizontal={2} />            
          </XStack>
        </YStack>
        <XStack flex={1} justifyContent='flex-end' alignItems='center'>
          <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon size={24} name='edit' color={theme.colors.gray[600]} onPress={() => navigator.navigate("edit-addOn", {
              addOn :item,
              menu: menu
            })} />
          </StyledCycle>
          <StyledSpacer marginHorizontal={4} />
          <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon size={32} name='delete-outline' color={theme.colors.gray[600]} onPress={() =>
              { 
                setIsDialogVisible(true)
                setAddOn(item)}
              } />
          </StyledCycle>
        </XStack>
      </StyledStack>
    )
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={() => navigator.navigate("menus")} title='AddOns' icon cycleProps={{
          borderColor: theme.colors.gray[300],
          marginRight: 8
        }} rightIcon={
          <XStack flex={1} justifyContent='flex-end' alignItems='center' paddingHorizontal={16}>
            <StyledCycle borderWidth={1} borderColor={theme.colors.cyan[400]} backgroundColor={theme.colors.cyan[500]}>
              <StyledMIcon size={24} name='add' color={theme.colors.gray[1]} onPress={() => navigator.navigate("add-addOn", {
                menu: menu
              })} />
            </StyledCycle>
          </XStack>
        } />
      </StyledHeader>
      <YStack flex={1} paddingHorizontal={8} paddingVertical={8} backgroundColor={theme.colors.gray[100]}>
        <FlatList
          data={data}
          initialNumToRender={100}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.addOn_id}
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
          description='Are you sure you want to delete this addOn?'
          confirm='Yes'
          cancel='No'
          title={'Confirmation'}
          onCancel={() => setIsDialogVisible(false)}
          onConfirm={() => onConfirm()}
        />}
    </StyledSafeAreaView>
  );
}

export default AddOn