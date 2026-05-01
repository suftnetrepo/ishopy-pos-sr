import React from 'react';
import {ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyledButton} from '../../../components/package/button';
import {StyledText} from 'fluent-styles';
import {theme} from '../../../utils/theme';
import {useAppTheme} from '../../../theme';

type SidebarItemProps = {
  label: string;
  icon: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  collapse?: boolean;
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  active = false,
  collapse = false,
  onPress,
  style,
}) => {
  const {t} = useAppTheme();
  const backgroundColor = active ? t.brandPrimary : 'transparent';
  const textColor       = active ? t.textOnAmber  : t.textSecondary;
  const iconColor       = textColor;

  return (
    <StyledButton
      flexDirection={collapse ? 'column' : 'row'}
      paddingVertical={12}
      paddingHorizontal={20}
      borderRadius={8}
      justifyContent={collapse ? 'center' : 'flex-start'}
      alignItems="center"
      backgroundColor={backgroundColor}
      borderColor={active ? t.brandPrimary : 'transparent'}
      onPress={onPress}
      style={style}>
      <Icon name={icon} size={25} color={iconColor} />
      {!collapse && (
        <StyledText
          color={textColor}
          fontSize={15}
          fontWeight={theme.fontWeight.medium as any}
          marginLeft={10}
          textAlign="center">
          {label}
        </StyledText>
      )}
    </StyledButton>
  );
};