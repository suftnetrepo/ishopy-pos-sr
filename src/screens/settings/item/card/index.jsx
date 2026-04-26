import React, {useState, useEffect} from 'react';
import {
  YStack,
  theme,
  XStack,
  Stack,
  StyledPressable,
  StyledConfirmDialog,
  StyledCycle,
  StyledSpinner,
  StyledOkDialog,
  StyledSpacer,
  StyledText,
} from 'fluent-styles';
import {Box, Text} from '@gluestack-ui/themed';
import {fontStyles} from '../../../../configs/theme';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyledMIcon} from '../../../../components/icon';
import {useMenus, useDeleteMenu} from '../../../../hooks/useMenu';
import {FlatList, Pressable, ScrollView} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {formatCurrency, toWordCase} from '../../../../utils/help';
import {useCategories} from '../../../../hooks/useCategory';
import {useAppContext} from '../../../../hooks/appContext';

const ItemCard = ({
  onItemChange,
  onItemDelete,
  onAddonChange,
  flag = false,
  shop,
}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const {menuQuery} = useAppContext();
  const [state, setState] = useState('All');
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

  useEffect(() => {
    freeTextSearch(menuQuery);
  }, [menuQuery]);

  const handleFilter = async category => {
    setState(category.category_id);
    if (category.category_id === 'All') {
      restoreMenus();
      return;
    }

    await filterMenus(category.category_id);
  };

  const renderRightActions = item => (
    <XStack
      alignItems="center"
      justifyContent="center"
      height="100%"
      paddingRight={8}>
      <StyledPressable
        onPress={() => {
          onItemDelete(item.menu_id);
        }}
        backgroundColor={theme.colors.red[500]}
        borderRadius={16}
        zIndex={9999}
        padding={12}>
        <StyledMIcon
          pointerEvents="none"
          size={28}
          name="delete-outline"
          color={theme.colors.white}
        />
      </StyledPressable>
    </XStack>
  );

  const RenderCard = ({item}) => {
    return (
      <Swipeable
        containerStyle={{flex: 1}}
        renderRightActions={() => renderRightActions(item)}>
        <Stack
          horizontal
          marginHorizontal={4}
          flex={1}
          status={
            item.status === 1 ? theme.colors.green[600] : theme.colors.red[400]
          }
          paddingHorizontal={8}
          backgroundColor={theme.colors.gray[1]}
          paddingVertical={8}
          justifyContent="flex-start"
          marginBottom={8}
          borderRadius={16}
          alignItems="center">
          <YStack flex={2}>
            <StyledText
              paddingHorizontal={8}
              fontFamily={fontStyles.Roboto_Regular}
              fontWeight={theme.fontWeight.normal}
              fontSize={theme.fontSize.small}
              color={theme.colors.gray[700]}>
              {toWordCase(item.name)}
            </StyledText>
            <StyledSpacer marginVertical={1} />
            <StyledText
              paddingHorizontal={8}
              fontFamily={fontStyles.Roboto_Regular}
              fontSize={theme.fontSize.small}
              fontWeight={theme.fontWeight.medium}
              color={theme.colors.gray[500]}>
              {formatCurrency(shop?.currency || '£', item.price)}
            </StyledText>
          </YStack>
          <XStack flex={1} justifyContent="flex-end" alignItems="center">
            <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
              <StyledMIcon
                size={24}
                name="edit"
                color={theme.colors.gray[600]}
                onPress={() =>
                  onItemChange({
                    data: item,
                    tag: 'Edit',
                  })
                }
              />
            </StyledCycle>
            <StyledSpacer marginHorizontal={4} />
            {shop?.mode === 'restaurant' && (
              <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
                <MIcon
                  size={24}
                  name="bowl-mix"
                  color={theme.colors.gray[600]}
                  onPress={() => {
                    onAddonChange(item);
                  }}
                />
              </StyledCycle>
            )}
          </XStack>
        </Stack>
      </Swipeable>
    );
  };

  return (
    <>
      <Stack gap={8} horizontal>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[{category_id: 'All', name: 'All'}, ...categories].map(category => {
            const isActive = category.category_id === state;
            return (
              <Pressable
                key={category.category_id}
                onPress={async () => {
                  await handleFilter(category);
                }}>
                <Box
                  px="$4"
                  py="$2"
                  marginHorizontal={4}
                  marginBottom={4}
                  borderRadius="$full"
                  bg={isActive ? '$green600' : '$gray200'}>
                  <Text color={isActive ? '$white' : '$black'} fontWeight="300">
                    {category.name}
                  </Text>
                </Box>
              </Pressable>
            );
          })}
        </ScrollView>
      </Stack>
      <FlatList
        data={data}
        initialNumToRender={100}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.menu_id}
        numColumns={3}
        renderItem={({item, index}) => {
          return <RenderCard item={item} key={index} />;
        }}
      />
      {(error || deleteError) && (
        <StyledOkDialog
          title={error?.message || deleteError?.message}
          description="please try again"
          visible={true}
          onOk={() => {
            resetHandler();
          }}
        />
      )}
      {loading && <StyledSpinner />}
      {isDialogVisible && (
        <StyledConfirmDialog
          visible
          description="Are you sure you want to delete this Item?"
          confirm="Yes"
          cancel="No"
          title={'Confirmation'}
          onCancel={() => setIsDialogVisible(false)}
          onConfirm={() => onConfirm()}
        />
      )}
    </>
  );
};

export default ItemCard;
