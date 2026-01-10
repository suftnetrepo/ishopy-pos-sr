import React from 'react';
import {
  StyledText,
  StyledSpacer,
  StyledCycle,
} from 'fluent-styles';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Stack } from '../../../components/package/stack';
import { fontStyles, theme } from '../../../utils/theme';
import { StyledImage } from '../../../components/package/image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Logo from '../../../components/tablet/logo';
import { useAppContext } from '../../../hooks/appContext';

type Props = {
  showLogo?: boolean;
  showBackButton?: boolean;
  showTitle?: boolean;
  title?: string;
  children?: React.ReactNode;
  CopyIcon?: React.ReactNode
};

const RenderHeader = ({
  showLogo = true,
  showBackButton = false,
  showTitle,
  title,
  children,
  CopyIcon
}: Props) => {
  const navigation = useNavigation();
  const { user } = useAppContext();

  console.log('User Info:', user);

  return (
    <Stack
      horizonal
      flex={1}
      backgroundColor={theme.colors.gray[1]}
      justifyContent="flex-start"
      alignItems="center"
      paddingVertical={8}
      marginTop={14}
      marginBottom={14}
      marginHorizontal={16}
      borderRadius={16}
      shadowOpacity={0.1}
      shadowColor={theme.colors.gray[600]}
      shadowRadius={30}
      paddingHorizontal={8}>
      {showBackButton && (
        <StyledCycle
          paddingHorizontal={10}
          borderWidth={1}
          height={48}
          width={48}
          borderColor={theme.colors.gray[400]}>
          <Icon
            size={24}
            name="arrow-back"
            color={theme.colors.gray[800]}
            onPress={() => {

              navigation.canGoBack() && navigation.goBack();
            }}
          />
        </StyledCycle>
      )}
      {showLogo && <Logo />}
      {showTitle && (
        <StyledText
          fontFamily={fontStyles.Roboto_Regular}
          fontSize={theme.fontSize.normal}
          fontWeight={theme.fontWeight.normal}
          paddingHorizontal={8}
          color={theme.colors.gray[600]}>
          {title || 'Dashboard'}
        </StyledText>
      )}
      {
        children && (
          <Stack marginHorizontal={8} flex={1} horizonal>{children}</Stack>
        )
      }
      {
        !children && <StyledSpacer flex={1} />
      }

      {
        CopyIcon ? CopyIcon : (
          <>
            <Stack
              horizonal
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
                  color={theme.colors.gray[900]}
                  fontSize={theme.fontSize.small}
                  fontWeight={theme.fontWeight.semiBold}>
                  {user?.first_name} {user?.last_name}  
                </StyledText>
                <StyledText
                  color={theme.colors.gray[400]}
                  fontSize={theme.fontSize.small}
                  fontWeight={theme.fontWeight.medium}>
                {user?.role}
                </StyledText>
              </Stack>
            </Stack>

            <Stack horizonal>
              <StyledCycle
                paddingHorizontal={10}
                borderWidth={1}
                height={48}
                width={48}
                backgroundColor={theme.colors.gray[1]}
                borderColor={theme.colors.gray[400]}>
                <Icon
                  size={24}
                  name="exit-to-app"
                  color={theme.colors.gray[800]}
                  onPress={() => {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'keypad' }],
                      })
                    );
                  }}
                />
              </StyledCycle>
            </Stack>
          </>
        )
      }



    </Stack>
  );
};

export default RenderHeader;
