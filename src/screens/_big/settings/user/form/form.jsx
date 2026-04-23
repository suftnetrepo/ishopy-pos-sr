
import React, { useState, useEffect } from "react";
import { validate, StyledSpinner, YStack, StyledOkDialog, StyledSpacer, StyledInput, StyledText, StyledButton } from 'fluent-styles';
import {
  Text,
  HStack,
} from "@gluestack-ui/themed";
import { fontStyles, theme } from "../../../../../configs/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { userRules } from "./validatorRules";
import { useUpdateUser, useInsertUser } from "../../../../../hooks/useUser";
import { ShowToast } from "../../../../../components/toast";
import { StyledIcon } from "../../../../../components/package/icon";

const UserForm = ({ user, onClose }) => {
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(userRules.fields)
  const { updateUser, error, loading, resetHandler } = useUpdateUser()
  const { insertUser } = useInsertUser()

  useEffect(() => {
    setFields((pre) => {
      return {
        ...pre,
        ...user
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

    if (fields?.user_id) {
      await updateUser(user.user_id, fields.username, fields.password, fields.role, fields.first_name, fields.last_name, parseInt(fields.pass_code)).then(async (result) => {
        result && handleResult("User was updated successfully")
      })
    } else {
      delete fields.user_id
      await insertUser(fields.username, fields.password, fields.role, fields.first_name, fields.last_name, parseInt(fields.pass_code)).then(async (result) => {
        result && handleResult("User was added successfully")
      })
    }
  }

  const handleResult = (message) => {
    ShowToast("Success", message)
    !user && setFields(userRules.reset)
  }

  return (
    <>
      <YStack
        flex={1}
        backgroundColor={theme.colors.gray[100]}
        paddingHorizontal={16}
      >
        <StyledSpacer marginVertical={16} />
        <HStack justifyContent="space-between" alignItems="center" >
          <HStack flex={1} horizontal justifyContent="flex-start" alignItems="center">
            <StyledIcon
              name={user ? "create" : "add"}
              size={32}
              color={theme.colors.gray[400]}
            />
            <Text
              paddingHorizontal={4}
              fontFamily={fontStyles.Roboto_Regular}
              color={theme.colors.gray[800]}
              fontSize={theme.fontSize.large}
              fontWeight={theme.fontWeight.thin}
            >
              User
            </Text>
          </HStack>
          <StyledIcon
            name="cancel"
            size={48}
            color={theme.colors.gray[800]}
            onPress={() => onClose()}
          />
        </HStack>
        <StyledSpacer marginVertical={8} />
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <StyledInput
            label={'FirstName'}
            keyboardType='default'
            placeholder='Enter your firstname'
            returnKeyType='next'
            maxLength={50}
            height={40}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.gray[400]}
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
           height={40}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.gray[400]}
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
            height={40}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.gray[400]}
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
            height={40}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.gray[400]}
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
            height={40}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.gray[400]}
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
          <StyledButton width='100%' backgroundColor={theme.colors.yellow[500]} onPress={() => onSubmit()} >
            <StyledText paddingHorizontal={20} paddingVertical={10} color={theme.colors.gray[800]}>
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
    </>
  )
}

export default UserForm