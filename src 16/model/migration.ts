/* eslint-disable prettier/prettier */
import Realm from 'realm';
const SCHEMA_VERSION = 1;

const migration1 = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < SCHEMA_VERSION) {
    const oldUsers = oldRealm.objects('User');
    const newUsers = newRealm.objects('User');

    for (let i = 0; i < oldUsers.length; i++) {
      newUsers[i].first_name = oldUsers[i].first_name || '';
      newUsers[i].last_name = oldUsers[i].last_name || '';
      newUsers[i].pass_code = oldUsers[i].pass_code || '';
      newUsers[i].status = oldUsers[i].status || 0;
    }

    const oldOrders = oldRealm.objects('Order');
    const newOrders = newRealm.objects('Order');

    for (let i = 0; i < oldOrders.length; i++) {
      newOrders[i].total_tax = oldOrders[i].total_tax || 0.0;
      newOrders[i].total_discount = oldOrders[i].total_discount || 0.0;
    }
  }
};

export {SCHEMA_VERSION, migration1 as migration};
