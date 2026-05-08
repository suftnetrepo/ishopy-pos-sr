import React from 'react';
import {ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyledButton} from '../../../components/package/button';
import Text from '../../../components/text';
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
  // Phase 2: Better active state with more subtle highlight
  const backgroundColor = active ? `${t.brandPrimary}15` : 'transparent';
  const textColor       = active ? t.brandPrimary : t.textPrimary;
  const iconColor       = active ? t.brandPrimary : t.textSecondary;
  const borderColor     = active ? t.brandPrimary : 'transparent';

  return (
    <StyledButton
      flexDirection={collapse ? 'column' : 'row'}
      paddingVertical={8}
      paddingHorizontal={collapse ? 8 : 12}
      borderRadius={10}
      borderWidth={1}
      minHeight={44}
      justifyContent={collapse ? 'center' : 'flex-start'}
      alignItems="center"
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      onPress={onPress}
      style={style}>
      <Icon name={icon} size={24} color={iconColor} />
      {!collapse && (
        <Text
          color={textColor}
          variant={active ? 'label' : 'subLabel'}
          marginLeft={12}
          style={{fontWeight: active ? '600' : '500'}}
          textAlign="left">
          {label}
        </Text>
      )}
    </StyledButton>
  );
};