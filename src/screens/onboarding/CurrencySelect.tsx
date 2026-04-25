/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  Stack,
  StyledText,
  StyledPressable,
  StyledCard,
  StyledTextInput,
  StyledScrollView,
  theme,
} from 'fluent-styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CURRENCIES = [
  {symbol: '£', code: 'GBP', name: 'British Pound', flag: '🇬🇧'},
  {symbol: '$', code: 'USD', name: 'US Dollar', flag: '🇺🇸'},
  {symbol: '€', code: 'EUR', name: 'Euro', flag: '🇪🇺'},
  {symbol: '₦', code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬'},
  {symbol: 'GH₵', code: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭'},
  {symbol: 'KSh', code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪'},
  {symbol: 'R', code: 'ZAR', name: 'South African Rand', flag: '🇿🇦'},
  {symbol: 'ETB', code: 'ETB', name: 'Ethiopian Birr', flag: '🇪🇹'},
  {symbol: 'CFA', code: 'XOF', name: 'West African CFA', flag: '🌍'},
  {symbol: 'USh', code: 'UGX', name: 'Ugandan Shilling', flag: '🇺🇬'},
  {symbol: 'TZS', code: 'TZS', name: 'Tanzanian Shilling', flag: '🇹🇿'},
  {symbol: 'C$', code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦'},
  {symbol: 'A$', code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺'},
  {symbol: '₹', code: 'INR', name: 'Indian Rupee', flag: '🇮🇳'},
  {symbol: '¥', code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵'},
  {symbol: 'د.إ', code: 'AED', name: 'UAE Dirham', flag: '🇦🇪'},
];

interface Props {
  selected: string;
  onSelect: (symbol: string) => void;
}

const CurrencySelect: React.FC<Props> = ({selected, onSelect}) => {
  const [search, setSearch] = useState('');

  const filtered = CURRENCIES.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack gap={16} flex={1}>
      <Stack gap={4} marginBottom={4}>
        <StyledText
          fontSize={theme.fontSize.large}
          fontWeight={theme.fontWeight.bold}
          color={theme.colors.gray[900]}>
          Select your currency
        </StyledText>
        <StyledText
          fontSize={theme.fontSize.normal}
          color={theme.colors.gray[500]}>
          Used on receipts, menus and reports. You can change this later in
          Settings.
        </StyledText>
      </Stack>
    
      <StyledScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{gap: 8, paddingBottom: 16}}>
          <StyledTextInput
        flex={0}
          variant="outline"
          placeholder="Search currency..."
          value={search}
          onChangeText={setSearch}
          clearable
          leftIcon={
            <Icon name="magnify" size={18} color={theme.colors.gray[400]} />
          }
        />
        {filtered.map(c => {
          const active = selected === c.symbol;
          return (
            <StyledPressable key={c.code} onPress={() => onSelect(c.symbol)}>
              <StyledCard
                padding={14}
                borderRadius={12}
                backgroundColor={
                  active ? theme.colors.teal[50] : theme.colors.white
                }
                borderWidth={2}
                borderColor={
                  active ? theme.colors.teal[500] : theme.colors.gray[200]
                }>
                <Stack horizontal alignItems="center" gap={12}>
                  {/* Flag + symbol */}
                  <Stack
                    width={48}
                    height={48}
                    borderRadius={12}
                    backgroundColor={
                      active ? theme.colors.teal[100] : theme.colors.gray[100]
                    }
                    alignItems="center"
                    justifyContent="center">
                    <StyledText fontSize={22}>{c.flag}</StyledText>
                  </Stack>
                  <Stack flex={1}>
                    <StyledText
                      fontSize={theme.fontSize.normal}
                      fontWeight={theme.fontWeight.semiBold}
                      color={theme.colors.gray[900]}>
                      {c.name}
                    </StyledText>
                    <StyledText
                      fontSize={theme.fontSize.small}
                      color={theme.colors.gray[400]}>
                      {c.code} · {c.symbol}
                    </StyledText>
                  </Stack>
                  {/* Check */}
                  {active && (
                    <Stack
                      width={28}
                      height={28}
                      borderRadius={14}
                      backgroundColor={theme.colors.teal[500]}
                      alignItems="center"
                      justifyContent="center">
                      <Icon name="check" size={16} color="#fff" />
                    </Stack>
                  )}
                </Stack>
              </StyledCard>
            </StyledPressable>
          );
        })}
      </StyledScrollView>
    </Stack>
  );
};

export default CurrencySelect;
