/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { validate, StyledSpinner, XStack, YStack, StyledOkDialog, StyledCheckBox, StyledHeader, StyledSafeAreaView, StyledSpacer, StyledInput, StyledText, StyledButton } from 'fluent-styles';
import { theme } from "../../../configs/theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { categoryRules } from "./validatorRules";
import { useUpdateCategory } from "../../../hooks/useCategory";
import ColorPicker from "../../../components/colorPicker";

const EditCategory = () => {
  const navigator = useNavigation()
  const route = useRoute()
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(categoryRules.fields)
  const { updateCategory, error, loading, resetHandler } = useUpdateCategory()
  const { category } = route.params
 
  useEffect(() => {
    setFields((pre) => {
      return {
        ...pre,
        ...category
      }
    })
  }, [category])

  const onSubmit = async () => {
    setErrorMessages({})
    const { hasError, errors } = validate(fields, categoryRules.rules)
    if (hasError) {
      setErrorMessages(errors)
      return false
    }

    await updateCategory(fields.category_id, fields.name, fields.status, fields.color_code).then(async (result) => {
      result && (
        navigator.reset({
          key: 'categories',
          index: 0,
          routes: [{ name: 'categories' }],
        })
      )
    })
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={() => navigator.reset({
          key: "categories",
          index: 0,
          routes: [{ name: 'categories' }]
        })} title='Edit Category' icon cycleProps={{
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
          <ColorPicker color={fields.color_code || theme.colors.purple[900]} onPress={(color) => setFields({ ...fields, color_code: color })} />
          <StyledInput
            label={'Name'}
            keyboardType='default'
            placeholder='Enter category name'
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
          <StyledSpacer marginVertical={4} />
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

export default EditCategory