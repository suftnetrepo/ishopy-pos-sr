/* eslint-disable prettier/prettier */
/**
 * PosIcon
 *
 * Universal icon component for CosyPOS.
 * - If icon_name is in the SVG pack → renders SVG (crisp, colorable)
 * - Otherwise → renders FontAwesome5 (legacy compatibility)
 *
 * Usage:
 *   <PosIcon name="rice-bowl" size={24} color="#fff" />
 *   <PosIcon name="hamburger" size={24} color="#333" />  // FA5 fallback
 */

import React from 'react';
import { View } from 'react-native';
import FA5 from 'react-native-vector-icons/FontAwesome5';

// ── SVG icon imports ────────────────────────────────────────
import RiceBowlIcon  from '../../../assets/icons/rice-bowl.svg';
import SoupIcon      from '../../../assets/icons/soup.svg';
import SwallowIcon   from '../../../assets/icons/swallow.svg';
import GrillIcon     from '../../../assets/icons/grill.svg';
import ProteinIcon   from '../../../assets/icons/protein.svg';
import BeansIcon     from '../../../assets/icons/beans.svg';
import SidesIcon     from '../../../assets/icons/sides.svg';
import DrinkIcon     from '../../../assets/icons/drink.svg';
import VegetableIcon from '../../../assets/icons/vegetable.svg';
import GrainsIcon    from '../../../assets/icons/grains.svg';
import FrozenIcon    from '../../../assets/icons/frozen.svg';
import SpiceIcon     from '../../../assets/icons/spice.svg';
import SnackIcon     from '../../../assets/icons/snack.svg';
import HouseholdIcon from '../../../assets/icons/household.svg';
import CafeIcon      from '../../../assets/icons/cafe.svg';
import PastryIcon    from '../../../assets/icons/pastry.svg';
import FishIcon      from '../../../assets/icons/fish.svg';
import ChickenIcon   from '../../../assets/icons/chicken.svg';
import BarcodeIcon   from '../../../assets/icons/barcode.svg';
import BasketIcon    from '../../../assets/icons/basket.svg';
import CartIcon      from '../../../assets/icons/cart.svg';
import BeautyIcon    from '../../../assets/icons/beauty.svg';
import MeatIcon      from '../../../assets/icons/meat.svg';
import FlourIcon     from '../../../assets/icons/flour.svg';
import CashIcon      from '../../../assets/icons/cash.svg';
import ReceiptIcon   from '../../../assets/icons/receipt.svg';
import PrinterIcon   from '../../../assets/icons/printer.svg';
import WaterIcon     from '../../../assets/icons/water.svg';
import StoreIcon     from '../../../assets/icons/store.svg';
import RestaurantIcon from '../../../assets/icons/restaurant.svg';

// ── SVG map ─────────────────────────────────────────────────
const SVG_ICONS: Record<string, React.FC<any>> = {
  'rice-bowl':  RiceBowlIcon,
  'soup':       SoupIcon,
  'swallow':    SwallowIcon,
  'grill':      GrillIcon,
  'protein':    ProteinIcon,
  'beans':      BeansIcon,
  'sides':      SidesIcon,
  'drink':      DrinkIcon,
  'vegetable':  VegetableIcon,
  'grains':     GrainsIcon,
  'frozen':     FrozenIcon,
  'spice':      SpiceIcon,
  'snack':      SnackIcon,
  'household':  HouseholdIcon,
  'cafe':       CafeIcon,
  'pastry':     PastryIcon,
  'fish':       FishIcon,
  'chicken':    ChickenIcon,
  'barcode':    BarcodeIcon,
  'basket':     BasketIcon,
  'cart':       CartIcon,
  'beauty':     BeautyIcon,
  'meat':       MeatIcon,
  'flour':      FlourIcon,
  'cash':       CashIcon,
  'receipt':    ReceiptIcon,
  'printer':    PrinterIcon,
  'water':      WaterIcon,
  'store':      StoreIcon,
  'restaurant': RestaurantIcon,
};

// ── FA5 names that map to SVG equivalents ────────────────────
// When an FA5 name is passed we try to map it to a POS SVG first
const FA5_TO_SVG: Record<string, string> = {
  'fish':          'fish',
  'hamburger':     'restaurant',
  'pizza-slice':   'restaurant',
  'hotdog':        'sides',
  'drumstick-bite':'chicken',
  'utensils':      'restaurant',
  'utensil-spoon': 'sides',
  'coffee':        'cafe',
  'mug-hot':       'cafe',
  'beer':          'drink',
  'wine-glass':    'drink',
  'cocktail':      'drink',
  'ice-cream':     'snack',
  'cookie':        'snack',
  'birthday-cake': 'snack',
  'bread-slice':   'pastry',
  'egg':           'sides',
  'bacon':         'protein',
  'cheese':        'sides',
  'carrot':        'vegetable',
  'lemon':         'vegetable',
  'pepper-hot':    'spice',
  'store':         'store',
  'shopping-bag':  'basket',
  'leaf':          'vegetable',
  'apple-alt':     'vegetable',
  'seedling':      'vegetable',
};

export interface PosIconProps {
  name?: string;
  size?: number;
  color?: string;
  style?: any;
}

/**
 * PosIcon — renders the best available icon for a given name.
 * Priority: SVG pack → FA5 mapped to SVG → raw FA5 → fallback 'restaurant' SVG
 */
const PosIcon: React.FC<PosIconProps> = ({
  name = 'restaurant',
  size = 24,
  color = '#374151',
  style,
}) => {
  // 1. Direct SVG match
  if (SVG_ICONS[name]) {
    const Svg = SVG_ICONS[name];
    return (
      <Svg
        width={size}
        height={size}
        color={color}
        fill={color}
        style={style}
      />
    );
  }

  // 2. FA5 name → mapped SVG
  const mappedSvg = FA5_TO_SVG[name];
  if (mappedSvg && SVG_ICONS[mappedSvg]) {
    const Svg = SVG_ICONS[mappedSvg];
    return (
      <Svg
        width={size}
        height={size}
        color={color}
        fill={color}
        style={style}
      />
    );
  }

  // 3. Raw FontAwesome5 (for any unmapped legacy icons)
  try {
    return <FA5 name={name} size={size} color={color} style={style} />;
  } catch {
    // 4. Ultimate fallback
    const Svg = SVG_ICONS['restaurant'];
    return <Svg width={size} height={size} color={color} fill={color} style={style} />;
  }
};

export default PosIcon;
