import React, {Fragment} from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {SidebarItem} from '../../package/sidebar';
import {useAppContext} from '../../../hooks/appContext';

const SideBar = ({collapse = false}) => {
  const {selectedMenu, updateCurrentMenu} = useAppContext();
  const navigate = useNavigation();

  console.log('Selected Menu:', selectedMenu);

  const items = [
    {
      id: 1,
      label: 'Dashboard',
      icon: 'view-dashboard-outline',
      active: true,
      name: 'big-dashboard',
    },
    {
      id: 2,
      label: 'Menu',
      icon: 'book-open-outline',
      active: false,
      name: 'big-menu',
    },
    {
      id: 3,
      label: 'Orders',
      icon: 'receipt',
      active: false,
      name: 'big-menu',
    },
    {
      id: 4,
      label: 'Table',
      icon: 'table-chair',
      active: false,
      name: 'big-table',
    },
    {
      id: 5,
      label: 'Settings',
      icon: 'cog-outline',
      active: false,
      name: 'big-menu',
    },
  ];

  return (
    <Fragment>
      {items.map((item, index) => (
        <SidebarItem
          collapse={collapse}
          key={index}
          label={item.label}
          icon={item.icon}
          active={
            selectedMenu === 1 && item.id === 1
              ? true
              : item.id === selectedMenu
          }
          onPress={() => {
            updateCurrentMenu(item.id);
            navigate.navigate(item.name);
          }}
        />
      ))}
    </Fragment>
  );
};

export default SideBar;
