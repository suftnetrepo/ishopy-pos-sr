/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import {getRealmInstance} from './store';

export interface Customer {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
}

const insertCustomer = async (
  name: string,
  email: string,
  phone: string,
): Promise<Customer> => {
  const realm = await getRealmInstance()
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const customer: Customer = {
          id: guid(),
          name,
          email,
          phone,
        };
        realm.create('Customer', customer);
        resolve(customer);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateCustomer = async (
  id: string,
  name: string,
  email: string,
  phone: string
): Promise<Customer> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const customer = realm.objectForPrimaryKey<Customer>('Customer', id);
        if (customer) {
          customer.name = name;
          customer.email = email;
          customer.phone = phone;
          resolve(customer);
        } else {
          reject(new Error('Customer not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteCustomer = async (id: string): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const customer = realm.objectForPrimaryKey<Customer>('Customer', id);
        if (customer) {
          realm.delete(customer);
          resolve(true);
        } else {
          reject(new Error('Customer not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryCustomers = async(): Promise<Customer[]> => {
    const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const customers = realm.objects<Customer>('Customer').map(customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      }));
      resolve(customers);
    } catch (error) {
      reject(error);
    }
  });
};

const queryCustomerById = async (id: string): Promise<Customer | null> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const customer = realm.objectForPrimaryKey<Customer>('Customer', id);
      resolve(
        customer
          ? {
              id: customer.id,
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
            }
          : null
      );
    } catch (error) {
      reject(error);
    }
  });
};

const queryCustomerByEmail = async(email: string): Promise<Customer[]> => {
    const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const customers = realm
        .objects<Customer>('Customer')
        .filtered('email == $0', email)
        .map(customer => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        }));
      resolve(customers);
    } catch (error) {
      reject(error);
    }
  });
};

const queryCustomerByPhone = async (phone: string): Promise<Customer[]> => {
    const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const customers = realm
        .objects<Customer>('Customer')
        .filtered('phone == $0', phone)
        .map(customer => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        }));
      resolve(customers);
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertCustomer,
  updateCustomer,
  deleteCustomer,
  queryCustomers,
  queryCustomerByEmail,
  queryCustomerByPhone,
  queryCustomerById,
};
