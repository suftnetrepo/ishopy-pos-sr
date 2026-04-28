import React from 'react';
import {
  YStack,
  XStack,
  StyledText,
  theme,
  Stack,
  StyledEmptyState,
} from 'fluent-styles';
import {fontStyles} from '../../../../configs/theme';
import {FlatList} from 'react-native';
import {formatCurrency, formatDate, getLastChars} from '../../../../utils/help';
import {StyledMIcon} from '../../../../components/icon';
import {useAppContext} from '../../../../hooks/appContext';
import {DownloadButton} from './downloadButton';
import EmptyView from '../../../../components/utils/empty';

const PaymentCard = ({data}) => {
  const {shop} = useAppContext();

  if (data?.length === 0) {
    return (
     <YStack
        flex={1}
        px={16}
        py={16}
        space="lg"
        backgroundColor={theme.colors.gray[1]}
        borderRadius={16}
        borderWidth={1}
        borderColor={theme.colors.gray[200]}
        justifyContent="center"
        alignItems="center">
        <EmptyView
          color={theme.colors.gray[400]}
          title="Your Payment list is empty"
          description="Payments will appear here once added."
        />
      </YStack>
    );
  }

  const RenderCard = ({item}) => {
    return (
      <XStack
        flex={1}
        marginHorizontal={4}
        paddingHorizontal={16}
        backgroundColor={theme.colors.gray[1]}
        paddingVertical={16}
        justifyContent="space-between"
        marginBottom={8}
        borderRadius={16}
        alignItems="center">
        <YStack justifyContent="flex-start" alignItems="flex-start">
          <XStack justifyContent="flex-start" alignItems="center">
            <StyledMIcon
              size={16}
              name="money"
              color={theme.colors.gray[600]}
            />
            <StyledText
              fontWeight={theme.fontWeight.semiBold}
              fontSize={theme.fontSize.normal}
              paddingHorizontal={4}
              paddingVertical={1}>
              {formatCurrency(shop?.currency || '£', item?.amount)}
            </StyledText>
          </XStack>

          <XStack justifyContent="flex-start" alignItems="center">
            <StyledMIcon
              size={16}
              name="date-range"
              color={theme.colors.gray[600]}
            />
            <StyledText
              fontWeight={theme.fontWeight.normal}
              fontSize={theme.fontSize.small}
              color={theme.colors.gray[500]}
              paddingHorizontal={4}
              paddingVertical={1}>
              {formatDate(item?.date)}
            </StyledText>
          </XStack>
        </YStack>
        <StyledText
          fontWeight={theme.fontWeight.normal}
          fontSize={theme.fontSize.small}
          paddingHorizontal={4}
          paddingVertical={1}
          color={theme.colors.gray[300]}
          fontFamily={fontStyles.Roboto_Regular}>
          #{getLastChars(item?.order_id, 3)}
        </StyledText>
      </XStack>
    );
  };

  return (
    <Stack vertical flex={1}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        initialNumToRender={100}
        renderItem={({item, index}) => <RenderCard key={index} item={item} />}
        showsVerticalScrollIndicator={false}
        numColumns={3}
      />
      {data?.length > 0 && (
        <DownloadButton data={data} currency={shop?.currency} />
      )}
    </Stack>
  );
};

export default PaymentCard;
