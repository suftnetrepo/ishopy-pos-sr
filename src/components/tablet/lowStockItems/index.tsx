import React from 'react';
import {StyledSkeleton, StyledSpacer} from 'fluent-styles';
import {Stack} from '../../../components/package/stack';
import Text from '../../../components/text';
import {StyledIcon} from '../../../components/package/icon';
import {ScrollView} from 'react-native';
import {useQueryGetLowerStock} from '../../../hooks/useStock';
import ItemIcon from '../../../components/item-icon';
import {useAppTheme} from '../../../theme';
import {convertJsonToCsv} from '../../../utils/convertJsonToCsv';

const VISIBLE_COUNT = 5;

const LowStockItems = () => {
  const {t} = useAppTheme();
  const {data} = useQueryGetLowerStock();
  const visibleData = data?.slice(0, VISIBLE_COUNT) || [];

  const handleShare = async () => {
    if (!data?.length) return;
    await convertJsonToCsv(
      data.map(item => ({
        Item: item?.menu_name || '',
        'Stock Available': item?.current_stock || 0,
      })),
    );
  };

  return (
    <Stack
      vertical
      width={'100%'}
      borderRadius={16}
      borderWidth={1}
      borderColor={t.borderDefault}
      backgroundColor={t.bgCard}
      paddingHorizontal={16}
      paddingVertical={16}
      justifyContent="flex-start"
      alignItems="flex-start"
      shadowColor="#000"
      shadowOpacity={0.06}
      shadowRadius={12}
      elevation={3}>
      <Stack
        horizontal
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        gap={10}>
        <Text
          color={t.textPrimary}
          variant="title">
          Low Stock Items
        </Text>
        <StyledIcon
          size={24}
          name="share"
          color={data?.length ? t.brandPrimary : t.textMuted}
          onPress={handleShare}
        />
      </Stack>
      <StyledSpacer
        borderWidth={1}
        borderColor={`${t.borderDefault}33`}
        width={'100%'}
        marginVertical={8}
      />

      {data?.length === 0 ? (
        <Stack
          width="100%"
          vertical
          alignItems="center"
          justifyContent="center"
          paddingVertical={10}
          gap={6}
          backgroundColor={t.bgPage}
          borderRadius={0}>
          <Stack
            width={44}
            height={44}
            borderRadius={22}
            backgroundColor={t.bgInput}
            alignItems="center"
            justifyContent="center">
            <StyledIcon name="notifications-none" size={22} color={t.textMuted} />
          </Stack>
          <Text
            variant="subLabel"
            color={t.textSecondary}
            style={{fontWeight: '500'}}>
            Inventory healthy
          </Text>
          <Text variant="caption" color={t.textMuted} textAlign="center" style={{fontSize: 11}}>
            Low stock alerts appear here
          </Text>
        </Stack>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            {visibleData.map((dish, index) => (
              <Stack
                key={index}
                horizontal
                width="100%"
                justifyContent="flex-start"
                alignItems="center"
                gap={12}
                marginBottom={16}>
                <ItemIcon
                  iconName={dish?.icon_name}
                  color={dish?.color_code || t.brandPrimary}
                  size={22}
                />
                <Stack vertical>
                  <Text
                    color={t.textPrimary}
                    variant="label">
                    {dish?.menu_name}
                  </Text>
                  <Stack horizontal gap={4} alignItems="center">
                    <Text
                      color={t.textSecondary}
                      variant="caption">
                      Available:
                    </Text>
                    <Text
                      color={t.successColor}
                      variant="caption">
                      {dish?.current_stock || 0}
                    </Text>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </ScrollView>
        </>
      )}
    </Stack>
  );
};

export default LowStockItems;
