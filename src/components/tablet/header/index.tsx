import React from 'react';
import {
  StyledText,
  StyledSpacer,
  Stack,
  StyledPressable,
  StyleShape
} from 'fluent-styles';
import {useNavigation, CommonActions} from '@react-navigation/native';

import {fontStyles, theme} from '../../../utils/theme';
import {StyledImage} from '../../../components/package/image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Logo from '../../../components/tablet/logo';
import {useAppContext} from '../../../hooks/appContext';
import {useAppTheme} from '../../../theme';

type Props = {
  showLogo?: boolean;
  showBackButton?: boolean;
  showTitle?: boolean;
  title?: string;
  children?: React.ReactNode;
  CopyIcon?: React.ReactNode;
};

const RenderHeader = ({
  showLogo = true,
  showBackButton = false,
  showTitle,
  title,
  children,
  CopyIcon,
}: Props) => {
  const navigation = useNavigation();
  const {user} = useAppContext();
  const {t} = useAppTheme();

  return (
    <Stack
      horizontal
      backgroundColor={t.bgCard}
      justifyContent="flex-start"
      alignItems="center"
      paddingVertical={8}
      marginTop={14}
      marginBottom={14}
      marginHorizontal={16}
      borderRadius={16}
      borderWidth={0.5}
      borderColor={t.borderDefault}
      paddingHorizontal={8}
    >
      {showBackButton && (
        <StyledPressable
          onPress={() => {
            navigation.canGoBack() && navigation.goBack();
          }}>
          <StyleShape
            cycle size={48}
            borderWidth={1} borderColor={t.borderDefault}
            backgroundColor={t.bgCard}
            alignItems="center" justifyContent="center">
            <Icon
              style={{pointerEvents: 'none'}}
              size={24}
              name="arrow-back"
              color={t.textPrimary}
            />
          </StyleShape>
        </StyledPressable>
      )}
      {showLogo && <Logo />}
      {showTitle && (
        <StyledText
          fontFamily={fontStyles.Roboto_Regular}
          fontSize={theme.fontSize.normal}
          fontWeight={theme.fontWeight.normal as any}
          paddingHorizontal={8}
          color={t.textPrimary}>
          {title || 'Dashboard'}
        </StyledText>
      )}
      {children && (
        <Stack marginHorizontal={8} flex={1} horizontal>
          {children}
        </Stack>
      )}
      {!children && <StyledSpacer flex={1} />}

      {CopyIcon ? (
        CopyIcon
      ) : (
        <>
          <Stack
            horizontal
            paddingHorizontal={16}
            justifyContent="flex-start"
            alignItems="center">
            <StyledImage
              source={require('./../../../../assets/img/doctor_1.png')}
              size={32}
              cycle
              resizeMode="contain"></StyledImage>
            <Stack
              vertical
              marginLeft={8}
              justifyContent="flex-start"
              alignItems="flex-start">
              <StyledText
                color={t.textPrimary}
                fontSize={theme.fontSize.small}
                fontWeight={theme.fontWeight.semiBold as any}>
                {user?.first_name} {user?.last_name}
              </StyledText>
              <StyledText
                color={t.textMuted}
                fontSize={theme.fontSize.small}
                fontWeight={theme.fontWeight.medium as any}>
                {user?.role}
              </StyledText>
            </Stack>
          </Stack>

          <Stack horizontal>
            <StyledPressable
              onPress={() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'keypad'}],
                  })
                );
              }}>
              <StyleShape
                cycle size={48}
                borderWidth={1} borderColor={t.borderDefault}
                backgroundColor={t.bgCard}
                alignItems="center" justifyContent="center">
                <Icon
                  style={{pointerEvents: 'none'}}
                  size={24}
                  name="exit-to-app"
                  color={t.textPrimary}
                />
              </StyleShape>
            </StyledPressable>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default RenderHeader;