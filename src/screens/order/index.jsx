import React, {useState} from 'react';
import {
  Drawer as StyledDrawer,
  StyledPressable,
  StyledText,
  StyledPage,
  Stack,
  theme,
} from 'fluent-styles';
import SideBarAdapter from '../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../components/tablet/header';
import {StyledSearchBar} from '../../components/searchBar';
import {useAppContext} from '../../hooks/appContext';
import OrderCard from '../../components/tablet/order';
import OrderCart from '../../components/tablet/order/orderCart';
import OrderDateFilter from './orderDateFilter';
import {useFocus} from '../../hooks/useFocus';
import {StyledMIcon} from '../../components/icon';

const BigOrder = () => {
  const focus = useFocus();
  const {updateMenuQuery} = useAppContext();
  const [show, setShow] = useState(null);
  const [showCalendar, setCalendarShow] = useState(null);

  return (
    <StyledPage backgroundColor={theme.colors.gray[100]}>
      <StyledPage.Header.Full>
        <RenderHeader
          showBackButton={true}
          showLogo={false}
          showTitle={true}
          title="Orders">
          <StyledSearchBar
            placeholder="Search orders..."
            flex={1}
            onTextChange={query => updateMenuQuery(query)}
          />
        </RenderHeader>
      </StyledPage.Header.Full>

      <Stack key={focus} flex={1.5} horizontal>
        <SideBarAdapter selectedMenu={4} showMenu={false} collapse={true} />
        <Stack flex={3} paddingHorizontal={8} vertical>
          <OrderCard
            onOrderChange={j => setShow(j)}
            onHandleFilter={i => setCalendarShow(i)}
          />
        </Stack>
      </Stack>

      <StyledDrawer
        visible={show ? true : false}
        onClose={() => setShow(null)}
        title={`Orders `}
        width={'30%'}
        headerRight={
          <StyledMIcon
              name="print"
              size={32}
              color={theme.colors.gray[800]}
              onPress={() => {}}
            />
        }
        side="right">
        <OrderCart onClose={() => setShow(null)} />
      </StyledDrawer>
      {showCalendar && (
        <OrderDateFilter
          visible={!!showCalendar}
          setVisible={setCalendarShow}
        />
      )}
    </StyledPage>
  );
};

export default BigOrder;
