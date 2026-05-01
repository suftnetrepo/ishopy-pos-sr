/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  validate,
  theme,
  XStack,
  YStack,
  StyledSpacer,
  StyledText,
  Switch,
  StyledCard,
  StyledPressable,
  StyledTextInput,
  StyledChip,
  Stack,
  toastService,
} from 'fluent-styles';
import {fontStyles} from '../../../../configs/theme';
import {tableRules} from './validatorRules';
import {useUpdateTable, useInsertTable} from '../../../../hooks/useTable';
import ColorPicker from '../../../../components/colorPicker';
import {useLoaderAndError} from '../../../../hooks/useLoaderAndError';
import {useAppTheme} from '../../../../theme';

// ─── Location options ─────────────────────────────────────────────────────────
const LOCATION_OPTIONS = [
  {key: 'Dine In',  label: 'Dine In',  icon: 'table-restaurant', color: theme.colors.gray[500]},
  {key: 'Bar',      label: 'Bar',      icon: 'local-bar',        color: theme.colors.purple[600]},
  {key: 'Takeaway', label: 'Takeaway', icon: 'takeout-dining',   color: theme.colors.amber[600]},
];

const TableForm = ({table, onClose}) => {
  const {t} = useAppTheme();
  const [errorMessages, setErrorMessages] = useState({});
  const [fields, setFields] = useState(tableRules.fields);
  const {updateTable, error, loading, resetHandler} = useUpdateTable();
  const {insertTable} = useInsertTable();

  useEffect(() => {
    setFields(prev => ({...prev, ...table}));
  }, [table]);

  useLoaderAndError(loading, error, resetHandler);

  const onNotify = ({status, t}) => {
    toastService.show({
      message: `Table ${status}`,
      description: `Your table was ${status} successfully.`,
      variant: 'success',
      duration: 2500,
      theme: 'light',
    });
    setFields(tableRules.reset);
    onClose && onClose();
  };

  const onSubmit = async () => {
    setErrorMessages({});
    const {hasError, errors} = validate(fields, tableRules.rules);
    if (hasError) {
      setErrorMessages(errors);
      return false;
    }

    if (fields.table_id) {
      await updateTable(
        fields.table_id,
        fields.tableName,
        fields.status,
        0,
        fields.size,
        fields.color_code,
        fields.location,
      ).then(result => {
        result && onNotify({status: 'updated'});
      });
    } else {
      delete fields.table_id;
      await insertTable(
        fields.tableName,
        fields.status,
        0,
        fields.size,
        fields.color_code,
        fields.location,
      ).then(result => {
        result && onNotify({status: 'added'});
      });
    }
  };

  return (
    <YStack flex={1} backgroundColor={t.bgPage}>
      <StyledCard
        gap={8}
        paddingHorizontal={16}
        horizontal
        backgroundColor={t.bgCard}
        borderRadius={16}
        marginHorizontal={16}
        marginTop={16}
        paddingVertical={16}>

        <ColorPicker
          color={fields.color_code || theme.colors.purple[900]}
          onPress={color => setFields({...fields, color_code: color})}
        />

        <StyledTextInput
          label="Name"
          keyboardType="default"
          placeholder="Enter table name"
          returnKeyType="next"
          maxLength={50}
          fontSize={theme.fontSize.small}
          borderColor={t.brandPrimaryDark}
          backgroundColor={t.bgCard}
          borderRadius={32}
          paddingHorizontal={8}
          value={fields.tableName}
          placeholderTextColor={t.textMuted}
          onChangeText={text => setFields({...fields, tableName: text})}
          error={!!errorMessages?.tableName}
          errorMessage={errorMessages?.tableName?.message}
        />

        <StyledTextInput
          label="Size"
          keyboardType="number-pad"
          placeholder="Enter table size"
          returnKeyType="next"
          maxLength={3}
          fontSize={theme.fontSize.small}
          borderColor={t.brandPrimaryDark}
          backgroundColor={t.bgCard}
          borderRadius={32}
          paddingHorizontal={8}
          value={fields.size?.toString()}
          placeholderTextColor={t.textMuted}
          onChangeText={text => setFields({...fields, size: parseInt(text) || 0})}
          error={!!errorMessages?.size}
          errorMessage={errorMessages?.size?.message}
        />

        {/* ── Location selector ── */}
        <StyledSpacer marginVertical={2} />
        <StyledText
          fontWeight={theme.fontWeight.normal}
          color={t.textSecondary}
          fontSize={theme.fontSize.small}
          fontFamily={fontStyles.Roboto_Regular}
          marginBottom={6}>
          Location
        </StyledText>
        <Stack horizontal gap={8} flexWrap="wrap">
          {LOCATION_OPTIONS.map(loc => (
            <StyledChip
              key={loc.key}
              label={loc.label}
              variant="outlined"
              size="sm"
              selected={fields.location === loc.key}
              color={loc.color}
              showCheck={fields.location === loc.key}
              onPress={() => setFields({...fields, location: loc.key})}
            />
          ))}
        </Stack>

        <StyledSpacer marginVertical={4} />

        {/* ── Active status toggle ── */}
        <XStack
          justifyContent="flex-start"
          alignItems="center"
          gap={8}
          paddingHorizontal={16}>
          <Switch
            activeValue={1}
            inactiveValue={0}
            defaultValue={0}
            value={fields.status}
            onChange={value =>
              setFields({...fields, status: parseInt(value ? 1 : 0)})
            }
            colors={{
              activeThumb:  theme.colors.white,
              inactiveThumb: theme.colors.white,
              activeTrack:  t.successColor,
              inactiveTrack: t.dangerColor,
            }}
          />
          <StyledText
            fontWeight={theme.fontWeight.normal}
            color={t.textSecondary}
            fontSize={theme.fontSize.normal}
            fontFamily={fontStyles.Roboto_Regular}>
            Active
          </StyledText>
        </XStack>

        <StyledPressable
          onPress={onSubmit}
          backgroundColor={t.brandPrimary}
          borderRadius={32}
          paddingVertical={12}
          alignItems="center">
          <StyledText
            color={theme.colors.white}
            fontSize={theme.fontSize.normal}
            fontWeight={theme.fontWeight.medium}>
            Save Changes
          </StyledText>
        </StyledPressable>
      </StyledCard>
    </YStack>
  );
};

export default TableForm;