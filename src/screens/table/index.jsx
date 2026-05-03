/* eslint-disable prettier/prettier */
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
import {useLoaderAndError} from '../../hooks/useLoaderAndError';
import {useAppTheme} from '../../theme';
import {useNavigation, useRoute} from '@react-navigation/native';
import {updateWaitlistStatus} from '../../model/waitlist';

const BigTable = () => {
  const navigation = useNavigation();
  const focused = useFocus();
  const route   = useRoute();
  const {updateMenuQuery} = useAppContext();
  const {t} = useAppTheme();
  const [table, setTable] = useState(null);
  const {data, error, loading, resetHandler, handleOccupancy} =
    useQueryTablesByStatus(focused);

  useLoaderAndError(loading, error, resetHandler);

  // Waitlist entry passed from Waitlist screen (undefined when navigating normally)
  const waitlistEntry = route.params?.waitlistEntry || null;

  const onSubmit = async body => {
    handleOccupancy(body);

    // Auto-remove from waitlist if this came from Seat now
    if (waitlistEntry) {
      await updateWaitlistStatus(waitlistEntry.waitlist_id, 'removed');
         navigation.goBack();
    }
  };

  return (
    <StyledPage backgroundColor={t.bgPage}>
      <StyledPage.Header.Full>
        <RenderHeader
          showBackButton={true}
          showLogo={false}
          showTitle={true}
          title={waitlistEntry
            ? `Seating ${waitlistEntry.guest_name || 'Guest'}`
            : 'Tables'}>
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
          <TableCard
            data={data}
            onTableSelect={table => setTable(table)}
            waitlistEntry={waitlistEntry}
          />
        </Stack>
      </Stack>

      {table && (
        <StyledDialog visible>
          <KeyCard
            table_name={table.tableName}
            table_id={table.table_id}
            prefill={waitlistEntry ? {
              guest_name:  waitlistEntry.guest_name || 'Guest',
              guest_count: waitlistEntry.party_size,
            } : null}
            onSubmit={body => onSubmit(body)}
            onClose={() => setTable(null)}
          />
        </StyledDialog>
      )}
    </StyledPage>
  );
};

export default BigTable;