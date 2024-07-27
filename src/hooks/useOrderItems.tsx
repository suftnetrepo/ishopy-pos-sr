/* eslint-disable prettier/prettier */
import {useEffect, useState} from 'react';
import {
  queryOrderItemById,
  queryOrderItemByOrderId,
  insertOrderItem,
  deleteOrderItem,
} from '../model/orderItems';
import {OrderItem} from '../model/types';

interface Initialize {
  data: OrderItem[] | null | OrderItem | [] | boolean;
  error: Error | null;
  loading: boolean;
}

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
    ...data
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
    ...data
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

export { useDeleteOrderItem, useInsertOrderItem, useQueryOrderItemById, useQueryOrderItemByOrder };
