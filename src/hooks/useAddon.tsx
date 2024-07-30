/* eslint-disable prettier/prettier */
import { useState } from "react";
import { queryAddonByMenuId,  insertAddon, updateAddOn, deleteAddOn } from "../model/addOn";
import { AddOn } from "../model/types";

interface Initialize {
	data: AddOn[] | null | AddOn | [] | boolean;
	error: Error | null;
	loading: boolean;
}

const useAddOns = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadAddons(menu_id: string) {
		try {
			const result = await queryAddonByMenuId(menu_id);
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

	return {
		...data,
		loadAddons
	};
};


const useInsertAddon = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const insertHandler = async (
		addOnName: string,
		price: number,	
		menu_id: string,
		status :number
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await insertAddon(menu_id, addOnName, price, status);
			setData({
				data: result,
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
		insert: insertHandler,
		resetHandler
	};
};

const useUpdateAddOn = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const updateHandler = async (
		addOn_id: number,
		addOnName: string,
		price: number,		
		status: number
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await updateAddOn(addOn_id, addOnName, price, status);
			setData({
				data: result,
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
		update: updateHandler,
		resetHandler
	};
};

const useDeleteAddOn = () => {
	const [data, setData] = useState<{
		data: boolean;
		error: Error | null;
		loading: boolean;
	}>({
		data: false,
		error: null,
		loading: false,
	});

	const deleteHandler = async (addOn_id: string) => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const result = await deleteAddOn(addOn_id);
			setData({
				data: result,
				error: null,
				loading: false,
			});
			return true
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
		deleteAddOn: deleteHandler,
		resetHandler
	};
};

export { useDeleteAddOn, useInsertAddon, useUpdateAddOn, useAddOns };
