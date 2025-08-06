import React, {Fragment} from 'react';
import {SidebarItem} from '../../../components/package/sidebar';
import {useAppContext} from '../../../hooks/appContext';

const SideBar = ({collapse = false}) => {
  const {selectedMenu, updateCurrentMenu} = useAppContext();

  console.log('Selected Menu:', selectedMenu);

  const items = [
    {
      id: 1,
      label: 'Dashboard',
      icon: 'view-dashboard-outline',
      active: true,
    },
    {
      id: 2,
      label: 'Menu',
      icon: 'book-open-outline',
      active: false,
    },
    {
      id: 3,
      label: 'Orders',
      icon: 'receipt',
      active: false,
    },
    {
      id: 4,
      label: 'Table',
      icon: 'table-chair',
      active: false,
    },
    {
      id: 5,
      label: 'Settings',
      icon: 'cog-outline',
      active: false,
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
          active={selectedMenu === 1 && item.id === 1 ? true : item.id === selectedMenu}
          onPress={() => {
            updateCurrentMenu(item.id);
            console.log(`${item.id} clicked`);
             console.log(`${selectedMenu} clicked`);
          }}
        />
      ))}
    </Fragment>
  );
};

export default SideBar;
