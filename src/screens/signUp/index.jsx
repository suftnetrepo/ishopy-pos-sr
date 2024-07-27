/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { validate, StyledSpinner, YStack, StyledBadge, StyledOkDialog, XStack, StyledHeader, StyledSafeAreaView, StyledSpacer, StyledInput, StyledText, StyledButton } from 'fluent-styles';
import { theme } from "../../configs/theme";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { signUpValidatorRules } from "./validatorRules";
import { generateRandomData } from "../../utils/help";
import { useInsertShop } from "../../hooks/useShop";
import { useAppContext } from "../../hooks/appContext";
import { FEATURE_FLAG } from "../../feature-flags";

const SignUp = () => {
  const navigator = useNavigation()
  const { login } = useAppContext()
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(signUpValidatorRules.fields)
  const { error, loading, insertHandler, resetHandler } = useInsertShop()

  const onSubmit = async () => {
    setErrorMessages({})
    const { hasError, errors } = validate(fields, signUpValidatorRules.rules)
    if (hasError) {
      setErrorMessages(errors)
      return false
    }

    await insertHandler(fields).then(async (result) => {
      if (result) {       
        await login(result)     
      }
    })
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header backgroundColor={theme.colors.gray[1]} onPress={() => navigator.goBack()} icon cycleProps={{
          borderColor: theme.colors.gray[300],
          marginRight: 8
        }} rightIcon={
          FEATURE_FLAG && (
            <XStack flex={1} justifyContent='flex-end' alignItems='center' paddingHorizontal={8}>
              <StyledButton onPress={() => setFields({ ...fields, ...generateRandomData() })}>
                <StyledBadge
                  color={theme.colors.pink[800]}
                  backgroundColor={theme.colors.pink[100]}
                  fontWeight={theme.fontWeight.normal}
                  fontSize={theme.fontSize.normal}
                  paddingHorizontal={10}
                  paddingVertical={5}
                >
                  Mock Store
                </StyledBadge>
              </StyledButton>
              <StyledSpacer marginHorizontal={4} />
              <StyledButton onPress={async () => await clearSeedData()}>
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
              <StyledSpacer marginHorizontal={4} />
            </XStack>
          )
        } />
      </StyledHeader>
      <YStack
        flex={1}
        marginHorizontal={16}
      >
        <YStack
          justifyContent='flex-start' alignItems='center'
        >
          <StyledSpacer marginVertical={16} />
          <StyledText paddingHorizontal={8} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.xlarge} color={theme.colors.gray[800]}>
            Welcome to iShopy
          </StyledText>
          <StyledText paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.medium} color={theme.colors.gray[600]}>
            Sign Up to continue.
          </StyledText>
        </YStack>
        <StyledSpacer marginVertical={16} />
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <StyledInput
            label={'Store name'}
            keyboardType='default'
            placeholder='Enter your store name'
            returnKeyType='next'
            maxLength={50}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.name}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={(text) => setFields({ ...fields, name: text })}
            error={!!errorMessages?.name}
            errorMessage={errorMessages?.name?.message}
          />
          <StyledInput
            label={'FirstName'}
            keyboardType='default'
            placeholder='Enter your firstname'
            returnKeyType='next'
            maxLength={50}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.first_name}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={(text) => setFields({ ...fields, first_name: text })}
            error={!!errorMessages?.first_name}
            errorMessage={errorMessages?.first_name?.message}
          />
          <StyledInput
            label={'LastName'}
            keyboardType='default'
            placeholder='Enter your lastname'
            returnKeyType='next'
            maxLength={50}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.last_name}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={(text) => setFields({ ...fields, last_name: text })}
            error={!!errorMessages?.last_name}
            errorMessage={errorMessages?.last_name?.message}
          />
          <StyledInput
            label={'Email'}
            keyboardType='default'
            placeholder='Enter your email'
            returnKeyType='next'
            maxLength={50}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.email}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={(text) => setFields({ ...fields, email: text })}
            error={!!errorMessages?.email}
            errorMessage={errorMessages?.email?.message}
          />
          <StyledInput
            label={'Mobile'}
            keyboardType='default'
            placeholder='Enter your mobile'
            returnKeyType='next'
            maxLength={50}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.mobile}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={(text) => setFields({ ...fields, mobile: text })}
            error={!!errorMessages?.mobile}
            errorMessage={errorMessages?.mobile?.message}
          />
          <StyledInput
            label={'Address'}
            keyboardType='default'
            placeholder='Enter your address'
            returnKeyType='next'
            maxLength={100}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.address}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={(text) => setFields({ ...fields, address: text })}
            error={!!errorMessages?.address}
            errorMessage={errorMessages?.address?.message}
          />
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
              Sign up
            </StyledText>
          </StyledButton>
          <StyledSpacer marginVertical={4} />
          <XStack paddingHorizontal={20} justifyContent='center' alignItems='center'>
            <StyledText  >
              {`Already have an account?`}  { }
            </StyledText>
            <StyledSpacer marginHorizontal={2} />
            <StyledButton link onPress={() => { navigator.navigate("login") }} >
              <StyledText paddingHorizontal={1} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.large} >
                Sign in
              </StyledText>
            </StyledButton>
          </XStack>
        </KeyboardAwareScrollView>
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

export default SignUp