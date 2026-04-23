
import React, { useState, useEffect } from "react";
import { validate, StyledSpinner, XStack, YStack, StyledOkDialog, StyledCheckBox, StyledSpacer, StyledInput, StyledText, StyledButton } from 'fluent-styles';
import {
  Text,
  HStack,
} from "@gluestack-ui/themed";
import { fontStyles, theme } from "../../../../../configs/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { menuRules } from "./validatorRules";
import { useUpdateMenu, useInsertMenu } from "../../../../../hooks/useMenu";
import { ShowToast } from "../../../../../components/toast";
import { StyledIcon } from "../../../../../components/package/icon";
import { StyledDropdown } from "../../../../../components/dropdown";
import ColorPicker from "../../../../../components/colorPicker";
import { useCategories } from "../../../../../hooks/useCategory";
import IconPicker from "../../../../../components/icon-picker";
import { Stack } from "../../../../../components/package/stack";

const ItemForm = ({ item, onClose }) => {
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(menuRules.fields)
  const { update, error, loading, resetHandler } = useUpdateMenu()
  const { insert } = useInsertMenu()
  const { data } = useCategories()

  useEffect(() => {
    setFields((pre) => {
      return {
        ...pre,
        ...item
      }
    })
  }, [item])

  const onSubmit = async () => {
    setErrorMessages({})
    const { hasError, errors } = validate(fields, menuRules.rules)
    if (hasError) {
      setErrorMessages(errors)
      return false
    }

    if (fields?.menu_id) {
      await update(fields.menu_id, { ...fields, stock: parseInt(fields.stock), price: parseFloat(fields.price), cost: parseFloat(fields.cost),icon_name: fields.icon_name }).then(async (result) => {
        result && handleResult("Item was updated successfully")
      })
    } else {
      delete fields.menu_id
      await insert({ ...fields, stock: parseInt(fields.stock), price: parseFloat(fields.price), cost: parseFloat(fields.cost || 0), icon_name: fields.icon_name }).then(async (result) => {
        result && handleResult("Item was added successfully")
      })
    }
  }

  const handleResult = (message) => {
    ShowToast("Success", message)
    !item && setFields(menuRules.reset)
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
              name={item ? "create" : "add"}
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
              Item
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
            placeholder='Enter menu name'
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
            label={'Price'}
            keyboardType='number-pad'
            placeholder='Enter price'
            returnKeyType='next'
            maxLength={50}
            height={40}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.gray[400]}
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
            placeholder='Enter cost'
            returnKeyType='next'
            maxLength={50}
            height={40}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.gray[400]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.cost.toString()}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, cost: text })}
            error={!!errorMessages?.cost}
            errorMessage={errorMessages?.cost?.message}
          />
          <StyledInput
            label={'Quantity'}
            keyboardType='number-pad'
            placeholder='Enter quantity'
            returnKeyType='next'
            maxLength={50}
            height={40}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.gray[400]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.stock.toString()}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, stock: text })}
            error={!!errorMessages?.stock}
            errorMessage={errorMessages?.stock?.message}
          />
          <StyledDropdown
            placeholder={'Select a category'}
            label={'Category'}
            items={data.map((item) => ({ value: item.category_id, label: item.name }))}
            value={fields.category_id}
            onSelectItem={e => setFields({ ...fields, category_id: e.value })}
            error={!!errorMessages?.category_id}
            errorMessage={errorMessages?.category_id?.message}
            borderColor={theme.colors.gray[400]}
            backgroundColor={theme.colors.gray[1]}
            listMode='MODAL'
          />
          <StyledSpacer marginVertical={4} />
          <Stack marginLeft={8}>
            <StyledText
              fontWeight={theme.fontWeight.normal}
              color={theme.colors.gray[800]}
              fontSize={theme.fontSize.large}
            >
              Icon
            </StyledText>
            <StyledSpacer marginVertical={4} />
            <IconPicker name="Main" size={18} selectedIcon={fields?.icon_name} onPress={(icon) => setFields({ ...fields, icon_name: icon })} />
          </Stack>
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

export default ItemForm