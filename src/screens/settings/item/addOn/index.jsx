import React, {useState, useEffect} from 'react';
import {
  YStack,
  theme,
  XStack,
  Stack,
  StyledForm,
  StyledPressable,
  StyledConfirmDialog,
  StyledCycle,
  StyledSpinner,
  StyledOkDialog,
  StyledSpacer,
  StyledText,
  StyledTextInput,
  validate,
  StyledScrollView
} from 'fluent-styles';
import {fontStyles} from '../../../../configs/theme';
import {StyledMIcon} from '../../../../components/icon';
import {formatCurrency, toWordCase} from '../../../../utils/help';
import {
  useAddOns,
  useDeleteAddOn,
  useInsertAddon,
  useUpdateAddOn,
} from '../../../../hooks/useAddon';
import {useAppContext} from '../../../../hooks/appContext';
import {addOnRules} from './validatorRules';

const ItemAddOn = ({menu_id}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const {loading, data, error, loadAddons} = useAddOns();
  const {deleteAddOn} = useDeleteAddOn();
  const {insert} = useInsertAddon();
  const {update} = useUpdateAddOn();
  const {shop} = useAppContext();
  const [errorMessages, setErrorMessages] = useState({});
  const [fields, setFields] = useState(addOnRules.fields);

  useEffect(() => {
    loadAddons(menu_id);
  }, [menu_id]);

  const onConfirm = () => {
    deleteAddOn(item?.menu_id).then(async result => {
      onItemDeleted();
      setIsDialogVisible(false);
    });
  };

  const onUpdate = fields => {
    update(fields).then(() => {
      loadAddons(menu_id);
    });
  };

  const onSubmit = async () => {
    setErrorMessages({});
    const {hasError, errors} = validate(fields, addOnRules.rules);
    if (hasError) {
      setErrorMessages(errors);
      return false;
    }

    insert(fields).then(() => {});
  };

  const RenderCard = ({item}) => {
    return (
      <XStack
        flexDirection="row"
        marginHorizontal={16}
        flex={1}
        borderColor={theme.colors.gray[400]}
        borderWidth={0.5}
        paddingHorizontal={8}
        backgroundColor={theme.colors.gray[1]}
        paddingVertical={8}
        justifyContent="flex-start"
        marginBottom={8}
        borderRadius={16}
        alignItems="center">
        <YStack flex={2}>
          <StyledText
            paddingHorizontal={8}
            fontFamily={fontStyles.Roboto_Regular}
            fontWeight={theme.fontWeight.normal}
            fontSize={theme.fontSize.small}
            color={theme.colors.gray[700]}>
            {toWordCase(item.addOnName)}
          </StyledText>
          <StyledSpacer marginVertical={1} />
          <StyledText
            paddingHorizontal={8}
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.small}
            fontWeight={theme.fontWeight.medium}
            color={theme.colors.gray[500]}>
            {formatCurrency(shop?.currency || '£', item.price)}
          </StyledText>
        </YStack>
        <XStack flex={1} justifyContent="flex-end" alignItems="center">
          <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon
              size={24}
              name="edit"
              color={theme.colors.gray[600]}
              onPress={() => onUpdate(item)}
            />
          </StyledCycle>
          <StyledSpacer marginHorizontal={8} />
          <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon
              size={32}
              name="delete-outline"
              color={theme.colors.gray[600]}
              onPress={() => onAddonChange(item.menu_id)}
            />
          </StyledCycle>
        </XStack>
      </XStack>
    );
  };

  return (
    <>
      <Stack gap={8} paddingHorizontal={16} horizontal>
        <StyledForm>
          <StyledTextInput
            label={'Name'}
            keyboardType="default"
            placeholder="Enter your addOn name"
            returnKeyType="next"
            maxLength={50}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.addOnName}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={text => setFields({...fields, addOnName: text})}
            error={!!errorMessages?.addOnName}
            errorMessage={errorMessages?.addOnName?.message}
          />
          <StyledTextInput
            label={'Price'}
            keyboardType="default"
            placeholder="Enter your addOn price"
            returnKeyType="next"
            maxLength={50}
            fontSize={theme.fontSize.normal}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.price}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={text => setFields({...fields, price: text})}
            error={!!errorMessages?.price}
            errorMessage={errorMessages?.price?.message}
          />
          <StyledPressable
            onPress={onSubmit}
            backgroundColor={theme.colors.yellow[500]}
            borderRadius={32}
            paddingVertical={12}
            alignItems="center">
            <StyledText
              color={theme.colors.white}
              fontSize={theme.fontSize.normal}
              fontWeight={theme.fontWeight.medium}>
              Submit
            </StyledText>
          </StyledPressable>
        </StyledForm>
      </Stack>
      <StyledSpacer marginVertical={8} />
      <StyledScrollView>
        {
            data.map ((item, index) => (
              <RenderCard item={item} key={index} />
            ))
        }
      </StyledScrollView>
      {error && (
        <StyledOkDialog
          title={error?.message}
          description="please try again"
          visible={true}
          onOk={() => {
            resetHandler();
          }}
        />
      )}
      {loading && <StyledSpinner />}
      {isDialogVisible && (
        <StyledConfirmDialog
          visible
          description="Are you sure you want to delete this Item?"
          confirm="Yes"
          cancel="No"
          title={'Confirmation'}
          onCancel={() => setIsDialogVisible(false)}
          onConfirm={() => onConfirm()}
        />
      )}
    </>
  );
};

export default ItemAddOn;
