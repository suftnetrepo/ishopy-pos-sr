import React, { useState } from "react";
import { FlatList, Pressable } from "react-native";
import { StyledText, StyledSpacer, StyledCycle } from 'fluent-styles';
import {
    Box,
    Text,
    ScrollView,
} from "@gluestack-ui/themed";
import { Stack } from "../../package/stack";
import { theme, fontStyles } from "../../../utils/theme";
import { colorCodeStatus, getLastChars } from "../../../utils/help";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useOrders } from "../../../hooks/useOrder";
import { useAppContext } from "../../../hooks/appContext";

export default function OrderCard({ onOrderChange, onHandleFilter }) {
    const { updateSelectedOrder } = useAppContext()
    const [state, setState] = useState('All')
    const { data, filterOrders, restoreOrders, loading, error } = useOrders(true)
    const StatusOptions = ["All", "Progress", "Pending", "Completed", "Cancelled"];

    const handleFilter = async (status) => {
        setState(status)
        if (status === 'All') {
            restoreOrders();
            return;
        }

        await filterOrders(status)
    }

    const handleOrder = (order) => {
        updateSelectedOrder(order)
        onOrderChange('basket')
    }

    const Card = ({ order }) => {
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        };

        return (
            <Stack
                flex={1}
                backgroundColor={theme.colors.gray[1]}
                borderRadius={16}
                padding={16}
                marginVertical={4}
                marginHorizontal={4}
                shadowColor="black"
                shadowOffset={{ width: 0, height: 1 }}
                shadowOpacity={0.1}
                shadowRadius={2}
                elevation={3}
                status={colorCodeStatus(order?.status)}
                vertical
                onTouchStart={() => handleOrder(order)}
            >
                <Stack marginBottom={2} horizonal flex={1} justifyContent="space-between" alignItems="center">
                    <Stack gap={4} horizonal alignItems="center">
                        {/* <Ionicons name="restaurant-outline" size={18} color={theme.colors.gray[600]} /> */}
                        <StyledText color={theme.colors.gray[600]} fontSize={theme.fontSize.normal}>{order?.table_name}</StyledText>
                    </Stack>
                    <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.normal} color={theme.colors.gray[600]}>
                        #{getLastChars(order?.order_id, 3)}
                    </StyledText>
                </Stack>

                <Stack vertical >
                    <Stack gap={4} horizonal alignItems="center">
                        <MaterialIcon name="access-time" size={18} color={theme.colors.gray[600]} />
                        <StyledText color={theme.colors.gray[400]} fontSize={theme.fontSize.small}>{formatDate(order?.date)}</StyledText>
                    </Stack>
                </Stack>
            </Stack>
        );
    };

    return (
        <ScrollView flex={3} showsVerticalScrollIndicator={false}>
            <Stack marginBottom={8} flex={1} marginLeft={8} marginRight={24} horizonal justifyContent="space-between" alignItems="center" >
                <Stack gap={8} horizonal>
                    {StatusOptions.map((status) => {
                        const isActive = status === state;
                        return (
                            <Pressable key={status} onPress={async () => { await handleFilter(status) }}>
                                <Box
                                    px="$4"
                                    py="$2"
                                    borderRadius="$full"
                                    bg={isActive ? "$green600" : "$gray200"}
                                >
                                    <Text color={isActive ? "$white" : "$black"} fontWeight="300">
                                        {status}
                                    </Text>
                                </Box>
                            </Pressable>
                        );
                    })}
                </Stack>
                <StyledSpacer flex={1} />
                <Pressable onPress={() => { onHandleFilter('filter')}}>
                    <StyledCycle
                        paddingHorizontal={10}
                        borderWidth={1}
                        height={48}
                        width={48}
                        backgroundColor={theme.colors.gray[100]}
                        borderColor={theme.colors.gray[400]}>
                        <MaterialIcon
                            size={24}
                            name="filter-list"
                            color={theme.colors.gray[800]}

                        />
                    </StyledCycle>
                </Pressable>
            </Stack>
            <FlatList
                data={data}
                keyExtractor={(item) => item.order_id}
                scrollEnabled={false}
                numColumns={4}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Card
                        key={item.order_id}
                        order={item}
                    />
                )}
            />

        </ScrollView>
    );
}
