/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {
  theme,
  validate,
  StyledSpinner,
  YStack,
  StyledOkDialog,
  StyledTextInput,
  StyledSpacer,
  StyledInput,
  StyledText,
  StyledPressable,
  StyledChip,
  StyledDivider,
  Stack,
  toastService,
} from 'fluent-styles';
import {shopRules} from './validatorRules';
import {useUpdateShop} from '../../../hooks/useShop';
import {useAppContext} from '../../../hooks/appContext';
import {StyledIcon} from '../../../components/package/icon';
import {fontStyles} from '../../../configs/theme';
import { useLoaderAndError } from '../../../hooks/useLoaderAndError';

// ─── Business mode options ────────────────────────────────────────────────────
const MODES = [
  {
    key: 'restaurant',
    label: 'Restaurant',
    icon: 'restaurant',
    description: 'Tables, orders & menu',
  },
  {
    key: 'shop',
    label: 'Shop',
    icon: 'storefront',
    description: 'Retail & quick sale',
  },
];

// ─── Section label ────────────────────────────────────────────────────────────
const SectionLabel = ({label}) => (
  <StyledText
    fontFamily={fontStyles.Roboto_Regular}
    fontSize={theme.fontSize.small}
    fontWeight={theme.fontWeight.semiBold}
    color={theme.colors.gray[500]}
    marginBottom={8}
    letterSpacing={0.5}>
    {label.toUpperCase()}
  </StyledText>
);

// ─── Main component ───────────────────────────────────────────────────────────
const Shop = ({onClose}) => {
  const {updateCurrentShop, shop} = useAppContext();
  const [errorMessages, setErrorMessages] = useState({});
  const [fields, setFields] = useState(shopRules.fields);
  const {updateHandler, error, loading, resetHandler} = useUpdateShop();

  useLoaderAndError(loading, error, resetHandler);

  useEffect(() => {
    setFields(prev => ({...prev, ...shop}));
  }, [shop]);

  const onSubmit = async () => {
    setErrorMessages({});
    const {hasError, errors} = validate(fields, shopRules.rules);
    if (hasError) {
      setErrorMessages(errors);
      return;
    }
    await updateHandler(fields).then(result => {
      if (result) {
        updateCurrentShop({...fields});
        toastService.show({
          message: 'Shop updated',
          description: 'Your shop details were saved successfully.',
          variant: 'success',
          duration: 2500,
          theme: 'light',
        });
        onClose && onClose();
      }
    });
  };

  const inputProps = {
    fontSize: theme.fontSize.normal,
    borderColor: theme.colors.gray[200],
    backgroundColor: theme.colors.gray[1],
    borderRadius: 12,
    paddingHorizontal: 12,
    placeholderTextColor: theme.colors.gray[300],
    marginBottom: 12,
  };

  return (
    <>
      <YStack flex={1} backgroundColor={theme.colors.gray[100]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 32,
          }}>

          {/* ── Business type ── */}
          <Stack
            backgroundColor={theme.colors.gray[1]}
            borderRadius={14}
            padding={16}
            marginBottom={12}>
        
            <Stack horizontal gap={10}>
              {MODES.map(mode => {
                const active = fields.mode === mode.key;
                return (
                  <StyledPressable
                    key={mode.key}
                    flex={1}
                    onPress={() => setFields({...fields, mode: mode.key})}
                    borderRadius={12}
                    borderWidth={active ? 2 : 1}
                    borderColor={
                      active
                        ? theme.colors.amber[500]
                        : theme.colors.gray[200]
                    }
                    backgroundColor={
                      active ? theme.colors.amber[50] : theme.colors.gray[50]
                    }
                    paddingVertical={14}
                    paddingHorizontal={12}>
                    <Stack vertical alignItems="center" gap={6}>
                      <Stack
                        width={40}
                        height={40}
                        borderRadius={20}
                        backgroundColor={
                          active
                            ? theme.colors.amber[100]
                            : theme.colors.gray[100]
                        }
                        alignItems="center"
                        justifyContent="center">
                        <StyledIcon
                          name={mode.icon}
                          size={22}
                          color={
                            active
                              ? theme.colors.amber[700]
                              : theme.colors.gray[400]
                          }
                        />
                      </Stack>
                      <StyledText
                        fontSize={theme.fontSize.small}
                        fontWeight={
                          active
                            ? theme.fontWeight.semiBold
                            : theme.fontWeight.normal
                        }
                        color={
                          active
                            ? theme.colors.amber[800]
                            : theme.colors.gray[600]
                        }>
                        {mode.label}
                      </StyledText>
                      <StyledText
                        fontSize={10}
                        color={
                          active
                            ? theme.colors.amber[600]
                            : theme.colors.gray[400]
                        }>
                        {mode.description}
                      </StyledText>
                    </Stack>
                    {active && (
                      <Stack position="absolute" top={8} right={8}>
                        <StyledIcon
                          name="check-circle"
                          size={18}
                          color={theme.colors.green[500]}
                        />
                      </Stack>
                    )}
                  </StyledPressable>
                );
              })}
            </Stack>
          </Stack>

          {/* ── Contact details ── */}
          <Stack
            backgroundColor={theme.colors.gray[1]}
            borderRadius={14}
            padding={16}
            marginBottom={12}>

            <StyledInput
              label="Shop name"
              placeholder="Enter your shop name"
              returnKeyType="next"
              maxLength={50}
              value={fields.name}
              onChangeText={text => setFields({...fields, name: text})}
              error={!!errorMessages?.name}
              errorMessage={errorMessages?.name?.message}
              {...inputProps}
            />
            <StyledInput
              label="Email"
              keyboardType="email-address"
              placeholder="hello@yourshop.com"
              returnKeyType="next"
              maxLength={50}
              value={fields.email}
              onChangeText={text => setFields({...fields, email: text})}
              error={!!errorMessages?.email}
              errorMessage={errorMessages?.email?.message}
              {...inputProps}
            />
            <StyledInput
              label="Mobile"
              keyboardType="phone-pad"
              placeholder="Enter your mobile number"
              returnKeyType="next"
              maxLength={20}
              value={fields.mobile}
              onChangeText={text => setFields({...fields, mobile: text})}
              error={!!errorMessages?.mobile}
              errorMessage={errorMessages?.mobile?.message}
              {...inputProps}
              marginBottom={0}
            />
          </Stack>

          {/* ── Localisation ── */}
          <Stack
            backgroundColor={theme.colors.gray[1]}
            borderRadius={14}
            padding={16}
            marginBottom={12}>
       
            <StyledInput
              label="Currency symbol"
              placeholder="£  $  €  ₦"
              returnKeyType="next"
              maxLength={3}
              value={fields.currency}
              onChangeText={text => setFields({...fields, currency: text})}
              error={!!errorMessages?.currency}
              errorMessage={errorMessages?.currency?.message}
              {...inputProps}
              marginBottom={0}
            />
          </Stack>

          {/* ── Address & description ── */}
          <Stack
            backgroundColor={theme.colors.gray[1]}
            borderRadius={14}
            padding={16}
            marginBottom={24}>
  
            <StyledTextInput
              label="Address"
              placeholder="Enter your address"
              returnKeyType="next"
              maxLength={100}
              value={fields.address}
              onChangeText={text => setFields({...fields, address: text})}
              error={!!errorMessages?.address}
              errorMessage={errorMessages?.address?.message}
              multiline
              numberOfLines={3}
              {...inputProps}
            />
            <StyledTextInput
              label="Description"
              placeholder="A short description of your business"
              returnKeyType="done"
              maxLength={200}
              value={fields.description}
              onChangeText={text => setFields({...fields, description: text})}
              multiline
              numberOfLines={4}
              height={120}
              {...inputProps}
              marginBottom={0}
            />
          </Stack>

          {/* ── Save button ── */}
          <StyledPressable
            onPress={onSubmit}
            backgroundColor={theme.colors.amber[500]}
            borderRadius={12}
            paddingVertical={14}
            alignItems="center"
            justifyContent="center">
            <StyledText
              fontSize={theme.fontSize.normal}
              fontWeight={theme.fontWeight.semiBold}
              color={theme.colors.gray[900]}>
              Save changes
            </StyledText>
          </StyledPressable>

        </ScrollView>
      </YStack>

      {error && (
        <StyledOkDialog
          title={error?.message}
          description="Please try again"
          visible={true}
          onOk={resetHandler}
        />
      )}
      {loading && <StyledSpinner />}
    </>
  );
};

export default Shop;