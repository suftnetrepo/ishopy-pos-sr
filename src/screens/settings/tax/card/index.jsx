/* eslint-disable prettier/prettier */
import React from 'react';
import {FlatList} from 'react-native';
import {StyledPressable, Stack} from 'fluent-styles';
import Text from '../../../../components/text';
import {theme} from '../../../../configs/theme';
import {StyledIcon} from '../../../../components/package/icon';
import {toWordCase} from '../../../../utils/help';
import {useAppTheme} from '../../../../theme';

const RenderCard = ({item, onEdit, onDelete, t}) => {
  const isActive = item.status === 1;
  return (
    <Stack
      flex={1} vertical borderRadius={12}
      backgroundColor={t.bgCard}
      marginHorizontal={4} marginBottom={8} paddingHorizontal={14} paddingVertical={12}>
      <Stack horizontal alignItems="center" justifyContent="space-between" marginBottom={4}>
        <Text
          variant="label"
          color={t.textPrimary} flex={1} numberOfLines={1}>
          {toWordCase(item.name)}
        </Text>
        <Stack horizontal alignItems="center" gap={4}>
          <Stack width={6} height={6} borderRadius={3}
            backgroundColor={isActive ? t.successColor : t.dangerColor} />
          <Text variant="caption" color={isActive ? t.successColor : t.dangerColor}>
            {isActive ? 'Active' : 'Inactive'}
          </Text>
        </Stack>
      </Stack>
      <Text variant="label" color={t.textSecondary} marginBottom={12}>
        {item.rate}%
      </Text>
      <Stack horizontal gap={8}>
        <StyledPressable
          flex={1} onPress={onEdit}
          flexDirection="row" alignItems="center" justifyContent="center" gap={4}
          borderWidth={1} borderColor={t.borderDefault}
          backgroundColor={t.bgPage} borderRadius={8} paddingVertical={7}>
          <StyledIcon name="edit" size={14} color={t.textSecondary} />
          <Text variant="button" color={t.textSecondary}>Edit</Text>
        </StyledPressable>
        <StyledPressable
          flex={1} onPress={onDelete}
          flexDirection="row" alignItems="center" justifyContent="center" gap={4}
          borderWidth={1} borderColor={t.dangerBg}
          backgroundColor={t.dangerBg} borderRadius={8} paddingVertical={7}>
          <StyledIcon name="delete-outline" size={14} color={t.dangerColor} />
          <Text variant="button" color={t.dangerColor}>Delete</Text>
        </StyledPressable>
      </Stack>
    </Stack>
  );
};

const TaxCard = ({data, onTaxChange, onTaxDelete}) => {
  const {t} = useAppTheme();
  return (
    <FlatList
      data={data} initialNumToRender={100}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.tax_id}
      numColumns={3}
      renderItem={({item, index}) => (
        <RenderCard key={index} item={item}
          onEdit={() => onTaxChange({data: item, tag: 'Edit'})}
          onDelete={() => onTaxDelete(item?.tax_id)}
          t={t}
        />
      )}
    />
  );
};

export default TaxCard;