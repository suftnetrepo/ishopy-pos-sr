
import React, { useState, useEffect } from "react";
import { validate, StyledForm, Switch, theme,StyledSpinner, XStack,  StyledDropdown, YStack, StyledOkDialog, StyledCheckBox, StyledSpacer, StyledInput, StyledText, StyledButton } from 'fluent-styles';
import { fontStyles } from "../../../../configs/theme";
import { menuRules } from "./validatorRules";
import { useUpdateMenu, useInsertMenu } from "../../../../hooks/useMenu";
import { ShowToast } from "../../../../components/toast";
import ColorPicker from "../../../../components/colorPicker";
import { useCategories } from "../../../../hooks/useCategory";
import { Stack } from "../../../../components/package/stack";
import PosIconPicker from '../../../../components/pos-icon-picker';

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
       
        <StyledForm flex={1}>
          <ColorPicker color={fields.color_code || theme.colors.purple[900]} onPress={(color) => setFields({ ...fields, color_code: color })} />
          <StyledInput
            label={'Name'}
            keyboardType='default'
            placeholder='Enter menu name'
            returnKeyType='next'
            maxLength={50}
            height={40}
            fontSize={theme.fontSize.small}
            
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
            data={data.map((item) => ({ value: item.category_id, label: item.name }))}
            value={fields.category_id}
            onChange={e => setFields({ ...fields, category_id: e.value })}
            error={!!errorMessages?.category_id}
            errorMessage={errorMessages?.category_id?.message}
            borderColor={theme.colors.gray[400]}
   
          />
      
          <Stack marginLeft={8}>
            <StyledText
              fontWeight={theme.fontWeight.normal}
              color={theme.colors.gray[800]}
              fontSize={theme.fontSize.large}
            >
              Icon
            </StyledText>
            <StyledSpacer marginVertical={4} />
            <PosIconPicker
              color={fields?.color_code || theme.colors.gray[500]}
              size={18}
              selected={fields?.icon_name}
              onSelect={icon => setFields({...fields, icon_name: icon})}
            />
          </Stack>
    
          <XStack
            justifyContent='flex-start'
            alignItems='center'
            gap={8}
            paddingHorizontal={16}
          >
            <Switch
                activeValue="yes"
                inactiveValue="no"
                value={fields.status === 1 ? true : false}
                onChange={(value) => setFields({ ...fields, status: value ? 1 : 0 })}
              />
            <StyledText
              fontWeight={theme.fontWeight.normal}
              color={theme.colors.gray[600]}
              fontSize={theme.fontSize.normal}
              fontFamily={fontStyles.Roboto_Regular}
            >
              Status
            </StyledText>

          </XStack>
       
          <StyledButton flex={1} backgroundColor={theme.colors.yellow[500]} onPress={() => onSubmit()} >
            <StyledText paddingHorizontal={20} paddingVertical={10} color={theme.colors.gray[800]}>
              Save Changes
            </StyledText>
          </StyledButton>
          <StyledSpacer marginVertical={4} />
        </StyledForm>
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