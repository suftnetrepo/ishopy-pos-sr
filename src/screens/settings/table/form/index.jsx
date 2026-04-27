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
  toastService,
} from 'fluent-styles';
import {fontStyles} from '../../../../configs/theme';
import {tableRules} from './validatorRules';
import {useUpdateTable, useInsertTable} from '../../../../hooks/useTable';
import ColorPicker from '../../../../components/colorPicker';
import {useLoaderAndError} from '../../../../hooks/useLoaderAndError';

const TableForm = ({table, onClose}) => {
  const [errorMessages, setErrorMessages] = useState({});
  const [fields, setFields] = useState(tableRules.fields);
  const {updateTable, error, loading, resetHandler} = useUpdateTable();
  const {insertTable} = useInsertTable();

  useEffect(() => {
    setFields(pre => {
      return {
        ...pre,
        ...table,
      };
    });
  }, [table]);

  useLoaderAndError(loading, error, resetHandler);

  const onNotify = ({status}) => {
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
        fields.color_code
      ).then(async result => {
        result && onNotify({status: 'updated'});
      });
    } else {
      delete fields.table_id;
      await insertTable(
        fields.tableName,
        fields.status,
        0,
        fields.size,
        fields.color_code
      ).then(async result => {
        result && onNotify({status: 'added'});
      });
    }
  };

  return (
    <>
      <YStack flex={1} backgroundColor={theme.colors.gray[100]}>
        <StyledCard
          gap={8}
          paddingHorizontal={16}
          horizontal
          backgroundColor={theme.colors.gray[1]}
          borderRadius={16}
          marginHorizontal={16}
          marginTop={16}
          paddingVertical={16}>
          <ColorPicker
            color={fields.color_code || theme.colors.purple[900]}
            onPress={color => setFields({...fields, color_code: color})}
          />

          <StyledTextInput
            label={'Name'}
            keyboardType="default"
            placeholder="Enter table name"
            returnKeyType="next"
            maxLength={50}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.tableName}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={text => setFields({...fields, tableName: text})}
            error={!!errorMessages?.tableName}
            errorMessage={errorMessages?.tableName?.message}
          />
          <StyledTextInput
            label={'Size'}
            keyboardType="number-pad"
            placeholder="Enter table size"
            returnKeyType="next"
            maxLength={3}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.size.toString()}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={text => setFields({...fields, size: parseInt(text)})}
            error={!!errorMessages?.size}
            errorMessage={errorMessages?.size?.message}
          />
          <StyledSpacer marginVertical={4} />
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
                activeThumb: theme.colors.white,
                inactiveThumb: theme.colors.white,
                activeTrack: theme.colors.green[600],
                inactiveTrack: theme.colors.red[400],
              }}
            />
            <StyledText
              fontWeight={theme.fontWeight.normal}
              color={theme.colors.gray[600]}
              fontSize={theme.fontSize.normal}
              fontFamily={fontStyles.Roboto_Regular}>
              Status
            </StyledText>
          </XStack>
          <StyledPressable
            onPress={onSubmit}
            backgroundColor={theme.colors.yellow[500]}
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
    </>
  );
};

export default TableForm;
