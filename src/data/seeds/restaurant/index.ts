/* eslint-disable prettier/prettier */
/**
 * Restaurant seed templates
 * Each template has categories + menu items with realistic names and prices.
 * Icons use MaterialCommunityIcons names.
 */

const soupProteinOptions: SeedAddOnOption[] = [
  {name: 'Beef', price: 3.0, icon_name: 'cow'},
  {name: 'Goat Meat', price: 4.0, icon_name: 'goat'},
  {name: 'Assorted Meat', price: 4.5, icon_name: 'meat'},
  {name: 'Chicken', price: 3.5, icon_name: 'chicken'},
  {name: 'Turkey', price: 4.0, icon_name: 'turkey'},
  {name: 'Smoked Fish', price: 3.5, icon_name: 'smoked-fish'},
  {name: 'Stock Fish', price: 4.0, icon_name: 'stock-fish'},
  {name: 'Ponmo', price: 2.0, icon_name: 'ponmo'},
];

const swallowOptions: SeedAddOnOption[] = [
  {name: 'Eba', price: 3.5, icon_name: 'eba'},
  {name: 'Pounded Yam', price: 5.0, icon_name: 'pounded-yam'},
  {name: 'Fufu', price: 4.0, icon_name: 'fufu'},
  {name: 'Amala', price: 4.0, icon_name: 'amala'},
  {name: 'Semovita', price: 3.5, icon_name: 'semovita'},
];

const spiceOptions: SeedAddOnOption[] = [
  {name: 'Mild', price: 0},
  {name: 'Medium', price: 0},
  {name: 'Hot', price: 0},
];

const riceProteinOptions: SeedAddOnOption[] = [
  {name: 'Chicken', price: 3.5, icon_name: 'chicken'},
  {name: 'Beef', price: 3.0, icon_name: 'cow'},
  {name: 'Turkey', price: 4.0, icon_name: 'turkey'},
  {name: 'Fish', price: 4.0, icon_name: 'fish'},
];

const riceSideOptions: SeedAddOnOption[] = [
  {name: 'Plantain', price: 3.0, icon_name: 'plantain'},
  {name: 'Moi Moi', price: 2.5, icon_name: 'moi-moi'},
  {name: 'Coleslaw', price: 2.0, icon_name: 'coleslaw'},
];

const grillSideOptions: SeedAddOnOption[] = [
  {name: 'Plantain', price: 3.0, icon_name: 'plantain'},
  {name: 'Chips', price: 3.0, icon_name: 'fries'},
  {name: 'Jollof Rice', price: 5.0, icon_name: 'jollof-rice'},
  {name: 'Fried Rice', price: 5.0, icon_name: 'fried-rice'},
];

const grillSauceOptions: SeedAddOnOption[] = [
  {name: 'Pepper Sauce', price: 1.0, icon_name: 'pepper-sauce'},
  {name: 'Suya Spice', price: 1.0, icon_name: 'suya-spice'},
];

export interface SeedAddOn {
  name: string;
  price: number;
  icon_name?: string;
}

export interface SeedAddOnOption {
  name: string;
  price: number;
  icon_name?: string;
}

export interface SeedAddOnGroup {
  name: string;
  required?: boolean;
  multi?: boolean;
  options: SeedAddOnOption[];
}

export interface SeedCategory {
  name: string;
  color_code: string;
  icon_name: string;
}

export interface SeedMenuItem {
  name: string;
  price: number;
  category: string; // matches category name
  icon_name: string;
  color_code: string;
  stock: number;
  addOns?: SeedAddOn[];
  addOnGroups?: SeedAddOnGroup[];
}

export interface RestaurantTemplate {
  id: string;
  label: string;
  emoji: string;
  description: string;
  categories: SeedCategory[];
  items: SeedMenuItem[];
}

// ─────────────────────────────────────────────
// 1. CAFÉ & COFFEE SHOP
// ─────────────────────────────────────────────
const cafe: RestaurantTemplate = {
  id: 'cafe',
  label: 'Café & Coffee Shop',
  emoji: '☕',
  description: 'Perfect for coffee shops, bakeries and breakfast spots',
  categories: [
    { name: 'Hot Drinks',   color_code: '#92400e', icon_name: 'coffee'            },
    { name: 'Cold Drinks',  color_code: '#0369a1', icon_name: 'cup-water'         },
    { name: 'Pastries',     color_code: '#b45309', icon_name: 'food-croissant'    },
    { name: 'Breakfast',    color_code: '#15803d', icon_name: 'egg-fried'         },
    { name: 'Sandwiches',   color_code: '#7c3aed', icon_name: 'food'              },
    { name: 'Desserts',     color_code: '#be185d', icon_name: 'cake-variant'      },
  ],
  items: [
    { name: 'Espresso',           price: 2.50,  category: 'Hot Drinks',  icon_name: 'espresso',        color_code: '#92400e', stock: 99 },
    { name: 'Americano',          price: 3.00,  category: 'Hot Drinks',  icon_name: 'americano',       color_code: '#92400e', stock: 99 },
    { name: 'Cappuccino',         price: 3.50,  category: 'Hot Drinks',  icon_name: 'cappuccino',      color_code: '#92400e', stock: 99,
      addOnGroups: [
        { name: 'Milk Type', required: true, options: [
          { name: 'Regular Milk', price: 0 }, { name: 'Oat Milk', price: 0.50 }, { name: 'Almond Milk', price: 0.50 }, { name: 'Soya Milk', price: 0.50 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Extra Shot', price: 1.00 }, { name: 'Whipped Cream', price: 0.50 }
        ]},
        { name: 'Syrup', options: [
          { name: 'Vanilla', price: 0.50 }, { name: 'Caramel', price: 0.50 }, { name: 'Hazelnut', price: 0.50 }
        ]},
      ]
    },
    { name: 'Flat White',         price: 3.80,  category: 'Hot Drinks',  icon_name: 'flat-white',      color_code: '#92400e', stock: 99,
      addOnGroups: [
        { name: 'Milk Type', required: true, options: [
          { name: 'Regular Milk', price: 0 }, { name: 'Oat Milk', price: 0.50 }, { name: 'Almond Milk', price: 0.50 }, { name: 'Soya Milk', price: 0.50 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Extra Shot', price: 1.00 }, { name: 'Whipped Cream', price: 0.50 }
        ]},
      ]
    },
    { name: 'Latte',              price: 4.00,  category: 'Hot Drinks',  icon_name: 'latte',           color_code: '#92400e', stock: 99,
      addOnGroups: [
        { name: 'Milk Type', required: true, options: [
          { name: 'Regular Milk', price: 0 }, { name: 'Oat Milk', price: 0.50 }, { name: 'Almond Milk', price: 0.50 }, { name: 'Soya Milk', price: 0.50 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Extra Shot', price: 1.00 }, { name: 'Whipped Cream', price: 0.50 }
        ]},
        { name: 'Syrup', options: [
          { name: 'Vanilla', price: 0.50 }, { name: 'Caramel', price: 0.50 }, { name: 'Hazelnut', price: 0.50 }
        ]},
      ]
    },
    { name: 'Hot Chocolate',      price: 3.50,  category: 'Hot Drinks',  icon_name: 'hot-chocolate',   color_code: '#92400e', stock: 99,
      addOnGroups: [
        { name: 'Extras', multi: true, options: [
          { name: 'Whipped Cream', price: 0.50 }, { name: 'Marshmallows', price: 0.50 }
        ]},
      ]
    },
    { name: 'English Breakfast Tea', price: 2.50, category: 'Hot Drinks', icon_name: 'tea',            color_code: '#92400e', stock: 99 },
    { name: 'Iced Latte',         price: 4.50,  category: 'Cold Drinks', icon_name: 'iced-latte',      color_code: '#0369a1', stock: 99 },
    { name: 'Iced Americano',     price: 4.00,  category: 'Cold Drinks', icon_name: 'iced-americano',  color_code: '#0369a1', stock: 99 },
    { name: 'Frappuccino',        price: 5.00,  category: 'Cold Drinks', icon_name: 'frappuccino',     color_code: '#0369a1', stock: 99 },
    { name: 'Fresh Orange Juice', price: 3.50,  category: 'Cold Drinks', icon_name: 'juice',           color_code: '#0369a1', stock: 50 },
    { name: 'Sparkling Water',    price: 2.00,  category: 'Cold Drinks', icon_name: 'sparkling-water', color_code: '#0369a1', stock: 50 },
    { name: 'Butter Croissant',   price: 2.80,  category: 'Pastries',    icon_name: 'croissant',       color_code: '#b45309', stock: 20 },
    { name: 'Almond Croissant',   price: 3.20,  category: 'Pastries',    icon_name: 'croissant',       color_code: '#b45309', stock: 20 },
    { name: 'Blueberry Muffin',   price: 2.50,  category: 'Pastries',    icon_name: 'muffin',          color_code: '#b45309', stock: 20 },
    { name: 'Cinnamon Roll',      price: 3.50,  category: 'Pastries',    icon_name: 'cinnamon-roll',   color_code: '#b45309', stock: 15 },
    { name: 'Pain au Chocolat',   price: 3.00,  category: 'Pastries',    icon_name: 'croissant',       color_code: '#b45309', stock: 15 },
    { name: 'Full English',       price: 9.50,  category: 'Breakfast',   icon_name: 'full-english',    color_code: '#15803d', stock: 30 },
    { name: 'Avocado Toast',      price: 8.50,  category: 'Breakfast',   icon_name: 'avocado-toast',   color_code: '#15803d', stock: 30 },
    { name: 'Eggs Benedict',      price: 10.00, category: 'Breakfast',   icon_name: 'eggs-benedict',   color_code: '#15803d', stock: 20 },
    { name: 'Granola & Yoghurt',  price: 6.50,  category: 'Breakfast',   icon_name: 'granola-bowl',    color_code: '#15803d', stock: 25 },
    { name: 'Smashed Avocado',    price: 9.00,  category: 'Breakfast',   icon_name: 'avocado-toast',   color_code: '#15803d', stock: 20 },
    { name: 'Club Sandwich',      price: 9.50,  category: 'Sandwiches',  icon_name: 'sandwich',        color_code: '#7c3aed', stock: 25 },
    { name: 'BLT Sandwich',       price: 8.50,  category: 'Sandwiches',  icon_name: 'sandwich',        color_code: '#7c3aed', stock: 25 },
    { name: 'Tuna Melt Panini',   price: 8.00,  category: 'Sandwiches',  icon_name: 'sandwich',        color_code: '#7c3aed', stock: 20 },
    { name: 'Cheesecake Slice',   price: 5.50,  category: 'Desserts',    icon_name: 'cheesecake',      color_code: '#be185d', stock: 15 },
    { name: 'Chocolate Brownie',  price: 4.00,  category: 'Desserts',    icon_name: 'brownie',         color_code: '#be185d', stock: 20 },
    { name: 'Carrot Cake',        price: 4.50,  category: 'Desserts',    icon_name: 'carrot-cake',     color_code: '#be185d', stock: 15 },
  ],
};

// ─────────────────────────────────────────────
// 2. BURGER & FAST FOOD
// ─────────────────────────────────────────────
const burger: RestaurantTemplate = {
  id: 'burger',
  label: 'Burger & Fast Food',
  emoji: '🍔',
  description: 'Burgers, wings, fries and fast food favourites',
  categories: [
    { name: 'Burgers',     color_code: '#b45309', icon_name: 'hamburger'    },
    { name: 'Chicken',     color_code: '#d97706', icon_name: 'food-drumstick' },
    { name: 'Sides',       color_code: '#ca8a04', icon_name: 'french-fries' },
    { name: 'Hot Dogs',    color_code: '#dc2626', icon_name: 'food'         },
    { name: 'Drinks',      color_code: '#0284c7', icon_name: 'cup-water'    },
    { name: 'Desserts',    color_code: '#7c3aed', icon_name: 'ice-cream'    },
  ],
  items: [
    { name: 'Classic Burger',       price: 9.50,  category: 'Burgers',  icon_name: 'classic-burger',    color_code: '#b45309', stock: 50,
      addOnGroups: [
        { name: 'Meal Upgrade', options: [
          { name: 'Burger Only', price: 0 }, { name: 'Add Fries & Drink', price: 3.50 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Cheese', price: 1.00 }, { name: 'Bacon', price: 1.50 }, { name: 'Egg', price: 1.50 }, { name: 'Avocado', price: 2.00 }
        ]},
        { name: 'Sauces', multi: true, options: [
          { name: 'Ketchup', price: 0 }, { name: 'Mayo', price: 0 }, { name: 'BBQ', price: 0 }, { name: 'Chilli', price: 0 }
        ]},
      ]
    },
    { name: 'Double Smash Burger',  price: 12.50, category: 'Burgers',  icon_name: 'cheeseburger',      color_code: '#b45309', stock: 50,
      addOnGroups: [
        { name: 'Meal Upgrade', options: [
          { name: 'Burger Only', price: 0 }, { name: 'Add Fries & Drink', price: 3.50 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Bacon', price: 1.50 }, { name: 'Avocado', price: 2.00 }
        ]},
        { name: 'Sauces', multi: true, options: [
          { name: 'Ketchup', price: 0 }, { name: 'Mayo', price: 0 }, { name: 'BBQ', price: 0 }, { name: 'Chilli', price: 0 }
        ]},
      ]
    },
    { name: 'Cheeseburger',         price: 10.50, category: 'Burgers',  icon_name: 'cheeseburger',      color_code: '#b45309', stock: 50,
      addOnGroups: [
        { name: 'Meal Upgrade', options: [
          { name: 'Burger Only', price: 0 }, { name: 'Add Fries & Drink', price: 3.50 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Bacon', price: 1.50 }, { name: 'Egg', price: 1.50 }, { name: 'Avocado', price: 2.00 }
        ]},
        { name: 'Sauces', multi: true, options: [
          { name: 'Ketchup', price: 0 }, { name: 'Mayo', price: 0 }, { name: 'BBQ', price: 0 }, { name: 'Chilli', price: 0 }
        ]},
      ]
    },
    { name: 'Bacon BBQ Burger',     price: 13.00, category: 'Burgers',  icon_name: 'classic-burger',    color_code: '#b45309', stock: 40,
      addOnGroups: [
        { name: 'Meal Upgrade', options: [
          { name: 'Burger Only', price: 0 }, { name: 'Add Fries & Drink', price: 3.50 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Extra Bacon', price: 1.50 }, { name: 'Avocado', price: 2.00 }
        ]},
        { name: 'Sauces', multi: true, options: [
          { name: 'BBQ', price: 0 }, { name: 'Mayo', price: 0 }
        ]},
      ]
    },
    { name: 'Mushroom Swiss Burger',price: 12.00, category: 'Burgers',  icon_name: 'classic-burger',    color_code: '#b45309', stock: 40,
      addOnGroups: [
        { name: 'Meal Upgrade', options: [
          { name: 'Burger Only', price: 0 }, { name: 'Add Fries & Drink', price: 3.50 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Bacon', price: 1.50 }, { name: 'Extra Cheese', price: 1.00 }
        ]},
        { name: 'Sauces', multi: true, options: [
          { name: 'Ketchup', price: 0 }, { name: 'Mayo', price: 0 }, { name: 'Garlic Aioli', price: 0 }
        ]},
      ]
    },
    { name: 'Veggie Burger',        price: 10.00, category: 'Burgers',  icon_name: 'burger',            color_code: '#b45309', stock: 30,
      addOnGroups: [
        { name: 'Meal Upgrade', options: [
          { name: 'Burger Only', price: 0 }, { name: 'Add Fries & Drink', price: 3.50 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Avocado', price: 2.00 }, { name: 'Cheese', price: 1.00 }
        ]},
        { name: 'Sauces', multi: true, options: [
          { name: 'Ketchup', price: 0 }, { name: 'Mayo', price: 0 }, { name: 'Garlic Aioli', price: 0 }
        ]},
      ]
    },
    { name: 'Chicken Burger',       price: 10.50, category: 'Chicken',  icon_name: 'chicken-burger',    color_code: '#d97706', stock: 50,
      addOnGroups: [
        { name: 'Meal Upgrade', options: [
          { name: 'Burger Only', price: 0 }, { name: 'Add Fries & Drink', price: 3.50 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Cheese', price: 1.00 }, { name: 'Bacon', price: 1.50 }, { name: 'Avocado', price: 2.00 }
        ]},
        { name: 'Sauces', multi: true, options: [
          { name: 'Mayo', price: 0 }, { name: 'BBQ', price: 0 }, { name: 'Chilli', price: 0 }
        ]},
      ]
    },
    { name: 'Spicy Chicken Burger', price: 11.00, category: 'Chicken',  icon_name: 'chicken-burger',    color_code: '#d97706', stock: 50,
      addOnGroups: [
        { name: 'Meal Upgrade', options: [
          { name: 'Burger Only', price: 0 }, { name: 'Add Fries & Drink', price: 3.50 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Cheese', price: 1.00 }, { name: 'Jalapenos', price: 0.50 }, { name: 'Avocado', price: 2.00 }
        ]},
        { name: 'Sauces', multi: true, options: [
          { name: 'Sriracha', price: 0 }, { name: 'Mayo', price: 0 }, { name: 'Chilli', price: 0 }
        ]},
      ]
    },
    { name: 'Buffalo Wings (6)',    price: 9.00,  category: 'Chicken',  icon_name: 'wings',             color_code: '#d97706', stock: 40,
      addOnGroups: [
        { name: 'Sauce', required: true, options: [
          { name: 'BBQ', price: 0 }, { name: 'Buffalo', price: 0 }, { name: 'Peri Peri', price: 0 }, { name: 'Lemon & Herb', price: 0 }
        ]},
        { name: 'Side', options: [
          { name: 'Fries', price: 3.00 }, { name: 'Coleslaw', price: 2.00 }, { name: 'Ranch Dip', price: 1.50 }
        ]},
      ]
    },
    { name: 'Buffalo Wings (12)',   price: 16.00, category: 'Chicken',  icon_name: 'wings',             color_code: '#d97706', stock: 40,
      addOnGroups: [
        { name: 'Sauce', required: true, options: [
          { name: 'BBQ', price: 0 }, { name: 'Buffalo', price: 0 }, { name: 'Peri Peri', price: 0 }, { name: 'Lemon & Herb', price: 0 }
        ]},
        { name: 'Side', options: [
          { name: 'Fries', price: 3.00 }, { name: 'Coleslaw', price: 2.00 }, { name: 'Ranch Dip', price: 1.50 }
        ]},
      ]
    },
    { name: 'Chicken Strips (4)',   price: 8.50,  category: 'Chicken',  icon_name: 'chicken-strips',    color_code: '#d97706', stock: 40 },
    { name: 'Regular Fries',        price: 3.50,  category: 'Sides',    icon_name: 'fries',             color_code: '#ca8a04', stock: 99 },
    { name: 'Large Fries',          price: 4.50,  category: 'Sides',    icon_name: 'fries',             color_code: '#ca8a04', stock: 99 },
    { name: 'Cheese Fries',         price: 5.00,  category: 'Sides',    icon_name: 'fries',             color_code: '#ca8a04', stock: 80 },
    { name: 'Onion Rings',          price: 4.00,  category: 'Sides',    icon_name: 'onion-rings',       color_code: '#ca8a04', stock: 60 },
    { name: 'Coleslaw',             price: 2.50,  category: 'Sides',    icon_name: 'coleslaw',          color_code: '#ca8a04', stock: 60 },
    { name: 'Classic Hot Dog',      price: 7.50,  category: 'Hot Dogs', icon_name: 'hotdog',            color_code: '#dc2626', stock: 40 },
    { name: 'Chilli Cheese Dog',    price: 8.50,  category: 'Hot Dogs', icon_name: 'hotdog',            color_code: '#dc2626', stock: 40 },
    { name: 'Cola',                 price: 2.50,  category: 'Drinks',   icon_name: 'soda-drink',        color_code: '#0284c7', stock: 99 },
    { name: 'Lemonade',             price: 3.00,  category: 'Drinks',   icon_name: 'lemonade',          color_code: '#0284c7', stock: 99 },
    { name: 'Milkshake',            price: 5.50,  category: 'Drinks',   icon_name: 'milkshake',         color_code: '#0284c7', stock: 50 },
    { name: 'Chocolate Sundae',     price: 4.50,  category: 'Desserts', icon_name: 'ice-cream',         color_code: '#7c3aed', stock: 30 },
    { name: 'Apple Pie',            price: 4.00,  category: 'Desserts', icon_name: 'apple-pie',         color_code: '#7c3aed', stock: 25 },
  ],
};

// ─────────────────────────────────────────────
// 3. PIZZA & ITALIAN
// ─────────────────────────────────────────────
const pizza: RestaurantTemplate = {
  id: 'pizza',
  label: 'Pizza & Italian',
  emoji: '🍕',
  description: 'Pizzas, pasta, risotto and Italian classics',
  categories: [
    { name: 'Pizzas',      color_code: '#dc2626', icon_name: 'pizza'         },
    { name: 'Pasta',       color_code: '#d97706', icon_name: 'noodles'       },
    { name: 'Starters',    color_code: '#16a34a', icon_name: 'food'          },
    { name: 'Salads',      color_code: '#15803d', icon_name: 'food'          },
    { name: 'Drinks',      color_code: '#0284c7', icon_name: 'cup-water'     },
    { name: 'Desserts',    color_code: '#9333ea', icon_name: 'cake-variant'  },
  ],
  items: [
    { name: 'Margherita',          price: 11.00, category: 'Pizzas',   icon_name: 'margherita',     color_code: '#dc2626', stock: 40,
      addOnGroups: [
        { name: 'Size', required: true, options: [
          { name: 'Small', price: 0 }, { name: 'Medium', price: 2.00 }, { name: 'Large', price: 4.00 }
        ]},
        { name: 'Crust', options: [
          { name: 'Thin Crust', price: 0 }, { name: 'Stuffed Crust', price: 2.00 }
        ]},
        { name: 'Extra Toppings', multi: true, options: [
          { name: 'Pepperoni', price: 1.50 }, { name: 'Mushroom', price: 1.00 }, { name: 'Olives', price: 1.00 }, { name: 'Extra Cheese', price: 1.50 }
        ]},
      ]
    },
    { name: 'Pepperoni',           price: 13.00, category: 'Pizzas',   icon_name: 'pepperoni-pizza', color_code: '#dc2626', stock: 40,
      addOnGroups: [
        { name: 'Size', required: true, options: [
          { name: 'Small', price: 0 }, { name: 'Medium', price: 2.00 }, { name: 'Large', price: 4.00 }
        ]},
        { name: 'Crust', options: [
          { name: 'Thin Crust', price: 0 }, { name: 'Stuffed Crust', price: 2.00 }
        ]},
        { name: 'Extra Toppings', multi: true, options: [
          { name: 'Mushroom', price: 1.00 }, { name: 'Onions', price: 0.50 }, { name: 'Extra Cheese', price: 1.50 }
        ]},
      ]
    },
    { name: 'BBQ Chicken Pizza',   price: 14.00, category: 'Pizzas',   icon_name: 'pizza',          color_code: '#dc2626', stock: 40,
      addOnGroups: [
        { name: 'Size', required: true, options: [
          { name: 'Small', price: 0 }, { name: 'Medium', price: 2.00 }, { name: 'Large', price: 4.00 }
        ]},
        { name: 'Crust', options: [
          { name: 'Thin Crust', price: 0 }, { name: 'Stuffed Crust', price: 2.00 }
        ]},
        { name: 'Extra Toppings', multi: true, options: [
          { name: 'Extra Chicken', price: 2.00 }, { name: 'Bacon', price: 1.50 }, { name: 'Red Onions', price: 0.50 }
        ]},
      ]
    },
    { name: 'Four Cheese',         price: 13.50, category: 'Pizzas',   icon_name: 'pizza',          color_code: '#dc2626', stock: 40,
      addOnGroups: [
        { name: 'Size', required: true, options: [
          { name: 'Small', price: 0 }, { name: 'Medium', price: 2.00 }, { name: 'Large', price: 4.00 }
        ]},
        { name: 'Crust', options: [
          { name: 'Thin Crust', price: 0 }, { name: 'Stuffed Crust', price: 2.00 }
        ]},
      ]
    },
    { name: 'Vegetariana',         price: 12.50, category: 'Pizzas',   icon_name: 'pizza',          color_code: '#dc2626', stock: 30,
      addOnGroups: [
        { name: 'Size', required: true, options: [
          { name: 'Small', price: 0 }, { name: 'Medium', price: 2.00 }, { name: 'Large', price: 4.00 }
        ]},
        { name: 'Crust', options: [
          { name: 'Thin Crust', price: 0 }, { name: 'Stuffed Crust', price: 2.00 }
        ]},
      ]
    },
    { name: 'Diavola',             price: 14.50, category: 'Pizzas',   icon_name: 'pizza',          color_code: '#dc2626', stock: 30,
      addOnGroups: [
        { name: 'Size', required: true, options: [
          { name: 'Small', price: 0 }, { name: 'Medium', price: 2.00 }, { name: 'Large', price: 4.00 }
        ]},
        { name: 'Crust', options: [
          { name: 'Thin Crust', price: 0 }, { name: 'Stuffed Crust', price: 2.00 }
        ]},
      ]
    },
    { name: 'Truffle Mushroom',    price: 15.00, category: 'Pizzas',   icon_name: 'pizza',          color_code: '#dc2626', stock: 25,
      addOnGroups: [
        { name: 'Size', required: true, options: [
          { name: 'Small', price: 0 }, { name: 'Medium', price: 2.00 }, { name: 'Large', price: 4.00 }
        ]},
        { name: 'Crust', options: [
          { name: 'Thin Crust', price: 0 }, { name: 'Stuffed Crust', price: 2.00 }
        ]},
      ]
    },
    { name: 'Spaghetti Carbonara', price: 13.00, category: 'Pasta',    icon_name: 'pasta',          color_code: '#d97706', stock: 35,
      addOnGroups: [
        { name: 'Protein', options: [
          { name: 'Chicken', price: 2.50 }, { name: 'Prawns', price: 3.50 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Parmesan', price: 1.00 }, { name: 'Garlic Bread', price: 3.00 }
        ]},
      ]
    },
    { name: 'Penne Arrabbiata',    price: 12.00, category: 'Pasta',    icon_name: 'pasta',          color_code: '#d97706', stock: 35,
      addOnGroups: [
        { name: 'Protein', options: [
          { name: 'Chicken', price: 2.50 }, { name: 'Prawns', price: 3.50 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Parmesan', price: 1.00 }, { name: 'Garlic Bread', price: 3.00 }
        ]},
      ]
    },
    { name: 'Tagliatelle Ragu',    price: 14.00, category: 'Pasta',    icon_name: 'pasta',          color_code: '#d97706', stock: 30,
      addOnGroups: [
        { name: 'Protein', options: [
          { name: 'Extra Beef', price: 2.00 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Parmesan', price: 1.00 }, { name: 'Garlic Bread', price: 3.00 }
        ]},
      ]
    },
    { name: 'Risotto ai Funghi',   price: 14.50, category: 'Pasta',    icon_name: 'pasta',          color_code: '#d97706', stock: 25,
      addOnGroups: [
        { name: 'Extras', multi: true, options: [
          { name: 'Parmesan', price: 1.00 }, { name: 'Truffle Oil', price: 2.00 }
        ]},
      ]
    },
    { name: 'Garlic Bread',        price: 4.50,  category: 'Starters', icon_name: 'garlic-bread',    color_code: '#16a34a', stock: 50 },
    { name: 'Bruschetta',          price: 6.50,  category: 'Starters', icon_name: 'bruschetta',      color_code: '#16a34a', stock: 40 },
    { name: 'Arancini',            price: 7.50,  category: 'Starters', icon_name: 'arancini',        color_code: '#16a34a', stock: 30 },
    { name: 'Burrata',             price: 9.00,  category: 'Starters', icon_name: 'burrata',         color_code: '#16a34a', stock: 25 },
    { name: 'Caesar Salad',        price: 9.50,  category: 'Salads',   icon_name: 'salad',           color_code: '#15803d', stock: 30 },
    { name: 'Caprese Salad',       price: 8.50,  category: 'Salads',   icon_name: 'salad',           color_code: '#15803d', stock: 30 },
    { name: 'House Lemonade',      price: 3.50,  category: 'Drinks',   icon_name: 'lemonade',        color_code: '#0284c7', stock: 99 },
    { name: 'San Pellegrino',      price: 3.00,  category: 'Drinks',   icon_name: 'sparkling-water', color_code: '#0284c7', stock: 99 },
    { name: 'Tiramisu',            price: 6.50,  category: 'Desserts', icon_name: 'tiramisu',        color_code: '#9333ea', stock: 20 },
    { name: 'Panna Cotta',         price: 6.00,  category: 'Desserts', icon_name: 'panna-cotta',     color_code: '#9333ea', stock: 20 },
    { name: 'Gelato (2 Scoops)',   price: 5.00,  category: 'Desserts', icon_name: 'gelato',          color_code: '#9333ea', stock: 30 },
  ],
};

// ─────────────────────────────────────────────
// 4. ASIAN RESTAURANT
// ─────────────────────────────────────────────
const asian: RestaurantTemplate = {
  id: 'asian',
  label: 'Asian Restaurant',
  emoji: '🍣',
  description: 'Sushi, noodles, dim sum and Asian favourites',
  categories: [
    { name: 'Sushi',       color_code: '#e11d48', icon_name: 'food'          },
    { name: 'Noodles',     color_code: '#d97706', icon_name: 'noodles'       },
    { name: 'Dim Sum',     color_code: '#9333ea', icon_name: 'food'          },
    { name: 'Rice Dishes', color_code: '#16a34a', icon_name: 'rice'          },
    { name: 'Soups',       color_code: '#0284c7', icon_name: 'bowl-mix'      },
    { name: 'Drinks',      color_code: '#0891b2', icon_name: 'cup-water'     },
  ],
  items: [
    { name: 'Salmon Nigiri (2pc)',  price: 6.50,  category: 'Sushi',       icon_name: 'sushi',         color_code: '#e11d48', stock: 30 },
    { name: 'Tuna Nigiri (2pc)',    price: 7.00,  category: 'Sushi',       icon_name: 'sushi',         color_code: '#e11d48', stock: 30 },
    { name: 'California Roll',      price: 9.50,  category: 'Sushi',       icon_name: 'sushi',         color_code: '#e11d48', stock: 25,
      addOnGroups: [
        { name: 'Extras', multi: true, options: [
          { name: 'Soy Sauce', price: 0 }, { name: 'Wasabi', price: 0 }, { name: 'Ginger', price: 0 }
        ]},
      ]
    },
    { name: 'Dragon Roll',          price: 12.00, category: 'Sushi',       icon_name: 'sushi',         color_code: '#e11d48', stock: 25,
      addOnGroups: [
        { name: 'Extras', multi: true, options: [
          { name: 'Extra Salmon', price: 3.00 }, { name: 'Extra Tuna', price: 3.50 }
        ]},
      ]
    },
    { name: 'Spicy Tuna Roll',      price: 10.50, category: 'Sushi',       icon_name: 'sushi',         color_code: '#e11d48', stock: 25,
      addOnGroups: [
        { name: 'Extras', multi: true, options: [
          { name: 'Extra Tuna', price: 3.50 }, { name: 'Sriracha', price: 0 }
        ]},
      ]
    },
    { name: 'Sashimi Platter',      price: 18.00, category: 'Sushi',       icon_name: 'sushi',         color_code: '#e11d48', stock: 15 },
    { name: 'Ramen',                price: 13.00, category: 'Noodles',     icon_name: 'ramen',         color_code: '#d97706', stock: 30,
      addOnGroups: [
        { name: 'Protein', options: [
          { name: 'Chicken', price: 2.50 }, { name: 'Beef', price: 3.00 }, { name: 'Prawns', price: 3.50 }, { name: 'Tofu', price: 2.00 }
        ]},
        { name: 'Spice Level', required: true, options: [
          { name: 'Mild', price: 0 }, { name: 'Medium', price: 0 }, { name: 'Hot', price: 0 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Boiled Egg', price: 1.50 }, { name: 'Extra Noodles', price: 2.00 }
        ]},
      ]
    },
    { name: 'Pad Thai',             price: 12.50, category: 'Noodles',     icon_name: 'pad-thai',      color_code: '#d97706', stock: 30,
      addOnGroups: [
        { name: 'Protein', options: [
          { name: 'Chicken', price: 2.50 }, { name: 'Beef', price: 3.00 }, { name: 'Prawns', price: 3.50 }, { name: 'Tofu', price: 2.00 }
        ]},
        { name: 'Spice Level', required: true, options: [
          { name: 'Mild', price: 0 }, { name: 'Medium', price: 0 }, { name: 'Hot', price: 0 }
        ]},
      ]
    },
    { name: 'Udon Noodle Soup',     price: 12.00, category: 'Noodles',     icon_name: 'udon-noodles',  color_code: '#d97706', stock: 30,
      addOnGroups: [
        { name: 'Protein', options: [
          { name: 'Chicken', price: 2.50 }, { name: 'Beef', price: 3.00 }, { name: 'Tofu', price: 2.00 }
        ]},
        { name: 'Spice Level', required: true, options: [
          { name: 'Mild', price: 0 }, { name: 'Medium', price: 0 }, { name: 'Hot', price: 0 }
        ]},
      ]
    },
    { name: 'Soba Noodles',         price: 11.00, category: 'Noodles',     icon_name: 'soba-noodles',  color_code: '#d97706', stock: 25,
      addOnGroups: [
        { name: 'Protein', options: [
          { name: 'Chicken', price: 2.50 }, { name: 'Shrimp', price: 3.00 }
        ]},
      ]
    },
    { name: 'Char Siu Bao (3pc)',   price: 7.50,  category: 'Dim Sum',     icon_name: 'dim-sum',       color_code: '#9333ea', stock: 30 },
    { name: 'Har Gau (4pc)',        price: 8.00,  category: 'Dim Sum',     icon_name: 'dim-sum',       color_code: '#9333ea', stock: 30 },
    { name: 'Spring Rolls (3pc)',   price: 6.50,  category: 'Dim Sum',     icon_name: 'spring-roll',   color_code: '#9333ea', stock: 35 },
    { name: 'Gyoza (6pc)',          price: 8.50,  category: 'Dim Sum',     icon_name: 'gyoza',         color_code: '#9333ea', stock: 30 },
    { name: 'Chicken Fried Rice',   price: 11.00, category: 'Rice Dishes', icon_name: 'fried-rice',    color_code: '#16a34a', stock: 35 },
    { name: 'Nasi Goreng',          price: 12.00, category: 'Rice Dishes', icon_name: 'fried-rice',    color_code: '#16a34a', stock: 30 },
    { name: 'Bibimbap',             price: 13.00, category: 'Rice Dishes', icon_name: 'bibimbap',      color_code: '#16a34a', stock: 25 },
    { name: 'Miso Soup',            price: 3.50,  category: 'Soups',       icon_name: 'miso-soup',     color_code: '#0284c7', stock: 50 },
    { name: 'Tom Yum Soup',         price: 8.50,  category: 'Soups',       icon_name: 'tom-yum-soup',  color_code: '#0284c7', stock: 30 },
    { name: 'Green Tea',            price: 2.50,  category: 'Drinks',      icon_name: 'tea',           color_code: '#0891b2', stock: 99 },
    { name: 'Sake (100ml)',         price: 6.00,  category: 'Drinks',      icon_name: 'sake',          color_code: '#0891b2', stock: 50 },
    { name: 'Japanese Lemonade',    price: 3.50,  category: 'Drinks',      icon_name: 'lemonade',      color_code: '#0891b2', stock: 60 },
  ],
};

// ─────────────────────────────────────────────
// 5. BAR & GRILL
// ─────────────────────────────────────────────
const bar: RestaurantTemplate = {
  id: 'bar',
  label: 'Bar & Grill',
  emoji: '🍺',
  description: 'Steaks, grills, pub food and bar drinks',
  categories: [
    { name: 'Grills',      color_code: '#b45309', icon_name: 'grill'         },
    { name: 'Starters',    color_code: '#16a34a', icon_name: 'food'          },
    { name: 'Pub Grub',    color_code: '#d97706', icon_name: 'food'          },
    { name: 'Sides',       color_code: '#ca8a04', icon_name: 'french-fries'  },
    { name: 'Beers',       color_code: '#d97706', icon_name: 'beer'          },
    { name: 'Cocktails',   color_code: '#be185d', icon_name: 'glass-cocktail'},
    { name: 'Soft Drinks', color_code: '#0284c7', icon_name: 'cup-water'     },
  ],
  items: [
    { name: '8oz Sirloin Steak',    price: 22.00, category: 'Grills',     icon_name: 'steak',           color_code: '#b45309', stock: 20,
      addOnGroups: [
        { name: 'Cooking Level', required: true, options: [
          { name: 'Rare', price: 0 }, { name: 'Medium Rare', price: 0 }, { name: 'Medium', price: 0 }, { name: 'Medium Well', price: 0 }, { name: 'Well Done', price: 0 }
        ]},
        { name: 'Sauce', options: [
          { name: 'Peppercorn', price: 2.00 }, { name: 'Mushroom Sauce', price: 2.00 }, { name: 'Garlic Butter', price: 1.50 }
        ]},
        { name: 'Side', required: true, options: [
          { name: 'Fries', price: 0 }, { name: 'Mashed Potato', price: 0 }, { name: 'Rice', price: 0 }, { name: 'Salad', price: 0 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Add Prawns', price: 6.00 }, { name: 'Add Egg', price: 2.00 }
        ]},
      ]
    },
    { name: '10oz Ribeye',          price: 28.00, category: 'Grills',     icon_name: 'steak',           color_code: '#b45309', stock: 20,
      addOnGroups: [
        { name: 'Cooking Level', required: true, options: [
          { name: 'Rare', price: 0 }, { name: 'Medium Rare', price: 0 }, { name: 'Medium', price: 0 }, { name: 'Medium Well', price: 0 }, { name: 'Well Done', price: 0 }
        ]},
        { name: 'Sauce', options: [
          { name: 'Peppercorn', price: 2.00 }, { name: 'Mushroom Sauce', price: 2.00 }, { name: 'Garlic Butter', price: 1.50 }
        ]},
        { name: 'Side', required: true, options: [
          { name: 'Fries', price: 0 }, { name: 'Mashed Potato', price: 0 }, { name: 'Rice', price: 0 }, { name: 'Salad', price: 0 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Add Prawns', price: 6.00 }, { name: 'Add Egg', price: 2.00 }
        ]},
      ]
    },
    { name: 'Grilled Chicken',      price: 15.00, category: 'Grills',     icon_name: 'grilled-chicken', color_code: '#b45309', stock: 25,
      addOnGroups: [
        { name: 'Sauce', required: true, options: [
          { name: 'BBQ', price: 0 }, { name: 'Peri Peri', price: 0 }, { name: 'Garlic Butter', price: 0 }
        ]},
        { name: 'Side', options: [
          { name: 'Fries', price: 3.00 }, { name: 'Rice', price: 3.00 }, { name: 'Salad', price: 2.50 }
        ]},
      ]
    },
    { name: 'BBQ Ribs (Half Rack)', price: 20.00, category: 'Grills',     icon_name: 'ribs',            color_code: '#b45309', stock: 15,
      addOnGroups: [
        { name: 'Sauce', required: true, options: [
          { name: 'BBQ', price: 0 }, { name: 'Honey Garlic', price: 0 }
        ]},
        { name: 'Side', options: [
          { name: 'Fries', price: 3.00 }, { name: 'Rice', price: 3.00 }, { name: 'Salad', price: 2.50 }
        ]},
      ]
    },
    { name: 'Lamb Chops',           price: 24.00, category: 'Grills',     icon_name: 'lamb-chops',      color_code: '#b45309', stock: 15,
      addOnGroups: [
        { name: 'Cooking Level', required: true, options: [
          { name: 'Medium Rare', price: 0 }, { name: 'Medium', price: 0 }, { name: 'Medium Well', price: 0 }
        ]},
        { name: 'Sauce', options: [
          { name: 'Mint Sauce', price: 1.50 }, { name: 'Garlic Butter', price: 1.50 }
        ]},
        { name: 'Side', required: true, options: [
          { name: 'Fries', price: 0 }, { name: 'Mashed Potato', price: 0 }, { name: 'Salad', price: 0 }
        ]},
      ]
    },
    { name: 'Nachos',               price: 8.50,  category: 'Starters',   icon_name: 'nachos',          color_code: '#16a34a', stock: 40 },
    { name: 'Loaded Potato Skins',  price: 7.50,  category: 'Starters',   icon_name: 'potato-skins',    color_code: '#16a34a', stock: 35 },
    { name: 'Calamari',             price: 9.00,  category: 'Starters',   icon_name: 'calamari',        color_code: '#16a34a', stock: 30 },
    { name: 'Fish & Chips',         price: 14.00, category: 'Pub Grub',   icon_name: 'fish-chips',      color_code: '#d97706', stock: 30 },
    { name: 'Pie of the Day',       price: 13.00, category: 'Pub Grub',   icon_name: 'pie',             color_code: '#d97706', stock: 20 },
    { name: 'Scampi & Chips',       price: 13.50, category: 'Pub Grub',   icon_name: 'scampi-chips',    color_code: '#d97706', stock: 20 },
    { name: 'Garlic Bread',         price: 4.00,  category: 'Sides',      icon_name: 'garlic-bread',    color_code: '#ca8a04', stock: 50 },
    { name: 'Onion Rings',          price: 4.50,  category: 'Sides',      icon_name: 'onion-rings',     color_code: '#ca8a04', stock: 50 },
    { name: 'Chunky Chips',         price: 4.00,  category: 'Sides',      icon_name: 'fries',           color_code: '#ca8a04', stock: 60 },
    { name: 'Lager (Pint)',         price: 5.50,  category: 'Beers',      icon_name: 'beer',            color_code: '#d97706', stock: 99 },
    { name: 'Ale (Pint)',           price: 5.80,  category: 'Beers',      icon_name: 'beer',            color_code: '#d97706', stock: 99 },
    { name: 'Guinness (Pint)',      price: 6.00,  category: 'Beers',      icon_name: 'beer',            color_code: '#d97706', stock: 99 },
    { name: 'Mojito',               price: 9.50,  category: 'Cocktails',  icon_name: 'cocktail',        color_code: '#be185d', stock: 50 },
    { name: 'Espresso Martini',     price: 10.00, category: 'Cocktails',  icon_name: 'cocktail',        color_code: '#be185d', stock: 50 },
    { name: 'Gin & Tonic',          price: 8.50,  category: 'Cocktails',  icon_name: 'cocktail',        color_code: '#be185d', stock: 50 },
    { name: 'Cola',                 price: 3.00,  category: 'Soft Drinks',icon_name: 'soda-drink',      color_code: '#0284c7', stock: 99 },
    { name: 'Sparkling Water',      price: 2.50,  category: 'Soft Drinks',icon_name: 'sparkling-water', color_code: '#0284c7', stock: 99 },
  ],
};

// ─────────────────────────────────────────────
// 6. HEALTHY & SALADS
// ─────────────────────────────────────────────
const healthy: RestaurantTemplate = {
  id: 'healthy',
  label: 'Healthy & Salads',
  emoji: '🥗',
  description: 'Bowls, salads, wraps and fresh healthy options',
  categories: [
    { name: 'Salads',      color_code: '#16a34a', icon_name: 'food'          },
    { name: 'Bowls',       color_code: '#0d9488', icon_name: 'bowl-mix'      },
    { name: 'Wraps',       color_code: '#7c3aed', icon_name: 'food'          },
    { name: 'Juices',      color_code: '#d97706', icon_name: 'cup-water'     },
    { name: 'Smoothies',   color_code: '#be185d', icon_name: 'blender'       },
    { name: 'Snacks',      color_code: '#0284c7', icon_name: 'food'          },
  ],
  items: [
    { name: 'Caesar Salad',          price: 10.50, category: 'Salads',   icon_name: 'salad',           color_code: '#16a34a', stock: 30,
      addOnGroups: [
        { name: 'Protein', options: [
          { name: 'Chicken', price: 2.50 }, { name: 'Salmon', price: 4.00 }, { name: 'Falafel', price: 2.00 }, { name: 'Tofu', price: 2.00 }
        ]},
        { name: 'Dressing', required: true, options: [
          { name: 'Caesar', price: 0 }, { name: 'Lemon Herb', price: 0 }, { name: 'Balsamic', price: 0 }, { name: 'No Dressing', price: 0 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Avocado', price: 2.00 }, { name: 'Egg', price: 1.50 }, { name: 'Seeds', price: 1.00 }
        ]},
      ]
    },
    { name: 'Greek Salad',           price: 10.00, category: 'Salads',   icon_name: 'salad',           color_code: '#16a34a', stock: 30,
      addOnGroups: [
        { name: 'Protein', options: [
          { name: 'Chicken', price: 2.50 }, { name: 'Salmon', price: 4.00 }, { name: 'Falafel', price: 2.00 }
        ]},
        { name: 'Dressing', required: true, options: [
          { name: 'Greek', price: 0 }, { name: 'Lemon Herb', price: 0 }, { name: 'No Dressing', price: 0 }
        ]},
      ]
    },
    { name: 'Superfood Salad',       price: 12.00, category: 'Salads',   icon_name: 'salad',           color_code: '#16a34a', stock: 25,
      addOnGroups: [
        { name: 'Protein', options: [
          { name: 'Chicken', price: 2.50 }, { name: 'Salmon', price: 4.00 }
        ]},
        { name: 'Dressing', required: true, options: [
          { name: 'Lemon Herb', price: 0 }, { name: 'Tahini', price: 0 }, { name: 'No Dressing', price: 0 }
        ]},
      ]
    },
    { name: 'Niçoise Salad',         price: 12.50, category: 'Salads',   icon_name: 'salad',           color_code: '#16a34a', stock: 25,
      addOnGroups: [
        { name: 'Protein', required: true, options: [
          { name: 'Tuna', price: 0 }, { name: 'Salmon', price: 2.00 }
        ]},
        { name: 'Dressing', required: true, options: [
          { name: 'Vinaigrette', price: 0 }, { name: 'Lemon Herb', price: 0 }
        ]},
      ]
    },
    { name: 'Quinoa Buddha Bowl',    price: 13.00, category: 'Bowls',    icon_name: 'protein-bowl',    color_code: '#0d9488', stock: 30,
      addOnGroups: [
        { name: 'Protein', options: [
          { name: 'Chicken', price: 2.50 }, { name: 'Tofu', price: 2.00 }, { name: 'Tempeh', price: 2.50 }
        ]},
        { name: 'Extras', multi: true, options: [
          { name: 'Avocado', price: 2.00 }, { name: 'Seeds', price: 1.00 }
        ]},
      ]
    },
    { name: 'Poke Bowl',             price: 14.00, category: 'Bowls',    icon_name: 'protein-bowl',    color_code: '#0d9488', stock: 25,
      addOnGroups: [
        { name: 'Protein', required: true, options: [
          { name: 'Salmon', price: 0 }, { name: 'Tuna', price: 0 }
        ]},
        { name: 'Base', required: true, options: [
          { name: 'Rice', price: 0 }, { name: 'Mixed Greens', price: 0 }
        ]},
      ]
    },
    { name: 'Acai Bowl',             price: 10.50, category: 'Bowls',    icon_name: 'protein-bowl',    color_code: '#0d9488', stock: 25 },
    { name: 'Teriyaki Chicken Bowl', price: 13.50, category: 'Bowls',    icon_name: 'protein-bowl',    color_code: '#0d9488', stock: 25 },
    { name: 'Falafel Wrap',          price: 9.50,  category: 'Wraps',    icon_name: 'wrap',            color_code: '#7c3aed', stock: 30 },
    { name: 'Grilled Chicken Wrap',  price: 10.50, category: 'Wraps',    icon_name: 'wrap',            color_code: '#7c3aed', stock: 30,
      addOnGroups: [
        { name: 'Extras', multi: true, options: [
          { name: 'Avocado', price: 2.00 }, { name: 'Bacon', price: 1.50 }
        ]},
      ]
    },
    { name: 'Hummus Veggie Wrap',    price: 9.00,  category: 'Wraps',    icon_name: 'wrap',            color_code: '#7c3aed', stock: 30 },
    { name: 'Fresh Orange Juice',    price: 4.00,  category: 'Juices',   icon_name: 'juice',           color_code: '#d97706', stock: 40 },
    { name: 'Green Detox Juice',     price: 5.50,  category: 'Juices',   icon_name: 'juice',           color_code: '#d97706', stock: 30 },
    { name: 'Carrot Ginger Juice',   price: 5.00,  category: 'Juices',   icon_name: 'juice',           color_code: '#d97706', stock: 30 },
    { name: 'Mango Smoothie',        price: 6.00,  category: 'Smoothies',icon_name: 'smoothie',        color_code: '#be185d', stock: 30,
      addOnGroups: [
        { name: 'Milk/Base', required: true, options: [
          { name: 'Water', price: 0 }, { name: 'Milk', price: 0 }, { name: 'Oat Milk', price: 0.50 }, { name: 'Almond Milk', price: 0.50 }
        ]},
        { name: 'Boosters', multi: true, options: [
          { name: 'Protein', price: 1.50 }, { name: 'Peanut Butter', price: 1.00 }, { name: 'Chia Seeds', price: 1.00 }
        ]},
      ]
    },
    { name: 'Berry Blast Smoothie',  price: 6.50,  category: 'Smoothies',icon_name: 'smoothie',        color_code: '#be185d', stock: 30,
      addOnGroups: [
        { name: 'Milk/Base', required: true, options: [
          { name: 'Water', price: 0 }, { name: 'Milk', price: 0 }, { name: 'Oat Milk', price: 0.50 }, { name: 'Almond Milk', price: 0.50 }
        ]},
        { name: 'Boosters', multi: true, options: [
          { name: 'Protein', price: 1.50 }, { name: 'Peanut Butter', price: 1.00 }, { name: 'Chia Seeds', price: 1.00 }
        ]},
      ]
    },
    { name: 'Green Protein Shake',   price: 7.00,  category: 'Smoothies',icon_name: 'smoothie',        color_code: '#be185d', stock: 25,
      addOnGroups: [
        { name: 'Milk/Base', required: true, options: [
          { name: 'Water', price: 0 }, { name: 'Milk', price: 0 }, { name: 'Oat Milk', price: 0.50 }, { name: 'Almond Milk', price: 0.50 }
        ]},
      ]
    },
    { name: 'Hummus & Crudités',     price: 5.50,  category: 'Snacks',   icon_name: 'hummus',          color_code: '#0284c7', stock: 30 },
    { name: 'Granola Bar',           price: 3.00,  category: 'Snacks',   icon_name: 'granola-bar',     color_code: '#0284c7', stock: 40 },
    { name: 'Mixed Nuts',            price: 4.00,  category: 'Snacks',   icon_name: 'nuts',            color_code: '#0284c7', stock: 50 },
  ],
};

// ─────────────────────────────────────────────
// 7. AFRICAN RESTAURANT
// ─────────────────────────────────────────────

const african: RestaurantTemplate = {
  id: 'african',
  label: 'African Restaurant',
  emoji: '🌍',
  description: 'West African, East African and pan-African cuisine',
  categories: [
    {name: 'Soups & Stews', color_code: '#b45309', icon_name: 'soup'},
    {name: 'Rice & Grains', color_code: '#d97706', icon_name: 'rice-bowl'},
    {name: 'Grills & BBQ', color_code: '#dc2626', icon_name: 'grill'},
    {name: 'Snacks', color_code: '#16a34a', icon_name: 'snacks'},
    {name: 'Breads & Sides', color_code: '#7c3aed', icon_name: 'sides'},
    {name: 'Drinks', color_code: '#0891b2', icon_name: 'drink'},
    {name: 'Desserts', color_code: '#be185d', icon_name: 'dessert'},
  ],
  items: [
    {
      name: 'Egusi Soup',
      price: 13.0,
      category: 'Soups & Stews',
      icon_name: 'egusi-soup',
      color_code: '#b45309',
      stock: 20,
      addOnGroups: [
        { name: 'Protein', multi: true, options: soupProteinOptions },
        { name: 'Swallow', options: swallowOptions },
        { name: 'Spice Level', required: true, options: spiceOptions },
      ],
    },
    {
      name: 'Okra Soup',
      price: 12.5,
      category: 'Soups & Stews',
      icon_name: 'okra-soup',
      color_code: '#b45309',
      stock: 20,
      addOnGroups: [
        { name: 'Protein', multi: true, options: soupProteinOptions },
        { name: 'Swallow', options: swallowOptions },
        { name: 'Spice Level', required: true, options: spiceOptions },
      ],
    },
    {
      name: 'Peanut Groundnut Soup',
      price: 13.5,
      category: 'Soups & Stews',
      icon_name: 'groundnut-soup',
      color_code: '#b45309',
      stock: 20,
      addOnGroups: [
        { name: 'Protein', multi: true, options: soupProteinOptions },
        { name: 'Swallow', options: swallowOptions },
        { name: 'Spice Level', required: true, options: spiceOptions },
      ],
    },
    {
      name: 'Ofe Onugbu (Bitter Leaf)',
      price: 13.0,
      category: 'Soups & Stews',
      icon_name: 'bitterleaf-soup',
      color_code: '#b45309',
      stock: 15,
      addOnGroups: [
        { name: 'Protein', multi: true, options: soupProteinOptions },
        { name: 'Swallow', options: swallowOptions },
        { name: 'Spice Level', required: true, options: spiceOptions },
      ],
    },
    {
      name: 'Pepper Soup',
      price: 10.0,
      category: 'Soups & Stews',
      icon_name: 'pepper-soup',
      color_code: '#b45309',
      stock: 20,
      addOnGroups: [
        { name: 'Protein', multi: true, options: [
          {name: 'Goat Meat', price: 4.0, icon_name: 'goat'},
          {name: 'Catfish', price: 5.0, icon_name: 'catfish'},
          {name: 'Assorted Meat', price: 4.5, icon_name: 'meat'},
          {name: 'Yam', price: 3.0, icon_name: 'yam'},
          {name: 'Plantain', price: 3.0, icon_name: 'plantain'},
        ]},
        { name: 'Spice Level', required: true, options: spiceOptions },
      ],
    },
    {
      name: 'Miyan Kuka',
      price: 11.0,
      category: 'Soups & Stews',
      icon_name: 'miyan-kuka',
      color_code: '#b45309',
      stock: 15,
      addOnGroups: [
        { name: 'Protein', multi: true, options: soupProteinOptions },
        { name: 'Swallow', options: swallowOptions },
        { name: 'Spice Level', required: true, options: spiceOptions },
      ],
    },

    {
      name: 'Jollof Rice',
      price: 12.0,
      category: 'Rice & Grains',
      icon_name: 'jollof-rice',
      color_code: '#d97706',
      stock: 30,
      addOnGroups: [
        { name: 'Protein', multi: true, options: riceProteinOptions },
        { name: 'Sides', multi: true, options: riceSideOptions },
      ],
    },
    {
      name: 'Fried Rice & Chicken',
      price: 14.0,
      category: 'Rice & Grains',
      icon_name: 'fried-rice',
      color_code: '#d97706',
      stock: 25,
      addOnGroups: [
        { name: 'Protein', multi: true, options: [
          {name: 'Extra Chicken', price: 3.5, icon_name: 'chicken'},
          {name: 'Turkey', price: 4.0, icon_name: 'turkey'},
        ]},
        { name: 'Sides', multi: true, options: riceSideOptions },
      ],
    },
    {
      name: 'Fufu',
      price: 4.0,
      category: 'Rice & Grains',
      icon_name: 'fufu',
      color_code: '#d97706',
      stock: 30,
    },
    {
      name: 'Eba (Garri)',
      price: 3.5,
      category: 'Rice & Grains',
      icon_name: 'eba',
      color_code: '#d97706',
      stock: 30,
    },
    {
      name: 'Pounded Yam',
      price: 5.0,
      category: 'Rice & Grains',
      icon_name: 'pounded-yam',
      color_code: '#d97706',
      stock: 25,
    },
    {
      name: 'Ugali',
      price: 3.5,
      category: 'Rice & Grains',
      icon_name: 'ugali',
      color_code: '#d97706',
      stock: 30,
    },
    {
      name: 'Injera',
      price: 4.0,
      category: 'Rice & Grains',
      icon_name: 'injera',
      color_code: '#d97706',
      stock: 25,
    },

    {
      name: 'Suya (Beef)',
      price: 12.0,
      category: 'Grills & BBQ',
      icon_name: 'suya',
      color_code: '#dc2626',
      stock: 25,
      addOnGroups: [
        { name: 'Sides', multi: true, options: grillSideOptions },
        { name: 'Sauce', options: grillSauceOptions },
      ],
    },
    {
      name: 'Suya (Chicken)',
      price: 11.0,
      category: 'Grills & BBQ',
      icon_name: 'chicken-suya',
      color_code: '#dc2626',
      stock: 25,
      addOnGroups: [
        { name: 'Sides', multi: true, options: grillSideOptions },
        { name: 'Sauce', options: grillSauceOptions },
      ],
    },
    {
      name: 'Nyama Choma',
      price: 16.0,
      category: 'Grills & BBQ',
      icon_name: 'nyama-choma',
      color_code: '#dc2626',
      stock: 20,
      addOnGroups: [
        { name: 'Sides', multi: true, options: grillSideOptions },
        { name: 'Sauce', options: grillSauceOptions },
      ],
    },
    {
      name: 'Tilapia Grill',
      price: 15.0,
      category: 'Grills & BBQ',
      icon_name: 'grilled-fish',
      color_code: '#dc2626',
      stock: 20,
      addOnGroups: [
        { name: 'Sides', multi: true, options: grillSideOptions },
        { name: 'Sauce', options: grillSauceOptions },
      ],
    },
    {
      name: 'Asun (Goat)',
      price: 14.0,
      category: 'Grills & BBQ',
      icon_name: 'asun',
      color_code: '#dc2626',
      stock: 15,
      addOnGroups: [
        { name: 'Sides', multi: true, options: grillSideOptions },
        { name: 'Sauce', options: grillSauceOptions },
      ],
    },

    {name: 'Puff Puff', price: 4.5, category: 'Snacks', icon_name: 'puff-puff', color_code: '#16a34a', stock: 30},
    {name: 'Chin Chin', price: 3.5, category: 'Snacks', icon_name: 'chin-chin', color_code: '#16a34a', stock: 40},
    {name: 'Akara (Bean Cakes)', price: 5.0, category: 'Snacks', icon_name: 'akara', color_code: '#16a34a', stock: 30},
    {name: 'Bofrot (Doughnuts)', price: 4.0, category: 'Snacks', icon_name: 'bofrot', color_code: '#16a34a', stock: 30},
    {name: 'Samosa', price: 4.5, category: 'Snacks', icon_name: 'samosa', color_code: '#16a34a', stock: 35},

    {name: 'Plantain (Fried)', price: 4.5, category: 'Breads & Sides', icon_name: 'plantain', color_code: '#7c3aed', stock: 40},
    {name: 'Fried Yam', price: 5.0, category: 'Breads & Sides', icon_name: 'fried-yam', color_code: '#7c3aed', stock: 35},
    {name: 'Coleslaw', price: 3.0, category: 'Breads & Sides', icon_name: 'coleslaw', color_code: '#7c3aed', stock: 30},

    {name: 'Zobo (Hibiscus)', price: 3.5, category: 'Drinks', icon_name: 'zobo', color_code: '#0891b2', stock: 40},
    {name: 'Kunu', price: 3.0, category: 'Drinks', icon_name: 'kunu', color_code: '#0891b2', stock: 40},
    {name: 'Palm Wine', price: 5.0, category: 'Drinks', icon_name: 'palm-wine', color_code: '#0891b2', stock: 30},
    {name: 'Chapman', price: 5.5, category: 'Drinks', icon_name: 'chapman', color_code: '#0891b2', stock: 30},
    {name: 'Tamarind Juice', price: 3.5, category: 'Drinks', icon_name: 'tamarind-juice', color_code: '#0891b2', stock: 35},

    {name: 'Beignets', price: 5.0, category: 'Desserts', icon_name: 'beignets', color_code: '#be185d', stock: 20},
    {name: 'Mandazi', price: 4.5, category: 'Desserts', icon_name: 'mandazi', color_code: '#be185d', stock: 20},
    {name: 'Malva Pudding', price: 6.0, category: 'Desserts', icon_name: 'malva-pudding', color_code: '#be185d', stock: 15},
  ],
};

export const restaurantTemplates: RestaurantTemplate[] = [
  cafe, burger, pizza, asian, bar, healthy, african,
];
