import React from 'react';
import {
  StyledText,
  StyledSpacer,
} from 'fluent-styles';

import {Stack} from '../../../components/package/stack';
import {theme} from '../../../utils/theme';
import {StyledShape} from '../../../components/package/shape';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Tiles = () => {
  return (
    <Stack
      horizonal
      justifyContent="flex-start"
      gap={16}
      marginLeft={16}
      marginTop={16}
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
            borderColor={theme.colors.indigo[100]}
            backgroundColor={theme.colors.indigo[100]}>
            <FontAwesome
              name="clock-o"
              size={24}
              color={theme.colors.indigo[400]}
            />
          </StyledShape>
          <StyledSpacer marginVertical={24} />
          <Stack
            width={'100%'}
            vertical
            flexWrap="wrap"
            justifyContent="flex-start"
            alignItems="flex-start">
            <StyledText
              color={theme.colors.gray[500]}
              fontSize={16}
              fontWeight={theme.fontWeight.medium}
              marginLeft={10}>
              Pending
            </StyledText>
            <StyledText
              color={theme.colors.gray[800]}
              fontSize={18}
              fontWeight={theme.fontWeight.medium}
              marginLeft={10}>
              20
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
            borderColor={theme.colors.amber[100]}
            backgroundColor={theme.colors.amber[100]}>
            <FontAwesome
              name="spinner"
              size={24}
              color={theme.colors.amber[500]}
            />
          </StyledShape>
          <StyledSpacer marginVertical={24} />
          <Stack
            width={'100%'}
            vertical
            flexWrap="wrap"
            justifyContent="flex-start"
            alignItems="flex-start">
            <StyledText
              color={theme.colors.gray[500]}
              fontSize={16}
              fontWeight={theme.fontWeight.medium}
              marginLeft={10}>
              Progress
            </StyledText>
            <StyledText
              color={theme.colors.gray[800]}
              fontSize={18}
              fontWeight={theme.fontWeight.medium}
              marginLeft={10}>
              30
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
          <StyledSpacer marginVertical={24} />
          <Stack
            width={'100%'}
            vertical
            flexWrap="wrap"
            justifyContent="flex-start"
            alignItems="flex-start">
            <StyledText
              color={theme.colors.gray[500]}
              fontSize={16}
              fontWeight={theme.fontWeight.medium}
              marginLeft={10}>
              Completed
            </StyledText>
            <StyledText
              color={theme.colors.gray[800]}
              fontSize={18}
              fontWeight={theme.fontWeight.medium}
              marginLeft={10}>
              30
            </StyledText>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Tiles;
