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
import {useAppTheme} from '../../../../theme';

const ItemForm = ({item, onClose}) => {
  const [errorMessages, setErrorMessages] = useState({});
  const {t} = useAppTheme();
  const [fields, setFields] = useState(menuRules.fields);
  const {update, error, loading, resetHandler} = useUpdateMenu();
  const {insert} = useInsertMenu();
  const {data} = useCategories();

  useLoaderAndError(loading, error, resetHandler);

  useEffect(() => {
    setFields(pre => ({
      ...pre,
      ...item, // spread raw item first
      cost: parseFloat(parseFloat(item?.cost || 0).toFixed(2)), // then override with formatted
      price: parseFloat(parseFloat(item?.price || 0).toFixed(2)),
      stock: parseInt(item?.stock || 0),
    }));
  }, [item]);

  const onNotify = ({status, isDeleted, t}) => {
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
        price: parseFloat(parseFloat(fields.price || 0).toFixed(2)),
        cost: parseFloat(parseFloat(fields.cost || 0).toFixed(2)),
        icon_name: fields.icon_name,
      }).then(async result => {
        result && onNotify({status: 'updated', isDeleted: false});
      });
    } else {
      delete fields.menu_id;
      await insert({
        ...fields,
        stock: parseInt(fields.stock || 0),
        price: parseFloat(parseFloat(fields.price || 0).toFixed(2)),
        cost: parseFloat(parseFloat(fields.cost || 0).toFixed(2)),
        icon_name: fields.icon_name,
      }).then(async result => {
        result && onNotify({status: 'added', isDeleted: false});
      });
    }
  };

  return (
    <>
      <YStack flex={1} backgroundColor={t.bgPage}>
        <StyledCard
          gap={8}
          paddingHorizontal={16}
          horizontal
          backgroundColor={t.bgCard}
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
              backgroundColor={t.bgInput}
              color={t.textPrimary}
              borderColor={t.borderDefault}
              value={fields.name}
              placeholderTextColor={t.textMuted}
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
              backgroundColor={t.bgInput}
              color={t.textPrimary}
              borderColor={t.borderDefault}
              value={fields.price?.toString() || ''}
              placeholderTextColor={t.textMuted}
              onChangeText={text => setFields({...fields, price: text})}
              onBlur={() =>
                setFields(f => ({
                  ...f,
                  price: parseFloat(parseFloat(f.price || 0).toFixed(2)),
                }))
              }
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
              backgroundColor={t.bgInput}
              color={t.textPrimary}
              borderColor={t.borderDefault}
              value={fields.cost?.toString() || ''}
              placeholderTextColor={t.textMuted}
              onChangeText={text => setFields({...fields, cost: text})}
              onBlur={() =>
                setFields(f => ({
                  ...f,
                  cost: parseFloat(parseFloat(f.cost || 0).toFixed(2)),
                }))
              }
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
              backgroundColor={t.bgInput}
              color={t.textPrimary}
              borderColor={t.borderDefault}
              value={fields.stock.toString()}
              placeholderTextColor={t.textMuted}
              onChangeText={text => setFields({...fields, stock: text})}
              error={!!errorMessages?.stock}
              errorMessage={errorMessages?.stock?.message}
            />
            <StyledText
              fontWeight={theme.fontWeight.semiBold}
              color={t.textSecondary}
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
                color={t.textPrimary}
                fontSize={theme.fontSize.normal}>
                Icon
              </StyledText>
              <StyledSpacer marginVertical={4} />
              <PosIconPicker
                color={fields?.color_code || t.textSecondary}
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
                  activeTrack: t.successColor,
                  inactiveTrack: t.dangerColor,
                }}
              />
              <StyledText
                fontWeight={theme.fontWeight.normal}
                color={t.textSecondary}
                fontSize={theme.fontSize.normal}
                fontFamily={fontStyles.Roboto_Regular}>
                Status
              </StyledText>
            </XStack>
            <StyledPressable
              onPress={onSubmit}
              backgroundColor={t.brandPrimary}
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
