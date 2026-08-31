/* eslint-disable prettier/prettier */
import React from 'react';
import {ScrollView, useWindowDimensions} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyledSpacer,
  StyledPressable,
  StyledSpinner,
  Stack,
  StyledPage,
  StyleShape,
  toastService,
} from 'fluent-styles';
import Text from '../../components/text';
import {useNavigation} from '@react-navigation/native';
import {useInAppPurchase} from '../../hooks/useInAppPurchase';
import {StyledIcon} from '../../components/package/icon';
import {useAppTheme} from '../../theme';

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

// ─── Benefit row (right card) ──────────────────────────────────────────────────
const Feature = ({text, t, isLast}) => (
  <Stack
    horizontal
    alignItems="center"
    gap={14}
    paddingVertical={14}
    borderBottomWidth={isLast ? 0 : 1}
    borderColor={t.borderDefault}>
    <Stack
      width={26}
      height={26}
      borderRadius={13}
      backgroundColor={t.successBg}
      alignItems="center"
      justifyContent="center"
      flexShrink={0}>
      <StyledIcon name="check" size={16} color={t.successColor} />
    </Stack>
    <Text variant="body" color={t.textPrimary} flex={1}>
      {text}
    </Text>
  </Stack>
);

// ─── Price card illustration — shield badge flanked by laurel sprigs, ────────
// sitting on a soft gold wave that spans the card width.
const PriceIllustration = ({t}) => (
  <Stack width="100%" height={110} alignItems="center" justifyContent="center">
    <Svg
      width="100%"
      height={110}
      viewBox="0 0 300 110"
      preserveAspectRatio="none"
      style={{position: 'absolute'}}>
      <Path
        d="M0 78 Q75 50 150 70 T300 58"
        stroke={t.brandPrimary}
        strokeWidth={1.5}
        fill="none"
        opacity={0.2}
      />
      <Path
        d="M0 92 Q75 68 150 84 T300 74"
        stroke={t.brandPrimary}
        strokeWidth={1.5}
        fill="none"
        opacity={0.13}
      />
    </Svg>

    <Stack horizontal alignItems="center" justifyContent="center" gap={18}>
      <Icon
        name="leaf"
        size={22}
        color={t.brandPrimary}
        style={{opacity: 0.55, transform: [{rotate: '-25deg'}]}}
      />
      <Stack
        width={68}
        height={68}
        borderRadius={34}
        backgroundColor={t.brandPrimaryBg}
        borderWidth={1}
        borderColor={t.brandPrimary + '33'}
        alignItems="center"
        justifyContent="center">
        <Icon name="shield-check" size={32} color={t.brandPrimary} />
      </Stack>
      <Icon
        name="leaf"
        size={22}
        color={t.brandPrimary}
        style={{opacity: 0.55, transform: [{scaleX: -1}, {rotate: '-25deg'}]}}
      />
    </Stack>
  </Stack>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
const PaywallScreen = ({onDismiss}) => {
  const navigation = useNavigation();
  const {t} = useAppTheme();
  const {width} = useWindowDimensions();
  const isCompact = width < 700;
  const {
    purchaseHandler,
    restorePurchases,
    isLoading,
    isActive,
    error,
  } = useInAppPurchase();

  const dismiss = () => (onDismiss ? onDismiss() : navigation.goBack());

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

  const price = '£19.99';

  return (
    <StyledPage hideStatusBarOnIOS backgroundColor={t.bgPage}>
      <Stack flex={1}>
        {/* Floating close button */}
        <Stack position="absolute" top={16} right={16} zIndex={10}>
          <StyledPressable onPress={dismiss}>
            <StyleShape
              cycle
              size={44}
              backgroundColor={t.bgCard}
              shadowColor="#000"
              shadowOffset={{width: 0, height: 2}}
              shadowOpacity={0.1}
              shadowRadius={6}
              elevation={3}>
              <StyledIcon
                pointerEvents="none"
                name="close"
                size={22}
                color={t.textPrimary}
              />
            </StyleShape>
          </StyledPressable>
        </Stack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            paddingHorizontal: isCompact ? 20 : 32,
            paddingTop: 40,
            paddingBottom: 40,
          }}>
          <Stack width="100%" maxWidth={900} alignSelf="center">
            {/* ── Header ── */}
            <Stack alignItems="center">
              <Stack horizontal alignItems="center" gap={10} marginBottom={20}>
                <Stack
                  width={40}
                  height={40}
                  borderRadius={12}
                  backgroundColor={t.brandPrimary}
                  alignItems="center"
                  justifyContent="center">
                  <Icon name="lock" size={20} color={t.textOnAmber} />
                </Stack>
                <Text variant="header" color={t.textPrimary}>
                  Kursa
                </Text>
              </Stack>

              <Stack
                horizontal
                flexWrap="wrap"
                justifyContent="center"
                marginBottom={8}>
                <Text
                  variant="display"
                  fontSize={isCompact ? 30 : 36}
                  color={t.textPrimary}
                  textAlign="center">
                  Kursa{' '}
                </Text>
                <Text
                  variant="display"
                  fontSize={isCompact ? 30 : 36}
                  color={t.brandPrimary}
                  textAlign="center">
                  Premium
                </Text>
              </Stack>

              <Text variant="body" color={t.textSecondary} textAlign="center">
                The complete POS for restaurants & shops
              </Text>

              <StyledSpacer marginVertical={10} />

              <Stack
                horizontal
                alignItems="center"
                gap={6}
                paddingHorizontal={16}
                paddingVertical={8}
                borderRadius={20}
                borderWidth={1}
                borderColor={t.brandPrimary}
                backgroundColor={t.bgCard}>
                <StyledIcon name="star" size={14} color={t.brandPrimary} />
                <Text variant="label" color={t.brandPrimaryText}>
                  One-time purchase
                </Text>
              </Stack>
            </Stack>

            <StyledSpacer marginVertical={20} />

            {/* ── Price + benefits cards ── */}
            <Stack horizontal={!isCompact} gap={16} alignItems="stretch">
              {/* Price card */}
              <Stack
                flex={1}
                backgroundColor={t.bgCard}
                borderRadius={20}
                borderWidth={1}
                borderColor={t.borderDefault}
                paddingHorizontal={24}
                paddingVertical={28}
                alignItems="center"
                justifyContent="center"
                overflow="hidden">
                <Stack alignItems="center">
                  <Stack
                    paddingHorizontal={12}
                    paddingVertical={5}
                    borderRadius={8}
                    backgroundColor={t.brandPrimaryBg}
                    marginBottom={14}>
                    <Text variant="overline" color={t.brandPrimaryText}>
                      One-time price
                    </Text>
                  </Stack>

                  <Text
                    variant="metric"
                    fontSize={isCompact ? 40 : 48}
                    lineHeight={isCompact ? 48 : 56}
                    color={t.textPrimary}>
                    {price}
                  </Text>

                  <Stack
                    width={40}
                    height={3}
                    borderRadius={2}
                    backgroundColor={t.brandPrimary}
                    marginTop={10}
                    marginBottom={16}
                  />

                  <Text variant="body" color={t.textSecondary} textAlign="center">
                    Pay once, own it forever.
                  </Text>
                  <Text variant="body" color={t.textSecondary} textAlign="center">
                    No subscriptions.
                  </Text>
                </Stack>

                <StyledSpacer marginVertical={20} />

                <PriceIllustration t={t} />
              </Stack>

              {/* Benefits card */}
              <Stack
                flex={1.15}
                backgroundColor={t.bgCard}
                borderRadius={20}
                borderWidth={1}
                borderColor={t.borderDefault}
                paddingHorizontal={24}
                paddingVertical={12}
                justifyContent="center">
                {FEATURES.map((f, i) => (
                  <Feature
                    key={f}
                    text={f}
                    t={t}
                    isLast={i === FEATURES.length - 1}
                  />
                ))}
              </Stack>
            </Stack>

            <StyledSpacer marginVertical={24} />

            {/* ── CTA ── */}
            <StyledPressable
              onPress={purchaseHandler}
              disabled={isLoading}
              backgroundColor={isLoading ? t.borderDefault : t.brandPrimary}
              borderRadius={14}
              paddingVertical={18}
              alignItems="center"
              justifyContent="center"
              flexDirection="row"
              gap={8}>
              <Icon
                name="lock-outline"
                size={18}
                color={isLoading ? t.textMuted : t.textOnAmber}
              />
              <Text
                variant="button"
                fontSize={16}
                color={isLoading ? t.textMuted : t.textOnAmber}>
                {isLoading ? 'Processing...' : 'Unlock Premium'}
              </Text>
            </StyledPressable>

            {/* Restore */}
            <StyledPressable
              onPress={restorePurchases}
              disabled={isLoading}
              paddingVertical={14}
              alignItems="center">
              <Text variant="label" color={t.brandPrimaryText}>
                Restore purchase
              </Text>
            </StyledPressable>

            {/* Legal */}
            <Text
              variant="caption"
              color={t.textMuted}
              textAlign="center"
              lineHeight={18}>
              {price} charged once. No subscriptions, ever.
              {'\n'}
              Managed in your App Store settings.
            </Text>
          </Stack>
        </ScrollView>

        {isLoading && <StyledSpinner />}
      </Stack>
    </StyledPage>
  );
};

export default PaywallScreen;
