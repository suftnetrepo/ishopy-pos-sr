import React, {useMemo} from 'react';
import {FlatList, useWindowDimensions} from 'react-native';
import {YStack} from 'fluent-styles';
import {useCategories} from '../../../../hooks/useCategory';
import CategoryCard from './category';
import {useAppContext} from '../../../../hooks/appContext';

const GAP = 8;

const MenuCategory = () => {
  const {data} = useCategories();
  const {updateSelectedCategory} = useAppContext();
  const {width} = useWindowDimensions();

const columns = useMemo(() => {
  if (width >= 1400) return 4;
  if (width >= 850) return 3;
  if (width >= 650) return 2;
  return 1;
}, [width]);

const available = useMemo(() => {
  if (width >= 1400) return 4;
  if (width >= 850) return width - 120 - 300 - 22;
  if (width >= 650) return width - 120 - 211;
  return 1;
}, [width]);

  const contentPadding = 0;
const availableWidth =available
  const safeWidth = Math.max(320, availableWidth);
  const cardWidth = (safeWidth - GAP * (columns - 1) - contentPadding) / columns;

  const renderItem = ({item, index}) => {
    const {category_id, name, status, icon_name, total_menu, color_code} = item;

    return (
      <YStack
        width={cardWidth}
        marginRight={(index + 1) % columns === 0 ? 0 : GAP}
        marginBottom={GAP}>
        <CategoryCard
          category_id={category_id}
          name={name}
          status={status}
          icon_name={icon_name}
          total_menu={total_menu}
          color_code={color_code}
          onPress={() => updateSelectedCategory(category_id)}
        />
      </YStack>
    );
  };

  const keyExtractor = (item, index) =>
    item.category_id || `category-${index}`;

  return (
    <YStack width="100%">
      <FlatList
        key={`category-grid-${columns}`}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={columns}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </YStack>
  );
};

export default MenuCategory;