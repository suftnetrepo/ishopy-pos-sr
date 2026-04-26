

import React from 'react';
import { YStack, theme, Stack, XStack, StyledCycle, StyledSpacer, StyledText } from 'fluent-styles';
import { fontStyles } from '../../../../configs/theme';
import { StyledMIcon } from '../../../../components/icon';
// import { useTaxes } from '../../../../hooks/useTax';
import { FlatList } from 'react-native';
import { toWordCase } from '../../../../utils/help';

const TaxCard = ({ data, onTaxChange, onTaxDelete, flag = false }) => {

    const RenderCard = ({ item }) => {
        return (
            <Stack horizontal flex={1} status={item.status === 1 ? theme.colors.green[600] : theme.colors.red[400]} paddingHorizontal={8} backgroundColor={theme.colors.gray[1]}
                paddingVertical={8} justifyContent='flex-start' marginHorizontal={4} marginBottom={8} borderRadius={16} alignItems='center' >
                <YStack flex={2}>
                    <StyledText paddingHorizontal={8} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[600]}>
                        {toWordCase(item.name)}
                    </StyledText>
                </YStack>
                <XStack flex={1} justifyContent='flex-end' alignItems='center'>
                    <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
                        <StyledMIcon size={24} name='edit' color={theme.colors.gray[600]} onPress={() => onTaxChange({
                            data: item, tag: 'Edit'
                        })} />
                    </StyledCycle>
                    <StyledSpacer marginHorizontal={4} />
                    <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
                        <StyledMIcon size={32} name='delete-outline' color={theme.colors.gray[600]} onPress={() => onTaxDelete(item?.tax_id)} />
                    </StyledCycle>
                </XStack>
            </Stack>
        )
    }

    return (
        <FlatList
            data={data}
            initialNumToRender={100}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.tax_id}
            numColumns={3}
            renderItem={({ item, index }) => (
                <RenderCard item={item} key={index} />
            )}
        />
    );
}

export default TaxCard