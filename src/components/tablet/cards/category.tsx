import React from 'react';
import {StyledText} from 'fluent-styles';
import {Stack} from '../../package/stack';
import {fontStyles, theme} from '../../../utils/theme';
import {Icon} from './icon';
import {Category} from '../../../model/types';

const CategoryCard: React.FC<Category> = ({
  name,
  status,
  icon,
  total_menu = 0,
}) => {
  if (!name || !icon) {
    return null;
  }

  const isActive = status === 1;
  const menuText = total_menu === 1 ? 'item' : 'items';

  return (
    <Stack
      horizonal
      flex={1}
      padding={12}
      gap={16}
      justifyContent="flex-start"
      alignItems="center"
      marginHorizontal={8}
      marginVertical={8}
      borderRadius={12}
      backgroundColor={theme.colors.gray[1]}
      shadowColor={theme.colors.black}
      shadowOffset={{width: 0, height: 0.1}}
      shadowOpacity={0.1}
      shadowRadius={1}
      elevation={2}>
      <Icon {...icon} />

      <Stack vertical flex={1} justifyContent="center">
        <StyledText
          fontFamily={fontStyles.Roboto_Regular}
          fontSize={theme.fontSize.medium}
          fontWeight={theme.fontWeight.medium}
          color={isActive ? theme.colors.gray[800] : theme.colors.gray[600]}
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
  );
};

export default CategoryCard;
