
import React, { useState} from 'react';
import {
    YStack,
    StyledText,
    StyledSpacer,
    StyledButton,
    StyledCheckBox,
    XStack
} from 'fluent-styles';
import { StyledMIcon } from '../../icon';
import { fontStyles, palettes, theme } from '../../../configs/theme';
import { prepareSeedData } from '../../../model/seed';
import { useNavigation } from '@react-navigation/native';
import { useUtil } from '../../../store';

const PurchaseSuccess = () => {
    const { setPaymentStatus } = useUtil()
    const navigator = useNavigation()
    const [clearSeed, setClearSeed] = useState(false)

    const clearHandler = async () => {
        setPaymentStatus(false)
        navigator.navigate("big-settings")
    }

    return (
        <YStack
            backgroundColor={palettes.transparent05}
            flex={1}
            width='50%'
            justifyContent='center'
            alignItems='center'
        >
            <YStack
                width={'90%'}
                backgroundColor={theme.colors.gray[1]}
                borderRadius={16}
                paddingHorizontal={16}
                paddingVertical={16}
                justifyContent='center'
                alignItems='center'
            >
                <StyledMIcon
                    name="check-circle"
                    size={120}
                    color={theme.colors.green[600]}
                />
                <StyledSpacer marginVertical={8} />
                <StyledText
                    fontFamily={fontStyles.Roboto_Regular}
                    color={theme.colors.gray[800]}
                    fontWeight={theme.fontWeight.normal}
                    fontSize={theme.fontSize.xlarge}
                    paddingVertical={1}
                    paddingHorizontal={16}
                    textAlign='center'
                >
                    Thank You for Your Purchase!
                </StyledText>
                <StyledSpacer marginVertical={8} />
                <StyledText
                    fontFamily={fontStyles.Roboto_Regular}
                    color={theme.colors.gray[800]}
                    fontWeight={theme.fontWeight.normal}
                    fontSize={theme.fontSize.normal}
                    textAlign='center'
                >
                    We appreciate your support and are thrilled to have you on board. Please note that all sample Restaurant data will be deleted to ensure a clean experience.
                    We recommend updating your Restaurant and User account details.
                </StyledText>
                <StyledSpacer marginVertical={8} />
                <XStack
                    justifyContent='space-between'
                    alignItems='center'
                    paddingVertical={8}
                    paddingHorizontal={16}
                    backgroundColor={theme.colors.gray[1]}
                >
                    <StyledCheckBox
                        height={25}
                        width={25}
                        checkedColor={theme.colors.pink[500]}
                        onPress={() => setClearSeed(!clearSeed)}
                    />
                    <StyledSpacer marginHorizontal={8} />
                    <StyledText
                        fontFamily={fontStyles.Roboto_Regular}
                        fontWeight={theme.fontWeight.normal}
                        color={theme.colors.gray[600]}
                        fontSize={theme.fontSize.normal}
                    >
                        Do you want to clear sample data
                    </StyledText>
                    
                </XStack>
                <StyledSpacer marginVertical={8} />
                <StyledButton
                    borderRadius={30}
                    borderColor={theme.colors.cyan[500]}
                    backgroundColor={theme.colors.cyan[500]}
                    onPress={() => clearHandler()}
                >
                    <StyledText
                        fontFamily={fontStyles.OpenSansRegular}
                        color={theme.colors.gray[1]}
                        fontWeight={theme.fontWeight.normal}
                        fontSize={theme.fontSize.normal}
                        paddingHorizontal={16}
                        paddingVertical={8}
                    >
                        Go to Settings
                    </StyledText>
                </StyledButton>
                <StyledSpacer marginVertical={8} />
            </YStack>
        </YStack>
    )
}

export { PurchaseSuccess }