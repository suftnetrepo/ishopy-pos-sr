/* eslint-disable prettier/prettier */
/**
 * FAQ Data
 * Central repository for all FAQ sections and items
 */

export interface FAQItem {
  q: string
  a: string
}

export interface FAQSection {
  id: string
  title: string
  items: FAQItem[]
}

export const FAQ_SECTIONS: FAQSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    items: [
      {
        q: 'How do I create my first table?',
        a: 'Go to Settings > Tables, then tap Add Table. Enter the table name, size, and optional table type such as bar, dining, or takeaway.',
      },
      {
        q: 'How do I add menu items?',
        a: 'Go to Items, tap the plus button, then enter the item name, price, category, and stock details. You can also add modifiers or add-ons later.',
      },
      {
        q: 'How do I switch between Restaurant and Shop mode?',
        a: 'Go to Settings > Shop and update the business mode. Restaurant mode supports tables, waitlist, and held orders. Shop mode is designed for quick sales.',
      },
      {
        q: 'Can I use the app on an iPad?',
        a: 'Yes. The app is designed to work well on iPad and tablet screens, especially for restaurants, cafés, and retail counters.',
      },
    ],
  },
  {
    id: 'orders-tables',
    title: 'Orders & Tables',
    items: [
      {
        q: 'How do I start an order?',
        a: 'Open Tables, select a table, then tap menu items to add them to the cart. When ready, choose Cash or Card and complete the order.',
      },
      {
        q: 'How do I add more items to an existing table?',
        a: 'Open the table again and add more items. The cart updates automatically with the new total.',
      },
      {
        q: 'What does Hold mean?',
        a: 'Hold saves the order without taking payment. Use this when a customer is still dining or wants to continue ordering later.',
      },
      {
        q: 'How do I void an order?',
        a: 'Open the order and tap Void. Confirm the action. Voided orders are not treated as completed sales.',
      },
      {
        q: 'Can I remove an item from the cart?',
        a: 'Yes. Use the remove icon beside the item in the cart before completing payment.',
      },
      {
        q: 'Can I re-open a completed order?',
        a: 'Completed orders are usually kept as records. If you need to make changes, use refund, void, or adjustment features depending on your setup.',
      },
    ],
  },
  {
    id: 'menu-inventory',
    title: 'Menu & Inventory',
    items: [
      {
        q: 'How do I edit an item?',
        a: 'Go to Items and tap the edit icon on the item card. Update the item details and save.',
      },
      {
        q: 'How do I add add-ons or modifiers?',
        a: 'Go to Items and tap the add-ons icon on an item. Add options such as size, toppings, extras, or preparation choices.',
      },
      {
        q: 'What happens if an item has no add-ons?',
        a: 'If an item has no add-ons, it should be added directly to the cart without opening the add-ons modal.',
      },
      {
        q: 'How do I mark an item unavailable?',
        a: 'Edit the item and change its status to inactive or unavailable. It will no longer be available for new orders.',
      },
      {
        q: 'How do I manage categories?',
        a: 'Go to Settings > Categories. You can add, edit, or organise categories such as Breakfast, Drinks, Desserts, or Pastries.',
      },
      {
        q: 'How do I track low stock?',
        a: 'Use item stock fields when creating or editing items. Low stock items will appear on the dashboard when stock falls below the configured threshold.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments',
    items: [
      {
        q: 'How do I take cash payment?',
        a: 'Select Cash in the cart, then tap Pay. The order will be marked as completed once payment is confirmed.',
      },
      {
        q: 'How do I take card payment?',
        a: 'Select Card in the cart, then tap Pay. Card processing depends on your configured payment provider or manual card workflow.',
      },
      {
        q: 'Can I apply discounts?',
        a: 'Yes. Configure discounts in Settings > Discounts, then apply them during checkout if supported by your workflow.',
      },
      {
        q: 'Can I apply tax?',
        a: 'Yes. Configure tax rates in Settings > Taxes. Tax can then be included in order totals depending on your setup.',
      },
      {
        q: 'Can I refund a payment?',
        a: 'Refund support depends on your payment setup. For manual payments, record the refund in your order records. For card payments, use your payment provider refund flow.',
      },
      {
        q: 'Can I reprint a receipt?',
        a: 'Yes. Open the order details and tap the print icon to print the receipt again.',
      },
    ],
  },
  {
    id: 'printers',
    title: 'Printers',
    items: [
      {
        q: 'How do I connect a receipt printer?',
        a: 'Go to Settings > Printer and choose the printer connection type. Follow the pairing or network setup steps for your printer.',
      },
      {
        q: 'How do I test print?',
        a: 'Open Settings > Printer and use Test Print after selecting a printer. This confirms the printer connection is working.',
      },
      {
        q: 'Why is my printer not showing?',
        a: 'Check that the printer is powered on, paired, connected to the same network if using Wi-Fi, and supported by the app.',
      },
      {
        q: 'What should I do if printing fails?',
        a: 'Check the printer power, paper, connection, and selected printer. Try reconnecting the printer and running Test Print again.',
      },
      {
        q: 'Can I use Bluetooth printing on iPad?',
        a: 'iPad Bluetooth printing support depends on the printer and iOS compatibility. Wi-Fi or network printing is usually more reliable on iPad.',
      },
      {
        q: 'Can I use Wi-Fi printing?',
        a: 'Yes, if your printer supports network printing and the app has been configured for it.',
      },
    ],
  },
  {
    id: 'waitlist',
    title: 'Waitlist',
    items: [
      {
        q: 'How does the waitlist work?',
        a: 'Add guests to the waitlist with their party size, seating preference, and optional phone number. Staff can seat or notify guests when a table is ready.',
      },
      {
        q: 'How do I add a guest to the waitlist?',
        a: 'Open Waitlist, enter the guest name if available, choose party size and seating preference, then tap Add to waitlist.',
      },
      {
        q: 'How do I notify a guest?',
        a: 'Tap Notify on the guest card. If a phone number is saved, the app can open the device SMS composer with a prepared message.',
      },
      {
        q: 'Can SMS be sent automatically?',
        a: 'Device SMS opens the phone or tablet SMS composer and must be sent manually by staff. Automatic SMS requires an SMS provider such as Twilio or AWS SNS through a backend service.',
      },
      {
        q: 'Why is the SMS recipient field empty?',
        a: 'Make sure the guest has a valid phone number, including country code where needed, before tapping Notify.',
      },
      {
        q: 'What does Seat now do?',
        a: 'Seat now assigns the guest to a table and removes them from the waitlist.',
      },
      {
        q: 'Can I remove a guest from the waitlist?',
        a: 'Yes. Tap Remove on the guest card to remove them from the queue.',
      },
    ],
  },
  {
    id: 'users-security',
    title: 'Users & Security',
    items: [
      {
        q: 'How do I manage users?',
        a: 'Go to Settings > Users. You can add staff members, update their roles, and manage access.',
      },
      {
        q: 'What user roles are supported?',
        a: 'Common roles include Admin, Manager, and Staff. Permissions may vary depending on your setup.',
      },
      {
        q: 'How do I change a staff PIN?',
        a: 'Go to Settings > Users, select the user, and update their PIN or access details.',
      },
      {
        q: 'Can I restrict staff permissions?',
        a: 'Yes, if role permissions are enabled. Managers and admins can control which features staff can access.',
      },
      {
        q: 'How do I log out?',
        a: 'Tap the logout icon in the header to leave the current session.',
      },
    ],
  },
  {
    id: 'settings-backup',
    title: 'Settings & Backup',
    items: [
      {
        q: 'How do I update shop details?',
        a: 'Go to Settings > Shop. Update your business name, contact details, currency, address, and business mode.',
      },
      {
        q: 'How do I change the app theme?',
        a: 'Go to Settings and choose your preferred appearance or theme if theme switching is enabled.',
      },
      {
        q: 'How do I manage taxes?',
        a: 'Go to Settings > Taxes. Add or edit tax rates used during checkout.',
      },
      {
        q: 'How do I manage discounts?',
        a: 'Go to Settings > Discounts. Add or edit discount rules for orders or items.',
      },
      {
        q: 'How do I backup my data?',
        a: 'Go to Settings > Backup and run a backup if backup is configured. Automatic backups may also be available depending on setup.',
      },
      {
        q: 'How do I restore a backup?',
        a: 'Go to Settings > Backup and choose a saved backup to restore. Always confirm the backup is correct before restoring.',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    items: [
      {
        q: 'What should I do if the app looks wrong in dark mode?',
        a: 'Restart the app and check that the latest version is installed. If the issue continues, report the screen name and a screenshot.',
      },
      {
        q: 'What should I do if an order does not appear?',
        a: 'Refresh the screen, check your connection, and confirm the order was saved. If offline mode is enabled, it may sync later.',
      },
      {
        q: 'What happens if the internet goes down?',
        a: 'Some features may continue locally, but cloud sync, online payments, backup, and automatic SMS providers may require internet access.',
      },
      {
        q: 'Why are icons missing or showing as boxes?',
        a: 'This usually means the icon font was not loaded correctly. Restart the app or rebuild the app with the correct icon fonts linked.',
      },
      {
        q: 'Why are custom fonts not showing?',
        a: 'Make sure the font files are included in the app bundle and registered correctly in the iOS or Android project.',
      },
      {
        q: 'How do I contact support?',
        a: 'Use the support contact provided by your system administrator or app provider. Include screenshots and details of the issue.',
      },
    ],
  },
]