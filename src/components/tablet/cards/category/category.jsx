import React from 'react';
import { StyledText } from 'fluent-styles';
import { Stack } from '../../../package/stack';
import { fontStyles, theme } from '../../../../utils/theme';
import { Icon } from './icon';
import { Pressable } from 'react-native';
import { useAppContext } from '../../../../hooks/appContext';
import { StyledIcon } from "../../../package/icon";

const CategoryCard = ({
  name,
  category_id,
  status,
  icon,
  total_menu = 0,
  onPress,
  color_code
}) => {
  const { category_id: selected_category_id } = useAppContext()
  if (!name || !icon) {
    return null;
  }

  const menuText = total_menu === 1 ? 'item' : 'items';

  return (
    <Pressable onPress={() => onPress(category_id)} style={{ flex: 1 }}>
      <Stack
        green={selected_category_id === category_id}
        horizonal
        padding={12}
        gap={8}
        justifyContent="flex-start"
        alignItems="center"
        marginHorizontal={4}
        marginVertical={2}
        borderRadius={16}
        borderWidth={0}
        borderColor={theme.colors.gray[1]}
        backgroundColor={theme.colors.gray[1]}
        shadowColor="black"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.1}
        shadowRadius={2}
        elevation={3}
       
        >
        <Icon {...icon} />

        <Stack vertical flex={1} justifyContent="center">
          {
            selected_category_id === category_id && (
              <StyledIcon position='absolute' right={-9} top={-14} name="check-circle" size={20} color={theme.colors.green[500]} />
            )
          }
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.medium}
            fontWeight={theme.fontWeight.medium}
            numberOfLines={1}
            ellipsizeMode="tail">
            {name}
          </StyledText>

          {total_menu !== undefined && (
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontSize={theme.fontSize.small}
              fontWeight={theme.fontWeight.normal}
              color={theme.colors.gray[500]}
              marginTop={2}>
              {total_menu} {menuText}
            </StyledText>
          )}
        </Stack>
      </Stack>
    </Pressable>
  );
};

export default CategoryCard;
