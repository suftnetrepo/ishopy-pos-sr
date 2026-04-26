import React, {useState} from 'react';
import {
  YStack,
  theme,
  XStack,
  StyledForm,
  StyledPressable,
  StyledCycle,
  StyledSpacer,
  StyledText,
  StyledTextInput,
  validate,
  StyledScrollView,
  StyledCard,
  Switch,
  toastService,
} from 'fluent-styles';
import {useLoaderAndError} from '../../../../hooks/useLoaderAndError';
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
  const {deleteAddOn} = useDeleteAddOn();
  const {loading, data, error, loadAddons, resetHandler} = useAddOns(menu_id);
  const {insert} = useInsertAddon();
  const {update} = useUpdateAddOn();
  const {shop} = useAppContext();
  const [errorMessages, setErrorMessages] = useState({});
  const [fields, setFields] = useState(addOnRules.fields);

  useLoaderAndError(loading, error, resetHandler);

  const onNotify = ({status, isDeleted}) => {
    toastService.show({
      message: `Addon ${status}`,
      description: isDeleted
        ? `Your addon was deleted successfully.`
        : `Your addon was ${status} successfully.`,
      variant: 'success',
      duration: 2500,
      theme: 'light',
    });
    setFields(addOnRules.reset());
  };

  const onDelete =  addOn_id => {
    deleteAddOn(addOn_id).then(async result => {
      onNotify({status: 'deleted', isDeleted: true});
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

    if (fields?.addOn_id) {
      update(
        fields.addOn_id,
        fields.addOnName,
        parseFloat(fields.price),
        fields.status
      ).then(() => {
        loadAddons(menu_id).then(() => {
          onNotify({status: 'updated'});
        });
      });
      return;
    }

    insert(
      fields.addOnName,
      parseFloat(fields.price),
      menu_id,
      fields.status
    ).then(() => {
      loadAddons(menu_id).then(() => {
        onNotify({status: 'added'});
      });
    });
  };

  const RenderCard = ({item, index}) => {
    return (
      <XStack
        flexDirection="row"
        marginHorizontal={8}
        flex={1}
        paddingHorizontal={8}
        backgroundColor={theme.colors.gray[1]}
        justifyContent="flex-start"
        borderBottomWidth={1}
        borderBottomColor={
          index === data.length - 1 ? 'transparent' : theme.colors.gray[200]
        }
        paddingBottom={index === data.length - 1 ? 0 : 8}
        alignItems="center">
        <YStack flex={2} justifyContent="center">
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
              onPress={() => setFields({...fields, ...item})}
            />
          </StyledCycle>
          <StyledSpacer marginHorizontal={8} />
          <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon
              size={32}
              name="delete-outline"
              color={theme.colors.gray[600]}
              onPress={() => onDelete(item.addOn_id)}
            />
          </StyledCycle>
        </XStack>
      </XStack>
    );
  };

  return (
    <>
      <StyledCard
        gap={8}
        paddingHorizontal={16}
        horizontal
        backgroundColor={theme.colors.gray[1]}
        borderRadius={16}
        marginHorizontal={16}
        marginTop={16}
        paddingVertical={16}>
        <StyledForm>
          <StyledTextInput
            label={'Name'}
            keyboardType="default"
            placeholder="Enter your addOn name"
            returnKeyType="next"
            maxLength={50}
            fontSize={theme.fontSize.small}
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
            maxLength={9}
            fontSize={theme.fontSize.small}
            paddingHorizontal={8}
            value={fields.price.toString()}
            placeholderTextColor={theme.colors.gray[300]}
            onChangeText={text => setFields({...fields, price: text})}
            error={!!errorMessages?.price}
            errorMessage={errorMessages?.price?.message}
          />
          <Switch
            activeValue={1}
            inactiveValue={0}
            defaultValue={0}
            value={fields.status}
            colors={{
              activeThumb: theme.colors.white,
              inactiveThumb: theme.colors.white,
              activeTrack: theme.colors.green[600],
              inactiveTrack: theme.colors.red[400],
            }}
            onChange={v => setFields({...fields, status: v})}
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
              Save Changes
            </StyledText>
          </StyledPressable>
        </StyledForm>
      </StyledCard>
      <StyledSpacer marginVertical={8} />
      <StyledScrollView>
        <StyledCard
          gap={8}
          horizontal
          backgroundColor={theme.colors.gray[1]}
          borderRadius={16}
          marginHorizontal={16}
          paddingVertical={16}>
          {data.map((item, index) => (
            <RenderCard item={item} key={index} index={index} />
          ))}
        </StyledCard>
      </StyledScrollView>
    </>
  );
};

export default ItemAddOn;
