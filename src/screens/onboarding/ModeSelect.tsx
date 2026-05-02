/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Stack, StyledPressable, StyledCard, theme,
} from 'fluent-styles';
import Text from '../../components/text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppTheme} from '../../theme';

const MODES = [
  {
    value: 'restaurant',
    icon:  'silverware-fork-knife',
    label: 'Restaurant',
    desc:  'Cafes, restaurants, bars and food service',
    color: theme.colors.amber[500],
    bg:    theme.colors.orange[50],
    border:theme.colors.orange[200],
  },
  {
    value: 'shop',
    icon:  'storefront-outline',
    label: 'Retail Shop',
    desc:  'Boutiques, supermarkets and general stores',
    color: theme.colors.blue[600],
    bg:    theme.colors.blue[50],
    border:theme.colors.blue[200],
  },
];

interface Props {
  selected: string;
  onSelect: (mode: string) => void;
}

const ModeSelect: React.FC<Props> = ({ selected, onSelect }) => {
  const {t} = useAppTheme();
  return (
    <Stack gap={16}>
      <Stack gap={4} marginBottom={8}>
        <Text variant="title" color={t.textPrimary}>
          What type of business?
        </Text>
        <Text variant="body" color={t.textSecondary}>
          We'll load the right menu templates and layout for you.
        </Text>
      </Stack>

      {MODES.map(m => {
      const active = selected === m.value;
      return (
        <StyledPressable key={m.value} onPress={() => onSelect(m.value)}>
          <StyledCard
            padding={20} borderRadius={16}
            backgroundColor={active ? m.bg : theme.colors.white}
            borderWidth={2}
            borderColor={active ? m.color : t.borderDefault}
            shadow={active ? 'light' : undefined}>
            <Stack horizontal alignItems="center" gap={16}>
              <Stack width={56} height={56} borderRadius={16}
                backgroundColor={active ? m.color : t.bgPage}
                alignItems="center" justifyContent="center">
                <Icon name={m.icon} size={28} color={active ? '#fff' : t.textSecondary} />
              </Stack>
              <Stack flex={1}>
                <Text variant="label" color={t.textPrimary}>
                  {m.label}
                </Text>
                <Text variant="body" color={t.textSecondary}
                  marginTop={2}>
                  {m.desc}
                </Text>
              </Stack>
              <Stack width={24} height={24} borderRadius={12}
                borderWidth={2}
                borderColor={active ? m.color : t.textMuted}
                backgroundColor={active ? m.color : 'transparent'}
                alignItems="center" justifyContent="center">
                {active && <Icon name="check" size={14} color="#fff" />}
              </Stack>
            </Stack>
          </StyledCard>
        </StyledPressable>
      );
    })}
  </Stack>
);

export default ModeSelect;
