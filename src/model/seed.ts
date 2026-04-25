/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { getRealmInstance } from './store';
import { Customer, Stock, Tax, Discount, Payment, AddOn } from './types';
import { restaurantTemplates } from '../data/seeds/restaurant';
import { retailTemplates } from '../data/seeds/retail';

// ── Keep original exports so nothing else breaks ───────────
export const generateUser = () => ({
  user_id: guid(),
  username: 'admin',
  password: 'admin123',
  first_name: 'Admin',
  last_name: 'User',
  pass_code: 1234,
  status: 1,
  role: 'admin',
});

export const generateShop = (mode: string, currency: string = '£') => ({
  shop_id: 'default-shop-id',
  name: 'My Store',
  email: 'hello@mystore.com',
  mobile: '',
  description: '',
  address: '',
  currency,
  theme: 'light',
  mode,
  receipt_header: 'Welcome to My Store',
  receipt_footer: 'Thank you for your visit!',
});

// ── Template seeding (new) ──────────────────────────────────

// Helper function to flatten addOnGroups into flat AddOn array
const flattenAddOnGroups = (item: any): any[] => {
  const addOns: any[] = [];
  
  // Add legacy flat addOns if they exist
  if (item.addOns && Array.isArray(item.addOns)) {
    addOns.push(...item.addOns);
  }
  
  // Flatten addOnGroups using naming convention: ${group.name}: ${option.name}
  if (item.addOnGroups && Array.isArray(item.addOnGroups)) {
    item.addOnGroups.forEach((group: any) => {
      if (group.options && Array.isArray(group.options)) {
        group.options.forEach((option: any) => {
          addOns.push({
            name: `${group.name}: ${option.name}`,
            price: option.price,
            icon_name: option.icon_name,
          });
        });
      }
    });
  }
  
  return addOns;
};

const seedFromTemplate = async (
  templateId: string,
  mode: 'restaurant' | 'shop',
  currency: string,
) => {
  const templates = mode === 'restaurant' ? restaurantTemplates : retailTemplates;
  const template  = templates.find(t => t.id === templateId) ?? templates[0];
  const realm     = await getRealmInstance();

  // Build category objects
  const categories = template.categories.map(cat => ({
    category_id: guid(),
    name:        cat.name,
    color_code:  cat.color_code,
    icon_name:   cat.icon_name,
    icon:        cat.icon_name,
    description: '',
    sort_order:  0,
    status:      1,
  }));

  // Build menu items - map category name → id
  const catMap: Record<string, string> = {};
  categories.forEach(c => { catMap[c.name] = c.category_id; });

  const menus = template.items.map(item => ({
    menu_id:     guid(),
    name:        item.name,
    bar_code:    null,
    color_code:  item.color_code,
    icon_name:   item.icon_name,
    price:       item.price,
    price_offer: 0,
    cost:        item.price * 0.6,
    stock:       item.stock,
    category_id: catMap[item.category] ?? categories[0].category_id,
    status:      1,
    description: '',
    addOn_id:    null,
  }));

  // Build add-ons from both flat addOns and flattened addOnGroups
  const allAddOns: any[] = [];
  template.items.forEach((item, itemIndex) => {
    const flattenedAddOns = flattenAddOnGroups(item);
    flattenedAddOns.forEach(addOn => {
      allAddOns.push({
        addOn_id: guid(),
        addOnName: addOn.name,
        price: addOn.price,
        menu_id: menus[itemIndex].menu_id,
        status: 1,
      });
    });
  });

  console.log('Seeding with template:', template.label);
  console.log('Categories:', categories);
  console.log('Menu Items:', menus);
  console.log('Add-ons:', allAddOns);

  // Default tables for restaurant mode
  const tables = mode === 'restaurant'
    ? Array.from({ length: 20 }, (_, i) => ({
        table_id:    guid(),
        tableName:   `Table ${i + 1}`,
        isOccupied:  0,
        status:      1,
        size:        4,
        location:    '',
        guest_name:  '',
        guest_count: 0,
        start_time:  '',
      }))
    : [{
        table_id:    guid(),
        tableName:   'Counter',
        isOccupied:  0,
        status:      1,
        size:        1,
        location:    '',
        guest_name:  '',
        guest_count: 0,
        start_time:  '',
      }];

  const shop = {
    ...generateShop(mode, currency),
    name: template.label,
  };

  const admin = generateUser();

  try {
    realm.write(() => {
      realm.deleteAll();

      // Shop
      realm.create('Shop', shop);

      // Admin user
      realm.create('User', admin);

      // Default tax
      const taxes: Tax[] = [
        { tax_id: guid(), name: 'VAT', rate: 10, status: 1 },
      ];
      taxes.forEach(t => realm.create('Tax', t));

      // Default discount
      const discounts: Discount[] = [
        { discount_id: guid(), name: 'Promo', rate: 5, status: 1 },
      ];
      discounts.forEach(d => realm.create('Discount', d));

      // Categories
      categories.forEach(c => realm.create('Category', c));

      // Menu items + stock
      menus.forEach(m => {
        realm.create('Menu', m);
        const stock: Stock = {
          stock_id: guid(),
          menu_id:  m.menu_id,
          stock:    m.stock,
          date:     new Date().toISOString(),
        };
        realm.create('Stock', stock);
      });

      // Add-ons
      allAddOns.forEach(addon => {
        realm.create('AddOn', addon);
      });

      // Tables
      tables.forEach(t => realm.create('Table', t));

      console.log(`Seeded template: ${template.label}`);
    });
    return true;
  } catch (error) {
    console.log('Seed error:', error);
    return false;
  }
};

// ── Legacy seedData kept for compatibility ──────────────────
const seedData = async (mode: string, currency: string = '£') => {
  const templateId = mode === 'restaurant' ? 'cafe' : 'general';
  return seedFromTemplate(templateId, mode as 'restaurant' | 'shop', currency);
};

const clearSeedData = async () => {
  const realm = await getRealmInstance();
  realm.write(() => { realm.deleteAll(); });
};

const prepareSeedData = async () => {
  const realm = await getRealmInstance();
  try {
    realm.write(() => {
      realm.delete(realm.objects('Category'));
      realm.delete(realm.objects('Tax'));
      realm.delete(realm.objects('Discount'));
      realm.delete(realm.objects('Menu'));
      realm.delete(realm.objects('Stock'));
      realm.delete(realm.objects('Table'));
      realm.delete(realm.objects('AddOn'));
      realm.delete(realm.objects('Customer'));
      realm.delete(realm.objects('Order'));
      realm.delete(realm.objects('OrderItem'));
      realm.delete(realm.objects('Payment'));
    });
  } catch (error) {
    console.log('prepareSeedData error:', error);
  }
};

export { seedData, seedFromTemplate, clearSeedData, prepareSeedData };
