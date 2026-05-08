/* eslint-disable prettier/prettier */
import React from 'react';
import {StyledPressable, Stack} from 'fluent-styles';
import {Text} from './text';
import {useAppTheme} from '../theme';

const OPTIONS = [
  {key: 'light',  label: 'Light',  icon: '☀️'},
  {key: 'system', label: 'System', icon: '⚙️'},
  {key: 'dark',   label: 'Dark',   icon: '🌙'},
] as const;

const ThemeToggle = () => {
  const {t, mode, setMode} = useAppTheme();

  return (
    <Stack
      horizontal
      borderRadius={10}
      borderWidth={0.5}
      borderColor={t.borderDefault}
      backgroundColor={t.bgPage}
      overflow="hidden">
      {OPTIONS.map((opt, i) => {
        const active = mode === opt.key;
        return (
          <StyledPressable
            key={opt.key}
            flex={1}
            onPress={() => setMode(opt.key)}
            paddingVertical={8}
            paddingHorizontal={4}
            alignItems="center"
            justifyContent="center"
            backgroundColor={active ? t.brandPrimary : t.bgPage}
            borderRightWidth={i < OPTIONS.length - 1 ? 0.5 : 0}
            borderRightColor={t.borderDefault}>
            <Text variant="body">{opt.icon}</Text>
            <Text
              variant={active ? 'label' : 'subLabel'}
              color={active ? t.textOnAmber : t.textSecondary}>
              {opt.label}
            </Text>
          </StyledPressable>
        );
      })}
    </Stack>
  );
};

export default ThemeToggle;
