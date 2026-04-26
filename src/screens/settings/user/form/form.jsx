
import React, { useState, useEffect } from "react";
import { validate, theme, StyledPressable, YStack, toastService, StyledCard, XStack, StyledSpacer, StyledTextInput, StyledInput, StyledText, StyledForm, Switch } from 'fluent-styles';
import { fontStyles } from "../../../../configs/theme";
import { userRules } from "./validatorRules";
import { useUpdateUser, useInsertUser } from "../../../../hooks/useUser";
import { useLoaderAndError } from "../../../../hooks/useLoaderAndError";

const UserForm = ({ user, onClose }) => {
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(userRules.fields)
  const { updateUser, error, loading, resetHandler } = useUpdateUser()
  const { insertUser } = useInsertUser()

  useLoaderAndError(loading, error, resetHandler);

  useEffect(() => {
    setFields((pre) => {
      return {
        ...pre,
        ...user
      }
    })
  }, [user])

  const onNotify = ({ status }) => {
    toastService.show({
      message: `User ${status}`,
      description: `Your user was ${status} successfully.`,
      variant: 'success',
      duration: 2500,
      theme: 'light',
    });
    setFields(userRules.reset);
    onClose && onClose();
  };


  const onSubmit = async () => {
    setErrorMessages({});
    const { hasError, errors } = validate(fields, userRules.rules);
    if (hasError) {
      setErrorMessages(errors);
      return false;
    }

    if (fields?.user_id) {
      await updateUser(user.user_id, fields.username, fields.password, fields.role, fields.first_name, fields.last_name, parseInt(fields.pass_code)).then(async (result) => {
        result && onNotify({ status: 'updated' });
      });
    } else {
      delete fields.user_id;
      await insertUser(fields.username, fields.password, fields.role, fields.first_name, fields.last_name, parseInt(fields.pass_code)).then(async (result) => {
        result && onNotify({ status: 'added' });
      });
    }
  };

  return (
    <YStack flex={1} backgroundColor={theme.colors.gray[100]}>
      <StyledCard
        gap={8}
        paddingHorizontal={16}
        horizontal
        backgroundColor={theme.colors.gray[1]}
        borderRadius={16}
        marginHorizontal={16}
        marginTop={16}
        paddingVertical={16}
      >


        <StyledForm >
          <StyledTextInput
            label={'FirstName'}
            keyboardType='default'
            placeholder='Enter your firstname'
            returnKeyType='next'
            maxLength={50}
            height={40}
            fontSize={theme.fontSize.small}
            paddingHorizontal={8}
            value={fields.first_name}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, first_name: text })}
            error={!!errorMessages?.first_name}
            errorMessage={errorMessages?.first_name?.message}
          />
          <StyledTextInput
            label={'LastName'}
            keyboardType='default'
            placeholder='Enter your lastname'
            returnKeyType='next'
            maxLength={50}
            height={40}
            fontSize={theme.fontSize.small}
            paddingHorizontal={8}
            value={fields.last_name}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, last_name: text })}
            error={!!errorMessages?.last_name}
            errorMessage={errorMessages?.last_name?.message}
          />
          <StyledTextInput
            label={'Username'}
            keyboardType='default'
            placeholder='Enter your username'
            returnKeyType='next'
            maxLength={50}
            height={40}
            fontSize={theme.fontSize.small}
            paddingHorizontal={8}
            value={fields.username}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, username: text })}
            error={!!errorMessages?.username}
            errorMessage={errorMessages?.username?.message}
          />
          <StyledTextInput
            label={'Password'}
            keyboardType='default'
            secureTextEntry={true}
            placeholder='Enter your password'
            returnKeyType='done'
            maxLength={8}
            height={40}
            fontSize={theme.fontSize.small}
            paddingHorizontal={8}
            value={fields.password}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, password: text })}
            error={!!errorMessages?.password}
            errorMessage={errorMessages?.password?.message}
          />
          <StyledTextInput
            label={'Pass code'}
            keyboardType='numeric'
            placeholder='Enter your pass code'
            returnKeyType='done'
            maxLength={4}
            height={40}
            fontSize={theme.fontSize.small}
            paddingHorizontal={8}
            value={fields.pass_code}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, pass_code: text })}
            error={!!errorMessages?.pass_code}
            errorMessage={errorMessages?.pass_code?.message}
          />
          {/* Uncomment if user model supports status */}

          {/* <XStack justifyContent='flex-start' alignItems='center' gap={8}>
            <Switch
              activeValue={1}
              inactiveValue={0}
              defaultValue={0}
              value={fields.status}
              onChange={value =>
                setFields({ ...fields, status: parseInt(value ? 1 : 0) })
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
          </XStack> */}

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

        </StyledForm>
      </StyledCard>
    </YStack>
  );
}

export default UserForm