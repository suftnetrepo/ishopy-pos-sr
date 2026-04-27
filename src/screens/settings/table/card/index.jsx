import React from 'react';
import {
  YStack,
  XStack,
  Stack,
  StyledCycle,
  StyledSpacer,
  StyledText,
} from 'fluent-styles';
import {theme, fontStyles} from '../../../../configs/theme';
import {StyledMIcon} from '../../../../components/icon';
import {FlatList} from 'react-native';
import {toWordCase} from '../../../../utils/help';

const TableCard = ({onTableChange, onTableDelete, data}) => {
  const RenderCard = ({item}) => {
    return (
      <Stack
        horizontal
        flex={1}
        status={
          item.status === 1 ? theme.colors.green[600] : theme.colors.red[400]
        }
        paddingHorizontal={8}
        backgroundColor={theme.colors.gray[1]}
        paddingVertical={8}
        justifyContent="flex-start"
        marginHorizontal={4}
        marginBottom={8}
        borderRadius={16}
        alignItems="center">
        <YStack flex={2}>
          <StyledText
            paddingHorizontal={8}
            fontFamily={fontStyles.FontAwesome5_Regular}
            fontWeight={theme.fontWeight.medium}
            fontSize={theme.fontSize.normal}
            color={theme.colors.gray[800]}>
            {toWordCase(item.tableName)}
          </StyledText>
          <StyledText
            paddingHorizontal={8}
            fontFamily={fontStyles.FontAwesome5_Regular}
            fontWeight={theme.fontWeight.normal}
            fontSize={theme.fontSize.small}
            color={theme.colors.gray[600]}>
            Size {item.size}
          </StyledText>
        </YStack>
        <XStack flex={1} justifyContent="flex-end" alignItems="center">
          <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon
              size={24}
              name="edit"
              color={theme.colors.gray[600]}
              onPress={() =>
                onTableChange({
                  data: item,
                  tag: 'Edit',
                })
              }
            />
          </StyledCycle>
          <StyledSpacer marginHorizontal={4} />
          <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon
              size={32}
              name="delete-outline"
              color={theme.colors.gray[600]}
              onPress={() => {
                onTableDelete(item?.table_id);
              }}
            />
          </StyledCycle>
        </XStack>
      </Stack>
    );
  };

  return (
    <>
      <FlatList
        data={data}
        initialNumToRender={100}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.table_id}
        numColumns={3}
        renderItem={({item, index}) => {
          return <RenderCard item={item} key={index} />;
        }}
      />
    </>
  );
};

export default TableCard;
