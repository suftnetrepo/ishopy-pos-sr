import React from 'react';
import { FlatList } from 'react-native';
import { YStack } from 'fluent-styles';
import { useCategories } from '../../../../hooks/useCategory';
import CategoryCard from './category';
import { useAppContext } from '../../../../hooks/appContext';

const MenuCategory = () => {
  const { data } = useCategories();
  const { updateSelectedCategory} = useAppContext();

  const renderItem = ({ item }) => {
    const { category_id, name, status, icon_name, total_menu, color_code } = item;

    return (
      <CategoryCard
        category_id={category_id}
        name={name}
        status={status}
        icon_name={icon_name}
        total_menu={total_menu}
        color_code={color_code}
        onPress={() => updateSelectedCategory(category_id)}
      />
    );
  };

  const keyExtractor = (item, index) =>
    item.category_id || `category-${index}`;

  return (
    <YStack>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={4}
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  );
};

export default MenuCategory;