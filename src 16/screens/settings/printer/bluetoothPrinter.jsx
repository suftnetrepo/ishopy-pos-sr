
import React from 'react';
import { YStack, theme, XStack, StyledButton, StyledImage, StyledBadge, StyledSpinner, StyledOkDialog, StyledSpacer, StyledText } from 'fluent-styles';
import { fontStyles } from '../../../../configs/theme';
import { StyledMIcon } from '../../../components/icon';
import { useBluetoothPrinterContext } from '../../../hooks/bluetoothPrinterProvider';
import {useAppTheme} from '../../../theme';

const BluetoothPrinter = () => {
  const {t} = useAppTheme();
    const { isEnabled, devices, enableBluetooth, selectedPrinter, connectDevice, setError, error, testPrint, loading } = useBluetoothPrinterContext();
      
    const RenderRow = ({title, onPress, t}) => {
        return (
            <XStack borderRadius={8} marginHorizontal={2} marginBottom={8} borderWidth={1} borderColor={t.textMuted} backgroundColor={t.bgCard} justifyContent='flex-start' alignItems='center' paddingVertical={2} paddingHorizontal={2}>
                <StyledSpacer marginHorizontal={2} />
                <StyledMIcon size={32} name='bluetooth-disabled' color={t.dangerColor} />
                <StyledText fontFamily={fontStyles.FontAwesome5_Regular} paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={t.textPrimary}>
                    {title}
                </StyledText>
                <StyledSpacer flex={1} />
                <StyledMIcon size={32} name='chevron-right' color={t.textSecondary} onPress={() => onPress && onPress()} />
            </XStack>
        )
    }

    return (
        <YStack width={'100%'} paddingHorizontal={16} backgroundColor={t.bgCard}>       
          <YStack
                justifyContent='center'
                alignItems='center'
                paddingVertical={16}
              
                marginBottom={8}
            >
                <StyledImage
                    local
                    height={100}
                    width={100}
                    borderWidth={0}
                    source={require('../../../../../assets/img/printer.png')}
                />
                <StyledSpacer marginVertical={8} />
                <StyledText
                    fontFamily={fontStyles.Roboto_Regular}
                    fontWeight={theme.fontWeight.normal}
                    color={t.textPrimary}
                    fontSize={theme.fontSize.medium}
                >
                    Make sure your Bluetooth printer is in pairing mode. Once it’s ready, use the button below to scan for available Bluetooth devices.
                    `
                </StyledText>
                <StyledSpacer marginVertical={16} />
                <StyledButton backgroundColor={isEnabled ? t.successColor : t.dangerColor} onPress={enableBluetooth}>
                    <XStack paddingHorizontal={8} justifyContent='flex-start' alignItems='center'>
                        <StyledSpacer marginHorizontal={2} />
                        <StyledMIcon size={32} name='search' color={t.bgCard} />
                        <StyledText
                            fontFamily={fontStyles.Roboto_Regular}
                            fontWeight={theme.fontWeight.normal}
                            color={t.bgCard}
                            fontSize={theme.fontSize.medium}
                            paddingVertical={8}
                            paddingHorizontal={2}
                        >
                            {
                                isEnabled ? "Search devices" : "Enable Bluetooth"
                            }

                        </StyledText>
                         <StyledSpacer marginHorizontal={2} />
                    </XStack>
                </StyledButton>
            </YStack>
            {
                selectedPrinter && (
                    <>
                        <XStack justifyContent='flex-start' alignItems='center' paddingHorizontal={2}>
                            <StyledText fontFamily={fontStyles.FontAwesome5_Regular} paddingHorizontal={8} paddingBottom={8} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.small} color={t.textPrimary}>
                                Paired printer
                            </StyledText>
                        </XStack>
                        <XStack borderRadius={8} marginHorizontal={2} marginBottom={8} borderWidth={1} borderColor={t.textMuted} backgroundColor={t.bgCard} justifyContent='flex-start' alignItems='center' paddingVertical={4} paddingHorizontal={4}>
                            <StyledSpacer marginHorizontal={2} />
                            <StyledMIcon size={32} name='bluetooth-connected' color={t.successColor} />
                            <StyledText fontFamily={fontStyles.FontAwesome5_Regular} paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={t.textPrimary}>
                                {selectedPrinter.name}
                            </StyledText>
                            <StyledSpacer flex={1} />
                            <StyledButton onPress={() => testPrint()}>
                                <StyledBadge
                                    fontFamily={fontStyles.FontAwesome5_Regular}
                                    color={theme.colors.orange[800]}
                                    backgroundColor={theme.colors.orange[100]}
                                    fontWeight={theme.fontWeight.bold}
                                    fontSize={theme.fontSize.medium}
                                    paddingHorizontal={15}
                                    paddingVertical={1}
                                >
                                    Test print
                                </StyledBadge>
                            </StyledButton>
                            <StyledSpacer marginHorizontal={2} />
                        </XStack>
                    </>
                )
            }
            <XStack justifyContent='flex-start' alignItems='center' paddingHorizontal={2}>
                <StyledText fontFamily={fontStyles.FontAwesome5_Regular} paddingHorizontal={8} paddingBottom={8} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.small} color={t.textPrimary}>
                    Available devices
                </StyledText>
            </XStack>
            {
                devices.filter((device) => device.name !== selectedPrinter?.name).map((item, index) => {
                    return (
                        <RenderRow key={index} title={item.name} onPress={() => connectDevice(item)} t={t} />
                    )
                })
            }

            {
                (error) && (
                    <StyledOkDialog title={error?.message} description='please try again' visible={true} onOk={() => {
                        setError(null)
                    }} />
                )
            }
            {
                (loading) && (
                    <StyledSpinner />
                )
            }
        </YStack>
    );

};

export default BluetoothPrinter;
