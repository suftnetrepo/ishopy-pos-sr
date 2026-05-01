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