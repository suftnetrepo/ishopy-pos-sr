/* eslint-disable prettier/prettier */
import React from 'react';
import {ScrollView, Linking} from 'react-native';
import {
  StyledPage,
  StyledText,
  StyledSpacer,
  StyledPressable,
  StyledSpinner,
  Stack,
  theme,
  toastService,
  StyledShape,
} from 'fluent-styles';
import {useNavigation} from '@react-navigation/native';
import {useInAppPurchase} from '../../hooks/useInAppPurchase';
import {StyledIcon} from '../../components/package/icon';
import Logo from '../../components/tablet/logo';

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

const Feature = ({text}) => (
  <Stack horizontal alignItems="center" gap={12} paddingVertical={7}>
    <Stack
      width={22}
      height={22}
      borderRadius={11}
      backgroundColor={theme.colors.green[50]}
      alignItems="center"
      justifyContent="center"
      flexShrink={0}>
      <StyledIcon name="check" size={14} color={theme.colors.green[600]} />
    </Stack>
    <StyledText
      fontSize={theme.fontSize.normal}
      color={theme.colors.gray[800]}
      flex={1}>
      {text}
    </StyledText>
  </Stack>
);

const PaywallScreen = ({onDismiss}) => {
  const navigation = useNavigation();
  const {
    purchaseHandler,
    restorePurchases,
    isLoading,
    isActive,
    error,
    product,
  } = useInAppPurchase();

  React.useEffect(() => {
    if (isActive) {
      toastService.show({
        message: 'Welcome to Kursa Premium!',
        description: 'All features are now unlocked.',
        variant: 'success',
        duration: 3000,
        theme: 'light',
      });
      onDismiss ? onDismiss() : navigation.goBack();
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
    <Stack flex={1} width="100%" backgroundColor={theme.colors.gray[1]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{paddingBottom: 40}}>
        {/* ── Dark hero ── */}
        <Stack
          backgroundColor="#1c1917"
          paddingTop={16}
          paddingBottom={28}
          paddingHorizontal={24}
          alignItems="center">
          {/* Drag handle + close row */}
          <Stack
            horizontal
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={20}>
            {/* Spacer left */}
            <Stack width={36} />
            {/* Drag handle centre */}
            <Stack
              width={36}
              height={4}
              borderRadius={2}
              backgroundColor="rgba(255,255,255,0.2)"
            />
            {/* Close right */}
            <StyledPressable
              onPress={() => (onDismiss ? onDismiss() : navigation.goBack())}
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor={theme.colors.gray[100]}
              alignItems="center"
              justifyContent="center">
              <StyledIcon
                pointerEvents="none"
                name="close"
                size={18}
                color={theme.colors.gray[800]}
              />
            </StyledPressable>
          </Stack>

          <StyledShape cycle>
            <Logo />
          </StyledShape>

          <StyledSpacer marginVertical={8} />

          <StyledText
            fontSize={24}
            fontWeight={theme.fontWeight.semiBold}
            color="#fafafa"
            letterSpacing={-0.5}>
            Kursa Premium
          </StyledText>
          <StyledSpacer marginVertical={4} />
          <StyledText fontSize={13} color="#a1a1aa" textAlign="center">
            The complete POS for restaurants & shops
          </StyledText>
          <StyledSpacer marginVertical={12} />

          {/* Trial badge */}
          <Stack
            paddingHorizontal={16}
            paddingVertical={6}
            borderRadius={20}
            borderWidth={0.5}
            borderColor="rgba(245,158,11,0.4)"
            backgroundColor="rgba(245,158,11,0.12)">
            <StyledText
              fontSize={12}
              fontWeight={theme.fontWeight.medium}
              color="#f59e0b">
              7 days free — no credit card needed
            </StyledText>
          </Stack>
        </Stack>

        {/* ── Body ── */}
        <Stack paddingHorizontal={24} paddingTop={24}>
          {/* Price */}
          <Stack horizontal alignItems="baseline" gap={8} marginBottom={4}>
            <StyledText
              fontSize={34}
              fontWeight={theme.fontWeight.semiBold}
              color={theme.colors.gray[900]}>
              {price}
            </StyledText>
            <StyledText fontSize={14} color={theme.colors.gray[500]}>
              one-time
            </StyledText>
          </Stack>
          <StyledText
            fontSize={13}
            color={theme.colors.gray[400]}
            marginBottom={20}>
            Pay once, own it forever. No subscriptions.
          </StyledText>

          {/* Features */}
          <Stack vertical marginBottom={20}>
            {FEATURES.map((f, i) => (
              <Feature key={i} text={f} />
            ))}
          </Stack>

          {/* Divider */}
          <Stack
            height={0.5}
            backgroundColor={theme.colors.gray[200]}
            marginBottom={20}
          />

          {/* CTA */}
          <StyledPressable
            onPress={purchaseHandler}
            disabled={isLoading}
            backgroundColor={
              isLoading ? theme.colors.gray[200] : theme.colors.amber[500]
            }
            borderRadius={12}
            paddingVertical={16}
            alignItems="center"
            justifyContent="center"
            marginBottom={12}>
            <StyledText
              fontSize={theme.fontSize.large}
              fontWeight={theme.fontWeight.semiBold}
              color={isLoading ? theme.colors.gray[400] : '#1c1917'}>
              {isLoading ? 'Processing...' : 'Start 7-day free trial'}
            </StyledText>
          </StyledPressable>

          {/* Restore */}
          <StyledPressable
            onPress={restorePurchases}
            disabled={isLoading}
            paddingVertical={10}
            alignItems="center">
            <StyledText fontSize={13} color={theme.colors.gray[400]}>
              Restore purchase
            </StyledText>
          </StyledPressable>

          {/* Legal */}
          <StyledText
            fontSize={11}
            color={theme.colors.gray[400]}
            textAlign="center"
            lineHeight={18}
            marginTop={8}>
            After the 7-day trial, {price} is charged as a one-time payment.
            {'\n'}
            Managed in your App Store settings.{' '}
            <StyledText
              fontSize={11}
              color={theme.colors.gray[400]}
              textDecorationLine="underline"
              onPress={() => Linking.openURL('https://kursa.app/privacy')}>
              Privacy
            </StyledText>
            {' · '}
            <StyledText
              fontSize={11}
              color={theme.colors.gray[400]}
              textDecorationLine="underline"
              onPress={() => Linking.openURL('https://kursa.app/terms')}>
              Terms
            </StyledText>
          </StyledText>
        </Stack>
      </ScrollView>

      {isLoading && <StyledSpinner />}
    </Stack>
  );
};

export default PaywallScreen;
