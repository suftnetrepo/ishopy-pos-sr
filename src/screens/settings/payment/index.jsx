/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  StyledCycle,
  StyledSpacer,
  Stack,
  theme,
  StyledPage,
} from 'fluent-styles';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import {StyledIcon} from '../../../components/package/icon';
import {Pressable} from 'react-native';
import PaymentCard from './card';
import OrderDateFilter from '../../order/orderDateFilter';
import {useAppContext} from '../../../hooks/appContext';
import {useFocus} from '../../../hooks/useFocus';
import {useAppTheme} from '../../../theme';

const BigPayment = () => {
  const focus = useFocus();
  const [showCalendar, setCalendarShow] = useState(false);
  const {date_filter, updateDateFilter} = useAppContext();
  const {t} = useAppTheme();
  const hasActiveFilter = date_filter?.startDate && date_filter?.endDate;

  const handleClearDateFilter = () => {
    updateDateFilter({startDate: '', endDate: ''});
  };

  return (
    <StyledPage backgroundColor={t.bgPage}>
      <StyledPage.Header.Full>
        <RenderHeader
          showBackButton={true}
          showLogo={false}
          showTitle={true}
          title="Payments"
          CopyIcon={
            <>
              {hasActiveFilter && (
                <Pressable onTouchStart={handleClearDateFilter}>
                  <StyledCycle
                    width={48}
                    height={48}
                    borderWidth={1}
                    backgroundColor={t.bgPage}
                    borderColor={t.textMuted}>
                    <StyledIcon size={24} name="close" color={t.textPrimary} />
                  </StyledCycle>
                </Pressable>
              )}
              <StyledSpacer marginHorizontal={4} />
              <Pressable onTouchStart={() => setCalendarShow(true)}>
                <StyledCycle
                  width={48}
                  height={48}
                  borderWidth={1}
                  backgroundColor={t.bgPage}
                  borderColor={t.textMuted}>
                  <StyledIcon size={24} name="filter-list" color={t.textPrimary} />
                </StyledCycle>
              </Pressable>
            </>
          }
        />
      </StyledPage.Header.Full>

      <Stack key={focus} flex={1.5} horizontal>
        <SideBarAdapter selectedMenu={5} showMenu={false} collapse={true} />
        <Stack flex={3} paddingHorizontal={8} vertical>
          <PaymentCard />
        </Stack>
      </Stack>

      {showCalendar && (
        <OrderDateFilter
          visible={!!showCalendar}
          setVisible={setCalendarShow}
        />
      )}
    </StyledPage>
  );
};

export default BigPayment;