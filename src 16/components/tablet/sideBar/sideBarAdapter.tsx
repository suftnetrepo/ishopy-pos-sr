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
      paddingBottom={16}
      borderRadius={12}
      alignItems="center"
      justifyContent="center"
      vertical
      marginLeft={16}
      marginRight={16}
      paddingHorizontal={collapse ? 8 : 16}
      backgroundColor={t.bgCard}>
      <StyledSpacer marginVertical={7} />
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
