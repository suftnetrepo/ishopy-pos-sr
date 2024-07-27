/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { YStack, XStack, StyledConfirmDialog, StyledCycle, StyledBadge, StyledHeader, StyledSafeAreaView, StyledSpinner, StyledOkDialog, StyledSpacer } from 'fluent-styles';
import { theme, fontStyles } from '../../../configs/theme';
import { StyledMIcon } from '../../../components/icon';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStocks, useDeleteStock } from '../../../hooks/useStock';
import { FlatList } from 'react-native';
import { dateConverter } from '../../../utils/help';
import { convertJsonToCsv } from '../../../utils/convertJsonToCsv';

const Stock = () => {
  const navigator = useNavigation()
  const route = useRoute()
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [stock, setStock] = useState()
  const { data, error, loading, loadStocks, resetHandler } = useStocks()
  const { deleteStock, error: deleteError } = useDeleteStock()
  const { product } = route.params

  useEffect(() => {
    loadStocks(product.product_id)
  }, [product.product_id])

  const onConfirm = () => {
    deleteStock(stock?.stock_id).then(async (result) => {
      result && (
        loadStocks(product.product_id)
      )
      setIsDialogVisible(false)
    })
  }

  const RenderCard = ({ item }) => {

    return (
      <XStack paddingHorizontal={8} backgroundColor={theme.colors.gray[1]}
        paddingVertical={8} justifyContent='flex-start' marginBottom={8} borderRadius={16} alignItems='center' >
        <YStack justifyContent='flex-start' alignItems='flex-start'>
          <StyledBadge
            color={theme.colors.purple[800]}
            backgroundColor={theme.colors.purple[100]}
            fontWeight={theme.fontWeight.bold}
            fontSize={theme.fontSize.normal}
            paddingHorizontal={16}
            paddingVertical={4}
            fontFamily={fontStyles.FontAwesome5_Regular}
          >
            {item.stock}
          </StyledBadge>
          <StyledSpacer marginVertical={4} />
          <StyledBadge
            color={theme.colors.green[800]}
            backgroundColor={theme.colors.green[100]}
            fontWeight={theme.fontWeight.normal}
            fontSize={theme.fontSize.medium}
            paddingHorizontal={10}
            paddingVertical={1}
          >
            {dateConverter(item.date)}
          </StyledBadge>
        </YStack>
        <XStack flex={1} justifyContent='flex-end' alignItems='center'>
          <StyledSpacer marginHorizontal={4} />
          <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon size={32} name='delete-outline' color={theme.colors.gray[600]} onPress={() => {
              setIsDialogVisible(true)
              setStock(item)
            }
            } />
          </StyledCycle>
        </XStack>
      </XStack>
    )
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={() => navigator.navigate("products")} title={product?.name} icon cycleProps={{
          borderColor: theme.colors.gray[300],
          marginRight: 8
        }} rightIcon={
          <XStack flex={1} justifyContent='flex-end' alignItems='center' paddingHorizontal={16}>
            <StyledCycle borderWidth={1} borderColor={theme.colors.cyan[400]} backgroundColor={theme.colors.cyan[500]}>
              <StyledMIcon size={24} name='add' color={theme.colors.gray[1]} onPress={() => navigator.navigate("add-stock", {
                product
              })} />
            </StyledCycle>
            <StyledSpacer marginHorizontal={2} />
            <StyledCycle borderWidth={1} borderColor={theme.colors.gray[500]} backgroundColor={theme.colors.gray[1]}>
              <StyledMIcon size={24} name='share' color={theme.colors.gray[800]} onPress={async () => await convertJsonToCsv(data)} />
            </StyledCycle>
          </XStack>
        } />
      </StyledHeader>
      <YStack flex={1} paddingHorizontal={8} paddingVertical={8} backgroundColor={theme.colors.gray[100]}>
        <FlatList
          data={data}
          initialNumToRender={100}
          keyExtractor={(item) => item.stock_id}
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
          description='Are you sure you want to delete this stock?'
          confirm='Yes'
          cancel='No'
          title={'Confirmation'}
          onCancel={() => setIsDialogVisible(false)}
          onConfirm={() => onConfirm()}
        />}
    </StyledSafeAreaView>
  );
}

export default Stock