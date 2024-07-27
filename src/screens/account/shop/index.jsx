/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { validate, StyledSpinner, YStack, StyledOkDialog, StyledMultiInput, StyledHeader, StyledSafeAreaView, StyledSpacer, StyledInput, StyledText, StyledButton } from 'fluent-styles';
import { theme } from "../../../configs/theme";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { shopRules } from "./validatorRules";
import { useUpdateShop } from "../../../hooks/useShop";
import { useAppContext } from "../../../hooks/appContext";
import { useSelector } from "@legendapp/state/react";
import { state } from "../../../store";

const Shop = () => {
  const navigator = useNavigation()
  const { updateCurrentShop, shop } = useAppContext()
  const { purchase_status } = useSelector(() => state.get());
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(shopRules.fields)
  const { updateHandler, error, loading, resetHandler } = useUpdateShop()
 
  useEffect(() => {
    setFields((pre) => {
      return {
        ...pre,
        ...shop
      }
    })
  }, [shop])

  const onSubmit = async () => {
    setErrorMessages({})
    const { hasError, errors } = validate(fields, shopRules.rules)
    if (hasError) {
      setErrorMessages(errors)
      return false
    }

    const update = () => {
      updateCurrentShop(fields)   
      navigator.navigate("bottom-tabs", { screen: 'profile' })
    }

    await updateHandler(fields).then(async (result) => {
      result && (
        update()
      )
    })
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={() => navigator.goBack()} title='Store' icon cycleProps={{
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
            maxLength={20}
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
            label={'Currency'}
            keyboardType='default'
            placeholder='Enter your currency'
            returnKeyType='next'
            maxLength={3}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.currency}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={(text) => setFields({ ...fields, currency: text })}
            error={!!errorMessages?.currency}
            errorMessage={errorMessages?.currency?.message}
          />
          <StyledMultiInput
            label={'Address'}
            keyboardType='default'
            placeholder='Enter your address'
            returnKeyType='done'
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

          <StyledMultiInput
            label={'Description'}
            keyboardType='default'
            placeholder='Enter shop description'
            returnKeyType='done'
            maxLength={200}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.gray[400]}
            backgroundColor={theme.colors.gray[1]}
            value={fields.description}
            borderRadius={16}
            paddingHorizontal={8}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, description: text })}
          />

          <StyledSpacer marginVertical={8} />
          {
            purchase_status && (
              <StyledButton width='100%' backgroundColor={theme.colors.cyan[500]} onPress={() => onSubmit()} >
                <StyledText paddingHorizontal={20} paddingVertical={10} color={theme.colors.gray[1]}>
                  Save Changes
                </StyledText>
              </StyledButton>
            )
          }         
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

export default Shop