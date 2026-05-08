/* eslint-disable prettier/prettier */
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {FlatList, ScrollView, Animated} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {
  theme,
  Stack,
  StyledText,
  StyledChip,
  StyledPressable,
} from 'fluent-styles';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyledMIcon} from '../../../../components/icon';
import {useMenus, useDeleteMenu} from '../../../../hooks/useMenu';
import {formatCurrency, toWordCase} from '../../../../utils/help';
import {useCategories} from '../../../../hooks/useCategory';
import {useAppContext} from '../../../../hooks/appContext';
import usePremium from '../../../../hooks/usePremium';
import {useAppTheme} from '../../../../theme';
import {useLoaderAndError} from '../../../../hooks/useLoaderAndError';

const ItemCard = forwardRef(
  (
    {
      onItemChange,
      onItemDelete,
      onAddonChange,
      flag = false,
      shop,
      onRequestAdd,
    },
    ref
  ) => {
    const {menuQuery} = useAppContext();
    const {t} = useAppTheme();
    const {checkLimit} = usePremium();
    const [activeCategory, setActiveCategory] = useState('All');
    const {
      data,
      error,
      loading,
      resetHandler,
      restoreMenus,
      filterMenus,
      freeTextSearch,
    } = useMenus(flag);
    const {error: deleteError} = useDeleteMenu();
    const {data: categories} = useCategories();

    useLoaderAndError(loading, error || deleteError, resetHandler);

    useEffect(() => {
      freeTextSearch(menuQuery);
    }, [menuQuery]);

    const handleRequestAdd = () => {
      if (checkLimit('items', data?.length || 0)) {
        onRequestAdd?.();
      }
    };

    useImperativeHandle(ref, () => ({
      requestAdd: handleRequestAdd,
    }));

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
          <StyledMIcon pointerEvents="none" size={22} name="delete-outline" color={t.bgCard} />
        </StyledPressable>
      </Stack>
    );

    const RenderCard = ({item, t}) => {
      const isActive = item.status === 1;
      const [scale] = useState(new Animated.Value(1));

      const handleCardPress = () => {
        // Scale animation feedback
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 0.98,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();

        onItemChange({data: item, tag: 'Edit'});
      };

      const handleEditPress = (e) => {
        e.stopPropagation?.();
        onItemChange({data: item, tag: 'Edit'});
      };

      const handleAddonPress = (e) => {
        e.stopPropagation?.();
        onAddonChange(item);
      };

      return (
        <Swipeable
          containerStyle={{flex: 1}}
          renderRightActions={() => renderRightActions(item)}>
          <Animated.View style={{transform: [{scale}], flex: 1}}>
            <StyledPressable
              onPress={handleCardPress}
              style={{flex: 1}}
              activeOpacity={0.7}>
              <Stack
                flex={1}
                horizontal
                borderRadius={18}
                backgroundColor={t.bgCard}
                borderWidth={0.2}
                borderColor={t.borderSubtle}
                marginHorizontal={4}
                marginBottom={12}
                paddingHorizontal={16}
                paddingVertical={16}
                shadowColor={t.textPrimary}
                shadowOffset={{width: 0, height: 1}}
                shadowOpacity={0.04}
                shadowRadius={3}
                elevation={1}
                gap={12}>

                {/* Left Content: Title + Metadata */}
                <Stack flex={1} vertical gap={8}>
                  {/* Item Title */}
                  <StyledText
                    fontSize={theme.fontSize.medium}
                    fontWeight={theme.fontWeight.semiBold}
                    color={t.textPrimary}
                    numberOfLines={1}>
                    {toWordCase(item.name)}
                  </StyledText>

                  {/* Metadata Row: Status Pill + Price */}
                  <Stack horizontal alignItems="center" gap={10}>
                    {/* Status Pill Badge */}
                    <Stack
                      paddingHorizontal={10}
                      paddingVertical={4}
                      borderRadius={999}
                      backgroundColor={
                        isActive
                          ? `${t.successColor}15`
                          : `${t.dangerColor}15`
                      }>
                      <StyledText
                        fontSize={10}
                        fontWeight={theme.fontWeight.semiBold}
                        color={isActive ? t.successColor : t.dangerColor}>
                        {isActive ? 'Active' : 'Off'}
                      </StyledText>
                    </Stack>

                    {/* Price */}
                    <StyledText
                      fontSize={theme.fontSize.small}
                      fontWeight={theme.fontWeight.normal}
                      color={t.textSecondary}>
                      {formatCurrency(shop?.currency || '£', item.price)}
                    </StyledText>
                  </Stack>
                </Stack>

                {/* Right Content: Action Icons */}
                <Stack horizontal alignItems="flex-start" gap={8}>
                  {/* Edit Icon Button */}
                  <StyledPressable
                    onPress={handleEditPress}
                    width={36}
                    height={36}
                    borderRadius={18}
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="transparent"
                    activeOpacity={0.6}>
                    <MIcon
                      pointerEvents="none"
                      size={18}
                      name="pencil"
                      color={t.textMuted}
                    />
                  </StyledPressable>

                  {/* Add-ons Icon Button (Restaurant Mode Only) */}
                  {shop?.mode === 'restaurant' && (
                    <StyledPressable
                      onPress={handleAddonPress}
                      width={36}
                      height={36}
                      borderRadius={18}
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor="transparent"
                      activeOpacity={0.6}>
                      <MIcon
                        pointerEvents="none"
                        size={18}
                        name="tune"
                        color={t.textMuted}
                      />
                    </StyledPressable>
                  )}
                </Stack>
              </Stack>
            </StyledPressable>
          </Animated.View>
        </Swipeable>
      );
    };

    return (
      <>
        {/* Category Filter Pills */}
        <Stack 
          horizontal 
          marginBottom={16}
          paddingHorizontal={0}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}>
            <Stack horizontal gap={10} alignItems="center">
              {[{category_id: 'All', name: 'All'}, ...(categories || [])].map(
                cat => (
                  <StyledChip
                    key={cat.category_id}
                    label={cat.name}
                    variant="outlined"
                    size="md"
                    selected={cat.category_id === activeCategory}
                    color={cat.category_id === activeCategory ? t.brandPrimary : t.textMuted}
                    bgColor={cat.category_id === activeCategory ? `${t.brandPrimary}08` : undefined}
                    onPress={() => handleFilter(cat)}
                    showCheck={false}
                  />
                )
              )}
            </Stack>
          </ScrollView>
        </Stack>

        {/* Items Grid */}
        <FlatList
          data={data}
          initialNumToRender={100}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.menu_id}
          numColumns={3}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          renderItem={({item, index}) => (
            <RenderCard item={item} key={index} t={t} />
          )}
        />
      </>
    );
  }
);

export default ItemCard;
