/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { validate, StyledSpinner, YStack, StyledBadge, StyledOkDialog, XStack, StyledHeader, StyledSafeAreaView, StyledSpacer, StyledInput, StyledText, StyledButton } from 'fluent-styles';
import { theme } from "../../configs/theme";
import { validatorRules } from "./validatorRules";
import { useLogin } from "../../hooks/useUser";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../../hooks/appContext";
import { seedData, clearSeedData } from "../../model/seed";
import { FEATURE_FLAG } from "../../feature-flags";
import { state } from "../../store";
import { useSelector } from "@legendapp/state/react";

const Login = () => {
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
                  Mock User
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
                  Mock Store
                </StyledBadge>
              </StyledButton>

              <StyledButton onPress={async () => clearSeedData()}>
                <StyledBadge
                  color={theme.colors.gray[800]}
                  backgroundColor={theme.colors.gray[100]}
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

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Full>
          <RenderHeader />
        </StyledHeader.Full>

      </StyledHeader>
      <YStack
        height={'100%'}
        marginHorizontal={16}

      >
        <StyledSpacer marginVertical={32} />
        <YStack
          justifyContent='flex-start' alignItems='center'
        >
          <StyledSpacer marginVertical={16} />
          <StyledText paddingHorizontal={8} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.xlarge} color={theme.colors.gray[800]}>
            Welcome to iShopy
          </StyledText>
          <StyledText paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.medium} color={theme.colors.gray[600]}>
            Sign in to continue.
          </StyledText>
        </YStack>

        <StyledSpacer marginVertical={24} />
        <StyledInput
          label={'Username'}
          keyboardType='default'
          placeholder='Enter your username'
          returnKeyType='next'
          maxLength={50}
          fontSize={theme.fontSize.normal}
          borderColor={theme.colors.yellow[800]}
          backgroundColor={theme.colors.gray[1]}
          borderRadius={32}
          paddingHorizontal={8}
          value={fields.user_name}
          placeholderTextColor={theme.colors.gray[300]}
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
          borderColor={theme.colors.yellow[800]}
          backgroundColor={theme.colors.gray[1]}
          borderRadius={32}
          paddingHorizontal={8}
          value={fields.password}
          placeholderTextColor={theme.colors.gray[300]}
          onChangeText={(text) => setFields({ ...fields, password: text })}
          error={!!errorMessages?.password}
          errorMessage={errorMessages?.password?.message}
        />
        <StyledSpacer marginVertical={8} />
        <StyledButton width='100%' backgroundColor={theme.colors.cyan[500]} onPress={() => onSubmit()} >
          <StyledText paddingHorizontal={20} paddingVertical={10} color={theme.colors.gray[1]}>
            Sign in
          </StyledText>
        </StyledButton>
        <StyledSpacer marginVertical={4} />       
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