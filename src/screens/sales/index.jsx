/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState, useRef } from 'react';
import { YStack, XStack, StyledSafeAreaView, StyledText, StyledBadgeIcon, StyledBadge, StyledSpacer, StyledButton, StyledHeader } from 'fluent-styles';
import { Modalize } from 'react-native-modalize';
import { useNavigation } from '@react-navigation/native';
import { fontStyles, theme } from '../../configs/theme';
import { StyledMIcon } from '../../components/icon';
import CategoryScrollView from '../../components/category';
import ProductScrollView from '../../components/product';
import { formatCurrency } from '../../utils/help';
import { useAppContext } from '../../hooks/appContext';
import { StyledSearchBar } from '../../components/searchBar';

const Sales = () => {
  const navigator = useNavigation()
  const { shop, getItemCount, getTotalPrice, clearItem, getItems } = useAppContext()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchString, setSearchString] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const modalizeRef = useRef(null);
  const items = getItems()

  const showBottomSheet = () => {
    if (modalizeRef.current) {
      modalizeRef.current.open();
    }
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
          getItems().map((item, index) => {
            return (
              <RenderCard key={index} item={item} />
            )
          })
        }
      </YStack>
    </Modalize>
  )
 
  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[800]}>
      <StyledHeader borderWidth={1} borderRadius={8} backgroundColor={theme.colors.gray[800]} paddingHorizontal={8} statusProps={{ translucent: true, barStyle: 'light-content', backgroundColor: theme.colors.gray[800] }} >
        <StyledHeader.Header color={theme.colors.gray[1]} iconProps={{
          color: theme.colors.gray[1]
        }} onPress={() => navigator.reset({
          key: "bottom-tabs",
          index: 0,
          routes: [{ name: 'bottom-tabs' }]
        })} title='Sales' icon cycleProps={{
          borderColor: theme.colors.gray[300],
          backgroundColor: theme.colors.gray[700],
          marginRight: 8
        }} rightIcon={
          <>
            <XStack flex={1} justifyContent='flex-end' alignItems='center' paddingHorizontal={8}>
              <StyledSpacer marginHorizontal={4} />
              <StyledMIcon size={48} name={showSearch ? 'cancel' : 'search'} color={theme.colors.gray[1]} onPress={() => {
                setSelectedCategory(-1)
                setSearchString(null)
                setShowSearch(!showSearch)
              }} />
              <StyledBadgeIcon
                char={getItemCount()}
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
        <ProductScrollView searchString={searchString} category_id={selectedCategory?.category_id || -1} />
      </YStack>
      <XStack absolute paddingVertical={8} marginBottom={8} paddingHorizontal={8} borderWidth={1} borderRadius={32} borderColor={theme.colors.gray[400]}>
        <StyledButton flex={1} borderRadius={32} borderColor={theme.colors.coolGray[600]} backgroundColor={theme.colors.coolGray[600]} onPress={() => clearItem()} >
          <StyledText paddingHorizontal={16} paddingVertical={8} fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.bold} color={theme.colors.gray[100]} >Clear</StyledText>
        </StyledButton>
        <StyledSpacer marginHorizontal={4} />
        <StyledButton flex={2} borderRadius={32} borderColor={theme.colors.cyan[600]} backgroundColor={theme.colors.cyan[600]} onPress={() => items.length > 0 && navigator.navigate("checkout")} >
          <StyledText paddingHorizontal={16} paddingVertical={8} fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.bold} color={theme.colors.gray[100]} >Pay {formatCurrency(shop.currency || '£', getTotalPrice())}</StyledText>
        </StyledButton>
      </XStack >
      <RenderCartItems />
    </StyledSafeAreaView>
  );
}

export default Sales