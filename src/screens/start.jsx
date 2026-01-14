
import React, { useState, useEffect } from 'react';
import { StyledSpinner } from 'fluent-styles';
import Welcome from './welcome';
import Keypad from './lock';
import { getStore, clearStore } from '../utils/asyncStorage';
import { theme } from '../utils/theme';

const Start = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasOnboarded, setHasOnboarded] = useState(false);

    useEffect(() => {
        const checkOnboarding = async () => {
            try {
                const onboardingStatus = await getStore('hasOnboarded');
                setHasOnboarded(onboardingStatus === true || onboardingStatus === 'true');
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

    return (
        <>
            {hasOnboarded ? <Keypad /> : <Welcome onChange={(j) => setHasOnboarded(j)} />}
        </>
    );
}

export default Start;