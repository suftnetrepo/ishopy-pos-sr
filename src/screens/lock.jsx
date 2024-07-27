/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { YStack, XStack, StyledHeader, StyledSafeAreaView, StyledSpacer, StyledText, StyledSpinner, StyledButton } from 'fluent-styles';
import { theme } from '../configs/theme';
import { usePin } from '../hooks/useUser';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ShowToast } from '../components/toast';

const Keypad = () => {
    const navigator = useNavigation()
    const { error, loading, loginByPin, resetHandler } = usePin()
    const [pin, setPin] = useState('');

    const handlePress = (num) => {
        if (pin.length < 4) {
            let passCode = pin + num
            setPin(pin + num);

            if (passCode.length === 4) {
                loginByPin(parseInt(passCode)).then((result) => {
                    result && (
                        navigator.navigate("bottom-tabs"))
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

    return (
        <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
            <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
                <StyledHeader.Full>
                    <RenderHeader />
                </StyledHeader.Full>
            </StyledHeader>
            <RenderLockIcon />
            <YStack flex={1} justifyContent='center' alignItems='center'>

                <XStack marginBottom={20}>
                    {[0, 1, 2, 3].map((_, index) => (
                        <YStack key={index} width={60} height={60} borderWidth={1} borderRadius={10} margin={5} borderColor={theme.colors.gray[400]} justifyContent='center' alignItems='center'>
                            <StyledText fontSize={theme.fontSize.large} fontWeight={theme.fontWeight.bold} >
                                {pin[index]}
                            </StyledText>
                        </YStack>
                    ))}
                </XStack>
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
                                <StyledText fontSize={theme.fontSize.xxlarge} fontWeight={theme.fontWeight.bold} >
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
