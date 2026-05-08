import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const useFocus = () => {
    const [isFocused, setIsFocused] = useState(false);
    
    useFocusEffect(
        React.useCallback(() => {
            // Screen gained focus
            if (__DEV__) console.log("📱 SCREEN GAINED FOCUS");
            setIsFocused(true);
            
            return () => {
                // Screen lost focus
                if (__DEV__) console.log("❌ SCREEN LOST FOCUS");
                setIsFocused(false);
            };
        }, [])
    );

    return isFocused;
};

export { useFocus };