import React from 'react';
import {
  StyledSpacer,
  Stack,
  StyleShape,
} from 'fluent-styles';
import Text from '../../../components/text';
import {StyledIcon} from '../../../components/package/icon';
import {useQueryPopularMenuItems} from '../../../hooks/useOrderItems';
import ItemIcon from '../../item-icon';
import {useAppContext} from '../../../hooks/appContext';
import {useAppTheme} from '../../../theme';
import {convertJsonToCsv} from '../../../utils/convertJsonToCsv';

const VISIBLE_COUNT = 5;

const PopularDishes = () => {
  const {shop} = useAppContext();
  const {t} = useAppTheme();
  const {data} = useQueryPopularMenuItems();
  const visibleData = data?.slice(0, VISIBLE_COUNT) || [];
  const isShop = shop?.mode === 'shop';

  const handleShare = async () => {
    if (!data?.length) return;
    await convertJsonToCsv(
      data.map(dish => ({
        [isShop ? 'Item' : 'Dish']: dish?.menu_name || '',
        Orders: dish?.order_count || 0,
      })),
    );
  };

  return (
    <Stack
      vertical
      borderRadius={16}
      borderWidth={1}
      borderColor={t.borderDefault}
      backgroundColor={t.bgCard}
      paddingHorizontal={16}
      paddingVertical={12}
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
        paddingVertical={6}
        paddingHorizontal={0}
        gap={10}>
        <Text
          color={t.textPrimary}
          variant="title">
          {isShop ? 'Popular Items ' : 'Popular Dishes '}
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

      {data.length === 0 ? (
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
            No popular items yet
          </Text>
          <Text variant="caption" color={t.textMuted} textAlign="center" style={{fontSize: 11}}>
            Orders will show trending items
          </Text>
        </Stack>
      ) : (
        <>
            {visibleData.map((dish, index) => {
              // Extract icon colour from item data with fallback chain
              const iconColor = dish?.color_code || t.brandPrimary;
              
              return (
              <React.Fragment key={index}>
                <Stack
                  horizontal
                  width="100%"
                  justifyContent="flex-start"
                  alignItems="center"
                  gap={12}
                  paddingVertical={8}>
                  {/* Icon box */}
                  <StyleShape
                    size={44}
                    borderRadius={14}
                    backgroundColor={iconColor ? `${iconColor}18` : t.bgInput}
                    alignItems="center"
                    justifyContent="center">
                    <ItemIcon
                      iconName={dish?.menu_icon_name}
                      color={iconColor}
                      size={20}
                    />
                  </StyleShape>

                  {/* Text content */}
                  <Stack vertical gap={3}>
                    <Text
                      color={t.textPrimary}
                      variant="body"
                      fontWeight="600">
                      {dish?.menu_name}
                    </Text>
                    <Stack horizontal gap={4} alignItems="center">
                      <Text
                        color={t.textSecondary}
                        variant="caption">
                        Orders:
                      </Text>
                      <Text
                        color={t.successColor}
                        variant="caption"
                        fontWeight="600">
                        {dish?.order_count || 0}
                      </Text>
                    </Stack>
                  </Stack>
                </Stack>
                {index < visibleData.length - 1 && (
                  <Stack
                  horizontal
                    width="80%"
                    height={1}
                    backgroundColor={`${t.borderDefault}`}
                    marginLeft={56}
                  />
                )}
              </React.Fragment>
            );
            })}
    
        </>
      )}
    </Stack>
  );
};

export default PopularDishes;
