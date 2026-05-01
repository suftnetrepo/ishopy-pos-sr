/* eslint-disable prettier/prettier */
import React from 'react';
import {FlatList} from 'react-native';
import {StyledText, StyledPressable, Stack} from 'fluent-styles';
import {theme} from '../../../../configs/theme';
import {StyledIcon} from '../../../../components/package/icon';
import {toWordCase} from '../../../../utils/help';
import {useAppTheme} from '../../../../theme';

const RenderCard = ({item, onEdit, onDelete, idKey, label, t}) => {
  const isActive = item.status === 1;
  return (
    <Stack
      flex={1} vertical borderRadius={12}
      backgroundColor={t.bgCard}
      marginHorizontal={4} marginBottom={8} paddingHorizontal={14} paddingVertical={12}>
      <Stack horizontal alignItems="center" justifyContent="space-between" marginBottom={10}>
        <StyledText
          fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.normal}
          color={t.textPrimary} flex={1} numberOfLines={1}>
          {label}
        </StyledText>
        <Stack horizontal alignItems="center" gap={4}>
          <Stack width={6} height={6} borderRadius={3}
            backgroundColor={isActive ? t.successColor : t.dangerColor} />
          <StyledText fontSize={10} color={isActive ? t.successColor : t.dangerColor}>
            {isActive ? 'Active' : 'Inactive'}
          </StyledText>
        </Stack>
      </Stack>
      <Stack horizontal gap={8}>
        <StyledPressable
          flex={1} onPress={onEdit}
          flexDirection="row" alignItems="center" justifyContent="center" gap={4}
          borderWidth={1} borderColor={t.borderDefault}
          backgroundColor={t.bgPage} borderRadius={8} paddingVertical={7}>
          <StyledIcon name="edit" size={14} color={t.textSecondary} />
          <StyledText fontSize={theme.fontSize.small} color={t.textSecondary}>Edit</StyledText>
        </StyledPressable>
        <StyledPressable
          flex={1} onPress={onDelete}
          flexDirection="row" alignItems="center" justifyContent="center" gap={4}
          borderWidth={1} borderColor={t.dangerBg}
          backgroundColor={t.dangerBg} borderRadius={8} paddingVertical={7}>
          <StyledIcon name="delete-outline" size={14} color={t.dangerColor} />
          <StyledText fontSize={theme.fontSize.small} color={t.dangerColor}>Delete</StyledText>
        </StyledPressable>
      </Stack>
    </Stack>
  );
};

const CategoryCard = ({onCategoryChange, onCategoryDelete, data}) => {
  const {t} = useAppTheme();
  return (
    <FlatList
      data={data} initialNumToRender={100}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.category_id}
      numColumns={3}
      renderItem={({item, index}) => (
        <RenderCard
          key={index} item={item}
          label={toWordCase(item.name)}
          onEdit={() => onCategoryChange({data: item, tag: 'Edit'})}
          onDelete={() => onCategoryDelete(item?.category_id)}
          t={t}
        />
      )}
    />
  );
};

export default CategoryCard;