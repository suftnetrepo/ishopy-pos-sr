
import React from "react";
import { useNavigation } from '@react-navigation/native';
import { YStack, StyledImage, XStack, StyledHeader, StyledCycle, StyledSafeAreaView, StyledSpacer, theme } from 'fluent-styles';
import Text from "../../components/text";
import { StyledMIcon } from "../../components/icon";
import { Linking } from "react-native";
import {useAppTheme} from '../../theme';

const HelpCenter = () => {
  const {t} = useAppTheme();
    const navigator = useNavigation()

    const handleEmailPress = () => {
        Linking.openURL(`mailto:${"info@suftnet.com"}`);
    };

    const handleDialPress = () => {
        Linking.openURL(`tel:${"+447407022723"}`);
    };

    return (
        <StyledSafeAreaView backgroundColor={t.bgCard}>
            <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
                <StyledHeader.Header backgroundColor={t.bgCard} onPress={() => navigator.goBack()} title='Help Center' icon cycleProps={{
                    borderColor: t.textMuted,
                    marginRight: 8
                }} />
            </StyledHeader>
            <YStack flex={1} justifyContent='center' alignItems='center' backgroundColor={t.bgPage}>
                <YStack width={'80%'} backgroundColor={t.bgCard} borderRadius={8} paddingHorizontal={16} paddingVertical={16} >
                    <StyledSpacer marginVertical={8} />
                    <StyledImage source={require("../../../assets/img/logo.png")} ></StyledImage>
                    <StyledSpacer marginVertical={8} />
                    <Text variant="body" color={t.textPrimary}>
                        Thank you for using iShopy and for your interest in contacting
                        us. We're always here to help and we appreciate your feedback.
                    </Text>
                    <StyledSpacer marginVertical={8} />
                    <Text variant="label" color={t.textPrimary}>
                        {
                            "The Gatehouse \n453 Cranbrook Road\nllford Essex IG2 6EW, United Kingdom"
                        }
                    </Text>
                    <StyledSpacer marginVertical={8} />
                    <XStack
                        justifyContent='space-between' gap={10} alignItems='center'
                    >
                        <YStack>
                            <Text variant="label" color={t.textPrimary}>
                                info@suftnet.com
                            </Text>
                            <Text variant="label" color={t.textPrimary}>
                                +44 7407 022723
                            </Text>
                        </YStack>
                        <StyledSpacer marginHorizontal={1} />
                        <XStack
                            justifyContent='flex-end' alignItems='center'
                        >
                            <StyledCycle borderWidth={1} backgroundColor={theme.colors.cyan[500]}
                                borderColor={theme.colors.cyan[500]} >
                                <StyledMIcon                                  
                                    name="mail"
                                    size={20}
                                    color={t.bgCard}
                                    onPress={handleEmailPress}
                                />
                            </StyledCycle>                            
                            <StyledSpacer marginHorizontal={2} />
                            <StyledCycle borderWidth={1} backgroundColor={theme.colors.cyan[500]}
                                borderColor={theme.colors.cyan[500]} >
                                <StyledMIcon
                                    name="phone"
                                    size={20}
                                    color={t.bgCard}
                                    onPress={handleDialPress}
                                />
                            </StyledCycle>                           
                        </XStack>
                    </XStack>
                    <StyledSpacer marginVertical={8} />
                    <XStack justifyContent='flex-end' alignItems='center' >
                        <StyledSpacer flex={1} />
                        <Text variant="caption" color={t.textMuted}>
                            Version 0.0.1
                        </Text>
                    </XStack>
                </YStack>
            </YStack>
        </StyledSafeAreaView>
    )
}

export default HelpCenter