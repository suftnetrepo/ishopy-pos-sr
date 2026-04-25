/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Stack, StyledText, StyledPressable, StyledCard, theme,
} from 'fluent-styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MODES = [
  {
    value: 'restaurant',
    icon:  'silverware-fork-knife',
    label: 'Restaurant',
    desc:  'Cafes, restaurants, bars and food service',
    color: theme.colors.orange[500],
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

const ModeSelect: React.FC<Props> = ({ selected, onSelect }) => (
  <Stack gap={16}>
    <Stack gap={4} marginBottom={8}>
      <StyledText fontSize={theme.fontSize.large} fontWeight={theme.fontWeight.bold}
        color={theme.colors.gray[900]}>
        What type of business?
      </StyledText>
      <StyledText fontSize={theme.fontSize.normal} color={theme.colors.gray[500]}>
        We'll load the right menu templates and layout for you.
      </StyledText>
    </Stack>

    {MODES.map(m => {
      const active = selected === m.value;
      return (
        <StyledPressable key={m.value} onPress={() => onSelect(m.value)}>
          <StyledCard
            padding={20} borderRadius={16}
            backgroundColor={active ? m.bg : theme.colors.white}
            borderWidth={2}
            borderColor={active ? m.color : theme.colors.gray[200]}
            shadow={active ? 'light' : undefined}>
            <Stack horizontal alignItems="center" gap={16}>
              <Stack width={56} height={56} borderRadius={16}
                backgroundColor={active ? m.color : theme.colors.gray[100]}
                alignItems="center" justifyContent="center">
                <Icon name={m.icon} size={28} color={active ? '#fff' : theme.colors.gray[500]} />
              </Stack>
              <Stack flex={1}>
                <StyledText fontSize={theme.fontSize.medium} fontWeight={theme.fontWeight.semiBold}
                  color={theme.colors.gray[900]}>
                  {m.label}
                </StyledText>
                <StyledText fontSize={theme.fontSize.small} color={theme.colors.gray[500]}
                  marginTop={2}>
                  {m.desc}
                </StyledText>
              </Stack>
              <Stack width={24} height={24} borderRadius={12}
                borderWidth={2}
                borderColor={active ? m.color : theme.colors.gray[300]}
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
