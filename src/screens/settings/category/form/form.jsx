import React, {useState, useEffect} from 'react';
import {
  validate,
  theme,
  XStack,
  YStack,
  Stack,
  StyledSpacer,
  StyledText,
  Switch,
  StyledCard,
  StyledPressable,
  StyledTextInput,
  toastService
} from 'fluent-styles';
import {fontStyles} from '../../../../configs/theme';
import {categoryRules} from './validatorRules';
import {
  useUpdateCategory,
  useInsertCategory,
} from '../../../../hooks/useCategory';
import ColorPicker from '../../../../components/colorPicker';
import PosIconPicker from '../../../../components/pos-icon-picker';
import {useLoaderAndError} from '../../../../hooks/useLoaderAndError';

const CategoryForm = ({category, onClose}) => {
  const [errorMessages, setErrorMessages] = useState({});
  const [fields, setFields] = useState(categoryRules.fields);
  const {updateCategory, error, loading, resetHandler} = useUpdateCategory();
  const {insertCategory} = useInsertCategory();

  useEffect(() => {
    setFields(pre => {
      return {
        ...pre,
        ...category,
      };
    });
  }, [category]);

  useLoaderAndError(loading, error, resetHandler);

  const onNotify = ({status}) => {
    toastService.show({
      message: `Category ${status}`,
      description: `Your category was ${status} successfully.`,
      variant: 'success',
      duration: 2500,
      theme: 'light',
    });
    setFields(categoryRules.reset);
    onClose && onClose();
  };

  const onSubmit = async () => {
    setErrorMessages({});
    const {hasError, errors} = validate(fields, categoryRules.rules);
    if (hasError) {
      setErrorMessages(errors);
      return false;
    }

    if (fields.category_id) {
      await updateCategory(
        fields.category_id,
        fields.name,
        fields.status,
        fields.color_code,
        fields.icon_name
      ).then(async result => {
        result && onNotify({status: 'updated'});
      });
    } else {
      delete fields.category_id;
      await insertCategory(
        fields.name,
        fields.status,
        fields.color_code,
        fields.icon_name
      ).then(async result => {
        result && onNotify({status: 'added'});
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

          <StyledTextInput
            label={'Name'}
            keyboardType="default"
            placeholder="Enter category name"
            returnKeyType="next"
            maxLength={50}
            fontSize={theme.fontSize.small}
            value={fields.name}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={text => setFields({...fields, name: text})}
            error={!!errorMessages?.name}
            errorMessage={errorMessages?.name?.message}
          />

          <Stack>
            <StyledText
              fontWeight={theme.fontWeight.normal}
              color={theme.colors.gray[800]}
              fontSize={theme.fontSize.large}>
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
        </StyledCard>
      </YStack>
    </>
  );
};

export default CategoryForm;
