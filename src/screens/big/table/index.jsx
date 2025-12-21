import React, { useState } from 'react';
import {
  StyledSafeAreaView,
  StyledHeader,
  StyledDialog,
} from 'fluent-styles';
import { Stack } from '../../../components/package/stack';
import { theme } from '../../../utils/theme';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import { StyledSearchBar } from '../../../components/searchBar';
import { useAppContext } from '../../../hooks/appContext';
import { useQueryTablesByStatus } from '../../../hooks/useTable';
import TableCard from '../../../components/tablet/table';
import KeyCard from '../../../components/tablet/table/keyCard';
import { useFocus } from '../../../hooks/useFocus';

const BigTable = () => {
  const focused = useFocus();
  const { updateMenuQuery } = useAppContext();
  const [table, setTable] = useState(null)
  const { data, error, loading, handleOccupancy } = useQueryTablesByStatus(focused);

    const onSubmit = (body) => {
      handleOccupancy(body);
    }

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
        <SideBarAdapter selectedMenu={4} collapse={true} />
        <Stack flex={2.5} paddingHorizontal={8} vertical >
         <TableCard data={data} onTableSelect={(table)=> setTable(table) } />
        </Stack>
      </Stack>
      {table &&
        <StyledDialog visible>
       <KeyCard table_name={table.tableName} table_id={table.table_id} onSubmit={(table)=> onSubmit(table)} onClose={()=> setTable(null)} />
        </StyledDialog>}
    </StyledSafeAreaView>
  );
};

export default BigTable;
