/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Pressable} from 'react-native';
import {StyledPage, StyledDialog, StyleShape, theme} from 'fluent-styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
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
import {convertJsonToCsv} from '../../utils/convertJsonToCsv';

const BigTable = () => {
  const navigation = useNavigation();
  const focused = useFocus();
  const route = useRoute();
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

    // Auto-clear from the waitlist if this came from Seat now. 'seated' is
    // distinct from 'removed' (an explicit staff removal) — both leave the
    // active queue, but only this one represents a guest who was actually
    // seated, which matters for anyone reviewing waitlist history later.
    if (waitlistEntry) {
      await updateWaitlistStatus(waitlistEntry.waitlist_id, 'seated');
      navigation.navigate('big-waitlist');
      return;
    }

    // Newly-seated Dine In table — go straight to the menu, matching
    // Bar/Takeaway and already-occupied table behavior.
    navigation.navigate('big-menu', {
      table_id: table.table_id,
      table_name: table.tableName,
      order_type: 'Dine In',
    });
  };

  const handleShare = async () => {
    if (!data?.length) return;
    await convertJsonToCsv(
      data.map(tbl => ({
        Table: tbl.tableName,
        Location: tbl.location || 'Dine In',
        Size: tbl.size || 0,
        Status: tbl.isOccupied === 1 ? 'Occupied' : 'Available',
        Guests: tbl.guest_count || 0,
      })),
    );
  };

  return (
    <StyledPage paddingHorizontal={16} backgroundColor={t.bgPage}>
      <StyledPage.Header.Full>
        <RenderHeader
          showBackButton={true}
          showLogo={false}
          showTitle={true}
          title={
            waitlistEntry
              ? `Seating ${waitlistEntry.guest_name || 'Guest'}`
              : 'Tables'
          }>
          <StyledSearchBar
            placeholder="Search tables..."
            flex={1}
            onTextChange={query => updateMenuQuery(query)}
          />
          <Pressable onPress={handleShare} style={{marginLeft: 12}}>
            <StyleShape
              paddingHorizontal={10}
              borderWidth={1}
              cycle
              size={48}
              backgroundColor={t.bgPage}
              borderColor={data?.length ? t.brandPrimary : t.textMuted}>
              <MaterialIcon
                size={24}
                name="share"
                color={data?.length ? t.brandPrimary : t.textPrimary}
              />
            </StyleShape>
          </Pressable>
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
            prefill={
              waitlistEntry
                ? {
                    guest_name: waitlistEntry.guest_name || 'Guest',
                    guest_count: waitlistEntry.party_size,
                  }
                : null
            }
            onSubmit={body => onSubmit(body)}
            onClose={() => setTable(null)}
          />
        </StyledDialog>
      )}
    </StyledPage>
  );
};

export default BigTable;
