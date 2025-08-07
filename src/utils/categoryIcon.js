// Icon categories data from the IconPicker component
const iconCategories = {
  'main-meals': {
    title: 'Main Meals',
    color: '#FF6B6B',
    icons: [
      { name: 'hamburger', library: 'FontAwesome5', label: 'Burger', type: 'solid' },
      { name: 'pizza-slice', library: 'FontAwesome5', label: 'Pizza', type: 'solid' },
      { name: 'fish', library: 'FontAwesome5', label: 'Seafood', type: 'solid' },
      { name: 'drumstick-bite', library: 'FontAwesome5', label: 'Chicken', type: 'solid' },
      { name: 'utensils', library: 'FontAwesome5', label: 'Fine Dining', type: 'solid' },
      { name: 'bread-slice', library: 'FontAwesome5', label: 'Breakfast', type: 'solid' },
      { name: 'hotdog', library: 'FontAwesome5', label: 'Fast Food', type: 'solid' },
      { name: 'egg', library: 'FontAwesome5', label: 'Eggs', type: 'solid' },
    ]
  },
  'beverages': {
    title: 'Beverages',
    color: '#4ECDC4',
    icons: [
      { name: 'coffee', library: 'FontAwesome5', label: 'Coffee', type: 'solid' },
      { name: 'wine-glass-alt', library: 'FontAwesome5', label: 'Wine', type: 'solid' },
      { name: 'beer', library: 'FontAwesome5', label: 'Beer', type: 'solid' },
      { name: 'cocktail', library: 'FontAwesome5', label: 'Cocktails', type: 'solid' },
      { name: 'mug-hot', library: 'FontAwesome5', label: 'Hot Drinks', type: 'solid' },
      { name: 'glass-whiskey', library: 'FontAwesome5', label: 'Spirits', type: 'solid' },
      { name: 'local-cafe', library: 'MaterialIcons', label: 'Cafe', type: 'solid' },
      { name: 'wine', library: 'Ionicons', label: 'Wine Bar', type: 'solid' },
    ]
  },
  'appetizers': {
    title: 'Appetizers & Sides',
    color: '#45B7D1',
    icons: [
      { name: 'cheese', library: 'FontAwesome5', label: 'Cheese', type: 'solid' },
      { name: 'apple-alt', library: 'FontAwesome5', label: 'Fruits', type: 'solid' },
      { name: 'carrot', library: 'FontAwesome5', label: 'Vegetables', type: 'solid' },
      { name: 'seedling', library: 'FontAwesome5', label: 'Salads', type: 'solid' },
      { name: 'pepper-hot', library: 'FontAwesome5', label: 'Spicy', type: 'solid' },
      { name: 'lemon', library: 'FontAwesome5', label: 'Fresh', type: 'solid' },
    ]
  },
  'soups': {
    title: 'Soups',
    color: '#F39C12',
    icons: [
      { name: 'bowl-hot', library: 'FontAwesome5', label: 'Hot Soup', type: 'solid' },
      { name: 'soup', library: 'MaterialIcons', label: 'Soup Bowl', type: 'solid' },
      { name: 'restaurant', library: 'Ionicons', label: 'Broth', type: 'solid' },
    ]
  },
  'desserts': {
    title: 'Desserts',
    color: '#E74C3C',
    icons: [
      { name: 'birthday-cake', library: 'FontAwesome5', label: 'Cake', type: 'solid' },
      { name: 'ice-cream', library: 'FontAwesome5', label: 'Ice Cream', type: 'solid' },
      { name: 'cookie-bite', library: 'FontAwesome5', label: 'Cookies', type: 'solid' },
      { name: 'candy-cane', library: 'FontAwesome5', label: 'Candy', type: 'solid' },
      { name: 'cake', library: 'MaterialIcons', label: 'Birthday Cake', type: 'solid' },
    ]
  },
  'special': {
    title: 'Special',
    color: '#9B59B6',
    icons: [
      { name: 'star', library: 'FontAwesome5', label: 'Special', type: 'solid' },
      { name: 'heart', library: 'FontAwesome5', label: 'Favorite', type: 'solid' },
      { name: 'leaf', library: 'FontAwesome5', label: 'Vegan', type: 'solid' },
      { name: 'fire', library: 'FontAwesome5', label: 'Hot & Spicy', type: 'solid' },
      { name: 'award', library: 'FontAwesome5', label: 'Award Winner', type: 'solid' },
      { name: 'crown', library: 'FontAwesome5', label: 'Premium', type: 'solid' },
      { name: 'gem', library: 'FontAwesome5', label: 'Exclusive', type: 'solid' },
      { name: 'medal', library: 'FontAwesome5', label: 'Best Seller', type: 'solid' },
    ]
  }
};

// Helper function to generate unique IDs (you can replace with your own guid function)
const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper function to get a representative icon for each category
const getCategoryIcon = (categoryKey, categoryData) => {
  // Return the first icon from each category as the representative icon
  const firstIcon = categoryData.icons[0];
  return {
    name: firstIcon.name,
    library: firstIcon.library,
    label: firstIcon.label,
    type: firstIcon.type
  };
};

// Modified generateCategories function
const generateCategories = () => {
  return Object.entries(iconCategories).map(([categoryKey, categoryData]) => ({
    category_id: guid(),
    name: categoryData.title, // "Appetizers & Sides", "Main Meals", etc.
    color_code: categoryData.color, // "#45B7D1", "#FF6B6B", etc.
    icon: getCategoryIcon(categoryKey, categoryData), // Icon object with name, library, etc.
    status: 1,
  }));
};

// Alternative version if you want to specify custom icons for categories
const generateCategoriesWithCustomIcons = () => {
  // Define specific representative icons for each category
  const categoryIcons = {
    'main-meals': { name: 'utensils', library: 'FontAwesome5', label: 'Main Meals', type: 'solid' },
    'beverages': { name: 'coffee', library: 'FontAwesome5', label: 'Beverages', type: 'solid' },
    'appetizers': { name: 'cheese', library: 'FontAwesome5', label: 'Appetizers', type: 'solid' },
    'soups': { name: 'bowl-hot', library: 'FontAwesome5', label: 'Soups', type: 'solid' },
    'desserts': { name: 'birthday-cake', library: 'FontAwesome5', label: 'Desserts', type: 'solid' },
    'special': { name: 'star', library: 'FontAwesome5', label: 'Special', type: 'solid' }
  };

  return Object.entries(iconCategories).map(([categoryKey, categoryData]) => ({
    category_id: guid(),
    name: categoryData.title,
    color_code: categoryData.color,
    icon: categoryIcons[categoryKey],
    status: 1,
  }));
};

// Usage examples:
console.log('Generated Categories:');
const categories = generateCategories();
console.log(categories);

// Example output structure:
/*
[
  {
    category_id: "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5",
    name: "Main Meals",
    color_code: "#FF6B6B", 
    icon: {
      name: "hamburger",
      library: "FontAwesome5",
      label: "Burger", 
      type: "solid"
    },
    status: 1
  },
  {
    category_id: "b2c3d4e5-f6g7-4h8i-9j0k-l1m2n3o4p5q6",
    name: "Beverages",
    color_code: "#4ECDC4",
    icon: {
      name: "coffee",
      library: "FontAwesome5", 
      label: "Coffee",
      type: "solid"
    },
    status: 1
  },
  // ... more categories
]
*/

// Function to get all available icons for a specific category
const getIconsForCategory = (categoryName) => {
  const categoryEntry = Object.entries(iconCategories).find(
    ([_, categoryData]) => categoryData.title === categoryName
  );
  
  return categoryEntry ? categoryEntry[1].icons : [];
};

// Function to get category by name
const getCategoryByName = (categoryName) => {
  const categoryEntry = Object.entries(iconCategories).find(
    ([_, categoryData]) => categoryData.title === categoryName
  );
  
  if (categoryEntry) {
    const [categoryKey, categoryData] = categoryEntry;
    return {
      key: categoryKey,
      title: categoryData.title,
      color: categoryData.color,
      icons: categoryData.icons
    };
  }
  
  return null;
};

// Export for use in other files
export { 
  generateCategories, 
  generateCategoriesWithCustomIcons,
  getIconsForCategory,
  getCategoryByName,
  iconCategories 
};