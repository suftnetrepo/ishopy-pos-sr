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

const BigPayment = () => {
  const focus = useFocus();
  const [showCalendar, setCalendarShow] = useState(false);
  const {date_filter, updateDateFilter} = useAppContext();
  const hasActiveFilter = date_filter?.startDate && date_filter?.endDate;

  const handleClearDateFilter = () => {
    updateDateFilter({startDate: '', endDate: ''});
  };

  return (
    <StyledPage backgroundColor={theme.colors.gray[100]}>
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
                    backgroundColor={theme.colors.gray[50]}
                    borderColor={theme.colors.gray[400]}>
                    <StyledIcon size={24} name="close" color={theme.colors.gray[800]} />
                  </StyledCycle>
                </Pressable>
              )}
              <StyledSpacer marginHorizontal={4} />
              <Pressable onTouchStart={() => setCalendarShow(true)}>
                <StyledCycle
                  width={48}
                  height={48}
                  borderWidth={1}
                  backgroundColor={theme.colors.gray[100]}
                  borderColor={theme.colors.gray[400]}>
                  <StyledIcon size={24} name="filter-list" color={theme.colors.gray[800]} />
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