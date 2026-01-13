
import React, { useState, useEffect } from 'react';
import { StyledSpinner } from 'fluent-styles';
import Welcome from './welcome';
import Keypad from './lock';
import { getStore } from '../utils/asyncStorage';
import { theme } from '../utils/theme';

const Start = () => {
    const [state, setState] = useState(false);

    useEffect(() => {
        const checkOnboarding = async () => {
            const hasOnboarded = await getStore('hasOnboarded');
            setState(hasOnboarded === 'true');
        };
        checkOnboarding();
    }, []);

    if (!state) {
        return <StyledSpinner size={48} color={theme.colors.indigo[500]} />;
    }

    return (
        <>
            {
                state ? <Keypad /> : <Welcome onChange={(j) => setState(j)} />
            }
        </>
    );
}

export default Start;