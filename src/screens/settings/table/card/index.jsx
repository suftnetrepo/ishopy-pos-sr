/* eslint-disable prettier/prettier */
import React from 'react';
import {FlatList} from 'react-native';
import {StyledText, StyledSpacer, StyledPressable, Stack} from 'fluent-styles';
import {theme} from '../../../../configs/theme';
import {StyledIcon} from '../../../../components/package/icon';
import {toWordCase} from '../../../../utils/help';
import {useAppTheme} from '../../../../theme';

// ─── Location pill config with theme-aware tokens ────────────────
const getLocationStyle = (loc, t) => {
  const styles = {
    'Bar':      { bg: t.colors?.purple[50] || '#faf5ff',  color: t.colors?.purple[600] || '#9333ea' },
    'Takeaway': { bg: t.colors?.amber[50] || '#fffbeb',   color: t.colors?.amber[700] || '#b45309' },
    'Dine In':  { bg: t.bgInput, color: t.textSecondary },
  };
  return styles[loc] || styles['Dine In'];
};

// ─── Table card ───────────────────────────────────────────────────────────────
const TableCard = ({onTableChange, onTableDelete, data}) => {
  const {t} = useAppTheme();
  const RenderCard = ({item, t}) => {
    const isActive    = item.status === 1;
    const location    = item.location || 'Dine In';
    const locStyle    = getLocationStyle(location, t);
    const borderColor = isActive ? t.successColor : t.dangerBg;

    return (
      <Stack
        flex={1}
        vertical
        borderRadius={12}
        backgroundColor={t.bgCard}
        marginHorizontal={4}
        marginBottom={8}
        paddingHorizontal={14}
        paddingVertical={12}>

        {/* Top row: name + location pill */}
        <Stack horizontal alignItems="center" justifyContent="space-between" marginBottom={4}>
          <StyledText
            fontSize={theme.fontSize.normal}
            fontWeight={theme.fontWeight.normal}
            color={t.textPrimary}
            flex={1}
            numberOfLines={1}>
            {toWordCase(item.tableName)}
          </StyledText>
          {location !== 'Dine In' && (
            <Stack
              paddingHorizontal={8} paddingVertical={3}
              borderRadius={20}
              backgroundColor={locStyle.bg}>
              <StyledText fontSize={10} fontWeight={theme.fontWeight.medium} color={locStyle.color}>
                {location}
              </StyledText>
            </Stack>
          )}
        </Stack>

        {/* Size + status */}
        <Stack horizontal alignItems="center" gap={8} marginBottom={12}>
          <StyledText fontSize={theme.fontSize.small} color={t.textMuted}>
            Size {item.size}
          </StyledText>
          <Stack width={4} height={4} borderRadius={2} backgroundColor={t.textMuted} />
          <Stack horizontal alignItems="center" gap={4}>
            <Stack
              width={6} height={6} borderRadius={3}
              backgroundColor={isActive ? t.successColor : t.dangerColor}
            />
            <StyledText
              fontSize={theme.fontSize.small}
              color={isActive ? t.successColor : t.dangerColor}>
              {isActive ? 'Active' : 'Inactive'}
            </StyledText>
          </Stack>
        </Stack>

        {/* Action buttons */}
        <Stack horizontal gap={8}>
          <StyledPressable
            flex={1}
            onPress={() => onTableChange({data: item, tag: 'Edit'})}
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap={4}
            borderWidth={1}
            borderColor={t.borderDefault}
            backgroundColor={t.bgPage}
            borderRadius={8}
            paddingVertical={7}>
            <StyledIcon name="edit" size={14} color={t.textSecondary} />
            <StyledText fontSize={theme.fontSize.small} color={t.textSecondary}>
              Edit
            </StyledText>
          </StyledPressable>

          <StyledPressable
            flex={1}
            onPress={() => onTableDelete(item?.table_id)}
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap={4}
            borderWidth={1}
            borderColor={t.dangerBg}
            backgroundColor={t.dangerBg}
            borderRadius={8}
            paddingVertical={7}>
            <StyledIcon name="delete-outline" size={14} color={t.dangerColor} />
            <StyledText fontSize={theme.fontSize.small} color={t.dangerColor}>
              Delete
            </StyledText>
          </StyledPressable>
        </Stack>
      </Stack>
    );
  };

  return (
    <FlatList
      data={data}
      initialNumToRender={100}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.table_id}
      numColumns={3}
      renderItem={({item, index}) => <RenderCard item={item} key={index} 
                        t={t}/>}
    />
  );
};

export default TableCard;