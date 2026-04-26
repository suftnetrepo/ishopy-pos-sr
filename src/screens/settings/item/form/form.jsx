import React, {useState, useEffect} from 'react';
import {
  validate,
  StyledForm,
  Switch,
  StyledCard,
  theme,
  StyledSpinner,
  XStack,
  YStack,
  StyledOkDialog,
  StyledTextInput,
  StyledSpacer,
  toastService,
  StyledText,
  StyledPressable,
  StyledChip,
} from 'fluent-styles';
import {fontStyles} from '../../../../configs/theme';
import {menuRules} from './validatorRules';
import {useUpdateMenu, useInsertMenu} from '../../../../hooks/useMenu';
import ColorPicker from '../../../../components/colorPicker';
import {useCategories} from '../../../../hooks/useCategory';
import {Stack} from '../../../../components/package/stack';
import PosIconPicker from '../../../../components/pos-icon-picker';
import {useLoaderAndError} from '../../../../hooks/useLoaderAndError';

const ItemForm = ({item, onClose}) => {
  const [errorMessages, setErrorMessages] = useState({});
  const [fields, setFields] = useState(menuRules.fields);
  const {update, error, loading, resetHandler} = useUpdateMenu();
  const {insert} = useInsertMenu();
  const {data} = useCategories();

  useEffect(() => {
    setFields(pre => {
      return {
        ...pre,
        ...item,
      };
    });
  }, [item]);

  useLoaderAndError(loading, error, resetHandler);

  const onNotify = ({status, isDeleted}) => {
    toastService.show({
      message: `Item ${status}`,
      description: isDeleted
        ? `Your Item was deleted successfully.`
        : `Your Item was ${status} successfully.`,
      variant: 'success',
      duration: 2500,
      theme: 'light',
    });
    setFields(menuRules.reset);
    onClose && onClose();
  };

  const onSubmit = async () => {
    setErrorMessages({});
    const {hasError, errors} = validate(fields, menuRules.rules);
    if (hasError) {
      setErrorMessages(errors);
      return false;
    }

    if (fields?.menu_id) {
      await update(fields.menu_id, {
        ...fields,
        stock: parseInt(fields.stock || 0),
        price: parseFloat(fields.price),
        cost: parseFloat(fields.cost || 0),
        icon_name: fields.icon_name,
      }).then(async result => {
        result && onNotify({status: 'updated', isDeleted: false});
      });
    } else {
      delete fields.menu_id;
      await insert({
        ...fields,
        stock: parseInt(fields.stock || 0),
        price: parseFloat(fields.price),
        cost: parseFloat(fields.cost || 0),
        icon_name: fields.icon_name,
      }).then(async result => {
        result && onNotify({status: 'added', isDeleted: false});
      });
    }
  };

  return (
    <>
      <YStack flex={1} backgroundColor={theme.colors.gray[100]}>
        <StyledCard
          gap={8}
          paddingHorizontal={16}
          horizontal
          backgroundColor={theme.colors.gray[1]}
          borderRadius={16}
          marginHorizontal={16}
          marginTop={16}
          paddingVertical={16}>
          <ColorPicker
            color={fields.color_code || theme.colors.purple[900]}
            onPress={color => setFields({...fields, color_code: color})}
          />
          <StyledForm flex={1}>
            <StyledTextInput
              label={'Name'}
              keyboardType="default"
              placeholder="Enter menu name"
              returnKeyType="next"
              maxLength={50}
              fontSize={theme.fontSize.small}
              value={fields.name}
              placeholderTextColor={theme.colors.gray[400]}
              onChangeText={text => setFields({...fields, name: text})}
              error={!!errorMessages?.name}
              errorMessage={errorMessages?.name?.message}
            />
            <StyledTextInput
              label={'Price'}
              keyboardType="number-pad"
              placeholder="Enter price"
              returnKeyType="next"
              maxLength={50}
              fontSize={theme.fontSize.small}
              value={fields.price.toString()}
              placeholderTextColor={theme.colors.gray[400]}
              onChangeText={text => setFields({...fields, price: text})}
              error={!!errorMessages?.price}
              errorMessage={errorMessages?.price?.message}
            />
            <StyledTextInput
              label={'Cost'}
              keyboardType="number-pad"
              placeholder="Enter cost"
              returnKeyType="next"
              maxLength={50}
              fontSize={theme.fontSize.small}
              value={fields.cost.toString()}
              placeholderTextColor={theme.colors.gray[400]}
              onChangeText={text => setFields({...fields, cost: text})}
              error={!!errorMessages?.cost}
              errorMessage={errorMessages?.cost?.message}
            />
            <StyledTextInput
              label={'Quantity'}
              labelProps={{
                fontSize: theme.fontSize.small,
              }}
              keyboardType="number-pad"
              placeholder="Enter quantity"
              returnKeyType="next"
              maxLength={50}
              fontSize={theme.fontSize.normal}
              value={fields.stock.toString()}
              placeholderTextColor={theme.colors.gray[400]}
              onChangeText={text => setFields({...fields, stock: text})}
              error={!!errorMessages?.stock}
              errorMessage={errorMessages?.stock?.message}
            />
            <StyledText
              fontWeight={theme.fontWeight.semiBold}
              color={theme.colors.gray[600]}
              fontSize={theme.fontSize.small}
              fontFamily={fontStyles.Roboto_Regular}>
              Category
            </StyledText>
            <Stack horizontal gap={8} flexWrap="wrap">
              {(data || []).map(({name, category_id}) => (
                <StyledChip
                  key={category_id}
                  label={name}
                  variant="ingredient"
                  selected={fields.category_id === category_id}
                  onPress={() =>
                    setFields({...fields, category_id: category_id})
                  }
                />
              ))}
            </Stack>
            <Stack marginLeft={8}>
              <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                fontWeight={theme.fontWeight.normal}
                color={theme.colors.gray[800]}
                fontSize={theme.fontSize.normal}>
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
              justifyContent="flex-start"
              alignItems="center"
              gap={8}
              paddingHorizontal={16}>
              <Switch
                activeValue={1}
                inactiveValue={0}
                defaultValue={0}
                value={fields.status}
                onChange={value =>
                  setFields({...fields, status: parseInt(value ? 1 : 0)})
                }
                colors={{
                  activeThumb: theme.colors.white,
                  inactiveThumb: theme.colors.white,
                  activeTrack: theme.colors.green[600],
                  inactiveTrack: theme.colors.red[400],
                }}
              />
              <StyledText
                fontWeight={theme.fontWeight.normal}
                color={theme.colors.gray[600]}
                fontSize={theme.fontSize.normal}
                fontFamily={fontStyles.Roboto_Regular}>
                Status
              </StyledText>
            </XStack>
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
            <StyledSpacer marginVertical={4} />
          </StyledForm>
        </StyledCard>
      </YStack>
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
    </>
  );
};

export default ItemForm;
