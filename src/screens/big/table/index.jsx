import React, { useState } from 'react';
import {
  StyledSafeAreaView,
  StyledHeader,
  StyledSpacer,
  StyledDialog,
} from 'fluent-styles';
import { Stack } from '../../../components/package/stack';
import { theme } from '../../../utils/theme';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import { StyledSearchBar } from '../../../components/searchBar';
import { useAppContext } from '../../../hooks/appContext';
import { useTables } from '../../../hooks/useTable';
import TableCard from '../../../components/tablet/table';
import KeyCard from '../../../components/tablet/table/keyCard';

const BigTable = () => {
  const { updateMenuQuery } = useAppContext();
    const [table, setTable] = useState(null)
    const { data, error, loading } = useTables();

    console.log('Tables Data', data);

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
      <StyledHeader borderRadius={30} statusProps={{ translucent: true }}>
        <StyledHeader.Full>
          <RenderHeader showBackButton={true} showLogo={false} showTitle={true} title='Tables' >
            <StyledSearchBar placeholder="Search tables..." flex={1} onTextChange={(query) => updateMenuQuery(query)} />
          </RenderHeader>
        </StyledHeader.Full>
      </StyledHeader>
      <Stack flex={1.5} horizonal>
        <SideBarAdapter collapse={true} />
        <Stack flex={2.5} paddingHorizontal={8} vertical >
         <TableCard onTableSelect={(table)=> setTable(table) } />
        </Stack>
       
      </Stack>
      {table &&
        <StyledDialog visible>
       <KeyCard table_name={table.tableName} onClose={()=> setTable(null)} />
        </StyledDialog>}
    </StyledSafeAreaView>
  );
};

export default BigTable;
