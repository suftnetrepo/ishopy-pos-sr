import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SidebarItem } from '../../package/sidebar';
import { useAppContext } from '../../../hooks/appContext';

const SideBar = ({ collapse = false, selectedMenu = 1, showMenu }) => {
  const navigate = useNavigation();
  const { shop } = useAppContext();

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
      label: 'Tables',
      icon: 'table-chair',
      active: false,
      name: 'big-table',
      show: shop.mode === 'restaurant' ? true : false,
    },
    {
      id: 3,
      label: shop.mode === 'shop' ? 'Items' : 'Menu',
      icon: 'book-open-outline',
      active: false,
      name: 'big-menu',
      show: shop.mode === 'shop' ? true : false,
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
      label: 'Payments',
      icon: 'card-outline',
      active: false,
      name: 'big-payment',
      show: true,
    },
    {
      id: 6,
      label: 'Settings',
      icon: 'cog-outline',
      active: false,
      name: 'big-settings',
      show: true,
    },
  ];

 return items
  .filter(item => (showMenu && showMenu.includes(item.id)) || item.show)
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
