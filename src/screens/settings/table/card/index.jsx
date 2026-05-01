/* eslint-disable prettier/prettier */
import React from 'react';
import {FlatList} from 'react-native';
import {StyledText, StyledSpacer, StyledPressable, Stack} from 'fluent-styles';
import {theme} from '../../../../configs/theme';
import {StyledIcon} from '../../../../components/package/icon';
import {toWordCase} from '../../../../utils/help';

// ─── Location pill config ─────────────────────────────────────────────────────
const LOCATION_STYLE = {
  'Bar':      {bg: '#f3e8ff', color: '#7c3aed'},
  'Takeaway': {bg: '#fef3c7', color: '#b45309'},
  'Dine In':  {bg: '#f4f4f5', color: '#71717a'},
};

const getLocationStyle = loc =>
  LOCATION_STYLE[loc] || LOCATION_STYLE['Dine In'];

// ─── Table card ───────────────────────────────────────────────────────────────
const TableCard = ({onTableChange, onTableDelete, data}) => {
  const RenderCard = ({item}) => {
    const isActive    = item.status === 1;
    const location    = item.location || 'Dine In';
    const locStyle    = getLocationStyle(location);
    const borderColor = isActive ? theme.colors.green[400] : theme.colors.red[300];

    return (
      <Stack
        flex={1}
        vertical
        borderRadius={12}
        backgroundColor={theme.colors.gray[1]}
        marginHorizontal={4}
        marginBottom={8}
        paddingHorizontal={14}
        paddingVertical={12}>

        {/* Top row: name + location pill */}
        <Stack horizontal alignItems="center" justifyContent="space-between" marginBottom={4}>
          <StyledText
            fontSize={theme.fontSize.normal}
            fontWeight={theme.fontWeight.normal}
            color={theme.colors.gray[800]}
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
          <StyledText fontSize={theme.fontSize.small} color={theme.colors.gray[400]}>
            Size {item.size}
          </StyledText>
          <Stack width={4} height={4} borderRadius={2} backgroundColor={theme.colors.gray[300]} />
          <Stack horizontal alignItems="center" gap={4}>
            <Stack
              width={6} height={6} borderRadius={3}
              backgroundColor={isActive ? theme.colors.green[500] : theme.colors.red[400]}
            />
            <StyledText
              fontSize={theme.fontSize.small}
              color={isActive ? theme.colors.green[600] : theme.colors.red[500]}>
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
            borderColor={theme.colors.gray[200]}
            backgroundColor={theme.colors.gray[50]}
            borderRadius={8}
            paddingVertical={7}>
            <StyledIcon name="edit" size={14} color={theme.colors.gray[500]} />
            <StyledText fontSize={theme.fontSize.small} color={theme.colors.gray[500]}>
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
            borderColor={theme.colors.red[200]}
            backgroundColor={theme.colors.red[50]}
            borderRadius={8}
            paddingVertical={7}>
            <StyledIcon name="delete-outline" size={14} color={theme.colors.red[500]} />
            <StyledText fontSize={theme.fontSize.small} color={theme.colors.red[500]}>
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
      renderItem={({item, index}) => <RenderCard item={item} key={index} />}
    />
  );
};

export default TableCard;