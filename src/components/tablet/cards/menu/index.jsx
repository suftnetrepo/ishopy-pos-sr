import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, Pressable, ScrollView} from 'react-native';
import {StyledSpacer, StyledText, StyledShape, YStack} from 'fluent-styles';
import {useQueryMenuByCategory} from '../../../../hooks/useMenu';
import {useAppContext} from '../../../../hooks/appContext';
import {Stack} from '../../../package/stack';
import {theme, fontStyles} from '../../../../utils/theme';
import {StyledIcon} from '../../../package/icon';
import {formatCurrency} from '../../../../utils/help';
import EmptyView from '../../../utils/empty';
import {useAppTheme} from '../../../../theme';

const GAP = 8;

export default function ItemCard({onChangeItem, table_id}) {
  const {
    category_id,
    updateSelectedItem,
    selectedItem,
    shop,
    addItem,
    menuQuery,
  } = useAppContext();

  const {t} = useAppTheme();
  const {data, handleQueryMemu} = useQueryMenuByCategory(category_id);

  useEffect(() => {
    handleQueryMemu(menuQuery);
  }, [menuQuery]);

  // Measure our own rendered width instead of reverse-engineering it from
  // the window width — the sidebar can be collapsed (84px) or expanded
  // (210px) depending on screen size, so any fixed offset guess drifts out
  // of sync and cards end up wider than the space actually available.
  const [containerWidth, setContainerWidth] = useState(0);

  const columns = useMemo(() => {
    if (containerWidth >= 700) return 3;
    if (containerWidth >= 450) return 2;
    return 1;
  }, [containerWidth]);

  const safeWidth = Math.max(containerWidth, 280);
  const cardWidth = (safeWidth - GAP * (columns - 1)) / columns;

  const handleAddItem = async item => {
    const hasAddons = Array.isArray(item?.addOns) && item?.addOns.length > 0;

    if (hasAddons) {
      onChangeItem(item);
      return;
    }

    const index = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

    addItem(index, item.menu_id, item.name, item.price, 1, table_id, []).then(
      () => {}
    );
  };

  const handleTouchStart = async item => {
    updateSelectedItem(item);
    await handleAddItem(item);
  };

  if (data.length === 0) {
    return (
      <YStack
        flex={1}
        px={16}
        py={16}
        space="lg"
        backgroundColor={t.bgCard}
        borderRadius={16}
        borderWidth={1}
        borderColor={t.borderDefault}
        justifyContent="center"
        alignItems="center">
        <EmptyView
          color={t.textMuted}
          title="Your Item list is empty"
          description="Select any of the categories to add items to your list."
        />
      </YStack>
    );
  }

  const Card = ({item, index}) => {
    const isSelected = selectedItem?.menu_id === item.menu_id;

    return (
      <Stack
        width={cardWidth}
        minHeight={86}
        backgroundColor={isSelected ? t.brandPrimaryBg : t.bgCard}
        borderRadius={16}
        borderWidth={isSelected ? 1.5 : 1}
        borderColor={isSelected ? t.brandPrimary : t.borderDefault}
        paddingHorizontal={16}
        paddingVertical={14}
        marginRight={(index + 1) % columns === 0 ? 0 : GAP}
        marginBottom={GAP}
        shadowColor="black"
        shadowOffset={{width: 0, height: 1}}
        shadowOpacity={0.06}
        shadowRadius={4}
        elevation={2}
        horizontal
        alignItems="center"
        justifyContent="space-between">
        {isSelected && (
          <StyledIcon
            position="absolute"
            left={8}
            top={2}
            name="check-circle"
            size={18}
            color={t.brandPrimary}
          />
        )}

        <Stack vertical flex={1} minWidth={0}>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.medium}
            fontWeight={theme.fontWeight.bold}
            color={t.textPrimary}
            numberOfLines={1}>
            {item.name}
          </StyledText>

          <StyledSpacer marginVertical={2} />

          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.normal}
            fontWeight={theme.fontWeight.normal}
            color={t.textPrimary}>
            {formatCurrency(shop?.currency || '£', item.price)}
          </StyledText>
        </Stack>

        <Pressable
          onTouchStart={() => handleTouchStart(item)}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <StyledShape
            cycle
            size={34}
            backgroundColor={t.bgCard}
            borderWidth={1.5}
            borderColor={t.brandPrimary}
            justifyContent="center"
            alignItems="center">
            <StyledIcon name="add" size={20} color={t.brandPrimary} />
          </StyledShape>
        </Pressable>
      </Stack>
    );
  };

  return (
    <ScrollView
      flex={3}
      showsVerticalScrollIndicator={false}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
      {containerWidth > 0 && (
        <FlatList
          key={`item-grid-${columns}`}
          data={data}
          keyExtractor={item => item.menu_id}
          scrollEnabled={false}
          numColumns={columns}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => <Card item={item} index={index} />}
        />
      )}
    </ScrollView>
  );
}
