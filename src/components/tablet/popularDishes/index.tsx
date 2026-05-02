import React from 'react';
import {
  StyledSpacer,
  Stack,
  StyleShape,
  StyledDivider,
} from 'fluent-styles';
import Text from '../../../components/text';
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
        gap={12}>
        <Text
          color={t.textPrimary}
          variant="title">
          {shop?.mode === 'shop' ? 'Popular Items ' : 'Popular Dishes '}
        </Text>
        <StyledIcon size={24} name="share" color={t.textMuted} />
      </Stack>

      <StyledSpacer
        borderWidth={1}
        borderColor={t.borderDefault}
        width={'100%'}
        marginVertical={12}
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
                justifyContent="flex-start"
                alignItems="center"
                gap={12}
                marginBottom={16}>
                {/* Icon box */}
                <StyleShape
                  size={36}
                  borderRadius={30}
                  backgroundColor={t.bgPage}
                  alignItems="center"
                  justifyContent="center">
                  <PosIcon
                    name={dish?.menu_icon_name}
                    size={15}
                    color={t.brandPrimary}
                  />
                </StyleShape>

                {/* Text content */}
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
                      Orders:
                    </Text>
                    <Text
                      color={t.successColor}
                      variant="caption">
                      {dish?.order_count || 0}
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
