/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React from "react";
import { useNavigation } from '@react-navigation/native';
import { YStack, XStack, StyledHeader, StyledSafeAreaView, StyledText } from 'fluent-styles';
import { theme } from "../../configs/theme";
import { StyledMIcon } from "../../components/icon";
import FaqProvider, { useFaqContext } from "../../hooks/faqContext";
import FAQS from '../../../assets/data/faq.json'
import { ScrollView } from "react-native";

const FAQ = () => {
    const navigator = useNavigation()

    const FAQ = ({ faq }) => {
        const { selected, onValueChange } = useFaqContext()
        return (
            <YStack>
                <XStack borderRadius={16} marginBottom={4} backgroundColor={theme.colors.gray[1]} justifyContent='space-between' alignItems='center' paddingVertical={8} paddingHorizontal={8}>
                    <XStack flex={1}>
                        <StyledText paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
                            {faq.question}
                        </StyledText>
                    </XStack>
                    <StyledMIcon size={32} name={selected === faq.id ? 'arrow-drop-down' : 'arrow-drop-up'} color={theme.colors.gray[600]} onPress={() => onValueChange(faq.id)} />
                </XStack>
                {
                    selected === faq.id && (
                        <XStack borderRadius={16} marginBottom={4} borderColor={theme.colors.gray[800]} backgroundColor={theme.colors.gray[800]} justifyContent='space-between' alignItems='center' paddingVertical={8} paddingHorizontal={8}>
                            <StyledText paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[1]}>
                                {faq.answer}
                            </StyledText>
                        </XStack>
                    )
                }
            </YStack>

        )
    }

    return (
        <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
            <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
                <StyledHeader.Header backgroundColor={theme.colors.gray[1]} onPress={() => navigator.goBack()} title='FAQ' icon cycleProps={{
                    borderColor: theme.colors.gray[300],
                    marginRight: 8
                }} />
            </StyledHeader>
            <YStack flex={1} paddingHorizontal={8} paddingVertical={4} backgroundColor={theme.colors.gray[200]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <FaqProvider>
                        {
                            FAQS.map((faq, index) => (<FAQ key={index} faq={faq} />))
                        }
                    </FaqProvider>
                </ScrollView>

            </YStack>
        </StyledSafeAreaView>
    )
}

export default FAQ