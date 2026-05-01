/* eslint-disable prettier/prettier */
import React from 'react';
import {FlatList} from 'react-native';
import {StyledText, StyledPressable, Stack} from 'fluent-styles';
import {theme} from '../../../../configs/theme';
import {StyledIcon} from '../../../../components/package/icon';
import {toWordCase} from '../../../../utils/help';
import {useAppTheme} from '../../../../theme';

const RenderCard = ({item, user_id, onEdit, onDelete, t}) => {
  const isActive = item.status === 1;
  const isSelf   = item.user_id === user_id;
  return (
    <Stack
      flex={1} vertical borderRadius={12}
      backgroundColor={t.bgCard}
      marginHorizontal={4} marginBottom={8} paddingHorizontal={14} paddingVertical={12}>
      <Stack horizontal alignItems="center" justifyContent="space-between" marginBottom={4}>
        <StyledText
          fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.normal}
          color={t.textPrimary} flex={1} numberOfLines={1}>
          {toWordCase(item.first_name)} {toWordCase(item.last_name)}
        </StyledText>
        <Stack horizontal alignItems="center" gap={4}>
          <Stack width={6} height={6} borderRadius={3}
            backgroundColor={isActive ? t.successColor : t.dangerColor} />
          <StyledText fontSize={10} color={isActive ? t.successColor : t.dangerColor}>
            {isActive ? 'Active' : 'Inactive'}
          </StyledText>
        </Stack>
      </Stack>
      <StyledText fontSize={theme.fontSize.small} color={t.textSecondary} marginBottom={12}>
        {item.role || 'Staff'}
      </StyledText>
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
          flex={1} onPress={isSelf ? undefined : onDelete}
          flexDirection="row" alignItems="center" justifyContent="center" gap={4}
          borderWidth={1}
          borderColor={isSelf ? t.bgPage : t.dangerBg}
          backgroundColor={isSelf ? t.bgPage : t.dangerBg}
          borderRadius={8} paddingVertical={7}
          opacity={isSelf ? 0.4 : 1}>
          <StyledIcon name="delete-outline" size={14} color={isSelf ? t.textMuted : t.dangerColor} />
          <StyledText fontSize={theme.fontSize.small} color={isSelf ? t.textMuted : t.dangerColor}>
            {isSelf ? 'You' : 'Delete'}
          </StyledText>
        </StyledPressable>
      </Stack>
    </Stack>
  );
};

const UserCard = ({data, user_id, onUserChange, onUserDelete}) => {
  const {t} = useAppTheme();
  return (
    <FlatList
      data={data} initialNumToRender={100}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.user_id}
      numColumns={3}
      renderItem={({item, index}) => (
        <RenderCard key={index} item={item} user_id={user_id}
          onEdit={() => onUserChange({data: item, tag: 'Edit'})}
          onDelete={() => onUserDelete && onUserDelete(item.user_id)}
          t={t}
        />
      )}
    />
  );
};

export default UserCard;