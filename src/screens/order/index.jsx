import React, {useState} from 'react';
import {
  Drawer as StyledDrawer,
  StyledPage,
  Stack,
  theme,
  useToast
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
import {useAppTheme} from '../../theme';
import {useWindowDimensions} from 'react-native';
import {formatReceiptData} from '../../utils/receiptFormatter';
import {printerStore} from '../../store/printerStore';
import {printReceipt} from '../../utils/printReceipt';

const BigOrder = () => {
  const focus = useFocus();
  const toast = useToast();
  const {updateMenuQuery, order, shop, user} = useAppContext();
  const {t} = useAppTheme();
  const [show, setShow] = useState(null);
  const [showCalendar, setCalendarShow] = useState(null);
  const {width} = useWindowDimensions();
  const drawerWidth = width < 768 ? '90%' : width < 1024 ? '60%' : '45%';

  const handlePrint = async () => {
    try {

      if(!order) {
        toast.show({
          message: 'No order selected',
          description: 'Please select an order to print the receipt.',
          type: 'error',
          theme: 'dark',
        });
        return;
      }

      const selectedPrinter = await printerStore.getSelectedPrinter();
      if (!selectedPrinter) {
        toast.show({
          message: 'No printer selected',
          description: 'Please select a printer in settings before printing.',
          type: 'error',
          theme: 'dark',
        });
        return;
      }

      const receiptData = await formatReceiptData({
        order,
        tableName: order?.table_name,
        shop,
        user,
        businessType: shop?.mode || 'restaurant',
      });

      await printReceipt(selectedPrinter, receiptData);
    } catch (error) {
      if (__DEV__) {
        console.error('Error printing receipt:', error);
      }
    }
  };

  return (
    <StyledPage backgroundColor={t.bgPage} paddingHorizontal={16}>
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
        width={drawerWidth}
        headerRight={
          <StyledMIcon
            name="print"
            size={32}
            color={t.textPrimary}
            onPress={handlePrint}
          />
        }
        colors={{
          background: t.bgPage,
          headerBg: theme.colors.transparent,
          headerTitle: t.textPrimary,
          headerSubtitle: t.textSecondary,
          headerBorder: t.bgPage,
        }}
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
