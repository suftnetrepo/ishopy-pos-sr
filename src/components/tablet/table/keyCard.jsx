import React, { useState } from "react";
import {
    Box,
    Text,
    VStack,
    HStack,
    Pressable,
    Button,
    ButtonText,
} from "@gluestack-ui/themed";
import { YStack, StyledSpacer } from 'fluent-styles';
import { StyledIcon } from "../../package/icon";
import { fontStyles, theme } from "../../../utils/theme";
import { Stack } from "../../../components/package/stack";

export default function KeyCard({ onSubmit, onClose, table_name, table_id }) {
    const [pad, setPad] = useState("");
    const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "<"];

    const handleKeyPress = (key) => {
        setPad((prev) => {

            if (key === "<") {
                return prev.slice(0, -1);
            }

            if (prev === "0") return key;
            return prev + key;
        });
    };

    const handleSubmit = () => {

      const table ={
        table_id: table_id,
        guest_count: pad,
        guest_name: "Guest",
        isOccupied: 1,
        start_time: new Date().toTimeString().split(' ')[0],
      }
      onSubmit(table);
           onClose();
    }

    const handleClose = () => {
        setPad("");
        onClose();
    }

    return (
        <YStack
            backgroundColor={theme.colors.transparent05}
            flex={1}
            justifyContent='center'
            alignItems='center'
        >
            <YStack
                width={'30%'}
                height={'80%'}
                backgroundColor={theme.colors.transparent05}
                borderRadius={16}
                justifyContent='center'
                alignItems='center'
            >

                <Box borderRadius={16}  backgroundColor={theme.colors.gray[900]}>
                    <HStack justifyContent="space-between" alignItems="center" px={24} py={16}>
                        <Stack horizonal flex={1} justifyContent="flex-start" alignItems="center">
                            <StyledIcon
                                name="attach-money"
                                size={24}
                                color={theme.colors.gray[1]}
                            />
                            <Text fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[1]} fontSize={theme.fontSize.large} fontWeight={theme.fontWeight.medium}>
                                {table_name}
                            </Text>
                        </Stack>
                        <StyledIcon
                            name="cancel"
                            size={48}
                            color={theme.colors.gray[1]}
                            onPress={handleClose}
                        />
                    </HStack>

                    <HStack flex={1}>
                        <VStack px={16} py={16} justifyContent="center" alignItems="center" >
                              <Text marginBottom={24} fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[300]} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.thin}>
                                Enter number of guests
                            </Text>
                              <Text fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[1]} fontSize={theme.fontSize.large} fontWeight={theme.fontWeight.medium}>
                                {pad}
                            </Text>
                            <StyledSpacer marginVertical={16} />
                            <HStack flex={1} paddingHorizontal={8} flexWrap="wrap" justifyContent="center">
                                {keypad.map((num, i) => (
                                    <Pressable
                                        key={i}
                                        onPress={() => handleKeyPress(num)}
                                        style={{
                                            width: "30%",
                                            margin: "1.5%",
                                            height: 70,
                                            borderRadius: 10,
                                            backgroundColor: "#2E2E2E",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text color={theme.colors.gray[1]} fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.large} fontWeight={theme.fontWeight.medium}>
                                            {num}
                                        </Text>
                                    </Pressable>
                                ))}
                            </HStack>
                            <HStack
                                justifyContent="space-between"
                                px={16}
                                py={16}
                              
                                borderTopWidth={1}
                                borderColor={theme.colors.gray[800]}
                            >
                                <Button variant="outline" borderColor={theme.colors.gray[600]} px={20} py={10} borderRadius={25} onPress={handleClose}>
                                    <ButtonText fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[1]}>Close</ButtonText>
                                </Button>
                                  <StyledSpacer marginHorizontal={16} />
                                <Button bg={(pad.length > 0 && pad !=="0") ? theme.colors.gray[1] : theme.colors.gray[600]} px={30} py={10} borderRadius={25} onPress={()=> (pad.length > 0 && pad !=="0") && handleSubmit()}>
                                    <ButtonText fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[800]}>Submit</ButtonText>
                                </Button>
                            </HStack>
                        </VStack>
                    </HStack>
                </Box>
            </YStack>
        </YStack>

    );
}
