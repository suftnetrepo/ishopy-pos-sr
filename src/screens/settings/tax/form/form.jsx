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

const TaxForm = ({tax, onClose}) => {
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

  const onNotify = ({status}) => {
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
        <StyledInput
          label={'Name'}
          keyboardType="default"
          placeholder="Enter tax name"
          returnKeyType="next"
          maxLength={50}
          height={40}
          fontSize={theme.fontSize.small}
          paddingHorizontal={8}
          value={fields.name}
          placeholderTextColor={theme.colors.gray[400]}
          onChangeText={text => setFields({...fields, name: text})}
          error={!!errorMessages.name}
          errorMessage={errorMessages.name?.message}
        />
        <StyledInput
          label={'Rate'}
          keyboardType="number-pad"
          placeholder="Enter tax rate"
          returnKeyType="next"
          maxLength={50}
          height={40}
          fontSize={theme.fontSize.small}
          paddingHorizontal={8}
          value={
            fields.rate !== undefined && fields.rate !== null
              ? String(fields.rate)
              : ''
          }
          placeholderTextColor={theme.colors.gray[400]}
          onChangeText={text => setFields({...fields, rate: text})}
          error={!!errorMessages.rate}
          errorMessage={errorMessages.rate?.message}
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
  );
};

export default TaxForm;
