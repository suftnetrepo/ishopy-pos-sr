/* eslint-disable prettier/prettier */
import React from 'react';

import RestaurantIcon from '../../../assets/icons/restaurant.svg';
import DimSumIcon from '../../../assets/icons/dim-sum.svg';
import DrinkIcon from '../../../assets/icons/drink.svg';
import NoodlesIcon from '../../../assets/icons/noodles.svg';
import RiceDishesIcon from '../../../assets/icons/rice-dishes.svg';
import SoupsIcon from '../../../assets/icons/soups.svg';
import SushiIcon from '../../../assets/icons/sushi.svg';
import PadThaiIcon from '../../../assets/icons/pad-thai.svg';
import RamenIcon from '../../../assets/icons/ramen.svg';
import SobaNoodlesIcon from '../../../assets/icons/soba-noodles.svg';
import UdonNoodleSoupIcon from '../../../assets/icons/udon-noodle-soup.svg';
import DragonRollIcon from '../../../assets/icons/dragon-roll.svg';
import GyozaIcon from '../../../assets/icons/gyoza.svg';
import HarGauIcon from '../../../assets/icons/har-gau.svg';
import SpringRollsIcon from '../../../assets/icons/spring-rolls.svg';
import MisoSoupIcon from '../../../assets/icons/miso-soup.svg';
import CartIcon from '../../../assets/icons/cart.svg';
import ReceiptIcon from '../../../assets/icons/receipt.svg';
import PrinterIcon from '../../../assets/icons/printer.svg';
import CashIcon from '../../../assets/icons/cash.svg';
import TableIcon from '../../../assets/icons/table.svg';
import DashboardIcon from '../../../assets/icons/dashboard.svg';
import PaymentsIcon from '../../../assets/icons/payments.svg';
import SettingsIcon from '../../../assets/icons/settings.svg';
import LogoutIcon from '../../../assets/icons/logout.svg';
import PopularIcon from '../../../assets/icons/popular.svg';
import LowStockIcon from '../../../assets/icons/low-stock.svg';

const SVG_ICONS: Record<string, React.FC<any>> = {
  restaurant: RestaurantIcon,
  'dim-sum': DimSumIcon,
  drink: DrinkIcon,
  drinks: DrinkIcon,
  noodles: NoodlesIcon,
  'rice-dishes': RiceDishesIcon,
  rice: RiceDishesIcon,
  soups: SoupsIcon,
  soup: SoupsIcon,
  sushi: SushiIcon,
  'pad-thai': PadThaiIcon,
  ramen: RamenIcon,
  'soba-noodles': SobaNoodlesIcon,
  soba: SobaNoodlesIcon,
  'udon-noodle-soup': UdonNoodleSoupIcon,
  udon: UdonNoodleSoupIcon,
  'dragon-roll': DragonRollIcon,
  gyoza: GyozaIcon,
  'har-gau': HarGauIcon,
  'spring-rolls': SpringRollsIcon,
  'miso-soup': MisoSoupIcon,
  cart: CartIcon,
  receipt: ReceiptIcon,
  printer: PrinterIcon,
  cash: CashIcon,
  table: TableIcon,
  tables: TableIcon,
  dashboard: DashboardIcon,
  payments: PaymentsIcon,
  settings: SettingsIcon,
  logout: LogoutIcon,
  popular: PopularIcon,
  'low-stock': LowStockIcon,
};

const LEGACY_TO_SVG: Record<string, string> = {
  fish: 'sushi',
  hamburger: 'restaurant',
  'pizza-slice': 'restaurant',
  hotdog: 'spring-rolls',
  'drumstick-bite': 'restaurant',
  utensils: 'restaurant',
  'utensil-spoon': 'soups',
  coffee: 'drink',
  'mug-hot': 'drink',
  beer: 'drink',
  'wine-glass': 'drink',
  cocktail: 'drink',
  'bread-slice': 'dim-sum',
  'shopping-cart': 'cart',
  'shopping-bag': 'cart',
  'cash-register': 'cash',
  'credit-card': 'payments',
  cog: 'settings',
  'sign-out-alt': 'logout',
  'chart-pie': 'dashboard',
  'concierge-bell': 'popular',
};

export interface PosIconProps {
  name?: string | null;
  size?: number;
  color?: string;
  style?: any;
}

const normaliseIconName = (name?: string | null) =>
  String(name || 'restaurant')
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-');

const PosIcon: React.FC<PosIconProps> = ({
  name = 'restaurant',
  size = 24,
  color = '#374151',
  style,
}) => {
  const key = normaliseIconName(name);
  const mappedKey = SVG_ICONS[key] ? key : LEGACY_TO_SVG[key];
  const Svg = SVG_ICONS[mappedKey] || RestaurantIcon;

  return (
    <Svg
      width={size}
      height={size}
      color={color}
      stroke={color}
      fill="none"
      style={style}
    />
  );
};

export default PosIcon;
export { SVG_ICONS };
