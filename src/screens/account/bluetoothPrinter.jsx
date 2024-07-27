/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React from 'react';
import { YStack, XStack, StyledButton, StyledImage, StyledBadge, StyledSpinner, StyledOkDialog, StyledSpacer, StyledText } from 'fluent-styles';
import { theme, fontStyles } from '../../configs/theme';
import { StyledMIcon } from '../../components/icon';
import { useBluetoothPrinterContext } from '../../hooks/bluetoothPrinterProvider';

const BluetoothPrinter = () => {
    const { isEnabled, devices, enableBluetooth, selectedPrinter, connectDevice, setError, error, testPrint, loading } = useBluetoothPrinterContext();
   
    const RenderRow = ({ title, onPress }) => {
        return (
            <XStack borderRadius={8} marginHorizontal={2} marginBottom={8} borderWidth={1} borderColor={theme.colors.gray[300]} backgroundColor={theme.colors.gray[1]} justifyContent='flex-start' alignItems='center' paddingVertical={2} paddingHorizontal={2}>
                <StyledSpacer marginHorizontal={2} />
                <StyledMIcon size={32} name='bluetooth-disabled' color={theme.colors.red[600]} />
                <StyledText fontFamily={fontStyles.FontAwesome5_Regular} paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
                    {title}
                </StyledText>
                <StyledSpacer flex={1} />
                <StyledMIcon size={32} name='chevron-right' color={theme.colors.gray[600]} onPress={() => onPress && onPress()} />
            </XStack>
        )
    }

    return (
        <YStack width={'100%'} paddingBottom={8} backgroundColor={theme.colors.gray[1]}>       
          <YStack
                justifyContent='center'
                alignItems='center'
                paddingVertical={32}
                paddingHorizontal={16}
                marginBottom={8}
            >
                <StyledImage
                    local
                    height={100}
                    width={100}
                    source={require('../../../assets/img/printer.png')}
                />
                <StyledSpacer marginVertical={8} />
                <StyledText
                    fontFamily={fontStyles.FontAwesome5_Regular}
                    fontWeight={theme.fontWeight.normal}
                    color={theme.colors.gray[800]}
                    fontSize={theme.fontSize.medium}
                >
                    You are not connected to any printer yet.
                    Make sure your Bluetooth printer is in pairing mode to connect.
                    `
                </StyledText>
                <StyledSpacer marginVertical={4} />
                <StyledButton backgroundColor={isEnabled ? theme.colors.cyan[500] : theme.colors.pink[600]} onPress={enableBluetooth}>
                    <XStack paddingHorizontal={8} justifyContent='flex-start' alignItems='center'>
                        <StyledSpacer marginHorizontal={2} />
                        <StyledMIcon size={32} name='search' color={theme.colors.gray[1]} />
                        <StyledText
                            fontFamily={fontStyles.FontAwesome5_Regular}
                            fontWeight={theme.fontWeight.normal}
                            color={theme.colors.gray[1]}
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
                            <StyledText fontFamily={fontStyles.FontAwesome5_Regular} paddingHorizontal={8} paddingBottom={8} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.small} color={theme.colors.gray[800]}>
                                Paired printer
                            </StyledText>
                        </XStack>
                        <XStack borderRadius={8} marginHorizontal={2} marginBottom={8} borderWidth={1} borderColor={theme.colors.gray[300]} backgroundColor={theme.colors.gray[1]} justifyContent='flex-start' alignItems='center' paddingVertical={4} paddingHorizontal={4}>
                            <StyledSpacer marginHorizontal={2} />
                            <StyledMIcon size={32} name='bluetooth-connected' color={theme.colors.green[600]} />
                            <StyledText fontFamily={fontStyles.FontAwesome5_Regular} paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
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
                <StyledText fontFamily={fontStyles.FontAwesome5_Regular} paddingHorizontal={8} paddingBottom={8} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.small} color={theme.colors.gray[800]}>
                    Available devices
                </StyledText>
            </XStack>
            {
                devices.filter((device) => device.name !== selectedPrinter?.name).map((item, index) => {
                    return (
                        <RenderRow key={index} title={item.name} onPress={() => connectDevice(item)} />
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
