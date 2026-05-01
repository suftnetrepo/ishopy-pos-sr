/* eslint-disable prettier/prettier */
import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {
  theme,
  Stack,
  StyledText,
  StyledChip,
  StyledPressable,
} from 'fluent-styles';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyledIcon} from '../../../../components/package/icon';
import {StyledMIcon} from '../../../../components/icon';
import {useMenus, useDeleteMenu} from '../../../../hooks/useMenu';
import {formatCurrency, toWordCase} from '../../../../utils/help';
import {useCategories} from '../../../../hooks/useCategory';
import {useAppContext} from '../../../../hooks/appContext';
import usePremium from '../../../../hooks/usePremium';
import {useAppTheme} from '../../../../theme';

const ItemCard = forwardRef(({onItemChange, onItemDelete, onAddonChange, flag = false, shop, onRequestAdd}, ref) => {
  const {menuQuery} = useAppContext();
  const {t} = useAppTheme();
  const {checkLimit} = usePremium();

  const handleRequestAdd = () => {
    if (checkLimit('items', data?.length || 0)) {
      onRequestAdd?.();
    }
  };

  useImperativeHandle(ref, () => ({
    requestAdd: handleRequestAdd,
  }));
  const [activeCategory, setActiveCategory] = useState('All');
  const {data, error, loading, resetHandler, restoreMenus, filterMenus, freeTextSearch} = useMenus(flag);
  const {error: deleteError} = useDeleteMenu();
  const {data: categories} = useCategories();

  useEffect(() => {
    freeTextSearch(menuQuery);
  }, [menuQuery]);

  const handleFilter = async category => {
    setActiveCategory(category.category_id);
    if (category.category_id === 'All') {
      restoreMenus();
      return;
    }
    await filterMenus(category.category_id);
  };

  // Swipe left to delete
  const renderRightActions = item => (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="100%"
      paddingRight={8}
      paddingBottom={8}>
      <StyledPressable
        onPress={() => onItemDelete(item.menu_id)}
        backgroundColor={t.dangerColor}
        borderRadius={10}
        padding={14}
        alignItems="center"
        justifyContent="center">
        <StyledMIcon size={22} name="delete-outline" color={t.bgCard} />
      </StyledPressable>
    </Stack>
  );

  const RenderCard = ({item, t}) => {
    const isActive = item.status === 1;
    const borderColor = isActive ? t.successColor : t.dangerBg;

    return (
      <Swipeable
        containerStyle={{flex: 1}}
        renderRightActions={() => renderRightActions(item)}>
        <Stack
          flex={1}
          vertical
          borderRadius={12}
          backgroundColor={t.bgCard}
          marginHorizontal={4}
          marginBottom={8}
          paddingHorizontal={14}
          paddingVertical={12}>

          {/* Name + status dot */}
          <Stack horizontal alignItems="center" justifyContent="space-between" marginBottom={2}>
            <StyledText
              fontSize={theme.fontSize.small}
              fontWeight={theme.fontWeight.normal}
              color={t.textPrimary}
              flex={1}
              numberOfLines={1}>
              {toWordCase(item.name)}
            </StyledText>
            <Stack horizontal alignItems="center" gap={4}>
              <Stack
                width={6} height={6} borderRadius={3}
                backgroundColor={isActive ? t.successColor : t.dangerColor}
              />
              <StyledText fontSize={10} color={isActive ? t.successColor : t.dangerColor}>
                {isActive ? 'Active' : 'Off'}
              </StyledText>
            </Stack>
          </Stack>

          {/* Price */}
          <StyledText
            fontSize={theme.fontSize.small}
            fontWeight={theme.fontWeight.normal}
            color={t.textSecondary}
            marginBottom={12}>
            {formatCurrency(shop?.currency || '£', item.price)}
          </StyledText>

          {/* Actions */}
          <Stack horizontal gap={8}>
            <StyledPressable
              flex={1}
              onPress={() => onItemChange({data: item, tag: 'Edit'})}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              gap={4}
              borderWidth={1}
              borderColor={t.borderDefault}
              backgroundColor={t.bgPage}
              borderRadius={8}
              paddingVertical={7}>
              <StyledIcon name="edit" size={14} color={t.textSecondary} />
              <StyledText fontSize={theme.fontSize.small} color={t.textSecondary}>Edit</StyledText>
            </StyledPressable>

            {shop?.mode === 'restaurant' && (
              <StyledPressable
                flex={1}
                onPress={() => onAddonChange(item)}
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                gap={4}
                borderWidth={1}
                borderColor={t.borderFocus}
                backgroundColor={t.brandPrimaryBg}
                borderRadius={8}
                paddingVertical={7}>
                <MIcon size={14} name="bowl-mix" color={t.brandPrimary} />
                <StyledText fontSize={theme.fontSize.small} color={t.brandPrimary}>Add-ons</StyledText>
              </StyledPressable>
            )}
          </Stack>
        </Stack>
      </Swipeable>
    );
  };

  return (
    <>
      {/* Category chips */}
      <Stack horizontal marginBottom={12}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Stack horizontal gap={6} alignItems="center">
            {[{category_id: 'All', name: 'All'}, ...(categories || [])].map(cat => (
              <StyledChip
                key={cat.category_id}
                label={cat.name}
                variant="ingredient"
                size="sm"
                selected={cat.category_id === activeCategory}
                showCheck={cat.category_id === activeCategory}
                onPress={() => handleFilter(cat)}
              />
            ))}
          </Stack>
        </ScrollView>
      </Stack>

      {/* Items grid */}
      <FlatList
        data={data}
        initialNumToRender={100}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.menu_id}
        numColumns={3}
        renderItem={({item, index}) => <RenderCard item={item} key={index} 
                        t={t}/>}
      />

      
    </>
  );
})

export default ItemCard;
