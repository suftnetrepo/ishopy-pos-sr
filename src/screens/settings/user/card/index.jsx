/* eslint-disable prettier/prettier */
import React from 'react';
import {FlatList} from 'react-native';
import {StyledPressable, Stack} from 'fluent-styles';
import Text from '../../../../components/text';
import {toWordCase} from '../../../../utils/help';
import {useAppTheme} from '../../../../theme';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const RenderCard = ({item, user_id, onEdit, onDelete, t}) => {
  const isActive = item.status === 1;
  const isSelf = item.user_id === user_id;
  
  return (
    <StyledPressable
      onPress={onEdit}
      style={{flex: 1}}
      activeOpacity={0.7}>
      <Stack
        flex={1}
        horizontal
        borderRadius={18}
        backgroundColor={t.bgCard}
        borderWidth={0.2}
        borderColor={t.borderSubtle}
        marginHorizontal={4}
        marginBottom={12}
        paddingHorizontal={16}
        paddingVertical={16}
        shadowColor={t.textPrimary}
        shadowOffset={{width: 0, height: 1}}
        shadowOpacity={0.04}
        shadowRadius={3}
        elevation={1}
        gap={12}>

        {/* Left Content: Title + Metadata */}
        <Stack flex={1} vertical gap={8}>
          {/* Title */}
          <Text
            variant="label"
            color={t.textPrimary}
            numberOfLines={1}>
            {toWordCase(item.first_name)} {toWordCase(item.last_name)}
          </Text>

          {/* Metadata Row: Role + Status */}
          <Stack horizontal alignItems="center" gap={10}>
            {/* Role */}
            <Text
              variant="caption"
              color={t.textMuted}>
              {item.role || 'Staff'}
            </Text>

            {/* Status Pill */}
            <Stack
              paddingHorizontal={10}
              paddingVertical={4}
              borderRadius={999}
              backgroundColor={isActive ? `${t.successColor}15` : `${t.dangerColor}15`}>
              <Text
                variant="caption"
                color={isActive ? t.successColor : t.dangerColor}>
                {isActive ? 'Active' : 'Inactive'}
              </Text>
            </Stack>
          </Stack>
        </Stack>

        {/* Right Content: Action Icons */}
        <Stack horizontal alignItems="flex-start" gap={8}>
          {/* Edit Icon Button */}
          <StyledPressable
            onPress={(e) => {
              e.stopPropagation?.();
              onEdit();
            }}
            width={36}
            height={36}
            borderRadius={18}
            alignItems="center"
            justifyContent="center"
            backgroundColor="transparent"
            activeOpacity={0.6}>
            <MIcon
              pointerEvents="none"
              size={18}
              name="pencil"
              color={t.textMuted}
            />
          </StyledPressable>

          {/* Delete Icon Button */}
          <StyledPressable
            onPress={(e) => {
              e.stopPropagation?.();
              !isSelf && onDelete();
            }}
            width={36}
            height={36}
            borderRadius={18}
            alignItems="center"
            justifyContent="center"
            backgroundColor="transparent"
            activeOpacity={isSelf ? 1 : 0.6}
            opacity={isSelf ? 0.5 : 1}>
            <MIcon
              pointerEvents="none"
              size={18}
              name="trash-can-outline"
              color={t.textMuted}
            />
          </StyledPressable>
        </Stack>
      </Stack>
    </StyledPressable>
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