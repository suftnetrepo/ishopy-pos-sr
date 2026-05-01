
import React from "react";
import { useNavigation } from '@react-navigation/native';
import { YStack, XStack, StyledHeader, StyledSafeAreaView, StyledText, theme } from 'fluent-styles';
import { StyledMIcon } from "../../components/icon";
import FaqProvider, { useFaqContext } from "../../hooks/faqContext";
import FAQS from '../../../assets/data/faq.json'
import { ScrollView } from "react-native";
import {useAppTheme} from '../../theme';

const FAQ = () => {
  const {t} = useAppTheme();
    const navigator = useNavigation()

    const FAQ = ({faq, t}) => {
        const { selected, onValueChange } = useFaqContext()
        return (
            <YStack>
                <XStack borderRadius={16} marginBottom={4} backgroundColor={t.bgCard} justifyContent='space-between' alignItems='center' paddingVertical={8} paddingHorizontal={8}>
                    <XStack flex={1}>
                        <StyledText paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={t.textPrimary}>
                            {faq.question}
                        </StyledText>
                    </XStack>
                    <StyledMIcon size={32} name={selected === faq.id ? 'arrow-drop-down' : 'arrow-drop-up'} color={t.textSecondary} onPress={() => onValueChange(faq.id)} />
                </XStack>
                {
                    selected === faq.id && (
                        <XStack borderRadius={16} marginBottom={4} borderColor={t.textPrimary} backgroundColor={t.textPrimary} justifyContent='space-between' alignItems='center' paddingVertical={8} paddingHorizontal={8}>
                            <StyledText paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={t.bgCard}>
                                {faq.answer}
                            </StyledText>
                        </XStack>
                    )
                }
            </YStack>

        )
    }

    return (
        <StyledSafeAreaView backgroundColor={t.bgCard}>
            <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
                <StyledHeader.Header backgroundColor={t.bgCard} onPress={() => navigator.goBack()} title='FAQ' icon cycleProps={{
                    borderColor: t.textMuted,
                    marginRight: 8
                }} />
            </StyledHeader>
            <YStack flex={1} paddingHorizontal={8} paddingVertical={4} backgroundColor={t.borderDefault}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <FaqProvider>
                        {
                            FAQS.map((faq, index) => (<FAQ key={index} faq={faq} 
                        t={t}/>))
                        }
                    </FaqProvider>
                </ScrollView>

            </YStack>
        </StyledSafeAreaView>
    )
}

export default FAQ