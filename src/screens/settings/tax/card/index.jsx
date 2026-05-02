/* eslint-disable prettier/prettier */
import React from 'react';
import {FlatList} from 'react-native';
import {StyledPressable, Stack} from 'fluent-styles';
import Text from '../../../../components/text';
import {theme} from '../../../../configs/theme';
import {StyledIcon} from '../../../../components/package/icon';
import {toWordCase} from '../../../../utils/help';
import {useAppTheme} from '../../../../theme';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const RenderCard = ({item, onEdit, onDelete, t}) => {
  const isActive = item.status === 1;
  
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
        borderWidth={1}
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
            {toWordCase(item.name)}
          </Text>

          {/* Metadata Row: Status Pill + Rate */}
          <Stack horizontal alignItems="center" gap={10}>
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

            {/* Rate Value */}
            <Text
              variant="body"
              color={t.textSecondary}>
              {item.rate}%
            </Text>
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
              onDelete();
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
              name="trash-can-outline"
              color={t.textMuted}
            />
          </StyledPressable>
        </Stack>
      </Stack>
    </StyledPressable>
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