
import React, { useState, useEffect } from "react";
import { validate, StyledSpinner, XStack, YStack, StyledOkDialog, StyledCheckBox, StyledSpacer, StyledInput, StyledText, StyledButton } from 'fluent-styles';
import {
  Text,
  HStack,
} from "@gluestack-ui/themed";
import { fontStyles, theme } from "../../../../../configs/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { discountRules } from "./validatorRules";
import { useUpdateDiscount, useInsertDiscount } from "../../../../../hooks/useDiscount";
import { ShowToast } from "../../../../../components/toast";
import { StyledIcon } from "../../../../../components/package/icon";

const DiscountForm = ({ discount, onClose }) => {
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(discountRules.fields)
  const { update, error, loading, resetHandler } = useUpdateDiscount()
  const { insert } = useInsertDiscount()

  useEffect(() => {
    setFields((pre) => {
      return {
        ...pre,
        ...discount
      }
    })
  }, [discount])

  const onSubmit = async () => {
    setErrorMessages({})
    const { hasError, errors } = validate(fields, discountRules.rules)
    if (hasError) {
      setErrorMessages(errors)
      return false
    }

    if (fields?.discount_id) {
      await update({ ...fields, rate: parseFloat(fields.rate) }).then(async (result) => {
        result && handleResult("Discount was updated successfully")
      })
    } else {
      delete fields.discount_id
      await insert({ ...fields, rate: parseFloat(fields.rate) }).then(async (result) => {
        result && handleResult("Discount was added successfully")
      })
    }
  }

  const handleResult = (message) => {
    ShowToast("Success", message)
    !discount && setFields(discountRules.reset)
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
              name={discount ? "create" : "add"}
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
              Discount
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
            placeholder='Enter discount name'
            returnKeyType='next'
            maxLength={50}
            height={40}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.gray[400]}
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
            label={'Rate'}
            keyboardType='number-pad'
            placeholder='Enter discount rate'
            returnKeyType='next'
            maxLength={50}
            height={40}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.gray[400]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields?.rate?.toString()}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, rate: text })}
            error={!!errorMessages?.rate}
            errorMessage={errorMessages?.rate?.message}
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

export default DiscountForm