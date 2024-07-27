/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { validate, StyledSpinner, YStack, StyledOkDialog, StyledHeader, StyledSafeAreaView, StyledSpacer, StyledInput, StyledText, StyledButton } from 'fluent-styles';
import { theme } from "../../../configs/theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { stockRules } from "./validatorRules";
import { useInsertStock } from "../../../hooks/useStock";
import { ShowToast } from "../../../components/toast";
import { useUpdateProduct } from "../../../hooks/useProduct";

const AddStock = () => {
  const navigator = useNavigation()
  const route = useRoute()
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(stockRules.fields)
  const { insert, error, loading, resetHandler } = useInsertStock()
  const { update } = useUpdateProduct()
  const { product } = route.params

  const onSubmit = async () => {
    setErrorMessages({})

    const { hasError, errors } = validate(fields, stockRules.rules)
    if (hasError) {
      setErrorMessages(errors)
      return false
    }

    const handleResult = async () => {
      ShowToast("Success", "Stock was added successfully")
      setFields(stockRules.reset)
    }

    await insert(product.product_id, parseInt(fields.stock)).then(async (result) => {
      if (result) {
        const updateProduct = {
          ...product,
          stock: parseInt(product.stock) + parseInt(fields.stock)
        }
        await update(product.product_id, updateProduct)
        await handleResult()
      }
    })
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={() => navigator.reset({
          key: "stocks",
          index: 0,
          routes: [{ name: 'stocks', params: { product } }]
        })} title='Add Stock' icon cycleProps={{
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
            label={'Quantity'}
            keyboardType='numeric'
            placeholder='Enter stock quantity'
            returnKeyType='next'
            maxLength={9}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.stock}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, stock: text })}
            error={!!errorMessages?.stock}
            errorMessage={errorMessages?.stock?.message}
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

export default AddStock