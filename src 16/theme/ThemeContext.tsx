/* eslint-disable prettier/prettier */
/**
 * ThemeContext.tsx
 * Provides theme tokens + colour scheme to the entire app.
 *
 * Usage:
 *   const { t, isDark, setMode } = useAppTheme();
 *
 *   <View style={{ backgroundColor: t.bgCard }}>
 *     <Text style={[textStyles.cardTitle, { color: t.textPrimary }]}>
 *       Hello
 *     </Text>
 *   </View>
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {Appearance, ColorSchemeName} from 'react-native';
import {light, dark, ThemeTokens} from './tokens';
import {getStore, store} from '../utils/asyncStorage';

const THEME_KEY = 'kursa_theme_mode';
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  t:       ThemeTokens;       // all design tokens
  isDark:  boolean;
  mode:    ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue>({
  t:       light,
  isDark:  false,
  mode:    'system',
  setMode: async () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  // Load saved preference on mount
  useEffect(() => {
    getStore(THEME_KEY).then(saved => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setModeState(saved);
      }
    });
  }, []);

  // Listen for OS-level changes
  useEffect(() => {
    const sub = Appearance.addChangeListener(({colorScheme}) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  // Resolve effective scheme
  const isDark =
    mode === 'dark' ||
    (mode === 'system' && systemScheme === 'dark');

  const t = isDark ? dark : light;

  const setMode = useCallback(async (newMode: ThemeMode) => {
    setModeState(newMode);
    await store(THEME_KEY, newMode);
  }, []);

  return (
    <ThemeContext.Provider value={{t, isDark, mode, setMode}}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAppTheme = () => useContext(ThemeContext);
