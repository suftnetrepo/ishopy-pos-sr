/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { YStack, StyledImage, XStack, StyledHeader, StyledConfirmDialog, StyledScrollView, StyledSafeAreaView, StyledSeparator, StyledSpacer, StyledText } from 'fluent-styles';
import { theme } from "../../configs/theme";
import { StyledMIcon } from "../../components/icon";
import { useAppContext } from "../../hooks/appContext";
import { toWordCase } from "../../utils/help";
import { clearSeedData } from "../../model/seed";

const Account = () => {
  const navigator = useNavigation()
  const { shop } = useAppContext()
  const [isDialogVisible, setIsDialogVisible] = useState(false)

  const RenderRow = ({ icon = 'account-circle', title, screen }) => {
    return (
      <XStack borderRadius={16} marginHorizontal={8} marginBottom={4} backgroundColor={theme.colors.gray[1]} justifyContent='flex-start' alignItems='center' paddingVertical={8} paddingHorizontal={8}>
        <StyledMIcon size={32} name={icon} color={theme.colors.gray[800]} onPress={() => { }} />
        <StyledSpacer marginHorizontal={2} />
        <StyledText paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
          {title}
        </StyledText>
        <StyledSpacer flex={1} />
        <StyledMIcon size={32} name='chevron-right' color={theme.colors.gray[600]} onPress={() => screen && navigator.navigate(screen)} />
      </XStack>
    )
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader skipAndroid={false} statusProps={{ translucent: true, backgroundColor: "transparent", barStyle: "dark-content" }} >
      </StyledHeader>
      <XStack
        paddingHorizontal={8}
        paddingVertical={8}
        borderRadius={16}
        justifyContent='flex-start'
        alignItems='center'
      >
        <StyledImage
          local
          borderRadius={100}
          borderWidth={5}
          borderColor={theme.colors.gray[100]}
          height={90}
          width={90}
          source={require('../../../assets/img/doctor.png')}
        />
        <YStack flex={1} marginHorizontal={2}>
          <XStack justifyContent='space-between'
            alignItems='center'>
            <StyledText paddingHorizontal={8} fontWeight={theme.fontWeight.semiBold} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
              {toWordCase(shop.name)}
            </StyledText>
            <StyledMIcon
              name="delete"
              size={48}
              color={theme.colors.gray[800]}
              onPress={() => setIsDialogVisible(true)}
            />
          </XStack>
          <StyledText paddingHorizontal={2} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.small} color={theme.colors.gray[800]}>
            {toWordCase(shop.address)}
          </StyledText>

        </YStack>
      </XStack>
      <StyledScrollView>
        <YStack
          flex={2}
          backgroundColor={theme.colors.gray[100]}
          borderTopLeftRadius={16}
          borderTopRightRadius={16}>
          <StyledSeparator left={
            <StyledText paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.large} color={theme.colors.gray[400]}>
              Application
            </StyledText>
          }>
          </StyledSeparator>
          <RenderRow icon="outlet" title='Store' screen='shop' />
          <RenderRow icon="person" title='User' screen='users' />
          <RenderRow icon="local-printshop" title='Printer' screen='printer' />
          <StyledSeparator left={
            <StyledText paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.large} color={theme.colors.gray[400]}>
              Store
            </StyledText>
          }></StyledSeparator>
          <RenderRow icon="add-circle-outline" title='Tax' screen='tax' />
          <RenderRow icon="remove-circle-outline" title='Discount' screen='discount' />
          <RenderRow icon="shopping-bag" title='Category' screen='categories' />
          <RenderRow icon="collections" title='Menu' screen='menus' />
          <RenderRow icon="table-view" title='Table' screen='table' />
          <StyledSeparator left={
            <StyledText paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.large} color={theme.colors.gray[400]}>
              Help
            </StyledText>
          }></StyledSeparator>
          <RenderRow icon="help-outline" title='FAQ' screen='faq' />
          <RenderRow icon="info-outline" title='Help Center' screen='help-center' />
        </YStack>
      </StyledScrollView>
      {isDialogVisible &&
        <StyledConfirmDialog
          visible
          description='Are you sure you want to delete this app? This action cannot be undone and will remove all data associated with it. Do you want to proceed?'
          confirm='Yes'
          cancel='No'
          title={'Delete this App'}
          onCancel={() => setIsDialogVisible(false)}
          onConfirm={() => {
            clearSeedData().then(() => {
              navigator.navigate("login")
              BackHandler.exitApp();
            })
          }}
        />}
    </StyledSafeAreaView>
  )
}

export default Account