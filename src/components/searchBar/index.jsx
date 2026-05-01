import React, {useState} from 'react';
import {
  theme,
  StyledSpacer,
  StyledCycle,
  StyledPressable,
  StyledText,
  Stack,
} from 'fluent-styles';
import {TextInput} from 'react-native';
import {StyledMIcon} from '../icon';
import {useAppTheme} from '../../theme';

const StyledSearchBar = ({
  size = 24,
  name = 'search',
  placeholder = 'Search item by name',
  showSearchIcon = false,
  onTextChange,
  onPress,
  flex = 1,
  ...rest
}) => {
  const {t} = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = () => {
    if (onPress && searchQuery) onPress(searchQuery);
  };

  return (
    <Stack
      flex={flex}
      horizontal
      alignItems="center"
      height={50}
      borderRadius={100}
      borderWidth={1}
      borderColor={t.borderDefault}
      backgroundColor={t.bgCard}
      paddingHorizontal={4}
      {...rest}>
      <TextInput
        style={{
          flex: 1,
          marginHorizontal: 12,
          fontSize: theme.fontSize.normal,
          color: t.textPrimary,
          backgroundColor: 'transparent',
        }}
        placeholder={placeholder}
        placeholderTextColor={t.textMuted}
        value={searchQuery}
        onChangeText={text => {
          setSearchQuery(text);
          onTextChange && onTextChange(text);
        }}
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
      />
      {showSearchIcon && (
        <StyledCycle
          borderWidth={1}
          borderColor={theme.colors.cyan[400]}
          backgroundColor={theme.colors.cyan[500]}>
          <StyledMIcon size={size} name={name} color={t.bgCard} onPress={handleSubmit} />
        </StyledCycle>
      )}
    </Stack>
  );
};

export {StyledSearchBar};