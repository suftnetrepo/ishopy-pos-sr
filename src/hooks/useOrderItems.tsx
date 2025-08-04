/* eslint-disable prettier/prettier */
import {useEffect, useState} from 'react';
import {
  queryOrderItemById,
  queryOrderItemByOrderId,
  insertOrderItem,
  deleteOrderItem,
  getMostPopularMenuByQuantity,
  queryRecentOrders,
} from '../model/orderItems';
import {OrderItem} from '../model/types';
import {PopularMenuItem, RecentOrderDisplay} from '../model/orderItems';

interface Initialize {
  data:
    | OrderItem[]
    | null
    | OrderItem
    | []
    | boolean
    | PopularMenuItem[]
    | null
    | RecentOrderDisplay[]
    | null;
  error: Error | null;
  loading: boolean;
}

const useQueryRecentOrders = () => {
  const [data, setData] = useState<Initialize>({
    data: [],
    error: null,
    loading: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const result = await queryRecentOrders(5);
        setData(prev => ({
          ...prev,
          data: result,
          loading: false,
        }));
      } catch (error) {
        setData({
          data: null,
          error: error as Error,
          loading: false,
        });
      }
    }
    load();
  }, []);

  return {
    data: data.data as RecentOrderDisplay[] | [],
    error: data.error,
    loading: data.loading,
  };
};

const useQueryPopularMenuItems = () => {
  const [data, setData] = useState<Initialize>({
    data: [],
    error: null,
    loading: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const result = await getMostPopularMenuByQuantity(8);
        setData(prev => ({
          ...prev,
          data: result,
          loading: false,
        }));
      } catch (error) {
        setData({
          data: null,
          error: error as Error,
          loading: false,
        });
      }
    }
    load();
  }, []);

  return {
    data: data.data as PopularMenuItem[] | [],
    error: data.error,
    loading: data.loading,
  };
};

const useQueryOrderItemByOrder = (order_id: string) => {
  const [data, setData] = useState<Initialize>({
    data: [],
    error: null,
    loading: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const result = await queryOrderItemByOrderId(order_id);
        setData(prev => ({
          ...prev,
          data: result,
          loading: false,
        }));
      } catch (error) {
        setData({
          data: null,
          error: error as Error,
          loading: false,
        });
      }
    }
    load();
  }, [order_id]);

  return {
    ...data,
  };
};

const useQueryOrderItemById = (detail_id: string) => {
  const [data, setData] = useState<Initialize>({
    data: [],
    error: null,
    loading: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const result = await queryOrderItemById(detail_id);
        setData(prev => ({
          ...prev,
          data: result,
          loading: false,
        }));
      } catch (error) {
        setData({
          data: null,
          error: error as Error,
          loading: false,
        });
      }
    }
    load();
  }, [detail_id]);

  return {
    ...data,
  };
};

const useInsertOrderItem = () => {
  const [data, setData] = useState<Initialize>({
    data: null,
    error: null,
    loading: true,
  });

  const insertHandler = async (orderItem: OrderItem) => {
    setData(prev => ({...prev, loading: true}));

    try {
      const result = await insertOrderItem(orderItem);
      setData({
        data: result,
        error: null,
        loading: false,
      });
    } catch (error) {
      setData({
        data: null,
        error: error as Error,
        loading: false,
      });
    }
  };

  return {
    ...data,
    insert: insertHandler,
  };
};

const useDeleteOrderItem = () => {
  const [data, setData] = useState<{
    data: boolean;
    error: Error | null;
    loading: boolean;
  }>({
    data: false,
    error: null,
    loading: true,
  });

  const deleteHandler = async (detail_id: string) => {
    setData(prev => ({...prev, loading: true}));
    try {
      const result = await deleteOrderItem(detail_id);
      setData({
        data: result,
        error: null,
        loading: false,
      });
    } catch (error) {
      setData({
        data: false,
        error: error as Error,
        loading: false,
      });
    }
  };

  return {
    ...data,
    delete: deleteHandler,
  };
};

export {
  useDeleteOrderItem,
  useInsertOrderItem,
  useQueryOrderItemById,
  useQueryOrderItemByOrder,
  useQueryPopularMenuItems,
  useQueryRecentOrders,
};
