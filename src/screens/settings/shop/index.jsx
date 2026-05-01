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
import ThemeToggle from '../../../components/ThemeToggle';
import {fontStyles} from '../../../configs/theme';
import {useAppTheme} from '../../../theme';

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
const SectionLabel = ({label, t}) => (
  <StyledText
    fontFamily={fontStyles.Roboto_Regular}
    fontSize={theme.fontSize.small}
    fontWeight={theme.fontWeight.semiBold}
    color={t.textSecondary}
    marginBottom={8}
    letterSpacing={0.5}>
    {label.toUpperCase()}
  </StyledText>
);

// ─── Main component ───────────────────────────────────────────────────────────
const Shop = ({onClose}) => {
  const {t} = useAppTheme();
  const {updateCurrentShop, shop} = useAppContext();
  const [errorMessages, setErrorMessages] = useState({});
  const [fields, setFields] = useState(shopRules.fields);
  const {updateHandler, error, loading, resetHandler} = useUpdateShop();

  useEffect(() => {
    setFields(prev => ({...prev, ...shop}));
  }, []);

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
    borderColor: t.borderDefault,
    backgroundColor: t.bgInput,
    color: t.textPrimary,
    borderRadius: 12,
    paddingHorizontal: 12,
    placeholderTextColor: t.textMuted,
    marginBottom: 12,
  };

  return (
    <>
      <YStack flex={1} backgroundColor={t.bgPage}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 32,
          }}>

          {/* ── Business type ── */}
          <Stack
            backgroundColor={t.bgCard}
            borderRadius={14}
            padding={16}
            marginBottom={12}>
            <SectionLabel label="Business type" 
                        t={t}/>
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
                        ? t.brandPrimary
                        : t.borderDefault
                    }
                    backgroundColor={
                      active ? t.brandPrimaryBg : t.bgPage
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
                            ? t.brandPrimaryBg
                            : t.bgPage
                        }
                        alignItems="center"
                        justifyContent="center">
                        <StyledIcon
                          name={mode.icon}
                          size={22}
                          color={
                            active
                              ? t.brandPrimaryText
                              : t.textMuted
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
                            ? t.brandPrimaryText
                            : t.textSecondary
                        }>
                        {mode.label}
                      </StyledText>
                      <StyledText
                        fontSize={10}
                        color={
                          active
                            ? t.brandPrimaryDark
                            : t.textMuted
                        }>
                        {mode.description}
                      </StyledText>
                    </Stack>
                    {active && (
                      <Stack position="absolute" top={8} right={8}>
                        <StyledIcon
                          name="check-circle"
                          size={18}
                          color={t.successColor}
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
            backgroundColor={t.bgCard}
            borderRadius={14}
            padding={16}
            marginBottom={12}>
            <SectionLabel label="Contact details" 
                        t={t}/>
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
            backgroundColor={t.bgCard}
            borderRadius={14}
            padding={16}
            marginBottom={12}>
            <SectionLabel label="Localisation" 
                        t={t}/>
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
            backgroundColor={t.bgCard}
            borderRadius={14}
            padding={16}
            marginBottom={24}>
            <SectionLabel label="About" 
                        t={t}/>
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

          {/* ── Appearance ── */}
          <Stack
            backgroundColor={t.bgCard}
            borderRadius={14}
            padding={16}
            marginBottom={24}>
            <SectionLabel label="Appearance" 
                        t={t}/>
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontSize={theme.fontSize.small}
              color={t.textSecondary}
              marginBottom={10}>
              Choose light, dark or follow your device setting
            </StyledText>
            <ThemeToggle />
          </Stack>

          {/* ── Save button ── */}
          <StyledPressable
            onPress={onSubmit}
            backgroundColor={t.brandPrimary}
            borderRadius={12}
            paddingVertical={14}
            alignItems="center"
            justifyContent="center">
            <StyledText
              fontSize={theme.fontSize.normal}
              fontWeight={theme.fontWeight.semiBold}
              color={t.textPrimary}>
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