
import React, { useState } from 'react';
import { YStack, XStack, StyledConfirmDialog, StyledCycle, StyledSpinner, StyledOkDialog, StyledSpacer, StyledText } from 'fluent-styles';
import { theme, fontStyles } from '../../../../../configs/theme';
import { StyledMIcon } from '../../../../../components/icon';
import { useTaxes, useDeleteTax } from '../../../../../hooks/useTax';
import { FlatList } from 'react-native';
import { toWordCase } from '../../../../../utils/help';
import { StyledStack } from '../../../../../components/stack';
import { convertJsonToCsv } from '../../../../../utils/convertJsonToCsv';
import { Stack } from '../../../../../components/package/stack';

const TaxCard = ({ onTaxChange, onTaxDeleted, onTaxDeleting, flag = false }) => {
    const [isDialogVisible, setIsDialogVisible] = useState(false)
    const [tax, setTax] = useState()
    const { data, error, loading, resetHandler } = useTaxes(flag)
    const { deleteTax, error: deleteError } = useDeleteTax()

    const onConfirm = () => {
        deleteTax(tax?.tax_id).then(async (result) => {
            onTaxDeleted()
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
                        <StyledMIcon size={24} name='edit' color={theme.colors.gray[600]} onPress={() => onTaxChange({
                            data: item, tag: 'Edit'
                        })} />
                    </StyledCycle>
                    <StyledSpacer marginHorizontal={4} />
                    <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
                        <StyledMIcon size={32} name='delete-outline' color={theme.colors.gray[600]} onPress={() => {
                            onTaxDeleting()
                            setIsDialogVisible(true)
                            setTax(item)
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
                keyExtractor={(item) => item.tax_id}
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
                    description='Are you sure you want to delete this tax?'
                    confirm='Yes'
                    cancel='No'
                    title={'Confirmation'}
                    onCancel={() => setIsDialogVisible(false)}
                    onConfirm={() => onConfirm()}
                />}
        </>
    );
}

export default TaxCard