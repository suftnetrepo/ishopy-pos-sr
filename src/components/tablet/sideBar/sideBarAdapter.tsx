import React from 'react';
import { StyledSpacer } from 'fluent-styles';

import { Stack } from '../../../components/package/stack';
import { theme } from '../../../utils/theme';
import SideBar from '../../../components/tablet/sideBar';

interface SideBarAdapterProps {
  collapse: boolean;
  selectedMenu: number;
  showMenu?: boolean;
}

const SideBarAdapter: React.FC<SideBarAdapterProps> = ({ collapse, selectedMenu, showMenu }) => {
  return (
    <Stack
      paddingBottom={16}
      borderRadius={12}
      flex={collapse ? 0.3 : 0.6}
      alignItems="center"
      justifyContent="center"
      vertical
      marginLeft={16}
      paddingHorizontal={16}
      shadowOpacity={0.9}
      shadowColor={theme.colors.gray[200]}
      shadowRadius={8}
      backgroundColor={theme.colors.gray[1]}>
      <StyledSpacer marginVertical={7} />
      <SideBar selectedMenu={selectedMenu} collapse={collapse} showMenu={showMenu} />
      <StyledSpacer flex={1} />
    </Stack>
  );
};

export default SideBarAdapter;
