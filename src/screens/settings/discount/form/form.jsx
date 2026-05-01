import React, {useState, useEffect} from 'react';
import {
  validate,
  theme,
  XStack,
  YStack,
  StyledCard,
  StyledPressable,
  StyledSpacer,
  StyledInput,
  StyledText,
  StyledButton,
  toastService,
  Switch,
} from 'fluent-styles';

import {fontStyles} from '../../../../configs/theme';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {discountRules} from './validatorRules';
import {
  useUpdateDiscount,
  useInsertDiscount,
} from '../../../../hooks/useDiscount';

import {StyledIcon} from '../../../../components/package/icon';
import {useAppTheme} from '../../../../theme';

const DiscountForm = ({discount, onClose}) => {
  const {t} = useAppTheme();
  const [errorMessages, setErrorMessages] = useState({});
  const [fields, setFields] = useState(discountRules.fields);
  const {update, error, loading, resetHandler} = useUpdateDiscount();
  const {insert} = useInsertDiscount();

  useEffect(() => {
    setFields(pre => {
      return {
        ...pre,
        ...discount,
      };
    });
  }, [discount]);

  const onNotify = ({status, t}) => {
    toastService.show({
      message: `Discount ${status}`,
      description: `Your discount was ${status} successfully.`,
      variant: 'success',
      duration: 2500,
      theme: 'light',
    });
    setFields(discountRules.reset);
    onClose && onClose();
  };

  const onSubmit = async () => {
    setErrorMessages({});
    const {hasError, errors} = validate(fields, discountRules.rules);
    if (hasError) {
      setErrorMessages(errors);
      return false;
    }

    if (fields?.discount_id) {
      await update({...fields, rate: parseFloat(fields.rate)}).then(
        async result => {
          result && onNotify({status: 'updated'});
        }
      );
    } else {
      delete fields.discount_id;
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
          placeholder="Enter discount name"
          returnKeyType="next"
          maxLength={50}
          height={40}
          fontSize={theme.fontSize.small}
          paddingHorizontal={8}
          value={fields.name}
          placeholderTextColor={t.textMuted}
          onChangeText={text => setFields({...fields, name: text})}
          error={!!errorMessages.name}
          errorMessage={errorMessages.name?.message}
        />
        <StyledInput
          label={'Rate'}
          keyboardType="number-pad"
          placeholder="Enter discount rate"
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
          placeholderTextColor={t.textMuted}
          onChangeText={text => setFields({...fields, rate: text})}
          error={!!errorMessages.rate}
          errorMessage={errorMessages.rate?.message}
        />
        <XStack
          justifyContent="flex-start"
          alignItems="center"
          gap={8}
        >
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

export default DiscountForm;
