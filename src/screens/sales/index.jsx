/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState, useRef } from 'react';
import { YStack, XStack, StyledSafeAreaView, StyledText, StyledDialog, StyledBadgeIcon, StyledBadge, StyledSpacer, StyledButton, StyledHeader } from 'fluent-styles';
import { Modalize } from 'react-native-modalize';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { fontStyles, theme, palettes } from '../../configs/theme';
import { StyledMIcon } from '../../components/icon';
import CategoryScrollView from '../../components/category';
import MenuScrollView from '../../components/menu';
import { formatCurrency } from '../../utils/help';
import { useAppContext } from '../../hooks/appContext';
import { StyledSearchBar } from '../../components/searchBar';
import { printKitchenTicket } from '../../utils/printReceipt';

const Sales = () => {
  const navigator = useNavigation()
  const route = useRoute()
  const { shop, user, getItemCount, getTotal, clearItem, getItems, addAddOn } = useAppContext()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchString, setSearchString] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [item, setItem] = useState()
  const { table } = route.params
  const modalizeRef = useRef(null);
  const items = getItems(table.table_id)

  const printTicket = async () => {
    const ticket = {     
      table_name: table.tableName,
      date: new Date().toISOString(),
      cashier: `${user.first_name} ${user.last_name}`,
      items,
    }

    try {
      await printKitchenTicket(ticket)
    }catch(error) {
      console.error(error)
    }
   
  }

  const showBottomSheet = () => {
    if (modalizeRef.current) {
      modalizeRef.current.open();
    }
  };
  const increaseAddOnQuantity = (addOn) => {
    setItem((prev) => ({
      ...prev,
      addOns: prev.addOns.map(a =>
        a.addOn_id === addOn.addOn_id ? { ...a, quantity: parseInt(a.quantity || 0) + 1 } : a
      ),
    }))
  };
  const decreaseAddOnQuantity = (addOn) => {
    if (parseInt(addOn?.quantity || 0) === 0) return
    setItem((prev) => ({
      ...prev,
      addOns: prev.addOns.map(a =>
        a.addOn_id === addOn.addOn_id ? { ...a, quantity: parseInt(a.quantity || 0) - 1 } : a
      ),
    }))
  }
  const calculateTotalAddOnsPrice = () => {
    return item.addOns.reduce((total, addOn) => {
      return total + (parseInt(addOn.price || 0) * parseInt(addOn.quantity || 0));
    }, 0);
  };
  const RenderCard = ({ item }) => {
    return (
      <XStack flex={1} marginVertical={4} paddingHorizontal={8} paddingVertical={8} justifyContent='space-between' alignItems='center' borderWidth={1} borderColor={theme.colors.gray[400]} borderRadius={16}>
        <YStack paddingHorizontal={8} justifyContent='flex-start' alignItems='flex-start'>
          <StyledText fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[600]} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal}>
            {item.name}
          </StyledText>

        </YStack>
        <XStack gap={2}>
          <StyledSpacer marginHorizontal={16} />
          <StyledBadge
            color={theme.colors.gray[800]}
            backgroundColor={theme.colors.gray[200]}
            fontWeight={theme.fontWeight.normal}
            fontSize={theme.fontSize.normal}
            paddingHorizontal={10}
            paddingVertical={1}
          >
            {item.quantity}
          </StyledBadge>
          <StyledSpacer marginHorizontal={4} />
          <StyledBadge
            color={theme.colors.gray[100]}
            backgroundColor={theme.colors.gray[800]}
            fontWeight={theme.fontWeight.normal}
            fontSize={theme.fontSize.normal}
            paddingHorizontal={10}
            paddingVertical={1}
          >
            {formatCurrency(shop.currency || '£', item.price)}
          </StyledBadge>
        </XStack>
      </XStack>
    )
  }
  const RenderCartItems = () => (
    <Modalize
      ref={modalizeRef}
      adjustToContentHeight={true}
      alwaysOpen={false}
      withHandle={true}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        stickyHeaderIndices: [0],
      }}>

      <YStack paddingHorizontal={8} marginVertical={8}>
        {
          getItems(table.table_id).map((item, index) => {
            return (
              <RenderCard key={index} item={item} />
            )
          })
        }
      </YStack>
    </Modalize>
  )

  const RenderAddOns = ({ item }) => {
    return (
      <YStack
        backgroundColor={palettes.transparent05}
        flex={1}
        justifyContent='center'
        alignItems='center'
      >
        <YStack
          width={'90%'}
          backgroundColor={theme.colors.gray[1]}
          borderRadius={16}
          paddingHorizontal={8}
          paddingVertical={8}
          justifyContent='center'
          alignItems='center'
        >
          {
            item.addOns.map((addOn, index) => (
              <XStack key={index} marginVertical={4} paddingHorizontal={8} paddingVertical={8} justifyContent='space-between' alignItems='center' borderWidth={1} borderColor={theme.colors.gray[400]} borderRadius={16}>
                <YStack flex={2} paddingHorizontal={8} justifyContent='flex-start' alignItems='flex-start'>
                  <StyledText fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[600]} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal}>
                    {addOn.addOnName}
                  </StyledText>
                  <StyledBadge
                    color={theme.colors.gray[100]}
                    backgroundColor={theme.colors.gray[800]}
                    fontWeight={theme.fontWeight.small}
                    fontSize={theme.fontSize.small}
                    paddingHorizontal={10}
                    paddingVertical={1}
                  >
                    {formatCurrency(shop.currency || '£', addOn.price)}
                  </StyledBadge>
                </YStack>
                <XStack flex={1} gap={2} alignItems='center' justifyContent='flex-end' >
                  <StyledBadge
                    color={theme.colors.gray[800]}
                    backgroundColor={theme.colors.gray[200]}
                    fontWeight={theme.fontWeight.normal}
                    fontSize={theme.fontSize.normal}
                    paddingHorizontal={10}
                    paddingVertical={1}
                  >
                    {addOn.quantity}
                  </StyledBadge>
                  <StyledSpacer marginHorizontal={4} />
                  <YStack paddingHorizontal={8} justifyContent='center' alignItems='center'>
                    <StyledButton
                      borderRadius={30}
                      height={30}
                      width={30}
                      borderColor={theme.colors.green[500]}
                      backgroundColor={theme.colors.green[500]}
                      onPress={() => { increaseAddOnQuantity(addOn) }}
                    >
                      <StyledText
                        fontFamily={fontStyles.OpenSansRegular}
                        color={theme.colors.gray[1]}
                        fontWeight={theme.fontWeight.normal}
                        fontSize={theme.fontSize.normal}
                        paddingHorizontal={4}
                        paddingVertical={2}
                      >
                        +
                      </StyledText>
                    </StyledButton>
                    <StyledSpacer marginVertical={2} />
                    <StyledButton
                      borderRadius={30}
                      height={30}
                      width={30}
                      borderColor={theme.colors.pink[500]}
                      backgroundColor={theme.colors.pink[500]}
                      onPress={() => { decreaseAddOnQuantity(addOn) }}
                    >
                      <StyledText
                        fontFamily={fontStyles.OpenSansRegular}
                        color={theme.colors.gray[1]}
                        fontWeight={theme.fontWeight.normal}
                        fontSize={theme.fontSize.normal}
                        paddingHorizontal={4}
                        paddingVertical={2}
                      >
                        -
                      </StyledText>
                    </StyledButton>
                  </YStack>
                </XStack>
              </XStack>
            ))
          }
          <XStack borderColor={theme.colors.gray[400]} borderRadius={16} width={'100%'} justifyContent='flex-end' paddingVertical={8} paddingHorizontal={16} alignItems='center' backgroundColor={theme.colors.gray[50]}>
            <YStack >
              <StyledText color={theme.colors.gray[800]} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.large}>
                Total
              </StyledText>
            </YStack>
            <StyledSpacer marginHorizontal={8} />
            <StyledText color={theme.colors.gray[800]}
              fontWeight={theme.fontWeight.bold}
              fontSize={theme.fontSize.normal}>
              {formatCurrency(shop.currency || "£", calculateTotalAddOnsPrice())}
            </StyledText>
          </XStack>
          <StyledSpacer marginVertical={2} />
          <XStack borderColor={theme.colors.gray[400]} borderRadius={16} width={'100%'} justifyContent='flex-end' alignItems='center' backgroundColor={theme.colors.gray[50]}>
            <StyledButton
              flex={1}
              borderRadius={30}
              borderColor={theme.colors.gray[200]}
              backgroundColor={theme.colors.gray[200]}
              onPress={() => { setItem() }}
            >
              <StyledText
                fontFamily={fontStyles.OpenSansRegular}
                color={theme.colors.gray[800]}
                fontWeight={theme.fontWeight.normal}
                fontSize={theme.fontSize.normal}
                paddingHorizontal={16}
                paddingVertical={8}
              >
                Close
              </StyledText>
            </StyledButton>
            <StyledSpacer marginHorizontal={4} />
            <StyledButton
              flex={1}
              borderRadius={30}
              borderColor={theme.colors.cyan[500]}
              backgroundColor={theme.colors.cyan[500]}
              onPress={() => { addAddOn(item.menu_id, item.addOns?.filter((j) => j.quantity > 0), table.table_id), setItem() }}
            >
              <StyledText
                fontFamily={fontStyles.OpenSansRegular}
                color={theme.colors.gray[1]}
                fontWeight={theme.fontWeight.normal}
                fontSize={theme.fontSize.normal}
                paddingHorizontal={16}
                paddingVertical={8}
              >
                Add
              </StyledText>
            </StyledButton>
          </XStack>
          <StyledSpacer marginVertical={2} />
        </YStack>
      </YStack>
    )
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[800]}>
      <StyledHeader borderWidth={1} borderRadius={8} backgroundColor={theme.colors.gray[800]} paddingHorizontal={8} statusProps={{ translucent: true, barStyle: 'light-content', backgroundColor: theme.colors.gray[800] }} >
        <StyledHeader.Header color={theme.colors.gray[1]} iconProps={{
          color: theme.colors.gray[1]
        }} onPress={() => navigator.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'bottom-tabs', state: { routes: [{ name: 'Tables' }] } },
            ],
          }))} title={table.tableName} icon cycleProps={{
            borderColor: theme.colors.gray[300],
            backgroundColor: theme.colors.gray[700],
            marginRight: 8
          }} rightIcon={
            <>
              <XStack flex={1} justifyContent='flex-end' alignItems='center' paddingHorizontal={8}>
                <StyledSpacer marginHorizontal={4} />
                <StyledMIcon size={48} name={showSearch ? 'cancel' : 'search'} color={theme.colors.gray[1]} onPress={() => {
                  setSelectedCategory("-1")
                  setSearchString(null)
                  setShowSearch(!showSearch)
                }} />
                <StyledMIcon size={48} name='clear' color={theme.colors.gray[1]} onPress={() => {
                  clearItem(table.table_id)
                }} />
                <StyledBadgeIcon
                  char={getItemCount(table.table_id)}
                  right={1}
                  top={-5}
                  textAlign='center'
                  charProps={{
                    borderRadius: 50,
                    width: 25,
                    height: 25,
                    paddingHorizontal: 1,
                    paddingVertical: 1,
                    backgroundColor: theme.colors.pink[700],
                    fontFamily: fontStyles.OpenSansRegular,
                    color: theme.colors.gray[1],
                    fontWeight: theme.fontWeight.bold,
                    fontSize: theme.fontSize.small,
                    textAlign: 'center'
                  }}
                  icon={
                    <StyledMIcon
                      name={'shopping-cart'}
                      size={48}
                      color={theme.colors.gray[300]}
                      onPress={() => showBottomSheet()}
                    />
                  }
                />
              </XStack>
            </>
          } />
      </StyledHeader>
      <XStack justifyContent='flex-start' alignItems='flex-start' paddingHorizontal={16} paddingVertical={8} backgroundColor={theme.colors.gray[800]}>
        {
          showSearch ? (
            <StyledSearchBar onPress={(term) => setSearchString(term)} />
          ) : (
            <CategoryScrollView onPress={(category) => setSelectedCategory(category)} />
          )
        }
      </XStack>
      <YStack flex={1} backgroundColor={theme.colors.gray[100]}>
        <MenuScrollView table={table} onChange={(item) => setItem({ ...item, quantity: 0 })} searchString={searchString} category_id={selectedCategory?.category_id || -1} />
      </YStack>
      <XStack absolute paddingVertical={8} marginBottom={8} paddingHorizontal={8} borderWidth={1} borderRadius={32} borderColor={theme.colors.gray[400]}>
        <StyledButton flex={1} borderRadius={32} borderColor={theme.colors.coolGray[600]} backgroundColor={theme.colors.coolGray[600]} onPress={() => items?.length > 0 && printTicket()} >
          <StyledText paddingHorizontal={16} paddingVertical={8} fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.bold} color={theme.colors.gray[100]} >Print </StyledText>
        </StyledButton>
        <StyledSpacer marginHorizontal={4} />
        <StyledButton flex={2} borderRadius={32} borderColor={theme.colors.cyan[600]} backgroundColor={theme.colors.cyan[600]} onPress={() => items.length > 0 && navigator.navigate("checkout", {
          table: table
        })} >
          <StyledText paddingHorizontal={16} paddingVertical={8} fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.bold} color={theme.colors.gray[100]} >Pay {formatCurrency(shop.currency || '£', getTotal(table.table_id))}</StyledText>
        </StyledButton>
      </XStack >
      <RenderCartItems />
      {item &&
        <StyledDialog visible>
          <RenderAddOns item={item} />
        </StyledDialog>}

    </StyledSafeAreaView>
  );
}

export default Sales