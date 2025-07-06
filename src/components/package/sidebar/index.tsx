import React from 'react';
import {ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyledButton} from '../../../components/package/button';
import {StyledText} from 'fluent-styles';
import {theme} from '../../../utils/theme';

type SidebarItemProps = {
  label: string;
  icon: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  active = false,
  onPress,
  style,
}) => {
  const backgroundColor = active ? theme.colors.yellow[400] : 'transparent';
  const textColor = active ? theme.colors.gray[900] : theme.colors.gray[500];
  const iconColor = textColor;

  return (
    <>
    <StyledButton
      flexDirection='row'
      paddingVertical={12}
      paddingHorizontal={20}
      borderRadius={8}
      justifyContent="flex-start"
      backgroundColor={backgroundColor}
      borderColor={active ? theme.colors.yellow[400] : 'transparent'}
      onPress={onPress}
      style={style}>
      <Icon name={icon} size={25} color={iconColor} />
      <StyledText
        color={textColor}
        fontSize={15}
        fontWeight={theme.fontWeight.medium}
        marginLeft={10}
        textAlign="center">
        {label}
      </StyledText>
    </StyledButton>
    </>
    
  );
};
