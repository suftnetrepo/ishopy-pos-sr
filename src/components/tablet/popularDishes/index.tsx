import React from 'react';
import {
  StyledSpacer,
  Stack,
  StyleShape,
} from 'fluent-styles';
import Text from '../../../components/text';
import {StyledIcon} from '../../../components/package/icon';
import {useQueryPopularMenuItems} from '../../../hooks/useOrderItems';
import PosIcon from '../../pos-icon';
import {useAppContext} from '../../../hooks/appContext';
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
        paddingVertical={8}
        paddingHorizontal={4}
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
        borderColor={`${t.borderDefault}55`}
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
              color={t.textMuted}>
              Nothing here yet
            </Text>
            <Text variant="caption" color={t.textMuted} textAlign="center">
              Popular dishes will appear here.
            </Text>
          </Stack>
        </>
      ) : (
        <>
            {data?.map((dish, index) => (
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
                    backgroundColor={t.bgInput}
                    alignItems="center"
                    justifyContent="center">
                    <PosIcon
                      name={dish?.menu_icon_name}
                      size={18}
                      color={t.brandPrimary}
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
                {index < data.length - 1 && (
                  <Stack
                  horizontal
                    width="80%"
                    height={1}
                    backgroundColor={`${t.borderDefault}`}
                    marginLeft={56}
                  />
                )}
              </React.Fragment>
            ))}
    
        </>
      )}
    </Stack>
  );
};

export default PopularDishes;
