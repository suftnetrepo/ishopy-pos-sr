/* eslint-disable prettier/prettier */
/**
 * src/screens/onboarding/index.jsx
 *
 * 3-step onboarding controller.
 * Step 1: Mode (Restaurant / Retail)
 * Step 2: Template
 * Step 3: Currency
 * → Seeds Realm → marks hasOnboarded → navigates to dashboard
 */

import React, {useState} from 'react';
import {ScrollView, Alert} from 'react-native';
import {
  Stack,
  StyledText,
  StyledButton,
  StyledSafeAreaView,
  StyledDivider,
  StyledPressable,
  Loader,
  theme,
} from 'fluent-styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {store} from '../../utils/asyncStorage';
import {seedFromTemplate, clearSeedData} from '../../model/seed';
import {useAppContext} from '../../hooks/appContext';
import ModeSelect from './ModeSelect';
import TemplateSelect from './TemplateSelect';
import CurrencySelect from './CurrencySelect';

const STEPS = [
  {id: 1, label: 'Business type'},
  {id: 2, label: 'Template'},
  {id: 3, label: 'Currency'},
];

const OnboardingScreen = ({onChange}) => {
  const {updateShop} = useAppContext();

  const [step, setStep] = useState(1);
  const [mode, setMode] = useState('restaurant');
  const [template, setTemplate] = useState('cafe');
  const [currency, setCurrency] = useState('£');
  const [loading, setLoading] = useState(false);

  // When mode changes reset template to first of that mode
  const handleModeChange = m => {
    setMode(m);
    setTemplate(m === 'restaurant' ? 'cafe' : 'general');
  };

  const canNext = () => {
    if (step === 1) return !!mode;
    if (step === 2) return !!template;
    if (step === 3) return !!currency;
    return false;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(s => s + 1);
      return;
    }
    handleGetStarted();
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const handleGetStarted = async () => {
    setLoading(true);
    try {
      await clearSeedData();
      const ok = await seedFromTemplate(template, mode, currency);
      if (!ok) {
        Alert.alert(
          'Setup failed',
          'Could not load your template. Please try again.'
        );
        setLoading(false);
        return;
      }
      await store('hasOnboarded', 'true');
      await updateShop();
      onChange(true); // navigate to dashboard via start.jsx
    } catch (e) {
      console.log('Onboarding error:', e);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StepDot = ({n}) => (
    <Stack
      width={28}
      height={28}
      borderRadius={14}
      backgroundColor={
        step >= n ? theme.colors.violet[600] : theme.colors.gray[200]
      }
      alignItems="center"
      justifyContent="center">
      {step > n ? (
        <Icon name="check" size={14} color="#fff" />
      ) : (
        <StyledText
          fontSize={12}
          fontWeight={theme.fontWeight.semiBold}
          color={step === n ? '#fff' : theme.colors.gray[500]}>
          {n}
        </StyledText>
      )}
    </Stack>
  );

  return (
    <StyledSafeAreaView
      justifyContent="center"
      alignItems="center"
      paddingVertical={48}
      backgroundColor={theme.colors.gray[50]}>
      <Stack
        width={'50%'}
        vertical
        flex={1}
        paddingHorizontal={24}
        paddingTop={16}
        paddingBottom={24}>
        {/* Header logo */}
        <Stack horizontal alignItems="center" gap={10} marginBottom={28}>
          <Stack
            width={36}
            height={36}
            borderRadius={10}
            backgroundColor="#2dd4bf"
            alignItems="center"
            justifyContent="center">
            <Icon name="silverware-fork-knife" size={20} color="#0f172a" />
          </Stack>
          <StyledText
            fontSize={20}
            fontWeight="800"
            color={theme.colors.gray[900]}>
            ishopy
          </StyledText>
        </Stack>

        {/* Step progress bar */}
        <Stack horizontal alignItems="center" gap={0} marginBottom={28}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <Stack alignItems="center" gap={6}>
                <StepDot n={s.id} />
                <StyledText
                  fontSize={10}
                  color={
                    step >= s.id
                      ? theme.colors.violet[600]
                      : theme.colors.gray[400]
                  }
                  fontWeight={
                    step === s.id
                      ? theme.fontWeight.semiBold
                      : theme.fontWeight.normal
                  }>
                  {s.label}
                </StyledText>
              </Stack>
              {i < STEPS.length - 1 && (
                <Stack
                  flex={1}
                  height={2}
                  marginBottom={16}
                  marginHorizontal={4}
                  backgroundColor={
                    step > s.id
                      ? theme.colors.violet[400]
                      : theme.colors.gray[200]
                  }
                />
              )}
            </React.Fragment>
          ))}
        </Stack>

        {/* Step content */}
        <Stack flex={1}>
          {step === 1 && (
            <ModeSelect selected={mode} onSelect={handleModeChange} />
          )}
          {step === 2 && (
            <TemplateSelect
              mode={mode}
              selected={template}
              onSelect={setTemplate}
            />
          )}
          {step === 3 && (
            <CurrencySelect selected={currency} onSelect={setCurrency} />
          )}
          {/* Navigation */}
          <Stack gap={12} marginTop={16}>
            <StyledPressable
              loading={loading}
              justifyContent='center'
               alignItems='center'
               paddingVertical={8}
               borderRadius={32}
              disabled={!canNext() || loading}
              onPress={handleNext}
              backgroundColor={theme.colors.violet[600]}>
              <StyledText
                color={theme.colors.white}
                fontSize={theme.fontSize.medium}
                fontWeight={theme.fontWeight.semiBold}>
                {step === 3
                  ? loading
                    ? 'Setting up…'
                    : 'Get Started →'
                  : 'Continue →'}
              </StyledText>
            </StyledPressable>

            {step > 1 && (
              <StyledPressable  onPress={handleBack} disabled={loading} justifyContent='center' alignItems='center' paddingVertical={8} borderRadius={32}>
                <StyledText
                  fontSize={theme.fontSize.normal}
                  color={theme.colors.gray[600]}>
                  ← Back
                </StyledText>
              </StyledPressable>
            )}
          </Stack>

          {/* Footer note */}
          <StyledText
            fontSize={12}
            color={theme.colors.gray[400]}
            textAlign="center"
            marginTop={12}>
            Default PIN is 1234 · You can change it in Settings after setup
          </StyledText>
        </Stack>
      </Stack>

      {loading && (
        <Loader
          variant="dots"
          overlay
          theme="light"
          label="Loading your template…"
        />
      )}
    </StyledSafeAreaView>
  );
};

export default OnboardingScreen;
