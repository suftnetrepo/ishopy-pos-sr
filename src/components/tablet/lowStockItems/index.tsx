import React from 'react';
import {StyledText, StyledSkeleton, StyledSpacer} from 'fluent-styles';
import {Stack} from '../../../components/package/stack';
import {theme} from '../../../utils/theme';
import {StyledIcon} from '../../../components/package/icon';
import {ScrollView} from 'react-native';
import {useQueryGetLowerStock} from '../../../hooks/useStock';
import {Icon} from '../icon/icon';
import {useAppTheme} from '../../../theme';

const LowStockItems = () => {
  const {t} = useAppTheme();
  const {data} = useQueryGetLowerStock();

  return (
    <Stack
      vertical
      width={'100%'}
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
          Low Stock Items
        </StyledText>
        <StyledIcon size={24} name="share" color={t.textMuted} />
      </Stack>
      <StyledSpacer
        borderWidth={0.5}
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
            <StyledText fontSize={32}>🔔</StyledText>
            <StyledText
              fontSize={theme.fontSize.normal}
              fontWeight={theme.fontWeight.semiBold as any}
              color={t.textPrimary}>
              Nothing here yet
            </StyledText>
            <StyledText fontSize={theme.fontSize.small} color={t.textSecondary} textAlign="center">
              Lower stock items will appear here.
            </StyledText>
          </Stack>
        </>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            {data.map((dish, index) => (
              <Stack
                key={index}
                horizontal
                justifyContent="flex-start"
                alignItems="center"
                gap={4}
                marginBottom={16}>
                <Icon name={dish?.icon_name} isSelected={false} />
                <Stack vertical>
                  <StyledText
                    color={t.textSecondary}
                    fontSize={16}
                    fontWeight={theme.fontWeight.medium as any}
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
                      Available:
                    </StyledText>
                    <StyledText
                      color={theme.colors.green[800]}
                      fontSize={14}
                      fontWeight={theme.fontWeight.semiBold as any}
                      marginLeft={5}>
                      {dish.current_stock || 0}
                    </StyledText>
                  </Stack>
                </Stack>
                <StyledSpacer flex={1} />
              </Stack>
            ))}
          </ScrollView>
        </>
      )}
    </Stack>
  );
};

export default LowStockItems;
