import React, {Fragment, useState} from 'react';
import {SidebarItem} from '../../../components/package/sidebar';

const SideBar = () => {
  const [selectedButton, setSelectedButton] = useState(1);

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
          key={index}
          label={item.label}
          icon={item.icon}
          active={item.id === selectedButton}
          onPress={() => {
            setSelectedButton(item.id);
            console.log(`${item.label} clicked`);
          }}
        />
      ))}
    </Fragment>
  );
};

export default SideBar;
