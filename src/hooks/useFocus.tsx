import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const useFocus = () => {
    const [isFocused, setIsFocused] = useState(false);
    
    useFocusEffect(
        React.useCallback(() => {
            // Screen is focused
            setIsFocused(true);
            
            return () => {
                // Screen is unfocused
                setIsFocused(false);
            };
        }, [])
    );

    return isFocused;
};

export { useFocus };