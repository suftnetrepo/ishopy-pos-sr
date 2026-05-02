import React from 'react';
import {
  StyledSpacer,
  Stack,
  StyleShape,
} from 'fluent-styles';
import {Text} from '../../../components/text';
import {StyledIcon} from '../../../components/package/icon';
import {ScrollView} from 'react-native';
import {useQueryPopularMenuItems} from '../../../hooks/useOrderItems';
import PosIcon from '../../pos-icon';
import {useAppContext} from '../../../hooks/appContext';
import EmptyView from '@components/utils/empty';
import {useAppTheme} from '../../../theme';


const PopularDishes = () => {
  const {shop} = useAppContext();
  const {t} = useAppTheme();
  const {data} = useQueryPopularMenuItems();

  return (
    <Stack
      vertical
      borderRadius={8}
      backgroundColor={t.bgCard}
      paddingHorizontal={24}
      paddingVertical={24}
      justifyContent="flex-start"
      alignItems="flex-start">
      <Stack
        horizontal
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        gap={8}>
        <Text
          color={t.textPrimary}
          variant="title">
          {shop?.mode === 'shop' ? 'Popular Items ' : 'Popular Dishes '}
        </Text>
        <StyledIcon size={24} name="share" color={t.textMuted} />
      </Stack>

      <StyledSpacer
        borderWidth={0.4}
        borderColor={t.textMuted}
        width={'100%'}
        marginVertical={8}
      />

      {data.length === 0 ? (
        <>
          <Stack
            width="100%" vertical alignItems="center" justifyContent="center"
            paddingVertical={24} gap={12}
            backgroundColor={t.bgCard} borderRadius={12}>
            <Text fontSize={32}>📢</Text>
            <Text
              variant="title"
              color={t.textPrimary}>
              Nothing here yet
            </Text>
            <Text variant="caption" color={t.textSecondary} textAlign="center">
              Popular dishes will appear here.
            </Text>
          </Stack>
        </>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            {data?.map((dish, index) => (
              <Stack
                key={index}
                horizontal
                width="100%"
                flexWrap="wrap"
                justifyContent="flex-start"
                alignItems="center"
                gap={4}
                marginBottom={16}>
                {/* Icon box with color */}
                <StyleShape
                  size={48}
                  borderRadius={10}
                  backgroundColor={t.bgPage}
                  alignItems="center"
                  justifyContent="center">
                  <PosIcon
                    name={dish?.menu_icon_name}
                    size={24}
                    color={t.textSecondary}
                  />
                </StyleShape>

                <Stack vertical>
                  <Text
                    color={t.textSecondary}
                    variant="body"
                    marginLeft={2}>
                    {dish.menu_name}
                  </Text>
                  <Stack
                    horizontal
                    justifyContent="flex-start"
                    alignItems="center"
                    gap={4}>
                    <Text
                      color={t.textMuted}
                      variant="caption"
                      marginLeft={2}>
                      Orders:
                    </Text>
                    <Text
                      color={t.successColor}
                      variant="label"
                      marginLeft={5}>
                      {dish.order_count || 0}
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

export default PopularDishes;
