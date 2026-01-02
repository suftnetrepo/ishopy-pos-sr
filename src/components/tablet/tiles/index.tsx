import React from 'react';
import {StyledText, StyledSpacer} from 'fluent-styles';
import {Stack} from '../../../components/package/stack';
import {theme} from '../../../utils/theme';
import {StyledShape} from '../../../components/package/shape';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useOrderStatusAggregate} from '../../../hooks/useOrder';

const Tiles = () => {
  const {data} = useOrderStatusAggregate();

  return (
    <Stack
      horizonal
      justifyContent="flex-start"
      gap={16}
      marginLeft={16}
      shadowOpacity={0.9}
      shadowColor={theme.colors.gray[200]}
      shadowRadius={8}
      alignItems="center">
     
      <Stack horizonal flex={1}>
        <Stack
          flex={1}
          vertical
          borderRadius={8}
          backgroundColor={theme.colors.gray[1]}
          paddingHorizontal={18}
          paddingVertical={18}
          justifyContent="flex-end"
          alignItems="flex-end">
          <StyledShape
            cycle
            height={60}
            width={60}
            borderColor={theme.colors.amber[100]}
            backgroundColor={theme.colors.amber[100]}>
            <FontAwesome
              name="spinner"
              size={24}
              color={theme.colors.amber[500]}
            />
          </StyledShape>
          <StyledSpacer marginVertical={8} />
          <Stack
            width={'100%'}
            horizonal
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center">
            <StyledText
              color={theme.colors.gray[500]}
              fontSize={16}
              fontWeight={theme.fontWeight.medium}>
              Progress
            </StyledText>
            <StyledText
              color={theme.colors.gray[800]}
              fontSize={18}
              fontWeight={theme.fontWeight.medium}
              marginLeft={10}>
              {data?.Progress || 0}
            </StyledText>
          </Stack>
        </Stack>
      </Stack>
      <Stack horizonal flex={1}>
        <Stack
          flex={1}
          vertical
          borderRadius={8}
          backgroundColor={theme.colors.gray[1]}
          paddingHorizontal={18}
          paddingVertical={18}
          justifyContent="flex-end"
          alignItems="flex-end">
          <StyledShape
            cycle
            height={60}
            width={60}
            borderColor={theme.colors.green[100]}
            backgroundColor={theme.colors.green[100]}>
            <FontAwesome
              name="check-circle"
              size={24}
              color={theme.colors.green[400]}
            />
          </StyledShape>
          <StyledSpacer marginVertical={8} />
          <Stack
            width={'100%'}
            horizonal
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center">
            <StyledText
              color={theme.colors.gray[500]}
              fontSize={16}
              fontWeight={theme.fontWeight.medium}>
              Completed
            </StyledText>
            <StyledText
              color={theme.colors.gray[800]}
              fontSize={18}
              fontWeight={theme.fontWeight.medium}
              marginLeft={10}>
              {data?.Completed || 0}
            </StyledText>
          </Stack>
        </Stack>
      </Stack>
       <Stack horizonal flex={1}>
        <Stack
          flex={1}
          vertical
          borderRadius={8}
          backgroundColor={theme.colors.gray[1]}
          paddingHorizontal={18}
          paddingVertical={18}
          justifyContent="flex-end"
          alignItems="flex-end">
          <StyledShape
            cycle
            height={60}
            width={60}
            borderColor={theme.colors.rose[100]}
            backgroundColor={theme.colors.rose[100]}>
            <FontAwesome
              name="remove"
              size={24}
              color={theme.colors.rose[400]}
            />
          </StyledShape>
          <StyledSpacer marginVertical={8} />
          <Stack
            width={'100%'}
            horizonal
            justifyContent="space-between"
            alignItems="center">
            <StyledText
              color={theme.colors.gray[500]}
              fontSize={16}
              fontWeight={theme.fontWeight.medium}>
              Cancelled
            </StyledText>
            <StyledText
              color={theme.colors.gray[800]}
              fontSize={18}
              fontWeight={theme.fontWeight.medium}
              marginLeft={10}>
              {data?.Cancelled || 0}
            </StyledText>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Tiles;
