import React, {useMemo, useState} from 'react';
import {FlatList} from 'react-native';
import {YStack} from 'fluent-styles';
import {useCategories} from '../../../../hooks/useCategory';
import CategoryCard from './category';
import {useAppContext} from '../../../../hooks/appContext';

const GAP = 8;

const MenuCategory = () => {
  const {data} = useCategories();
  const {updateSelectedCategory} = useAppContext();

  // Measure our own rendered width instead of reverse-engineering it from
  // the window width — the sidebar can be collapsed (84px) or expanded
  // (210px) depending on screen size, so any fixed offset guess drifts out
  // of sync and cards end up wider than the space actually available.
  const [containerWidth, setContainerWidth] = useState(0);

  const columns = useMemo(() => {
    if (containerWidth >= 1000) return 4;
    if (containerWidth >= 750) return 3;
    if (containerWidth >= 500) return 2;
    return 1;
  }, [containerWidth]);

  const safeWidth = Math.max(containerWidth, 280);
  const cardWidth = (safeWidth - GAP * (columns - 1)) / columns;

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
    <YStack
      width="100%"
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
      {containerWidth > 0 && (
        <FlatList
          key={`category-grid-${columns}`}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={columns}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      )}
    </YStack>
  );
};

export default MenuCategory;
