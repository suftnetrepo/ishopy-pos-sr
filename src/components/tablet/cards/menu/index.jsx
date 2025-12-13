import React from "react";
import { FlatList } from "react-native";
import { StyledSpacer, StyledText } from 'fluent-styles';
import {
  ScrollView,
} from "@gluestack-ui/themed";
import { useQueryMenuByCategory } from "../../../../hooks/useMenu";
import { useAppContext } from "../../../../hooks/appContext";
import { Stack } from "../../../package/stack";
import { theme, fontStyles } from "../../../../utils/theme";
import { StyledIcon } from "../../../package/icon";
import { formatCurrency } from "../../../../utils/help";

export default function ItemCard() {
  const { category_id, updateSelectedItem, selectedItem, shop, addItem } = useAppContext()
  const { data } = useQueryMenuByCategory(category_id)

  const handleAddItem = async (item) => {
    // if (item?.addOns) {
    //   onChange(item)
    // }
    const index = `${Date.now()}${Math.random().toString(36).slice(2,8)}`;
    addItem(index, item.menu_id, item.name, item.price, 1, "1").then(() => { });
  };

  const handleTouchStart = async (item) => {
    updateSelectedItem(item)
    await handleAddItem(item)
  }

  const Card = ({ item }) => {
    return (
      <Stack
        blue={selectedItem?.menu_id === item.menu_id}
        flex={1}
        backgroundColor={theme.colors.gray[1]}
        borderRadius={16}
        padding={12}
        marginVertical={4}
        marginHorizontal={4}
        shadowColor="black"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.1}
        shadowRadius={2}
        elevation={3}
        status={item?.color_code}
        vertical
        onTouchStart={() => handleTouchStart(item)}
      >
        {
          selectedItem?.menu_id === item.menu_id && (
            <StyledIcon position='absolute' right={1} top={1} name="check-circle" size={32} color={theme.colors.blue[500]} />
          )
        }

        <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.medium} fontWeight={theme.fontWeight.medium} color={theme.colors.gray[800]}>
          {item.name}
        </StyledText>
        <StyledSpacer marginVertical={2} />
        <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.small} fontWeight={theme.fontWeight.light} color={theme.colors.gray[500]}>
          {item.stock} Available
        </StyledText>
        <StyledSpacer marginVertical={4} />
        <StyledText fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.medium} color={theme.colors.gray[800]}>
          {formatCurrency(shop?.currency || "£", item.price)}
        </StyledText>
      </Stack>
    );
  };

  return (
    <ScrollView flex={3} showsVerticalScrollIndicator={false}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.menu_id}
        scrollEnabled={false}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card
            key={item.menu_id}
            item={item}
          />
        )}
      />

    </ScrollView>
  );
}
