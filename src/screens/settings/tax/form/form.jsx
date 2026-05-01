import React, {useState, useEffect} from 'react';
import {
  theme,
  validate,
  XStack,
  YStack,
  StyledCard,
  StyledPressable,
  StyledInput,
  StyledText,
  StyledButton,
  toastService,
  Switch,
} from 'fluent-styles';
// ...existing code...
import {fontStyles} from '../../../../configs/theme';
import {taxRules} from './validatorRules';
import {useUpdateTax, useInsertTax} from '../../../../hooks/useTax';
import {useLoaderAndError} from '../../../../hooks/useLoaderAndError';
import {useAppTheme} from '../../../../theme';

const TaxForm = ({tax, onClose}) => {
  const {t} = useAppTheme();
  const [errorMessages, setErrorMessages] = useState({});
  const [fields, setFields] = useState(taxRules.fields);
  const {update, error, loading, resetHandler} = useUpdateTax();
  const {insert} = useInsertTax();

  useLoaderAndError(loading, error, resetHandler);

  useEffect(() => {
    setFields(pre => ({
      ...pre,
      ...tax,
    }));
  }, [tax]);

  const inputProps = {
    fontSize: theme.fontSize.small,
    borderColor: t.borderDefault,
    backgroundColor: t.bgInput,
    color: t.textPrimary,
    paddingHorizontal: 8,
    placeholderTextColor: t.textMuted,
  };

  const onNotify = ({status, t}) => {
    toastService.show({
      message: `Tax ${status}`,
      description: `Your tax was ${status} successfully.`,
      variant: 'success',
      duration: 2500,
      theme: 'light',
    });
    setFields(taxRules.reset);
    onClose && onClose();
  };

  const onSubmit = async () => {
    setErrorMessages({});
    const {hasError, errors} = validate(fields, taxRules.rules);
    if (hasError) {
      setErrorMessages(errors);
      return false;
    }

    if (fields?.tax_id) {
      await update({...fields, rate: parseFloat(fields.rate)}).then(
        async result => {
          result && onNotify({status: 'updated'});
        }
      );
    } else {
      delete fields.tax_id;
      await insert({...fields, rate: parseFloat(fields.rate)}).then(
        async result => {
          result && onNotify({status: 'added'});
        }
      );
    }
  };

  return (
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
        <StyledInput
          label={'Name'}
          keyboardType="default"
          placeholder="Enter tax name"
          returnKeyType="next"
          maxLength={50}
          height={40}
          value={fields.name}
          onChangeText={text => setFields({...fields, name: text})}
          error={!!errorMessages.name}
          errorMessage={errorMessages.name?.message}
          {...inputProps}
        />
        <StyledInput
          label={'Rate'}
          keyboardType="number-pad"
          placeholder="Enter tax rate"
          returnKeyType="next"
          maxLength={50}
          height={40}
          value={
            fields.rate !== undefined && fields.rate !== null
              ? String(fields.rate)
              : ''
          }
          onChangeText={text => setFields({...fields, rate: text})}
          error={!!errorMessages.rate}
          errorMessage={errorMessages.rate?.message}
          {...inputProps}
        />
        <XStack justifyContent="flex-start" alignItems="center" gap={8}>
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
      </StyledCard>
    </YStack>
  );
};

export default TaxForm;
