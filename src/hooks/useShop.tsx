/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import {
	queryAllShops,
	insertShop,
	updateShop,
	deleteShop,
} from "../model/shop";
import { Shop } from "../model/types";
import { insertUser } from "../model/user";
interface Initialize {
	data: Shop[] | [] | null | Shop;
	error: Error | null;
	loading: boolean;
}

interface IShop 
extends Shop {
	first_name: string;
	last_name: string;
	user_name: string;
	password: string;
	role: "admin";
	pass_code: number;
}

const useShop = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const shop = await queryAllShops();			
				setData({
					
					data: shop,
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
		}
		load();
	}, []);

	return {
		...data,
	};
};

const useInsertShop = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const insertHandler = async (shop: IShop) => {

		try {
			setData((prev) => ({ ...prev, loading: true }));

			const userResult = await insertUser(
				shop.first_name,
				shop.last_name,
				shop.user_name,
				shop.password,
				shop.role,
				shop.pass_code
			);

			const shopResult = await insertShop(shop);
			setData({
				data: shopResult,
				error: null,
				loading: false,
			});
			return {
				user: userResult,
				shop: shopResult
			}
		} catch (error) {
			setData({
				data: null,
				error: error as Error,
				loading: false,
			});
		}
	};

	const resetHandler = () => {
		setData({
			data: null,
			error: null,
			loading: false,
		});
	}

	return {
		...data,
		insertHandler,
		resetHandler
	};
};

const useUpdateShop = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const updateHandler = async (shop: Shop) => {
		setData((prev) => ({ ...prev, loading: true }));
		
		try {
			const user = await updateShop(shop);
			setData({
				data: user,
				error: null,
				loading: false,
			});
			return true
		} catch (error) {
			setData({
				data: null,
				error: error as Error,
				loading: false,
			});
		}
	};

	const resetHandler = () => {
		setData({
			data: null,
			error: null,
			loading: false,
		});
	}

	return {
		...data,
		updateHandler,
		resetHandler
	};
};

const useDeleteShop = () => {
	const [data, setData] = useState<{
		data: boolean;
		error: Error | null;
		loading: boolean;
	}>({
		data: false,
		error: null,
		loading: false,
	});

	const deleteHandler = async (shop_id: number) => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const user = await deleteShop(shop_id);
			setData({
				data: user,
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

	const resetHandler = () => {
		setData({
			data: false,
			error: null,
			loading: false,
		});
	}

	return {
		...data,
		deleteHandler,
		resetHandler
	};
};

export { useDeleteShop, useUpdateShop, useInsertShop, useShop };
