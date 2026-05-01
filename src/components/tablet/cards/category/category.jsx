import React from 'react';
import {StyledText, StyledShape} from 'fluent-styles';
import {Stack} from '../../../package/stack';
import {fontStyles, theme} from '../../../../utils/theme';
import {Pressable} from 'react-native';
import {useAppContext} from '../../../../hooks/appContext';
import {StyledIcon} from '../../../package/icon';
import PosIcon from '../../../pos-icon';
import {useAppTheme} from '../../../../theme';

const CategoryCard = ({name,
  category_id,
  status,
  icon_name,
  total_menu = 0,
  onPress,
  color_code}) => {
  const {t} = useAppTheme();
  const {category_id: selected_category_id} = useAppContext();

  const menuText = total_menu === 1 ? 'item' : 'items';

  return (
    <Pressable onTouchStart={() => onPress(category_id)} style={{flex: 1}}>
      <Stack
        green={selected_category_id === category_id}
        horizonal
        padding={8}
        gap={8}
        flex={1}
        horizontal
        marginVertical={4}
        marginHorizontal={4}
        borderRadius={8}
        borderWidth={0}
        borderColor={t.bgCard}
        backgroundColor={t.bgCard}
        shadowColor="black"
        shadowOffset={{width: 0, height: 1}}
        shadowOpacity={0.1}
        shadowRadius={2}
        elevation={3}>
        <StyledShape
          size={48}
          backgroundColor={ t.bgPage}
          justifyContent="center"
          alignItems="center"
          cycle
          marginHorizontal={4}
          padding={4}>
          <PosIcon
            name={icon_name}
            size={32}
            color={color_code || t.textSecondary}
          />
        </StyledShape>

        <Stack vertical flex={1} justifyContent="center">
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
              color={t.textSecondary}
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
