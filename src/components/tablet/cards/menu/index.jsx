import React, {useEffect, useMemo} from 'react';
import {FlatList, ScrollView, useWindowDimensions} from 'react-native';
import {StyledSpacer, StyledText, YStack} from 'fluent-styles';
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
  const {width} = useWindowDimensions();
  const {data, handleQueryMemu} = useQueryMenuByCategory(category_id);

  useEffect(() => {
    handleQueryMemu(menuQuery);
  }, [menuQuery]);

  const columns = useMemo(() => {
    if (width >= 1000) return 3;
    if (width >= 700) return 2;
    return 1;
  }, [width]);

  const available = useMemo(() => {
    if (width >= 1000) return width - 104 - 280 - 58;
    if (width >= 700) return width - 104 - 227;
    return 1;
  }, [width]);

  const availableWidth = available;
  const safeWidth = Math.max(320, availableWidth);
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
        borderRadius={8}
        borderWidth={1}
        borderColor={isSelected ? t.brandPrimary : t.borderDefault}
        padding={12}
        marginRight={(index + 1) % columns === 0 ? 0 : GAP}
        marginBottom={GAP}
        shadowColor="black"
        shadowOffset={{width: 0, height: 1}}
        shadowOpacity={0.1}
        shadowRadius={2}
        elevation={3}
        vertical
        onTouchStart={() => handleTouchStart(item)}>
        {isSelected && (
          <StyledIcon
            position="absolute"
            right={6}
            top={6}
            name="check-circle"
            size={32}
            color={t.brandPrimary}
          />
        )}

        <StyledText
          fontFamily={fontStyles.Roboto_Regular}
          fontSize={theme.fontSize.medium}
          fontWeight={theme.fontWeight.medium}
          color={t.textPrimary}
          numberOfLines={1}>
          {item.name}
        </StyledText>

        <StyledSpacer marginVertical={2} />

        <StyledText
          fontFamily={fontStyles.Roboto_Regular}
          fontSize={theme.fontSize.normal}
          fontWeight={theme.fontWeight.medium}
          color={t.textPrimary}>
          {formatCurrency(shop?.currency || '£', item.price)}
        </StyledText>
      </Stack>
    );
  };

  return (
    <ScrollView flex={3} showsVerticalScrollIndicator={false}>
      <FlatList
        key={`item-grid-${columns}`}
        data={data}
        keyExtractor={item => item.menu_id}
        scrollEnabled={false}
        numColumns={columns}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => <Card item={item} index={index} />}
      />
    </ScrollView>
  );
}
