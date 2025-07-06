import React from 'react';
import {
  StyledText,
  StyledSpacer,
} from 'fluent-styles';
// import {BarChart} from 'react-native-gifted-charts';
import {Stack} from '../../../components/package/stack';
import {theme} from '../../../utils/theme';
import {StyledImage} from '../../../components/package/image';
import {StyledButton} from '../../../components/package/button';
import {ScrollView} from 'react-native';

const LowStockItems = () => {
  const datas = {
    popular_dishes: [
      {
        rank: 1,
        name: 'Scrambled Eggs With Toast',
        orders: 23,
        image:
          'https://img1.wsimg.com/isteam/ip/8fa9801a-9459-437f-ac41-7e7e90b4e436/Making%20Egusi%20Soup%20Recipe%20(with%20Assorted%20Meat)%20.jpg/:/rs=w:1280',
      },
      {
        rank: 2,
        name: 'Tacos With Chicken Grilled',
        orders: 16,
        image:
          'https://www.blackfoodie.co/wp-content/uploads/2017/09/Screen-Shot-2017-09-22-at-12.22.49-PM.png',
      },
      {
        rank: 3,
        name: 'Spaghetti Bolognese',
        orders: 13,
        image:
          'https://www.grocery.coop/sites/default/files/wp-content/uploads/2011/12/Flavor_of_North_Africa_0.jpg',
      },
      {
        rank: 4,
        name: 'French Bread & Potato',
        orders: 12,
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187',
      },
    ],
    low_stock_items: [
      {
        name: 'Hawaiian Chicken Skewers',
        available: 3,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90',
      },
      {
        name: 'Veggie Supreme Pizza',
        available: 2,
        image: 'https://images.unsplash.com/photo-1601924638867-3ec6f722e2f3',
      },
      {
        name: 'Fish and Chips',
        available: 8,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add',
      },
      {
        name: 'Spaghetti Bolognese',
        available: 1,
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0',
      },
      
    ],
  };

  return (
    <Stack
      vertical
      borderRadius={8}
      backgroundColor={theme.colors.gray[1]}
      paddingHorizontal={24}
      paddingVertical={24}
      justifyContent="flex-start"
      alignItems="flex-start">
      <Stack
        horizonal
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        gap={8}>
        <StyledText
          color={theme.colors.gray[800]}
          fontSize={theme.fontSize.large}
          fontWeight={theme.fontWeight.semiBold}>
          Low Stock Items
        </StyledText>
        <StyledText
          color={theme.colors.green[800]}
          fontSize={12}
          fontWeight={theme.fontWeight.bold}>
          View All
        </StyledText>
      </Stack>
      <StyledSpacer marginVertical={16} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {datas.low_stock_items.map((dish, index) => (
          <Stack
            key={index}
            horizonal
            width="100%"
            flexWrap="wrap"
            justifyContent="flex-start"
            alignItems="center"
            gap={8}
            marginBottom={16}>
            <StyledImage
              source={{uri: dish.image}}
              size={32}
              cycle
              resizeMode="contain"></StyledImage>
            <Stack vertical>
              <StyledText
                color={theme.colors.gray[500]}
                fontSize={16}
                fontWeight={theme.fontWeight.medium}
                marginLeft={2}>
                {dish.name}
              </StyledText>
              <Stack
                horizonal
                justifyContent="flex-start"
                alignItems="center"
                gap={4}>
                <StyledText
                  color={theme.colors.gray[400]}
                  fontSize={14}
                  fontWeight={theme.fontWeight.normal}
                  marginLeft={2}>
                  Available:
                </StyledText>
                <StyledText
                  color={theme.colors.green[800]}
                  fontSize={14}
                  fontWeight={theme.fontWeight.semiBold}
                  marginLeft={5}>
                  {dish.available}
                </StyledText>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </ScrollView>
    </Stack>
  );
};

export default LowStockItems;
