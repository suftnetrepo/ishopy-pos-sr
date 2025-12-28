
import React, { useState } from 'react';
import { YStack, XStack, StyledConfirmDialog, StyledCycle, StyledSpinner, StyledOkDialog, StyledSpacer, StyledText } from 'fluent-styles';
import { theme, fontStyles } from '../../../../../configs/theme';
import { StyledMIcon } from '../../../../../components/icon';
import { useDiscounts, useDeleteDiscount } from '../../../../../hooks/useDiscount';
import { FlatList } from 'react-native';
import { toWordCase } from '../../../../../utils/help';
import { convertJsonToCsv } from '../../../../../utils/convertJsonToCsv';
import { Stack } from '../../../../../components/package/stack';

const DiscountCard = ({ onDiscountChange, onDiscountDeleted, onDiscountDeleting, flag = false }) => {
    const [isDialogVisible, setIsDialogVisible] = useState(false)
    const [discount, setDiscount] = useState()
    const { data, error, loading, resetHandler } = useDiscounts(flag)
    const { deleteDiscount, error: deleteError } = useDeleteDiscount()

    const onConfirm = () => {
        deleteDiscount(discount?.discount_id).then(async (result) => {
            onDiscountDeleted()
            setIsDialogVisible(false)
        })
    }

    const RenderCard = ({ item }) => {
        return (
            <Stack horizonal flex={1} status={item.status === 1 ? theme.colors.green[600] : theme.colors.red[400]} paddingHorizontal={8} backgroundColor={theme.colors.gray[1]}
                paddingVertical={8} justifyContent='flex-start' marginHorizontal={4} marginBottom={8} borderRadius={16} alignItems='center' >
                <YStack flex={2}>
                    <StyledText paddingHorizontal={8} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[600]}>
                        {toWordCase(item.name)}
                    </StyledText>
                </YStack>
                <XStack flex={1} justifyContent='flex-end' alignItems='center'>
                    <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
                        <StyledMIcon size={24} name='edit' color={theme.colors.gray[600]} onPress={() => onDiscountChange({
                            data: item, tag: 'Edit'
                        })} />
                    </StyledCycle>
                    <StyledSpacer marginHorizontal={4} />
                    <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
                        <StyledMIcon size={32} name='delete-outline' color={theme.colors.gray[600]} onPress={() => {
                            onDiscountDeleting()
                            setIsDialogVisible(true)
                            setDiscount(item)
                        }
                        } />
                    </StyledCycle>
                </XStack>
            </Stack>
        )
    }

    return (
        <>
            <FlatList
                data={data}
                initialNumToRender={100}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.discount_id}
                numColumns={3}
                renderItem={({ item, index }) => {
                    return (
                        <RenderCard item={item} key={index} />
                    )
                }}
            />
            {
                (error || deleteError) && (
                    <StyledOkDialog title={error?.message || deleteError?.message} description='please try again' visible={true} onOk={() => {
                        resetHandler()
                    }} />
                )
            }
            {
                (loading) && (
                    <StyledSpinner />
                )
            }
            {isDialogVisible &&
                <StyledConfirmDialog
                    visible
                    description='Are you sure you want to delete this discount?'
                    confirm='Yes'
                    cancel='No'
                    title={'Confirmation'}
                    onCancel={() => setIsDialogVisible(false)}
                    onConfirm={() => onConfirm()}
                />}
        </>
    );
}

export default DiscountCard