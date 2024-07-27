/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { validate, StyledSpinner, YStack, XStack, StyledOkDialog, StyledInput, StyledHeader, StyledCheckBox, StyledSafeAreaView, StyledSpacer, StyledText, StyledButton } from 'fluent-styles';
import { theme } from "../../../configs/theme";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useInsertProduct } from "../../../hooks/useProduct";
import { ShowToast } from "../../../components/toast";
import { productRules } from "./validatorRules";
// import { StyledInput } from "../../../components/form";
import { StyledDropdown } from "../../../components/dropdown";
import ColorPicker from "../../../components/colorPicker";
import { useCategories } from "../../../hooks/useCategory";

const AddProduct = () => {
  const navigator = useNavigation()
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(productRules.fields)
  const { insert, error, loading, resetHandler } = useInsertProduct()
  const { data } = useCategories()

  const onSubmit = async () => {
    setErrorMessages({})
    const { hasError, errors } = validate(fields, productRules.rules)
    if (hasError) {
      setErrorMessages(errors)
      return false
    }

    const handleResult = () => {
      ShowToast("Success", "Product was added successfully", "success")
      setFields(productRules.reset)
    }

    await insert({...fields, stock: 0, price : parseFloat(fields.price), cost : parseFloat(fields.cost || 0)}).then(async (result) => {
      result && handleResult()
    })

  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={() => navigator.reset({
          key: "products",
          index: 0,
          routes: [{ name: 'products' }]
        })} title='Add Product' icon cycleProps={{
          borderColor: theme.colors.gray[300],
          marginRight: 8
        }} />
      </StyledHeader>
      <YStack
        flex={1}
        backgroundColor={theme.colors.gray[100]}
        paddingHorizontal={16}
      >
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <ColorPicker color={theme.colors.purple[900]} onPress={(color) => setFields({ ...fields, color_code: color })} />
          <StyledInput
            label={'Name'}
            keyboardType='default'
            placeholder='Enter your product name'
            returnKeyType='next'
            maxLength={50}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.name}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, name: text })}
            error={!!errorMessages?.name}
            errorMessage={errorMessages?.name?.message}
          />
          <StyledInput
            label={'Price'}
            keyboardType='number-pad'
            placeholder='Enter your price'
            returnKeyType='next'
            maxLength={50}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.price.toString()}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, price: text })}
            error={!!errorMessages?.price}
            errorMessage={errorMessages?.price?.message}
          />

          <StyledInput
            label={'Cost'}
            keyboardType='number-pad'
            placeholder='Enter your cost'
            returnKeyType='next'
            maxLength={50}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.cost.toString()}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, cost: text })}
            error={!!errorMessages?.cost}
            errorMessage={errorMessages?.cost?.message}
          />
          
          <StyledDropdown
            placeholder={'Select a category'}
            label={'Category'}
            items={data.map((item) => ({ value: item.category_id, label: item.name }))}
            value={fields.category_id}
            onSelectItem={e => setFields({ ...fields, category_id: e.value })}
            error={!!errorMessages?.category_id}
            errorMessage={errorMessages?.category_id?.message}
            listMode='MODAL'
          />         
          <XStack
            justifyContent='flex-start'
            alignItems='center'
            paddingVertical={8}
            paddingHorizontal={16}
          >
            <StyledCheckBox
              height={30}
              width={30}
              checked={fields.status === 1 ? true : false}
              checkedColor={theme.colors.pink[600]}
              onPress={(value) => setFields({ ...fields, status: value ? 1 : 0 })}
            />
            <StyledSpacer marginHorizontal={8} />
            <StyledText
              fontWeight={theme.fontWeight.normal}
              color={theme.colors.gray[600]}
              fontSize={theme.fontSize.large}
            >
              Status
            </StyledText>

          </XStack>
          <StyledSpacer marginVertical={4} />
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

export default AddProduct