
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const useFocus = () => {
    const [key, setKey] = useState(false);
    useFocusEffect(
        React.useCallback(() => {
            setKey(true);
            return () => {
                setKey(false);
            };
        }, [])
    );
      console.log('.............mmmmmmmmm', key);
    return key;
};

export { useFocus };
