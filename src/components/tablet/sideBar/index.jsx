import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SidebarItem } from '../../package/sidebar';

const SideBar = ({ collapse = false, selectedMenu = 1, showMenu = false }) => {
  const navigate = useNavigation();

  const items = [
    {
      id: 1,
      label: 'Dashboard',
      icon: 'view-dashboard-outline',
      active: true,
      name: 'big-dashboard',
      show: true,
    },
    {
      id: 2,
      label: 'Table',
      icon: 'table-chair',
      active: false,
      name: 'big-table',
      show: true,
    },
    {
      id: 3,
      label: 'Menu',
      icon: 'book-open-outline',
      active: false,
      name: 'big-menu',
      show: false,
    },
    {
      id: 4,
      label: 'Orders',
      icon: 'receipt',
      active: false,
      name: 'big-orders',
      show: true,
    },
    
    {
      id: 5,
      label: 'Settings',
      icon: 'cog-outline',
      active: false,
      name: 'big-settings',
      show: true,
    },
  ];

 return items
  .filter(item => showMenu || item.show)
  .map((item, index) => (
    <SidebarItem
      collapse={collapse}
      key={item.id || index}
      label={item.label}
      icon={item.icon}
      active={item.id === selectedMenu}
      onPress={() => navigate.navigate(item.name)}
    />
  ));
};

export default SideBar;
