/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { validate, StyledSpinner, YStack, StyledOkDialog, StyledHeader, StyledSafeAreaView, StyledSpacer, StyledInput, StyledText, StyledButton } from 'fluent-styles';
import { theme } from "../../../configs/theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { userRules } from "./validatorRules";
import { useUpdateUser } from "../../../hooks/useUser";

const EditUser = () => {
  const navigator = useNavigation()
  const route = useRoute()
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(userRules.fields)
  const { updateUser, error, loading, resetHandler } = useUpdateUser()
  const { user } = route.params

  useEffect(() => {
    setFields((pre) => {
      return {
        ...pre,
        ...user,
        pass_code: user?.pass_code?.toString()
      }
    })
  }, [user])

  const onSubmit = async () => {
    setErrorMessages({})
    const { hasError, errors } = validate(fields, userRules.rules)
    if (hasError) {
      setErrorMessages(errors)
      return false
    }

    await updateUser(user.user_id, fields.username, fields.password, fields.role, fields.first_name, fields.last_name, parseInt(fields.pass_code)).then(async (result) => {    
      result && (
        navigator.reset({   
          key : 'users',    
          index: 0,
          routes: [{ name: 'users' }],
        })
      )
    })
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={()=> navigator.goBack()} title='Edit User' icon cycleProps={{
          borderColor: theme.colors.gray[300],
          marginRight: 8
        }} />
      </StyledHeader>

      <YStack
        flex={1}
        backgroundColor={theme.colors.gray[100]}
        paddingHorizontal={16}
      >
        <StyledSpacer marginVertical={8} />
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <StyledInput
            label={'FirstName'}
            keyboardType='default'
            placeholder='Enter your firstname'
            returnKeyType='next'
            maxLength={50}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.first_name}
            placeholderTextColor={theme.colors.gray[400]}
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
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.last_name}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, last_name: text })}
            error={!!errorMessages?.last_name}
            errorMessage={errorMessages?.last_name?.message}
          />
          <StyledInput
            label={'Username'}
            keyboardType='default'
            placeholder='Enter your username'
            returnKeyType='next'
            maxLength={50}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.username}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, username: text })}
            error={!!errorMessages?.username}
            errorMessage={errorMessages?.username?.message}
          />
          <StyledInput
            label={'Password'}
            keyboardType='default'
            secureTextEntry={true}
            placeholder='Enter your password'
            returnKeyType='done'
            maxLength={8}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.password}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, password: text })}
            error={!!errorMessages?.password}
            errorMessage={errorMessages?.password?.message}
          />
          <StyledInput
            label={'Pass code'}
            keyboardType='numeric'
            placeholder='Enter your pass code'
            returnKeyType='done'
            maxLength={4}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.pass_code}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, pass_code: text })}
            error={!!errorMessages?.pass_code}
            errorMessage={errorMessages?.pass_code?.message}
          />
          <StyledSpacer marginVertical={8} />
          <StyledButton width='100%' backgroundColor={theme.colors.cyan[500]} onPress={() => onSubmit()} >
            <StyledText paddingHorizontal={20} paddingVertical={10} color={theme.colors.gray[1]}>
              Save Changes
            </StyledText>
          </StyledButton>
          <StyledSpacer marginVertical={4} />
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

export default EditUser