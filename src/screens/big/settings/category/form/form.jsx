
import React, { useState, useEffect } from "react";
import { validate, StyledSpinner, XStack, YStack, StyledOkDialog, StyledCheckBox, StyledSpacer, StyledInput, StyledText, StyledButton } from 'fluent-styles';
import { fontStyles, theme } from "../../../../../configs/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { categoryRules } from "./validatorRules";
import { useUpdateCategory, useInsertCategory } from "../../../../../hooks/useCategory";
import ColorPicker from "../../../../../components/colorPicker";
import {
  Text,
  HStack,
} from "@gluestack-ui/themed";
import { StyledIcon } from "../../../../../components/package/icon";
import { ShowToast } from "../../../../../components/toast";

const CategoryForm = ({ category, onClose }) => {
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(categoryRules.fields)
  const { updateCategory, error, loading, resetHandler } = useUpdateCategory()
  const { insertCategory } = useInsertCategory()

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

    if (fields.category_id) {
      await updateCategory(fields.category_id, fields.name, fields.status, fields.color_code).then(async (result) => {
           result && handleResult("Category was updated successfully")
      })
    } else {
      delete fields.category_id
      await insertCategory(fields.name, fields.status, fields.color_code).then(async (result) => {
            result && handleResult("Category was added successfully")
      })
    }
  }

 const handleResult = (message) => {
    ShowToast("Success", message)
    !category && setFields(discountRules.reset)
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
              name={category ? "create" : "add"}
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
              Category
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
          <ColorPicker color={fields.color_code || theme.colors.purple[900]} onPress={(color) => setFields({ ...fields, color_code: color })} />
          <StyledInput
            label={'Name'}
            keyboardType='default'
            placeholder='Enter category name'
            returnKeyType='next'
            maxLength={50}
            height={40}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.gray[300]}
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

          <StyledSpacer marginVertical={4} />
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

export default CategoryForm