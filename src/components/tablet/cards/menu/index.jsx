import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {StyledSpacer, StyledText, YStack, StyledShape} from 'fluent-styles';
import {ScrollView} from 'react-native';
import {useQueryMenuByCategory} from '../../../../hooks/useMenu';
import {useAppContext} from '../../../../hooks/appContext';
import {Stack} from '../../../package/stack';
import {theme, fontStyles} from '../../../../utils/theme';
import {StyledIcon} from '../../../package/icon';
import {formatCurrency} from '../../../../utils/help';
import PosIcon from '../../../pos-icon';
import EmptyView from '../../../utils/empty';
import {useAppTheme} from '../../../../theme';

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

  const handleAddItem = async item => {
    if ([item?.addOns || []].length > 0) {
      onChangeItem(item);
      return;
    }
    const index = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
    addItem(
      index,
      item.menu_id,
      item.name,
      item.price,
      1,
      table_id,
      item?.icon_name
    ).then(() => {});
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

  const Card = ({item, t}) => {
    return (
      <Stack
        blue={selectedItem?.menu_id === item.menu_id}
        flex={1}
        backgroundColor={item?.color_code}
        borderRadius={16}
        padding={12}
        marginVertical={4}
        marginHorizontal={4}
        shadowColor="black"
        shadowOffset={{width: 0, height: 1}}
        shadowOpacity={0.1}
        shadowRadius={2}
        elevation={3}
        status={item?.color_code}
        vertical
        onTouchStart={() => handleTouchStart(item)}>
        {/* <StyledShape
          size={48}
          backgroundColor={t.bgPage}
          justifyContent="center"
          alignItems="center"
          cycle
          marginHorizontal={4}
          padding={4}>
          <PosIcon
            name={item?.icon_name}
            size={32}
            color={item?.color_code || t.textSecondary}
          />
        </StyledShape> */}

        {selectedItem?.menu_id === item.menu_id && (
          <StyledIcon
            position="absolute"
            right={1}
            top={1}
            name="check-circle"
            size={32}
            color={theme.colors.blue[500]}
          />
        )}

        <StyledText
          fontFamily={fontStyles.Roboto_Regular}
          fontSize={theme.fontSize.medium}
          fontWeight={theme.fontWeight.medium}
          color={t.textPrimary}>
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
        data={data}
        keyExtractor={item => item.menu_id}
        scrollEnabled={false}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => <Card key={item.menu_id} item={item} 
                        t={t}/>}
      />
    </ScrollView>
  );
}
