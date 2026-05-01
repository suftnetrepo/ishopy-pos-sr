/* eslint-disable prettier/prettier */
import React from 'react';
import {ScrollView, Linking} from 'react-native';
import {
  StyledText,
  StyledSpacer,
  StyledPressable,
  StyledSpinner,
  StyledDivider,
  Stack,
} from 'fluent-styles';
import {useNavigation} from '@react-navigation/native';
import {useInAppPurchase} from '../../hooks/useInAppPurchase';
import {StyledIcon} from '../../components/package/icon';
import {useAppTheme, fonts} from '../../theme';
import Logo from '../../components/tablet/logo';
import {toastService} from 'fluent-styles';

const FEATURES = [
  'Unlimited items, categories & menus',
  'Unlimited tables & orders',
  'Dine in · Bar · Takeaway modes',
  'Google Drive backup & restore',
  'Multi-user staff access',
  'Sales trends — weekly, monthly, yearly',
  'Receipt printer support',
  'Works fully offline — no internet needed',
];

// ─── Feature row ──────────────────────────────────────────────────────────────
const Feature = ({text, t}) => (
  <Stack horizontal alignItems="center" gap={12} paddingVertical={7}>
    <Stack
      width={22} height={22} borderRadius={11}
      backgroundColor={t.successBg}
      alignItems="center" justifyContent="center"
      flexShrink={0}>
      <StyledIcon name="check" size={14} color={t.successColor} />
    </Stack>
    <StyledText
      fontSize={15}
      fontFamily={fonts.bodyRegular}
      color={t.textPrimary}
      flex={1}>
      {text}
    </StyledText>
  </Stack>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
const PaywallScreen = ({onDismiss}) => {
  const navigation = useNavigation();
  const {t, isDark} = useAppTheme();
  const {purchaseHandler, restorePurchases, isLoading, isActive, error, product} =
    useInAppPurchase();

  const dismiss = () => onDismiss ? onDismiss() : navigation.goBack();

  React.useEffect(() => {
    if (isActive) {
      toastService.show({
        message: 'Welcome to Kursa Premium!',
        description: 'All features are now unlocked.',
        variant: 'success',
        duration: 3000,
        theme: 'light',
      });
      dismiss();
    }
  }, [isActive]);

  React.useEffect(() => {
    if (error) {
      toastService.show({
        message: 'Purchase failed',
        description: error,
        variant: 'error',
        duration: 3500,
        theme: 'light',
      });
    }
  }, [error]);

  const price = product?.localizedPrice || '£39.99';

  return (
    <Stack flex={1} backgroundColor={t.bgPage}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{paddingBottom: 40}}>

        {/* ── Dark hero ── */}
        <Stack
          backgroundColor={t.bgHero}
          paddingTop={16}
          paddingBottom={28}
          paddingHorizontal={24}
          alignItems="center">

          {/* Drag handle + close row */}
          <Stack
            horizontal width="100%"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={20}>
            <Stack width={36} />
            <Stack
              width={36} height={4} borderRadius={2}
              backgroundColor="rgba(255,255,255,0.2)"
            />
            <StyledPressable
              onPress={dismiss}
              width={36} height={36} borderRadius={18}
              backgroundColor="rgba(255,255,255,0.1)"
              alignItems="center" justifyContent="center">
              <StyledIcon name="close" size={18} color="rgba(255,255,255,0.6)" />
            </StyledPressable>
          </Stack>

          <Logo />
          <StyledSpacer marginVertical={8} />

          <StyledText
            fontFamily={fonts.displayBold}
            fontSize={24}
            fontWeight="700"
            color="#fafafa"
            letterSpacing={-0.5}>
            Kursa Premium
          </StyledText>

          <StyledSpacer marginVertical={4} />

          <StyledText
            fontFamily={fonts.bodyRegular}
            fontSize={13}
            color="rgba(255,255,255,0.55)"
            textAlign="center">
            The complete POS for restaurants & shops
          </StyledText>

          <StyledSpacer marginVertical={12} />

          {/* Trial badge */}
          <Stack
            paddingHorizontal={16} paddingVertical={6}
            borderRadius={20}
            borderWidth={0.5}
            borderColor="rgba(245,158,11,0.45)"
            backgroundColor="rgba(245,158,11,0.12)">
            <StyledText
              fontFamily={fonts.displaySemi}
              fontSize={12}
              fontWeight="600"
              color={t.brandPrimary}>
              7 days free — no credit card needed
            </StyledText>
          </Stack>
        </Stack>

        {/* ── Body ── */}
        <Stack paddingHorizontal={24} paddingTop={24}>

          {/* Price */}
          <Stack horizontal alignItems="baseline" gap={8} marginBottom={4}>
            <StyledText
              fontFamily={fonts.displayBold}
              fontSize={34}
              fontWeight="700"
              color={t.textPrimary}>
              {price}
            </StyledText>
            <StyledText
              fontFamily={fonts.bodyRegular}
              fontSize={14}
              color={t.textSecondary}>
              one-time
            </StyledText>
          </Stack>

          <StyledText
            fontFamily={fonts.bodyRegular}
            fontSize={13}
            color={t.textMuted}
            marginBottom={20}>
            Pay once, own it forever. No subscriptions.
          </StyledText>

          {/* Features */}
          <Stack vertical marginBottom={20}>
            {FEATURES.map((f, i) => <Feature key={i} text={f} t={t} />)}
          </Stack>

          <StyledDivider marginBottom={20} />

          {/* CTA */}
          <StyledPressable
            onPress={purchaseHandler}
            disabled={isLoading}
            backgroundColor={isLoading ? t.borderDefault : t.brandPrimary}
            borderRadius={12}
            paddingVertical={16}
            alignItems="center"
            justifyContent="center"
            marginBottom={12}>
            <StyledText
              fontFamily={fonts.displaySemi}
              fontSize={16}
              fontWeight="600"
              color={isLoading ? t.textMuted : t.textOnAmber}>
              {isLoading ? 'Processing...' : 'Start 7-day free trial'}
            </StyledText>
          </StyledPressable>

          {/* Restore */}
          <StyledPressable
            onPress={restorePurchases}
            disabled={isLoading}
            paddingVertical={10}
            alignItems="center">
            <StyledText
              fontFamily={fonts.bodyRegular}
              fontSize={13}
              color={t.textMuted}>
              Restore purchase
            </StyledText>
          </StyledPressable>

          {/* Legal */}
          <Stack paddingTop={8}>
            <StyledText
              fontFamily={fonts.bodyRegular}
              fontSize={11}
              color={t.textMuted}
              textAlign="center"
              lineHeight={18}>
              After the 7-day trial, {price} is charged as a one-time payment.{'\n'}
              Managed in your App Store settings.{' '}
            </StyledText>
            <Stack horizontal justifyContent="center" gap={4}>
              <StyledPressable onPress={() => Linking.openURL('https://kursa.app/privacy')}>
                <StyledText fontSize={11} color={t.textMuted} textDecorationLine="underline">
                  Privacy
                </StyledText>
              </StyledPressable>
              <StyledText fontSize={11} color={t.textMuted}>·</StyledText>
              <StyledPressable onPress={() => Linking.openURL('https://kursa.app/terms')}>
                <StyledText fontSize={11} color={t.textMuted} textDecorationLine="underline">
                  Terms
                </StyledText>
              </StyledPressable>
            </Stack>
          </Stack>

        </Stack>
      </ScrollView>

      {isLoading && <StyledSpinner />}
    </Stack>
  );
};

export default PaywallScreen;