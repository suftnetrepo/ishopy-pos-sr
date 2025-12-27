
import React, { useState, useEffect } from "react";
import { validate, StyledSpinner, YStack, StyledOkDialog, StyledMultiInput, StyledSpacer, StyledInput, StyledText, StyledButton } from 'fluent-styles';
import {
  Text,
  HStack,
} from "@gluestack-ui/themed";
import { fontStyles, theme } from "../../../../configs/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { shopRules } from "./validatorRules";
import { useUpdateShop } from "../../../../hooks/useShop";
import { useAppContext } from "../../../../hooks/appContext";
import { useSelector } from "@legendapp/state/react";
import { state } from "../../../../store";
import { StyledIcon } from "../../../../components/package/icon";

const Shop = ({onClose}) => {
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
    }

    await updateHandler(fields).then(async (result) => {
      result && (
        update()
      )
    })
  }

  return (
    <>
      <YStack
        flex={1}
        backgroundColor={theme.colors.gray[1]}
        paddingHorizontal={16}
      >

        <StyledSpacer marginVertical={16} />
        <HStack justifyContent="space-between" alignItems="center" >
          <HStack flex={1} horizontal justifyContent="flex-start" alignItems="center">
            <StyledIcon
              name="store"
              size={32}
              color={theme.colors.teal[400]}
            />
            <Text
              paddingHorizontal={4}
              fontFamily={fontStyles.Roboto_Regular}
              color={theme.colors.gray[500]}
              fontSize={theme.fontSize.large}
              fontWeight={theme.fontWeight.thin}
            >
              Shop
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
            label={'Name'}
            keyboardType='default'
            placeholder='Enter your shop name'
            returnKeyType='next'
            maxLength={50}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.gray[300]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={50}
            paddingHorizontal={8}
            value={fields.name}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={(text) => setFields({ ...fields, name: text })}
            error={!!errorMessages?.name}
            errorMessage={errorMessages?.name?.message}
            marginBottom={4}
          />
          <StyledInput
            label={'Email'}
            keyboardType='default'
            placeholder='Enter your email'
            returnKeyType='next'
            maxLength={50}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.gray[300]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={50}
            paddingHorizontal={8}
            value={fields.email}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={(text) => setFields({ ...fields, email: text })}
            error={!!errorMessages?.email}
            errorMessage={errorMessages?.email?.message}
            marginBottom={4}
          />
          <StyledInput
            label={'Mobile'}
            keyboardType='default'
            placeholder='Enter your mobile'
            returnKeyType='next'
            maxLength={20}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.gray[300]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={50}
            paddingHorizontal={8}
            value={fields.mobile}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={(text) => setFields({ ...fields, mobile: text })}
            error={!!errorMessages?.mobile}
            errorMessage={errorMessages?.mobile?.message}
            marginBottom={4}
          />
          <StyledInput
            label={'Currency'}
            keyboardType='default'
            placeholder='Enter your currency'
            returnKeyType='next'
            maxLength={3}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.gray[300]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={50}
            paddingHorizontal={8}
            value={fields.currency}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={(text) => setFields({ ...fields, currency: text })}
            error={!!errorMessages?.currency}
            errorMessage={errorMessages?.currency?.message}
            marginBottom={4}
          />
          <StyledMultiInput
            label={'Address'}
            keyboardType='default'
            placeholder='Enter your address'
            returnKeyType='done'
            maxLength={100}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.gray[300]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={16}
            paddingHorizontal={8}
            value={fields.address}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={(text) => setFields({ ...fields, address: text })}
            error={!!errorMessages?.address}
            errorMessage={errorMessages?.address?.message}
            marginBottom={4}
          />

          <StyledMultiInput
            label={'Description'}
            keyboardType='default'
            placeholder='Enter shop description'
            returnKeyType='done'
            maxLength={200}
            height={150}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.gray[300]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={16}
            value={fields.description}
            paddingHorizontal={8}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, description: text })}
          />

          <StyledSpacer marginVertical={8} />
          {
            !purchase_status && (
              <StyledButton width='100%' backgroundColor={theme.colors.yellow[500]} onPress={() => onSubmit()} >
                <StyledText paddingHorizontal={20} paddingVertical={10} color={theme.colors.gray[800]}>
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
    </>
  )
}

export default Shop