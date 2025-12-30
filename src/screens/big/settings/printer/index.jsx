
import React, { useEffect } from 'react';
import { YStack, XStack, StyledRadioButton, StyledSpacer, StyledText } from 'fluent-styles';
import {
  Text,
  HStack,
} from "@gluestack-ui/themed";
import { fontStyles, theme } from '../../../../configs/theme';
import { useRadioContext } from '../../../../hooks/radioContext';
import BluetoothPrinter from './bluetoothPrinter';
import { FEATURE_FLAG } from '../../../../feature-flags';
import { ScrollView } from 'react-native';
import { StyledIcon } from '../../../../components/package/icon';

const Printer = ({onClose}) => {
    const { onValueChange, checked } = useRadioContext()

    useEffect(()=> {
        onValueChange('bluetooth')
    },[])

    return (
        <>
            <YStack paddingHorizontal={8} flex={1} backgroundColor={theme.colors.gray[100]}>
               <StyledSpacer marginVertical={16} />
                     <HStack justifyContent="space-between" alignItems="center" >
                       <HStack flex={1} horizontal justifyContent="flex-start" alignItems="center">
                         <StyledIcon
                           name="print"
                           size={32}
                           color={theme.colors.teal[400]}
                         />
                         <Text
                           paddingHorizontal={4}
                           fontFamily={fontStyles.Roboto_Regular}
                           color={theme.colors.gray[500]}
                           fontSize={theme.fontSize.large}
                           fontWeight={theme.fontWeight.thin}
                         >
                           Printer
                         </Text>
                       </HStack>
                       <StyledIcon
                         name="cancel"
                         size={48}
                         color={theme.colors.gray[800]}
                         onPress={() => onClose()}
                       />
                     </HStack>
                           <StyledSpacer marginVertical={8} />
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
        </>
    );
};

export default Printer;
