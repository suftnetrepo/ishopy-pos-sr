import React, {useState} from 'react';
import {
  StyledPage,
  StyledDialog,
  theme,
} from 'fluent-styles';
import SideBarAdapter from '../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../components/tablet/header';
import {StyledSearchBar} from '../../components/searchBar';
import {useAppContext} from '../../hooks/appContext';
import {useQueryTablesByStatus} from '../../hooks/useTable';
import TableCard from '../../components/tablet/table';
import KeyCard from '../../components/tablet/table/keyCard';
import {useFocus} from '../../hooks/useFocus';
import {Stack} from '../../components/package/stack';
import { useLoaderAndError } from '../../hooks/useLoaderAndError';
import {useAppTheme} from '../../theme';

const BigTable = () => {
  const focused = useFocus();
  const {updateMenuQuery} = useAppContext();
  const {t} = useAppTheme();
  const [table, setTable] = useState(null);
  const {data, error, loading, resetHandler, handleOccupancy} =
    useQueryTablesByStatus(focused);

  useLoaderAndError(loading, error, resetHandler);

  const onSubmit = body => {
    handleOccupancy(body);
  };

  return (
    <StyledPage backgroundColor={t.bgPage}>
      <StyledPage.Header.Full>
        <RenderHeader
          showBackButton={true}
          showLogo={false}
          showTitle={true}
          title="Tables">
          <StyledSearchBar
            placeholder="Search tables..."
            flex={1}
            onTextChange={query => updateMenuQuery(query)}
          />
        </RenderHeader>
      </StyledPage.Header.Full>

      <Stack flex={1.5} horizontal>
        <SideBarAdapter selectedMenu={2} collapse={true} />
        <Stack flex={2.5} paddingHorizontal={8} vertical>
          <TableCard data={data} onTableSelect={table => setTable(table)} />
        </Stack>
      </Stack>
      {table && (
        <StyledDialog visible>
          <KeyCard
            table_name={table.tableName}
            table_id={table.table_id}
            onSubmit={table => onSubmit(table)}
            onClose={() => setTable(null)}
          />
        </StyledDialog>
      )}
    </StyledPage>
  );
};

export default BigTable;
