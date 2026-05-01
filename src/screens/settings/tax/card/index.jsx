/* eslint-disable prettier/prettier */
import React from 'react';
import {FlatList} from 'react-native';
import {StyledText, StyledPressable, Stack} from 'fluent-styles';
import {theme} from '../../../../configs/theme';
import {StyledIcon} from '../../../../components/package/icon';
import {toWordCase} from '../../../../utils/help';

const RenderCard = ({item, onEdit, onDelete}) => {
  const isActive = item.status === 1;
  return (
    <Stack
      flex={1} vertical borderRadius={12}
      backgroundColor={theme.colors.gray[1]}
      marginHorizontal={4} marginBottom={8} paddingHorizontal={14} paddingVertical={12}>
      <Stack horizontal alignItems="center" justifyContent="space-between" marginBottom={4}>
        <StyledText
          fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.normal}
          color={theme.colors.gray[800]} flex={1} numberOfLines={1}>
          {toWordCase(item.name)}
        </StyledText>
        <Stack horizontal alignItems="center" gap={4}>
          <Stack width={6} height={6} borderRadius={3}
            backgroundColor={isActive ? theme.colors.green[500] : theme.colors.red[400]} />
          <StyledText fontSize={10} color={isActive ? theme.colors.green[600] : theme.colors.red[500]}>
            {isActive ? 'Active' : 'Inactive'}
          </StyledText>
        </Stack>
      </Stack>
      <StyledText fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.bold}
        color={theme.colors.gray[600]} marginBottom={12}>
        {item.rate}%
      </StyledText>
      <Stack horizontal gap={8}>
        <StyledPressable
          flex={1} onPress={onEdit}
          flexDirection="row" alignItems="center" justifyContent="center" gap={4}
          borderWidth={1} borderColor={theme.colors.gray[200]}
          backgroundColor={theme.colors.gray[50]} borderRadius={8} paddingVertical={7}>
          <StyledIcon name="edit" size={14} color={theme.colors.gray[500]} />
          <StyledText fontSize={theme.fontSize.small} color={theme.colors.gray[500]}>Edit</StyledText>
        </StyledPressable>
        <StyledPressable
          flex={1} onPress={onDelete}
          flexDirection="row" alignItems="center" justifyContent="center" gap={4}
          borderWidth={1} borderColor={theme.colors.red[200]}
          backgroundColor={theme.colors.red[50]} borderRadius={8} paddingVertical={7}>
          <StyledIcon name="delete-outline" size={14} color={theme.colors.red[500]} />
          <StyledText fontSize={theme.fontSize.small} color={theme.colors.red[500]}>Delete</StyledText>
        </StyledPressable>
      </Stack>
    </Stack>
  );
};

const TaxCard = ({data, onTaxChange, onTaxDelete}) => (
  <FlatList
    data={data} initialNumToRender={100}
    showsVerticalScrollIndicator={false}
    keyExtractor={item => item.tax_id}
    numColumns={3}
    renderItem={({item, index}) => (
      <RenderCard key={index} item={item}
        onEdit={() => onTaxChange({data: item, tag: 'Edit'})}
        onDelete={() => onTaxDelete(item?.tax_id)}
      />
    )}
  />
);

export default TaxCard;