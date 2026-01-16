import React, {useEffect} from "react";
import { FlatList } from "react-native";
import { StyledSpacer, StyledText, StyledCycle } from 'fluent-styles';
import {
    ScrollView,
} from "@gluestack-ui/themed";
import { useAppContext } from "../../../hooks/appContext";
import { Stack } from "../../package/stack";
import { theme, fontStyles } from "../../../utils/theme";
import { StyledIcon } from "../../package/icon";
import { useNavigation } from "@react-navigation/native";
import { useFocus } from "../../../hooks/useFocus";

export default function TableCard({ data, onTableSelect }) {
    const focused = useFocus();
    const { shop, updateCurrentMenu } = useAppContext()
    const navigation = useNavigation();

    useEffect(() => {
        updateCurrentMenu(4);
    }, [focused]);

    const handlePress = (table) => {

        if (table?.isOccupied === 0) {
            onTableSelect(table);
            return;
        }

        navigation.navigate('big-menu', {
            table_id: table.table_id,
            table_name: table.tableName,
        });
    }

    const Card = ({ table }) => {
        return (
            <Stack
                flex={1}
                backgroundColor={theme.colors.gray[1]}
                borderColor={theme.colors.gray[1]}
                borderRadius={16}
                padding={8}
                marginBottom={8}
                marginHorizontal={4}
                shadowColor={theme.colors.gray[1]}
                shadowOffset={{ width: 0, height: 1 }}
                shadowOpacity={0.1}
                shadowRadius={2}
                elevation={3}
                horizonal
                justifyContent="space-between"
                alignItems="center"
                status={table?.isOccupied === 1 ? theme.colors.green[500] : theme.colors.purple[700]}
            >
                <Stack flex={1} vertical alignItems="flex-start" justifyContent="flex-start">
                    <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.medium} fontWeight={theme.fontWeight.medium} color={theme.colors.gray[800]}>
                        {table.tableName}
                    </StyledText>

                    <Stack horizonal marginTop={4} alignItems="center" justifyContent="flex-start">
                        <StyledIcon name="person" size={24} color={theme.colors.gray[500]} />
                        <StyledText marginHorizontal={2} fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.light} color={theme.colors.gray[500]}>
                            {table.guest_count || 0}
                        </StyledText>
                        <StyledSpacer marginHorizontal={2} />
                        <StyledIcon name="access-time" size={24} color={theme.colors.gray[500]} />
                        <StyledText marginHorizontal={4} fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.light} color={theme.colors.gray[500]}>
                            {table.start_time || "--:--"}
                        </StyledText>
                    </Stack>
                </Stack>
                 <StyledSpacer marginHorizontal={4} />
                <Stack horizonal alignItems="center" justifyContent="space-between">
                   
                    <StyledCycle
                        paddingHorizontal={10}
                        borderWidth={1}
                        height={48}
                        width={48}
                        onTouchStart={() => handlePress(table)}
                        borderColor={theme.colors.gray[400]}>
                        <StyledIcon
                            size={24}
                            name={table?.isOccupied === 0 ? "event-seat" : "groups"}
                            color={theme.colors.gray[800]}
                        />
                    </StyledCycle>
                </Stack>
            </Stack>
        );
    };

    return (
        <ScrollView flex={3} showsVerticalScrollIndicator={false}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.table_id}
                scrollEnabled={false}
                numColumns={4}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Card
                        key={item.table_id}
                        table={item}
                    />
                )}
            />

        </ScrollView>
    );
}
