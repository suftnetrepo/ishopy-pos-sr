import React from 'react';
import {StyledSkeleton, StyledSpacer} from 'fluent-styles';
import {Stack} from '../../../components/package/stack';
import Text from '../../../components/text';
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
          Low Stock Items
        </Text>
        <StyledIcon size={24} name="share" color={t.textMuted} />
      </Stack>
      <StyledSpacer
        borderWidth={1}
        borderColor={t.borderDefault}
        width={'100%'}
        marginVertical={12}
      />

      {data?.length === 0 ? (
        <>
          <Stack
            width="100%" vertical alignItems="center" justifyContent="center"
            paddingVertical={24} gap={12}
            backgroundColor={t.bgCard} borderRadius={12}>
            <Text fontSize={32}>🔔</Text>
            <Text
              variant="title"
              color={t.textMuted}>
              Nothing here yet
            </Text>
            <Text variant="caption" color={t.textMuted} textAlign="center">
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
                width="100%"
                justifyContent="flex-start"
                alignItems="center"
                gap={12}
                marginBottom={16}>
                <Icon name={dish?.icon_name} isSelected={false} />
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
