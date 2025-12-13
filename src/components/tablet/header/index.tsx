import React from 'react';
import {
  StyledText,
  StyledSpacer,
  StyledCycle,
} from 'fluent-styles';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {Stack} from '../../../components/package/stack';
import {fontStyles, theme} from '../../../utils/theme';
import {StyledImage} from '../../../components/package/image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Logo from '../../../components/tablet/logo';
import {useAppContext} from '../../../hooks/appContext';

type Props = {
  showLog?: boolean;
  showBackButton?: boolean;
  showTitle?: boolean;
  title?: string;
  children?: React.ReactNode;   
};

const RenderHeader = ({
  showLog = true,
  showBackButton = false,
  showTitle,
  title,
  children
}: Props) => {
  const navigation = useNavigation();
  const {user, previousSelectedMenu, updateCurrentMenu} = useAppContext();

  console.log("user", user)

  return (
    <Stack
      horizonal
      flex={1}
      backgroundColor={theme.colors.gray[1]}
      justifyContent="flex-start"
      alignItems="center"
      paddingVertical={16}
      marginTop={14}
      marginBottom={14}
      marginHorizontal={16}
      borderRadius={16}
      shadowOpacity={0.1}
      shadowColor={theme.colors.gray[600]}
      shadowRadius={30}
      paddingHorizontal={16}>
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
              updateCurrentMenu(previousSelectedMenu);
              navigation.canGoBack() && navigation.goBack();
            }}
          />
        </StyledCycle>
      )}
      {showLog && <Logo />}

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
        children  && (
           <Stack flex={1} horizonal>{children}</Stack>
        )
      }
      <Stack
        horizonal
        paddingHorizontal={20}
        justifyContent="flex-start"
        alignItems="center">
        <StyledImage
          source={require('./../../../../assets/img/doctor_1.png')}
          size={50}
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
            Gladina Samantha
          </StyledText>
          <StyledText
            color={theme.colors.gray[400]}
            fontSize={theme.fontSize.small}
            fontWeight={theme.fontWeight.medium}>
            Waiter
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
                  routes: [{name: 'keypad'}],
                })
              );
            }}
          />
        </StyledCycle>
      </Stack>
    </Stack>
  );
};

export default RenderHeader;
