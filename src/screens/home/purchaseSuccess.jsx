/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState} from 'react';
import {
    YStack,
    StyledSpacer,
    StyledButton,
    StyledCheckBox,
    XStack
} from 'fluent-styles';
import Text from '../../components/text';
import { StyledMIcon } from '../../components/icon';
import { palettes, theme } from '../../configs/theme';
import { prepareSeedData } from '../../model/seed';
import { useNavigation } from '@react-navigation/native';
import { useUtil } from '../../store';
import {useAppTheme} from '../../theme';

const PurchaseSuccess = () => {
  const {t} = useAppTheme();
    const { setPaymentStatus } = useUtil()
    const navigator = useNavigation()
    const [clearSeed, setClearSeed] = useState(false)

    const clearHandler = async () => {
        setPaymentStatus(false)
        clearSeed && await prepareSeedData()
        navigator.navigate("bottom-tabs", { screen: 'Settings' })
    }

    return (
        <YStack
            backgroundColor={palettes.transparent05}
            flex={1}
            justifyContent='center'
            alignItems='center'
        >
            <YStack
                width={'90%'}
                backgroundColor={t.bgCard}
                borderRadius={16}
                paddingHorizontal={16}
                paddingVertical={16}
                justifyContent='center'
                alignItems='center'
            >
                <StyledMIcon
                    name="check-circle"
                    size={120}
                    color={t.successColor}
                />
                <StyledSpacer marginVertical={8} />
                <Text
                    variant="header"
                    color={t.textPrimary}
                    paddingVertical={1}
                    paddingHorizontal={16}
                    textAlign='center'
                >
                    Thank You for Your Purchase!
                </Text>
                <StyledSpacer marginVertical={8} />
                <Text
                    variant="body"
                    color={t.textPrimary}
                    textAlign='center'
                >
                    We appreciate your support and are thrilled to have you on board. Please note that all sample Restaurant data will be deleted to ensure a clean experience.
                    We recommend updating your Restaurant and User account details.
                </Text>
                <StyledSpacer marginVertical={8} />
                <XStack
                    justifyContent='space-between'
                    alignItems='center'
                    paddingVertical={8}
                    paddingHorizontal={16}
                    backgroundColor={t.bgCard}
                >
                    <StyledCheckBox
                        height={25}
                        width={25}
                        checkedColor={theme.colors.pink[500]}
                        onPress={() => setClearSeed(!clearSeed)}
                    />
                    <StyledSpacer marginHorizontal={8} />
                    <Text
                        variant="body"
                        color={t.textSecondary}
                    >
                        Clear Sample Restaurant data
                    </Text>
                    
                </XStack>
                <StyledSpacer marginVertical={8} />
                <StyledButton
                    borderRadius={30}
                    borderColor={theme.colors.cyan[500]}
                    backgroundColor={theme.colors.cyan[500]}
                    onPress={() => clearHandler()}
                >
                    <Text
                        variant="button"
                        color={t.bgCard}
                        paddingHorizontal={16}
                        paddingVertical={8}
                    >
                        Go to Settings
                    </Text>
                </StyledButton>
                <StyledSpacer marginVertical={8} />
            </YStack>
        </YStack>
    )
}

export { PurchaseSuccess }