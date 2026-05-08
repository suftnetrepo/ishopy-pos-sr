/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { validate, StyledSpinner, YStack, StyledBadge, StyledOkDialog, XStack, StyledHeader, StyledSafeAreaView, StyledSpacer, StyledInput, StyledButton } from 'fluent-styles';
import Text from '../../components/text';
import { fontStyles, theme } from "../../configs/theme";
import { validatorRules } from "./validatorRules";
import { useLogin } from "../../hooks/useUser";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../../hooks/appContext";
import { seedData, clearSeedData } from "../../model/seed";
import { FEATURE_FLAG } from "../../feature-flags";
import { state } from "../../store";
import { useSelector } from "@legendapp/state/react";
import { StyledMIcon } from "../../components/icon";
import {useAppTheme} from '../../theme';

const Login = () => {
  const {t} = useAppTheme();
  const navigator = useNavigation()
  const { login } = useAppContext()
  const purchase_status = useSelector(() => state.purchase_status.get());
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(validatorRules.fields)
  const { error, loading, loginUser, resetHandler } = useLogin()

  const onSubmit = async () => {
    setErrorMessages({})
    const { hasError, errors } = validate(fields, validatorRules.rules)
    if (hasError) {
      setErrorMessages(errors)
      return false
    }

    loginUser(fields.user_name, fields.password).then(async (result) => {
      if (result) {
        await login(result)
        navigator.navigate("bottom-tabs")
      }
    })
  }

  const RenderHeader = () => {

    return (
      <XStack flex={1} justifyContent='flex-end' alignItems='center' marginHorizontal={16} paddingVertical={8}>
        {
          (FEATURE_FLAG.MOCK_STORE || !purchase_status) && (
            <>
              <StyledSpacer marginHorizontal={4} />
              <StyledButton onPress={() => setFields({ ...fields, password: 'user123', user_name: 'user' })}>
                <StyledBadge
                  color={theme.colors.green[800]}
                  backgroundColor={theme.colors.green[100]}
                  fontWeight={theme.fontWeight.normal}
                  fontSize={theme.fontSize.normal}
                  paddingHorizontal={10}
                  paddingVertical={5}
                >
                  Sample User
                </StyledBadge>
              </StyledButton>

              <StyledButton onPress={async () => await seedData()}>
                <StyledBadge
                  color={theme.colors.orange[800]}
                  backgroundColor={theme.colors.orange[100]}
                  fontWeight={theme.fontWeight.normal}
                  fontSize={theme.fontSize.normal}
                  paddingHorizontal={10}
                  paddingVertical={5}
                >
                  Sample Restaurant
                </StyledBadge>
              </StyledButton>

              <StyledButton onPress={async () => clearSeedData()}>
                <StyledBadge
                  color={t.textPrimary}
                  backgroundColor={t.bgPage}
                  fontWeight={theme.fontWeight.normal}
                  fontSize={theme.fontSize.normal}
                  paddingHorizontal={10}
                  paddingVertical={5}
                >
                  Clear
                </StyledBadge>
              </StyledButton>
            </>
          )
        }
      </XStack>
    )
  }

  const Notice = () => {
    return (
      <YStack marginBottom={32} borderRadius={16} justifyContent='flex-start' paddingVertical={16} paddingHorizontal={16} alignItems='flex-start' backgroundColor={theme.colors.cyan[50]}>

        <XStack justifyContent='flex-start' alignItems='center'>
          <StyledMIcon size={32} name='info' color={theme.colors.cyan[500]} />
          <Text variant="header" paddingHorizontal={8} color={t.textPrimary}>
            Welcome to iRit
          </Text>
        </XStack>
        <Text variant="body" color={t.textPrimary}>
          Get started quickly! Tap Sample Restaurant to generate dummy Data to see a sample of what the app can do. Feel free to explore the features!.
        </Text>
      </YStack>
    )
  }

  return (
    <StyledSafeAreaView backgroundColor={t.bgCard}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Full>
          <RenderHeader />
        </StyledHeader.Full>

      </StyledHeader>
      <YStack
        height={'100%'}
        marginHorizontal={16}

      >
        {
          !purchase_status && (
            <Notice />
          )
        }
        {
          purchase_status && (
            <>
              <StyledSpacer marginVertical={32} />
              <YStack
                justifyContent='flex-start' alignItems='center' marginVertical={24}
              >
                <StyledSpacer marginVertical={16} />
                <Text variant="header" paddingHorizontal={8} color={t.textPrimary}>
                  Welcome to iRit
                </Text>
                <Text variant="body" paddingHorizontal={8} color={t.textSecondary}>
                  Sign in to continue.
                </Text>
              </YStack>
            </>
          )
        }
        <StyledInput
          label={'Username'}
          keyboardType='default'
          placeholder='Enter your username'
          returnKeyType='next'
          maxLength={50}
          fontSize={theme.fontSize.normal}
          borderColor={t.brandPrimaryDark}
          backgroundColor={t.bgCard}
          borderRadius={32}
          paddingHorizontal={8}
          value={fields.user_name}
          placeholderTextColor={t.textMuted}
          onChangeText={(text) => setFields({ ...fields, user_name: text })}
          error={!!errorMessages?.user_name}
          errorMessage={errorMessages?.user_name?.message}
        />
        <StyledInput
          label={'Password'}
          keyboardType='default'
          type='password'
          placeholder='Enter your password'
          returnKeyType='done'
          maxLength={20}
          fontSize={theme.fontSize.normal}
          borderColor={t.brandPrimaryDark}
          backgroundColor={t.bgCard}
          borderRadius={32}
          paddingHorizontal={8}
          value={fields.password}
          placeholderTextColor={t.textMuted}
          onChangeText={(text) => setFields({ ...fields, password: text })}
          error={!!errorMessages?.password}
          errorMessage={errorMessages?.password?.message}
        />
        <StyledSpacer marginVertical={8} />
        <StyledButton width='100%' backgroundColor={theme.colors.cyan[500]} onPress={() => onSubmit()} >
          <Text variant="button" paddingHorizontal={20} paddingVertical={10} color={t.bgCard}>
            Sign in
          </Text>
        </StyledButton>
        <StyledSpacer marginVertical={4} />
        {
          purchase_status && (
            <XStack justifyContent='flex-end' alignItems='center'>
              <StyledButton link backgroundColor={theme.colors.cyan[500]} onPress={() => navigator.navigate("keypad", {
                recovery_password: true
              })} >
                <Text variant="body" paddingHorizontal={20} color={t.textMuted}>
                  Forgot password
                </Text>
              </StyledButton>
            </XStack>
          )
        }

      </YStack>
      {
        (error) && (
          <StyledOkDialog title={error?.message} description='please try again' visible={true} onOk={() => {
            resetHandler()
          }} />
        )
      }
      {
        (loading) && (
          <StyledSpinner />
        )
      }
    </StyledSafeAreaView>
  )
}

export default Login