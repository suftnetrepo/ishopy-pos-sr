/* eslint-disable prettier/prettier */
import React from 'react';
import {FlatList} from 'react-native';
import {StyledPressable, Stack} from 'fluent-styles';
import Text from '../../../../components/text';
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
        <Text
          variant="label"
          color={t.textPrimary} flex={1} numberOfLines={1}>
          {toWordCase(item.first_name)} {toWordCase(item.last_name)}
        </Text>
        <Stack horizontal alignItems="center" gap={4}>
          <Stack width={6} height={6} borderRadius={3}
            backgroundColor={isActive ? t.successColor : t.dangerColor} />
          <Text variant="caption" color={isActive ? t.successColor : t.dangerColor}>
            {isActive ? 'Active' : 'Inactive'}
          </Text>
        </Stack>
      </Stack>
      <Text variant="body" color={t.textSecondary} marginBottom={12}>
        {item.role || 'Staff'}
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
          flex={1} onPress={isSelf ? undefined : onDelete}
          flexDirection="row" alignItems="center" justifyContent="center" gap={4}
          borderWidth={1}
          borderColor={isSelf ? t.bgPage : t.dangerBg}
          backgroundColor={isSelf ? t.bgPage : t.dangerBg}
          borderRadius={8} paddingVertical={7}
          opacity={isSelf ? 0.4 : 1}>
          <StyledIcon name="delete-outline" size={14} color={isSelf ? t.textMuted : t.dangerColor} />
          <Text variant="button" color={isSelf ? t.textMuted : t.dangerColor}>
            {isSelf ? 'You' : 'Delete'}
          </Text>
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