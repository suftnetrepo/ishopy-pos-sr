/* eslint-disable prettier/prettier */
/**
 * Retail seed templates
 */

import { SeedCategory, SeedMenuItem } from '../restaurant';

export interface RetailTemplate {
  id: string;
  label: string;
  emoji: string;
  description: string;
  categories: SeedCategory[];
  items: SeedMenuItem[];
}

// ─────────────────────────────────────────────
// 1. GENERAL STORE
// ─────────────────────────────────────────────
const general: RetailTemplate = {
  id: 'general',
  label: 'General Store',
  emoji: '🛒',
  description: 'Everyday essentials, groceries and household goods',
  categories: [
    { name: 'Groceries',    color_code: '#16a34a', icon_name: 'shopping'       },
    { name: 'Beverages',    color_code: '#0284c7', icon_name: 'cup-water'      },
    { name: 'Snacks',       color_code: '#d97706', icon_name: 'food'           },
    { name: 'Household',    color_code: '#7c3aed', icon_name: 'home'           },
    { name: 'Personal Care',color_code: '#be185d', icon_name: 'spray'         },
    { name: 'Bakery',       color_code: '#b45309', icon_name: 'food-croissant' },
  ],
  items: [
    { name: 'White Bread',         price: 1.20, category: 'Bakery',       icon_name: 'food-croissant', color_code: '#b45309', stock: 30 },
    { name: 'Brown Bread',         price: 1.40, category: 'Bakery',       icon_name: 'food-croissant', color_code: '#b45309', stock: 30 },
    { name: 'Croissant',           price: 0.90, category: 'Bakery',       icon_name: 'food-croissant', color_code: '#b45309', stock: 20 },
    { name: 'Canned Tomatoes',     price: 0.89, category: 'Groceries',    icon_name: 'shopping',       color_code: '#16a34a', stock: 60 },
    { name: 'Pasta (500g)',        price: 1.20, category: 'Groceries',    icon_name: 'shopping',       color_code: '#16a34a', stock: 50 },
    { name: 'Rice (1kg)',          price: 2.50, category: 'Groceries',    icon_name: 'shopping',       color_code: '#16a34a', stock: 40 },
    { name: 'Eggs (12)',           price: 2.80, category: 'Groceries',    icon_name: 'egg',            color_code: '#16a34a', stock: 30 },
    { name: 'Milk (2L)',           price: 1.60, category: 'Groceries',    icon_name: 'shopping',       color_code: '#16a34a', stock: 30 },
    { name: 'Butter (250g)',       price: 1.80, category: 'Groceries',    icon_name: 'shopping',       color_code: '#16a34a', stock: 25 },
    { name: 'Olive Oil (500ml)',   price: 4.50, category: 'Groceries',    icon_name: 'shopping',       color_code: '#16a34a', stock: 20 },
    { name: 'Bottled Water',       price: 0.75, category: 'Beverages',    icon_name: 'cup-water',      color_code: '#0284c7', stock: 99 },
    { name: 'Orange Juice (1L)',   price: 2.20, category: 'Beverages',    icon_name: 'cup-water',      color_code: '#0284c7', stock: 40 },
    { name: 'Cola (2L)',           price: 1.80, category: 'Beverages',    icon_name: 'cup-water',      color_code: '#0284c7', stock: 40 },
    { name: 'Coffee (200g)',       price: 3.50, category: 'Beverages',    icon_name: 'coffee',         color_code: '#0284c7', stock: 25 },
    { name: 'Tea Bags (80)',       price: 2.80, category: 'Beverages',    icon_name: 'tea',            color_code: '#0284c7', stock: 25 },
    { name: 'Crisps',              price: 1.20, category: 'Snacks',       icon_name: 'food',           color_code: '#d97706', stock: 60 },
    { name: 'Chocolate Bar',       price: 1.10, category: 'Snacks',       icon_name: 'food',           color_code: '#d97706', stock: 60 },
    { name: 'Biscuits',            price: 1.50, category: 'Snacks',       icon_name: 'food',           color_code: '#d97706', stock: 50 },
    { name: 'Washing Up Liquid',   price: 1.20, category: 'Household',    icon_name: 'home',           color_code: '#7c3aed', stock: 30 },
    { name: 'Toilet Roll (4 Pack)',price: 3.50, category: 'Household',    icon_name: 'home',           color_code: '#7c3aed', stock: 30 },
    { name: 'Bin Bags (20)',       price: 2.00, category: 'Household',    icon_name: 'home',           color_code: '#7c3aed', stock: 25 },
    { name: 'Shampoo',             price: 3.00, category: 'Personal Care',icon_name: 'spray',         color_code: '#be185d', stock: 25 },
    { name: 'Body Wash',           price: 2.80, category: 'Personal Care',icon_name: 'spray',         color_code: '#be185d', stock: 25 },
    { name: 'Toothpaste',          price: 2.20, category: 'Personal Care',icon_name: 'spray',         color_code: '#be185d', stock: 30 },
  ],
};

// ─────────────────────────────────────────────
// 2. CLOTHING & FASHION
// ─────────────────────────────────────────────
const clothing: RetailTemplate = {
  id: 'clothing',
  label: 'Clothing & Fashion',
  emoji: '👗',
  description: 'Clothing, accessories and fashion items',
  categories: [
    { name: "Women's",     color_code: '#be185d', icon_name: 'tshirt-crew'    },
    { name: "Men's",       color_code: '#1d4ed8', icon_name: 'tshirt-crew'    },
    { name: 'Kids',        color_code: '#16a34a', icon_name: 'tshirt-crew'    },
    { name: 'Footwear',    color_code: '#b45309', icon_name: 'shoe-heel'      },
    { name: 'Accessories', color_code: '#9333ea', icon_name: 'watch'          },
    { name: 'Sale',        color_code: '#dc2626', icon_name: 'tag'            },
  ],
  items: [
    { name: "Women's T-Shirt",    price: 14.99, category: "Women's",    icon_name: 'tshirt-crew', color_code: '#be185d', stock: 30 },
    { name: "Women's Jeans",      price: 39.99, category: "Women's",    icon_name: 'tshirt-crew', color_code: '#be185d', stock: 20 },
    { name: 'Summer Dress',       price: 34.99, category: "Women's",    icon_name: 'tshirt-crew', color_code: '#be185d', stock: 15 },
    { name: 'Blouse',             price: 24.99, category: "Women's",    icon_name: 'tshirt-crew', color_code: '#be185d', stock: 20 },
    { name: "Women's Hoodie",     price: 32.99, category: "Women's",    icon_name: 'tshirt-crew', color_code: '#be185d', stock: 15 },
    { name: "Men's T-Shirt",      price: 14.99, category: "Men's",      icon_name: 'tshirt-crew', color_code: '#1d4ed8', stock: 30 },
    { name: "Men's Jeans",        price: 44.99, category: "Men's",      icon_name: 'tshirt-crew', color_code: '#1d4ed8', stock: 20 },
    { name: 'Polo Shirt',         price: 22.99, category: "Men's",      icon_name: 'tshirt-crew', color_code: '#1d4ed8', stock: 25 },
    { name: 'Chinos',             price: 39.99, category: "Men's",      icon_name: 'tshirt-crew', color_code: '#1d4ed8', stock: 15 },
    { name: "Men's Hoodie",       price: 34.99, category: "Men's",      icon_name: 'tshirt-crew', color_code: '#1d4ed8', stock: 15 },
    { name: "Kids T-Shirt",       price: 9.99,  category: 'Kids',       icon_name: 'tshirt-crew', color_code: '#16a34a', stock: 25 },
    { name: "Kids Jeans",         price: 19.99, category: 'Kids',       icon_name: 'tshirt-crew', color_code: '#16a34a', stock: 20 },
    { name: 'School Uniform Top', price: 12.99, category: 'Kids',       icon_name: 'tshirt-crew', color_code: '#16a34a', stock: 30 },
    { name: "Women's Trainers",   price: 49.99, category: 'Footwear',   icon_name: 'shoe-heel',   color_code: '#b45309', stock: 15 },
    { name: "Men's Trainers",     price: 54.99, category: 'Footwear',   icon_name: 'shoe-heel',   color_code: '#b45309', stock: 15 },
    { name: 'Sandals',            price: 24.99, category: 'Footwear',   icon_name: 'shoe-heel',   color_code: '#b45309', stock: 20 },
    { name: 'Watch',              price: 29.99, category: 'Accessories',icon_name: 'watch',       color_code: '#9333ea', stock: 15 },
    { name: 'Sunglasses',         price: 19.99, category: 'Accessories',icon_name: 'glasses',     color_code: '#9333ea', stock: 20 },
    { name: 'Belt',               price: 14.99, category: 'Accessories',icon_name: 'watch',       color_code: '#9333ea', stock: 20 },
    { name: 'Sale T-Shirt',       price: 7.99,  category: 'Sale',       icon_name: 'tag',         color_code: '#dc2626', stock: 20 },
    { name: 'Sale Jeans',         price: 19.99, category: 'Sale',       icon_name: 'tag',         color_code: '#dc2626', stock: 15 },
  ],
};

// ─────────────────────────────────────────────
// 3. BEAUTY & COSMETICS
// ─────────────────────────────────────────────
const beauty: RetailTemplate = {
  id: 'beauty',
  label: 'Beauty & Cosmetics',
  emoji: '💄',
  description: 'Makeup, skincare, haircare and beauty products',
  categories: [
    { name: 'Makeup',      color_code: '#be185d', icon_name: 'lipstick'       },
    { name: 'Skincare',    color_code: '#0d9488', icon_name: 'spray'         },
    { name: 'Haircare',    color_code: '#7c3aed', icon_name: 'hair-dryer'    },
    { name: 'Nails',       color_code: '#dc2626', icon_name: 'nail'           },
    { name: 'Fragrance',   color_code: '#d97706', icon_name: 'spray'         },
    { name: 'Tools',       color_code: '#475569', icon_name: 'tools'          },
  ],
  items: [
    { name: 'Foundation',         price: 18.99, category: 'Makeup',    icon_name: 'lipstick',  color_code: '#be185d', stock: 20 },
    { name: 'Mascara',            price: 12.99, category: 'Makeup',    icon_name: 'lipstick',  color_code: '#be185d', stock: 25 },
    { name: 'Lipstick',           price: 10.99, category: 'Makeup',    icon_name: 'lipstick',  color_code: '#be185d', stock: 30 },
    { name: 'Eyeshadow Palette',  price: 22.99, category: 'Makeup',    icon_name: 'lipstick',  color_code: '#be185d', stock: 15 },
    { name: 'Concealer',          price: 14.99, category: 'Makeup',    icon_name: 'lipstick',  color_code: '#be185d', stock: 20 },
    { name: 'Blush',              price: 11.99, category: 'Makeup',    icon_name: 'lipstick',  color_code: '#be185d', stock: 20 },
    { name: 'Moisturiser SPF30',  price: 16.99, category: 'Skincare',  icon_name: 'spray',    color_code: '#0d9488', stock: 20 },
    { name: 'Face Serum',         price: 24.99, category: 'Skincare',  icon_name: 'spray',    color_code: '#0d9488', stock: 15 },
    { name: 'Eye Cream',          price: 19.99, category: 'Skincare',  icon_name: 'spray',    color_code: '#0d9488', stock: 15 },
    { name: 'Face Wash',          price: 8.99,  category: 'Skincare',  icon_name: 'spray',    color_code: '#0d9488', stock: 25 },
    { name: 'Toner',              price: 10.99, category: 'Skincare',  icon_name: 'spray',    color_code: '#0d9488', stock: 20 },
    { name: 'Shampoo',            price: 8.99,  category: 'Haircare',  icon_name: 'hair-dryer',color_code: '#7c3aed', stock: 25 },
    { name: 'Conditioner',        price: 8.99,  category: 'Haircare',  icon_name: 'hair-dryer',color_code: '#7c3aed', stock: 25 },
    { name: 'Hair Mask',          price: 12.99, category: 'Haircare',  icon_name: 'hair-dryer',color_code: '#7c3aed', stock: 15 },
    { name: 'Hair Oil',           price: 9.99,  category: 'Haircare',  icon_name: 'hair-dryer',color_code: '#7c3aed', stock: 20 },
    { name: 'Nail Polish',        price: 5.99,  category: 'Nails',     icon_name: 'nail',      color_code: '#dc2626', stock: 30 },
    { name: 'Nail Polish Remover',price: 3.99,  category: 'Nails',     icon_name: 'nail',      color_code: '#dc2626', stock: 25 },
    { name: 'Nail Kit',           price: 9.99,  category: 'Nails',     icon_name: 'nail',      color_code: '#dc2626', stock: 15 },
    { name: "Women's Perfume",    price: 34.99, category: 'Fragrance', icon_name: 'spray',    color_code: '#d97706', stock: 15 },
    { name: "Men's Cologne",      price: 32.99, category: 'Fragrance', icon_name: 'spray',    color_code: '#d97706', stock: 15 },
    { name: 'Makeup Brushes Set', price: 15.99, category: 'Tools',     icon_name: 'tools',     color_code: '#475569', stock: 15 },
    { name: 'Eyelash Curler',     price: 8.99,  category: 'Tools',     icon_name: 'tools',     color_code: '#475569', stock: 20 },
  ],
};

// ─────────────────────────────────────────────
// 4. ELECTRONICS
// ─────────────────────────────────────────────
const electronics: RetailTemplate = {
  id: 'electronics',
  label: 'Electronics & Gadgets',
  emoji: '📱',
  description: 'Phones, accessories, cables and tech gadgets',
  categories: [
    { name: 'Phones',      color_code: '#1d4ed8', icon_name: 'cellphone'      },
    { name: 'Accessories', color_code: '#0d9488', icon_name: 'cable-data'     },
    { name: 'Audio',       color_code: '#7c3aed', icon_name: 'headphones'     },
    { name: 'Computers',   color_code: '#475569', icon_name: 'laptop'         },
    { name: 'Gaming',      color_code: '#dc2626', icon_name: 'gamepad-variant'},
    { name: 'Smart Home',  color_code: '#b45309', icon_name: 'home-automation'},
  ],
  items: [
    { name: 'Phone Case (Universal)',  price: 12.99, category: 'Phones',      icon_name: 'cellphone',       color_code: '#1d4ed8', stock: 30 },
    { name: 'Screen Protector',        price: 8.99,  category: 'Phones',      icon_name: 'cellphone',       color_code: '#1d4ed8', stock: 40 },
    { name: 'USB-C Cable',             price: 9.99,  category: 'Accessories', icon_name: 'cable-data',      color_code: '#0d9488', stock: 50 },
    { name: 'Lightning Cable',         price: 9.99,  category: 'Accessories', icon_name: 'cable-data',      color_code: '#0d9488', stock: 40 },
    { name: 'Power Bank 10000mAh',     price: 24.99, category: 'Accessories', icon_name: 'battery',         color_code: '#0d9488', stock: 20 },
    { name: 'Car Charger',             price: 12.99, category: 'Accessories', icon_name: 'cable-data',      color_code: '#0d9488', stock: 25 },
    { name: 'Wall Charger 20W',        price: 14.99, category: 'Accessories', icon_name: 'cable-data',      color_code: '#0d9488', stock: 25 },
    { name: 'Wireless Earbuds',        price: 39.99, category: 'Audio',       icon_name: 'headphones',      color_code: '#7c3aed', stock: 15 },
    { name: 'Wired Earphones',         price: 14.99, category: 'Audio',       icon_name: 'headphones',      color_code: '#7c3aed', stock: 25 },
    { name: 'Bluetooth Speaker',       price: 34.99, category: 'Audio',       icon_name: 'speaker',         color_code: '#7c3aed', stock: 12 },
    { name: 'Laptop Stand',            price: 19.99, category: 'Computers',   icon_name: 'laptop',          color_code: '#475569', stock: 15 },
    { name: 'Wireless Mouse',          price: 18.99, category: 'Computers',   icon_name: 'mouse',           color_code: '#475569', stock: 15 },
    { name: 'USB Hub',                 price: 22.99, category: 'Computers',   icon_name: 'usb',             color_code: '#475569', stock: 15 },
    { name: 'Gaming Controller',       price: 44.99, category: 'Gaming',      icon_name: 'gamepad-variant', color_code: '#dc2626', stock: 10 },
    { name: 'Gaming Headset',          price: 34.99, category: 'Gaming',      icon_name: 'headphones',      color_code: '#dc2626', stock: 10 },
    { name: 'Smart Bulb',              price: 12.99, category: 'Smart Home',  icon_name: 'lightbulb',       color_code: '#b45309', stock: 20 },
    { name: 'Smart Plug',              price: 14.99, category: 'Smart Home',  icon_name: 'home-automation', color_code: '#b45309', stock: 15 },
  ],
};

// ─────────────────────────────────────────────
// 5. HEALTH & WELLNESS
// ─────────────────────────────────────────────
const health: RetailTemplate = {
  id: 'health',
  label: 'Health & Wellness',
  emoji: '🌿',
  description: 'Supplements, vitamins, first aid and wellness products',
  categories: [
    { name: 'Vitamins',    color_code: '#d97706', icon_name: 'pill'           },
    { name: 'Supplements', color_code: '#16a34a', icon_name: 'pill'           },
    { name: 'First Aid',   color_code: '#dc2626', icon_name: 'medical-bag'    },
    { name: 'Fitness',     color_code: '#7c3aed', icon_name: 'dumbbell'       },
    { name: 'Pharmacy',    color_code: '#0284c7', icon_name: 'pharmacy'       },
    { name: 'Natural',     color_code: '#0d9488', icon_name: 'leaf'           },
  ],
  items: [
    { name: 'Vitamin C 1000mg',    price: 8.99,  category: 'Vitamins',    icon_name: 'pill',        color_code: '#d97706', stock: 30 },
    { name: 'Vitamin D3',          price: 7.99,  category: 'Vitamins',    icon_name: 'pill',        color_code: '#d97706', stock: 30 },
    { name: 'Multivitamin',        price: 12.99, category: 'Vitamins',    icon_name: 'pill',        color_code: '#d97706', stock: 25 },
    { name: 'Zinc Tablets',        price: 6.99,  category: 'Vitamins',    icon_name: 'pill',        color_code: '#d97706', stock: 25 },
    { name: 'Omega-3 Fish Oil',    price: 11.99, category: 'Supplements', icon_name: 'pill',        color_code: '#16a34a', stock: 20 },
    { name: 'Protein Powder',      price: 29.99, category: 'Supplements', icon_name: 'pill',        color_code: '#16a34a', stock: 15 },
    { name: 'Collagen Powder',     price: 24.99, category: 'Supplements', icon_name: 'pill',        color_code: '#16a34a', stock: 15 },
    { name: 'Plasters (40 Pack)',  price: 3.50,  category: 'First Aid',   icon_name: 'medical-bag', color_code: '#dc2626', stock: 30 },
    { name: 'Antiseptic Cream',    price: 4.99,  category: 'First Aid',   icon_name: 'medical-bag', color_code: '#dc2626', stock: 25 },
    { name: 'Paracetamol (16)',    price: 1.99,  category: 'Pharmacy',    icon_name: 'pharmacy',    color_code: '#0284c7', stock: 40 },
    { name: 'Ibuprofen (16)',      price: 2.49,  category: 'Pharmacy',    icon_name: 'pharmacy',    color_code: '#0284c7', stock: 40 },
    { name: 'Cough Syrup',         price: 5.99,  category: 'Pharmacy',    icon_name: 'pharmacy',    color_code: '#0284c7', stock: 20 },
    { name: 'Resistance Band',     price: 9.99,  category: 'Fitness',     icon_name: 'dumbbell',    color_code: '#7c3aed', stock: 20 },
    { name: 'Yoga Mat',            price: 19.99, category: 'Fitness',     icon_name: 'dumbbell',    color_code: '#7c3aed', stock: 10 },
    { name: 'Protein Bar',         price: 2.99,  category: 'Fitness',     icon_name: 'dumbbell',    color_code: '#7c3aed', stock: 40 },
    { name: 'Aloe Vera Gel',       price: 6.99,  category: 'Natural',     icon_name: 'leaf',        color_code: '#0d9488', stock: 20 },
    { name: 'Green Tea (40 bags)', price: 4.99,  category: 'Natural',     icon_name: 'leaf',        color_code: '#0d9488', stock: 25 },
    { name: 'Turmeric Capsules',   price: 9.99,  category: 'Natural',     icon_name: 'leaf',        color_code: '#0d9488', stock: 20 },
  ],
};

// ─────────────────────────────────────────────
// 6. AFRICAN MARKET
// ─────────────────────────────────────────────
const africanMarket: RetailTemplate = {
  id: 'african_market',
  label: 'African Market',
  emoji: '🌍',
  description: 'African groceries, spices, dry goods and produce',
  categories: [
    { name: 'Grains & Flour', color_code: '#d97706', icon_name: 'shopping'    },
    { name: 'Spices',         color_code: '#dc2626', icon_name: 'food'        },
    { name: 'Dried Goods',    color_code: '#b45309', icon_name: 'shopping'    },
    { name: 'Sauces & Oils',  color_code: '#16a34a', icon_name: 'bottle-soda' },
    { name: 'Beverages',      color_code: '#0891b2', icon_name: 'cup-water'   },
    { name: 'Household',      color_code: '#7c3aed', icon_name: 'home'        },
  ],
  items: [
    // Grains & Flour
    { name: 'Cassava Flour (2kg)',   price: 4.50,  category: 'Grains & Flour', icon_name: 'shopping',    color_code: '#d97706', stock: 25 },
    { name: 'Semolina (2kg)',        price: 3.80,  category: 'Grains & Flour', icon_name: 'shopping',    color_code: '#d97706', stock: 25 },
    { name: 'Plantain Flour (1kg)', price: 4.00,  category: 'Grains & Flour', icon_name: 'shopping',    color_code: '#d97706', stock: 20 },
    { name: 'Garri (2kg)',          price: 4.50,  category: 'Grains & Flour', icon_name: 'shopping',    color_code: '#d97706', stock: 25 },
    { name: 'Millet (1kg)',         price: 3.50,  category: 'Grains & Flour', icon_name: 'shopping',    color_code: '#d97706', stock: 20 },
    { name: 'Basmati Rice (5kg)',   price: 9.99,  category: 'Grains & Flour', icon_name: 'shopping',    color_code: '#d97706', stock: 20 },
    // Spices
    { name: 'Cameroon Pepper',      price: 2.50,  category: 'Spices',         icon_name: 'food',        color_code: '#dc2626', stock: 30 },
    { name: 'Suya Spice Mix',       price: 3.00,  category: 'Spices',         icon_name: 'food',        color_code: '#dc2626', stock: 25 },
    { name: 'Egusi (Ground)',       price: 5.50,  category: 'Spices',         icon_name: 'food',        color_code: '#dc2626', stock: 20 },
    { name: 'Uziza Leaves (Dried)', price: 2.80,  category: 'Spices',         icon_name: 'food',        color_code: '#dc2626', stock: 20 },
    { name: 'Crayfish (Ground)',    price: 4.00,  category: 'Spices',         icon_name: 'food',        color_code: '#dc2626', stock: 20 },
    { name: 'Ogiri / Dawadawa',     price: 2.50,  category: 'Spices',         icon_name: 'food',        color_code: '#dc2626', stock: 20 },
    // Dried Goods
    { name: 'Dried Stockfish',      price: 8.50,  category: 'Dried Goods',    icon_name: 'shopping',    color_code: '#b45309', stock: 15 },
    { name: 'Dried Catfish',        price: 6.50,  category: 'Dried Goods',    icon_name: 'shopping',    color_code: '#b45309', stock: 15 },
    { name: 'Black-Eyed Beans',     price: 3.50,  category: 'Dried Goods',    icon_name: 'shopping',    color_code: '#b45309', stock: 25 },
    { name: 'Brown Beans',          price: 3.50,  category: 'Dried Goods',    icon_name: 'shopping',    color_code: '#b45309', stock: 25 },
    { name: 'Ogbono Seeds',         price: 5.00,  category: 'Dried Goods',    icon_name: 'shopping',    color_code: '#b45309', stock: 15 },
    // Sauces & Oils
    { name: 'Palm Oil (1L)',        price: 5.50,  category: 'Sauces & Oils',  icon_name: 'bottle-soda', color_code: '#16a34a', stock: 20 },
    { name: 'Groundnut Oil (1L)',   price: 4.80,  category: 'Sauces & Oils',  icon_name: 'bottle-soda', color_code: '#16a34a', stock: 20 },
    { name: 'Tomato Paste (400g)', price: 2.00,  category: 'Sauces & Oils',  icon_name: 'bottle-soda', color_code: '#16a34a', stock: 30 },
    { name: 'Shito (Hot Pepper Sauce)', price: 5.50, category: 'Sauces & Oils', icon_name: 'bottle-soda', color_code: '#16a34a', stock: 15 },
    // Beverages
    { name: 'Milo (400g)',          price: 5.99,  category: 'Beverages',      icon_name: 'cup-water',   color_code: '#0891b2', stock: 20 },
    { name: 'Ovaltine (300g)',      price: 4.99,  category: 'Beverages',      icon_name: 'cup-water',   color_code: '#0891b2', stock: 20 },
    { name: 'Bournvita (400g)',     price: 5.50,  category: 'Beverages',      icon_name: 'cup-water',   color_code: '#0891b2', stock: 20 },
    { name: 'Malta Guinness (6pk)', price: 8.50,  category: 'Beverages',      icon_name: 'cup-water',   color_code: '#0891b2', stock: 15 },
    // Household
    { name: 'Aboniki Balm',        price: 3.00,  category: 'Household',      icon_name: 'home',        color_code: '#7c3aed', stock: 20 },
    { name: 'Omo Detergent (1kg)', price: 4.50,  category: 'Household',      icon_name: 'home',        color_code: '#7c3aed', stock: 20 },
    { name: 'Canoe Soap',          price: 2.50,  category: 'Household',      icon_name: 'home',        color_code: '#7c3aed', stock: 25 },
  ],
};

export const retailTemplates: RetailTemplate[] = [
  general, clothing, beauty, electronics, health, africanMarket,
];
