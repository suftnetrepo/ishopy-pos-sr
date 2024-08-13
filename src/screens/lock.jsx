/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { YStack, XStack, StyledHeader, StyledSafeAreaView, StyledSpacer, StyledText, StyledSpinner, StyledButton } from 'fluent-styles';
import { fontStyles, theme } from '../configs/theme';
import { usePin } from '../hooks/useUser';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ShowToast } from '../components/toast';
import { useSelector } from '@legendapp/state/react';
import { state } from '../store';
import { useAppContext } from '../hooks/appContext';
import { StyledMIcon } from '../components/icon';
import { ScrollView } from 'react-native';

const Keypad = () => {
    const navigator = useNavigation()
    const { login } = useAppContext()
    const route = useRoute()
    const purchase_status = useSelector(() => state.purchase_status.get());
    const { error, loading, loginByPin, resetHandler, recoveryHandler } = usePin()
    const { recovery_password } = route.params
    const [pin, setPin] = useState('');

    useEffect(() => {
        recovery_password && recoveryHandler()
    }, [recovery_password])

    const handlePress = (num) => {
        if (pin.length < 4) {
            let passCode = pin + num
            setPin(pin + num);

            if (passCode.length === 4) {
                loginByPin(parseInt(passCode)).then(async (result) => {
                    if (result) {
                        await login(result)
                        navigator.navigate("bottom-tabs")
                    }
                })
            }
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    const handleError = () => {
        ShowToast("Error", error?.message, "error")
        resetHandler()
    }

    const RenderHeader = () => {
        return (
            <XStack flex={1} justifyContent='flex-end' alignItems='center' paddingHorizontal={32} paddingVertical={8}>
                <Icon
                    name={'exit-to-app'}
                    size={48}
                    color={theme.colors.gray[700]}
                    onPress={() => {
                        navigator.navigate("login")
                    }}
                />
            </XStack>
        )
    }

    const RenderLockIcon = () => {
        return (
            <XStack justifyContent='center' alignItems='center' paddingVertical={8}>
                <Icon
                    name={'lock-clock'}
                    size={64}
                    color={theme.colors.gray[800]}
                />
            </XStack>
        )
    }

    const Notice = () => {
        return (
            <YStack marginHorizontal={32} borderRadius={16} justifyContent='flex-start' paddingVertical={16} paddingHorizontal={16} alignItems='flex-start' backgroundColor={theme.colors.cyan[50]}>

                <XStack justifyContent='flex-start' alignItems='center'>
                    <StyledMIcon size={32} name='info' color={theme.colors.cyan[500]} />
                    <StyledText paddingHorizontal={8} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.large} color={theme.colors.gray[800]}>
                        Password Reset
                    </StyledText>
                </XStack>
                <StyledText fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.medium} color={theme.colors.gray[800]}>
                    You have requested your password to be reset. After updating your password, we recommend updating your login details for enhanced security.
                </StyledText>
            </YStack>
        )
    }

    return (
        <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
            <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
                <StyledHeader.Full>
                    <RenderHeader />
                </StyledHeader.Full>
            </StyledHeader>
            <RenderLockIcon />
            <ScrollView showsVerticalScrollIndicator={false}>
                <YStack flex={1} justifyContent='center' alignItems='center'>
                    {
                        recovery_password && (
                            <>
                                <StyledSpacer marginVertical={8} />
                                <Notice />
                            </>
                        )
                    }
                    <StyledSpacer marginVertical={8} />
                    <XStack marginBottom={20}>
                        {[0, 1, 2, 3].map((_, index) => (
                            <YStack key={index} width={60} height={60} borderWidth={1} borderRadius={10} margin={5} borderColor={theme.colors.gray[400]} justifyContent='center' alignItems='center'>
                                <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.large} fontWeight={theme.fontWeight.bold} >
                                    {pin[index]}
                                </StyledText>
                            </YStack>
                        ))}
                    </XStack>
                    {
                        !purchase_status || recovery_password && (
                            <StyledText color={theme.colors.gray[400]} fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal} >
                                1234
                            </StyledText>
                        )
                    }
                    <StyledSpacer marginVertical={8} />
                    <XStack flexWrap='wrap' justifyContent='center' alignItems='center'>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, index) => (
                            <YStack key={index} margin={5}>
                                <StyledButton
                                    width={70} height={70}
                                    borderWidth={1} borderRadius={35}
                                    backgroundColor={theme.colors.gray[1]}
                                    borderColor={theme.colors.gray[400]}
                                    key={index}
                                    onPress={() => handlePress(num.toString())}
                                >
                                    <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.xxlarge} fontWeight={theme.fontWeight.bold} >
                                        {num}
                                    </StyledText>
                                </StyledButton>
                            </YStack>

                        ))}
                        <StyledButton
                            width={70} height={70}
                            borderWidth={1} borderRadius={35}
                            backgroundColor={theme.colors.gray[1]}
                            borderColor={theme.colors.gray[400]}
                            onPress={handleDelete}
                        >
                            <StyledText fontSize={theme.fontSize.xxlarge} fontWeight={theme.fontWeight.bold} >
                                ⌫
                            </StyledText>
                        </StyledButton>
                    </XStack>
                </YStack>
            </ScrollView>


            {
                (loading) && (
                    <StyledSpinner />
                )
            }
            {
                error && (handleError())
            }
        </StyledSafeAreaView>
    );
};

export default Keypad;
