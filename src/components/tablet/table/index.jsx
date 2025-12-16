import React from "react";
import { FlatList } from "react-native";
import { StyledSpacer, StyledText } from 'fluent-styles';
import {
    ScrollView,
} from "@gluestack-ui/themed";
import { useQueryTablesByStatus } from "../../../hooks/useTable";
import { useAppContext } from "../../../hooks/appContext";
import { Stack } from "../../package/stack";
import { theme, fontStyles } from "../../../utils/theme";
import { StyledIcon } from "../../package/icon";

export default function TableCard({onTableSelect}) {
    const { shop } = useAppContext()
    const { data, error, loading } = useQueryTablesByStatus()

    const Card = ({ table }) => {
        return (
            <Stack
                flex={1}
                backgroundColor={theme.colors.gray[50]}
                borderColor={theme.colors.gray[100]}
                borderRadius={16}
                padding={16}
                marginVertical={8}
                marginHorizontal={8}
                shadowColor={theme.colors.gray[1]}
                shadowOffset={{ width: 0, height: 1 }}
                shadowOpacity={0.1}
                shadowRadius={2}
                elevation={3}
                vertical
                onTouchStart={() => onTableSelect(table)}
                justifyContent="center"
                alignItems="center"
            >
                <Stack borderRadius={30} justifyContent="center" paddingHorizontal={16} paddingVertical={16} alignItems="center" backgroundColor={theme.colors.gray[1]} borderColor={theme.colors.gray[1]}>
                    <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.medium} fontWeight={theme.fontWeight.medium} color={theme.colors.gray[800]}>
                        {table.tableName}
                    </StyledText>
                </Stack>

                <StyledSpacer marginVertical={4} />
                <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.light} color={theme.colors.gray[500]}>
                   Guests {table.guest_count || 0} 
                </StyledText>
                <StyledSpacer marginVertical={16} />
                   <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.light} color={theme.colors.gray[500]}>
                    {table.start_time || "--:--"} 
                </StyledText>
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
