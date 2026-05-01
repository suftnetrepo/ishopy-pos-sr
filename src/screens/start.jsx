import React, { useState, useEffect } from 'react';
import { StyledSpinner } from 'fluent-styles';
import Welcome from './welcome';
import Keypad from './lock';
import PaywallScreen from './paywall';
import { getStore, clearStore } from '../utils/asyncStorage';
import { theme } from '../utils/theme';
import { STORAGE_KEYS } from '../utils/asyncStorage';
import {useAppTheme} from '../theme';

const { PURCHASED_STATUS } = STORAGE_KEYS;

const Start = () => {
  const {t} = useAppTheme();
    const [isLoading, setIsLoading]           = useState(true);
    const [hasOnboarded, setHasOnboarded]     = useState(false);
    const [showPaywall, setShowPaywall]       = useState(false);
    const [hasPurchased, setHasPurchased]     = useState(false);

    useEffect(() => {
        const checkOnboarding = async () => {
            try {
                const onboardingStatus = await getStore('hasOnboarded');
                const purchaseStatus   = await getStore(PURCHASED_STATUS);
                setHasOnboarded(onboardingStatus === true || onboardingStatus === 'true');
                setHasPurchased(purchaseStatus === 1 || purchaseStatus === '1');
            } catch (error) {
                if(__DEV__)
                console.error('Error checking onboarding status:', error);
            } finally {
                setIsLoading(false);
            }
        };
        checkOnboarding();
    }, []);

    if (isLoading) {
        return <StyledSpinner size={48} color={theme.colors.indigo[500]} />;
    }

    // After onboarding completes — show paywall once if not yet purchased
    if (hasOnboarded && showPaywall && !hasPurchased) {
        return <PaywallScreen onDismiss={() => setShowPaywall(false)} />;
    }

    return (
        <>
            {hasOnboarded
                ? <Keypad />
                : <Welcome onChange={() => {
                    setHasOnboarded(true);
                    // Show paywall after first onboarding only if not purchased
                    if (!hasPurchased) setShowPaywall(true);
                  }} />
            }
        </>
    );
}

export default Start;