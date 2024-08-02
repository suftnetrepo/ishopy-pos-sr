/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { YStack, XStack, StyledHeader, StyledRadioButton, StyledSafeAreaView, StyledSpacer, StyledText } from 'fluent-styles';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../configs/theme';
import { useRadioContext } from '../../hooks/radioContext';
import BluetoothPrinter from './bluetoothPrinter';
import { FEATURE_FLAG } from '../../feature-flags';
import { ScrollView } from 'react-native';


const Printer = () => {
    const navigator = useNavigation()
    const { onValueChange, checked } = useRadioContext()

    useEffect(()=> {
        onValueChange('bluetooth')
    },[])

    return (
        <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
            <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
                <StyledHeader.Header onPress={()=> navigator.goBack()}  title='Printer' icon cycleProps={{
                    borderColor: theme.colors.gray[300],
                    marginRight: 8
                }} />
            </StyledHeader>
            <YStack paddingHorizontal={8} flex={1} backgroundColor={theme.colors.gray[100]}>
                <StyledSpacer marginVertical={4} />
                <XStack
                    justifyContent='space-between'
                    alignItems='center'
                    paddingVertical={8}
                    paddingHorizontal={16}
                    marginBottom={8}
                    borderRadius={8}
                    backgroundColor={theme.colors.gray[1]}
                >
                    <StyledText
                        fontWeight={theme.fontWeight.normal}
                        color={theme.colors.gray[600]}
                        fontSize={theme.fontSize.normal}
                    >
                        Bluetooth (small POS printer)
                    </StyledText>
                    <StyledSpacer flex={1} />
                    <StyledRadioButton name='bluetooth' selected={checked} onPress={(name) => onValueChange(name)} />
                </XStack>
                {
                    FEATURE_FLAG.USB && (
                        <XStack
                            justifyContent='space-between'
                            alignItems='center'
                            paddingVertical={8}
                            paddingHorizontal={16}
                            marginBottom={8}
                            borderRadius={8}
                            backgroundColor={theme.colors.gray[1]}
                        >
                            <StyledText
                                fontWeight={theme.fontWeight.normal}
                                color={theme.colors.gray[600]}
                                fontSize={theme.fontSize.normal}
                            >
                                USB (small POS printer)
                            </StyledText>
                            <StyledSpacer flex={1} />
                            <StyledRadioButton name='usb' selected={checked} onPress={(name) => onValueChange(name)} />
                        </XStack>
                    )
                }
                {
                    FEATURE_FLAG.WIFI && (
                        <XStack
                            justifyContent='space-between'
                            alignItems='center'
                            paddingVertical={8}
                            paddingHorizontal={16}
                            marginBottom={8}
                            borderRadius={8}
                            backgroundColor={theme.colors.gray[1]}
                        >
                            <StyledText
                                fontWeight={theme.fontWeight.normal}
                                color={theme.colors.gray[600]}
                                fontSize={theme.fontSize.normal}
                            >
                                Wifi
                            </StyledText>
                            <StyledSpacer flex={1} />
                            <StyledRadioButton name='wifi' selected={checked} onPress={(name) => onValueChange(name)} />
                        </XStack>
                    )
                }             
                {
                    checked === 'bluetooth' && (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <BluetoothPrinter />
                        </ScrollView>                      
                    )
                }                
            </YStack>
        </StyledSafeAreaView>
    );
};

export default Printer;
