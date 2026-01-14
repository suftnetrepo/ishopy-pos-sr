
import React, { useState, useEffect } from 'react';
import { YStack, XStack, StyledHeader, StyledSafeAreaView, StyledSpacer, StyledText, StyledSpinner, StyledButton } from 'fluent-styles';
import { fontStyles, theme } from '../configs/theme';
import { usePin } from '../hooks/useUser';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ShowToast } from '../components/toast';
import { useSelector } from '@legendapp/state/react';
import { state } from '../store';
import { StyledMIcon } from '../components/icon';
import { useAppContext } from '../hooks/appContext';
import { Stack } from '../components/package/stack';
import Drawer from '../components/package/drawer';
import HelpScreen from '../components/help';

const Keypad = () => {
    const navigator = useNavigation()
    const { login } = useAppContext()
    const { purchase_status } = useSelector(() => state.get());
    const { error, loading, loginByPin, resetHandler, recoveryHandler } = usePin()
    const [pin, setPin] = useState('');
    const [recovery_password, setRecovery_password] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

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
                        navigator.navigate("big-dashboard")
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
            <XStack flex={1} justifyContent='flex-end' alignItems='center' marginHorizontal={16} paddingVertical={8}>
                <StyledMIcon size={32} name='help' color={theme.colors.violet[700]} onPress={() => setShowPayment(true)} />
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
            <YStack flex={1} justifyContent='center' alignItems='center'>
                <RenderLockIcon />

                <StyledSpacer marginVertical={16} />
                <XStack marginBottom={20}>
                    {[0, 1, 2, 3].map((_, index) => (
                        <YStack key={index} width={60} height={60} borderWidth={1} borderRadius={10} margin={5} borderColor={theme.colors.gray[600]} justifyContent='center' alignItems='center'>
                            <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.large} fontWeight={theme.fontWeight.bold} >
                                {pin[index]}
                            </StyledText>
                        </YStack>
                    ))}
                </XStack>
                {
                    (!purchase_status || recovery_password) && (
                        <StyledText color={theme.colors.gray[400]} fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal} >
                            1234
                        </StyledText>
                    )
                }
                <StyledSpacer marginVertical={8} />
                <Stack vertical flexWrap='wrap' justifyContent='center' alignItems='center'>
                    {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']].map((row, index) => (
                        <Stack gap={16} horizonal key={index} margin={5}>
                            {row.map(num => (
                                <StyledButton
                                    key={num}
                                    width={70} height={70}
                                    borderWidth={1} borderRadius={35}
                                    backgroundColor={theme.colors.gray[1]}
                                    borderColor={theme.colors.gray[600]}
                                    onPress={() => handlePress(num.toString())}
                                >
                                    <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.xxlarge} fontWeight={theme.fontWeight.bold} >
                                        {num}
                                    </StyledText>
                                </StyledButton>))}
                        </Stack>

                    ))}
                    <StyledSpacer marginVertical={8} />
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
                </Stack>
                <StyledSpacer marginVertical={8} />
            </YStack>
            {
                (loading) && (
                    <StyledSpinner />
                )
            }
            {
                error && (handleError())
            }
            <Drawer
                direction="right"
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
            >
                <HelpScreen onClose={() => setShowPayment(false)} />
            </Drawer>
        </StyledSafeAreaView>
    );
};

export default Keypad;
