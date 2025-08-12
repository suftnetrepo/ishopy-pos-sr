import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import {Stack} from '../../package/stack';
import {useCategories} from '../../../hooks/useCategory';
import {ScrollView} from 'react-native';
import CategoryCard from './category';

const MenuCategory = () => {
  const {data} = useCategories();

  const renderItem= ({ item }) => {
    const { category_id, name, status, icon, total_menu, color_code } = item;

    return (
      <CategoryCard
        category_id={category_id}
        name={name}
        status={status}
        icon={icon}
        total_menu={total_menu}
        color_code={color_code}
      />
    );
  };

  const keyExtractor = (item, index) => 
    item.category_id || `category-${index}`;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={3}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default MenuCategory;
