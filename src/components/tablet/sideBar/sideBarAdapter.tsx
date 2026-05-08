import React from 'react';
import {StyledSpacer} from 'fluent-styles';
import {Stack} from '../../../components/package/stack';

import SideBar from '../../../components/tablet/sideBar';
import {useAppTheme} from '../../../theme';

interface SideBarAdapterProps {
  collapse: boolean;
  selectedMenu: number;
  showMenu?: boolean | string;
}

const SideBarAdapter: React.FC<SideBarAdapterProps> = ({
  collapse,
  selectedMenu,
  showMenu = '',
}) => {
  const {t} = useAppTheme();
  const sidebarWidth = collapse ? 84 : 210;

  return (
    <Stack
      width={sidebarWidth}
      minWidth={sidebarWidth}
      maxWidth={sidebarWidth}
      paddingBottom={12}
      borderRadius={12}
      alignItems="center"
      justifyContent="flex-start"
      vertical
      paddingHorizontal={collapse ? 6 : 12}
      paddingTop={10}
      gap={4}
      backgroundColor={t.bgCard}>
      <SideBar
        selectedMenu={selectedMenu}
        collapse={collapse}
        showMenu={showMenu}
      />
      <StyledSpacer flex={1} />
    </Stack>
  );
};

export default SideBarAdapter;