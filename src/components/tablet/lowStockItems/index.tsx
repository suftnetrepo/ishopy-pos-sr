import React from 'react';
import {StyledSkeleton, StyledSpacer} from 'fluent-styles';
import {Stack} from '../../../components/package/stack';
import {Text} from '../../../components/text';
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
        <Text
          color={t.textPrimary}
          variant="title">
          Low Stock Items
        </Text>
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
            <Text fontSize={32}>🔔</Text>
            <Text
              variant="title"
              color={t.textPrimary}>
              Nothing here yet
            </Text>
            <Text variant="caption" color={t.textSecondary} textAlign="center">
              Lower stock items will appear here.
            </Text>
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
                      Available:
                    </Text>
                    <Text
                      color={t.successColor}
                      variant="label"
                      marginLeft={5}>
                      {dish.current_stock || 0}
                    </Text>
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
