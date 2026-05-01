/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {ScrollView, Alert} from 'react-native';
import {
  Stack,
  StyledText,
  StyledPressable,
  StyledSpacer,
  StyledSpinner,
} from 'fluent-styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {store} from '../../utils/asyncStorage';
import {seedFromTemplate, clearSeedData} from '../../model/seed';
import {useAppContext} from '../../hooks/appContext';
import {useAppTheme, fonts, textStyles} from '../../theme';
import ModeSelect from './ModeSelect';
import TemplateSelect from './TemplateSelect';
import CurrencySelect from './CurrencySelect';

const STEPS = [
  {id: 1, label: 'Business'},
  {id: 2, label: 'Template'},
  {id: 3, label: 'Currency'},
];

const OnboardingScreen = ({onChange}) => {
  const {t} = useAppTheme();
  const {updateShop} = useAppContext();

  const [step,     setStep]     = useState(1);
  const [mode,     setMode]     = useState('restaurant');
  const [template, setTemplate] = useState('cafe');
  const [currency, setCurrency] = useState('£');
  const [loading,  setLoading]  = useState(false);

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
    if (step < 3) { setStep(s => s + 1); return; }
    handleGetStarted();
  };

  const handleBack = () => { if (step > 1) setStep(s => s - 1); };

  const handleGetStarted = async () => {
    setLoading(true);
    try {
      await clearSeedData();
      const ok = await seedFromTemplate(template, mode, currency);
      if (!ok) {
        Alert.alert('Setup failed', 'Could not load your template. Please try again.');
        setLoading(false);
        return;
      }
      await store('hasOnboarded', 'true');
      await updateShop();
      onChange(true);
    } catch (e) {
      console.log('Onboarding error:', e);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step dot ─────────────────────────────────────────────────────────────
  const StepDot = ({n, t}) => (
    <Stack
      width={28} height={28} borderRadius={14}
      backgroundColor={step >= n ? t.brandPrimary : t.borderDefault}
      alignItems="center" justifyContent="center">
      {step > n ? (
        <Icon name="check" size={14} color={t.textOnAmber} />
      ) : (
        <StyledText
          fontSize={12}
          fontWeight="600"
          color={step === n ? t.textOnAmber : t.textMuted}>
          {n}
        </StyledText>
      )}
    </Stack>
  );

  return (
    <Stack
      flex={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor={t.bgPage}
      paddingVertical={48}>

      <Stack
        width="50%"
        flex={1}
        vertical
        paddingHorizontal={24}
        paddingTop={16}
        paddingBottom={24}>

        {/* ── Logo ── */}
        <Stack horizontal alignItems="center" gap={10} marginBottom={28}>
          <Stack
            width={38} height={38} borderRadius={10}
            backgroundColor={t.brandPrimary}
            alignItems="center" justifyContent="center">
            <Icon name="silverware-fork-knife" size={20} color={t.textOnAmber} />
          </Stack>
          <StyledText
            fontSize={20}
            fontWeight="700"
            fontFamily={fonts.displayBold}
            color={t.textPrimary}>
            Kursa
          </StyledText>
        </Stack>

        {/* ── Step progress ── */}
        <Stack horizontal alignItems="center" gap={0} marginBottom={28}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <Stack alignItems="center" gap={6}>
                <StepDot n={s.id} 
                        t={t}/>
                <StyledText
                  fontSize={10}
                  color={step >= s.id ? t.brandPrimaryText : t.textMuted}
                  fontWeight={step === s.id ? '600' : '400'}>
                  {s.label}
                </StyledText>
              </Stack>
              {i < STEPS.length - 1 && (
                <Stack
                  flex={1} height={2}
                  marginBottom={16}
                  marginHorizontal={4}
                  backgroundColor={step > s.id ? t.brandPrimary : t.borderDefault}
                />
              )}
            </React.Fragment>
          ))}
        </Stack>

        {/* ── Step content ── */}
        <Stack flex={1}>
          {step === 1 && <ModeSelect selected={mode} onSelect={handleModeChange} />}
          {step === 2 && <TemplateSelect mode={mode} selected={template} onSelect={setTemplate} />}
          {step === 3 && <CurrencySelect selected={currency} onSelect={setCurrency} />}

          {/* ── Navigation ── */}
          <Stack gap={12} marginTop={16}>
            <StyledPressable
              disabled={!canNext() || loading}
              onPress={handleNext}
              alignItems="center"
              justifyContent="center"
              paddingVertical={14}
              borderRadius={32}
              backgroundColor={canNext() && !loading ? t.brandPrimary : t.borderDefault}>
              <StyledText
                fontFamily={fonts.displaySemi}
                fontSize={16}
                fontWeight="600"
                color={canNext() && !loading ? t.textOnAmber : t.textMuted}>
                {step === 3 ? (loading ? 'Setting up…' : 'Get Started →') : 'Continue →'}
              </StyledText>
            </StyledPressable>

            {step > 1 && (
              <StyledPressable
                onPress={handleBack}
                disabled={loading}
                alignItems="center"
                justifyContent="center"
                paddingVertical={8}>
                <StyledText fontSize={14} color={t.textSecondary}>
                  ← Back
                </StyledText>
              </StyledPressable>
            )}
          </Stack>

          {/* ── Footer note ── */}
          <StyledText
            fontSize={12}
            color={t.textMuted}
            textAlign="center"
            marginTop={12}>
            Default PIN is 1234 · Change it in Settings after setup
          </StyledText>
        </Stack>
      </Stack>

      {loading && <StyledSpinner />}
    </Stack>
  );
};

export default OnboardingScreen;