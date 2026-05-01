import React from 'react';
import {
  StyledText,
  StyledSpacer,
  Stack,
  StyleShape,
} from 'fluent-styles';
import {theme} from '../../../utils/theme';
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
        <StyledText
          color={t.textPrimary}
          fontSize={theme.fontSize.large}
          fontWeight={theme.fontWeight.normal as any}>
          {shop?.mode === 'shop' ? 'Popular Items ' : 'Popular Dishes '}
        </StyledText>
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
            <StyledText fontSize={32}>📢</StyledText>
            <StyledText
              fontSize={theme.fontSize.normal}
              fontWeight={theme.fontWeight.semiBold as any}
              color={t.textPrimary}>
              Nothing here yet
            </StyledText>
            <StyledText fontSize={theme.fontSize.small} color={t.textSecondary} textAlign="center">
              Popular dishes will appear here.
            </StyledText>
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
                  <StyledText
                    color={t.textSecondary}
                    fontSize={16}
                    fontWeight={theme.fontWeight.normal as any}
                    marginLeft={2}>
                    {dish.menu_name}
                  </StyledText>
                  <Stack
                    horizontal
                    justifyContent="flex-start"
                    alignItems="center"
                    gap={4}>
                    <StyledText
                      color={t.textMuted}
                      fontSize={14}
                      fontWeight={theme.fontWeight.normal as any}
                      marginLeft={2}>
                      Orders:
                    </StyledText>
                    <StyledText
                      color={theme.colors.green[800]}
                      fontSize={14}
                      fontWeight={theme.fontWeight.semiBold as any}
                      marginLeft={5}>
                      {dish.order_count || 0}
                    </StyledText>
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
