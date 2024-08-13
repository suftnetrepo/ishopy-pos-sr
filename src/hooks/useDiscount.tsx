/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { queryAllDiscounts,queryByStatus, insertDiscount,updateDiscount,deleteDiscount } from "../model/discount";
import { Discount } from "../model/types";

interface Initialize {
	data: Discount[] | null | Discount | [] | boolean;
	error: Error | null;
	loading: boolean;
}

const useDiscounts = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadDiscount() {
		try {
			const result = await queryAllDiscounts();
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

	useEffect(() => {		
		loadDiscount();
	}, []);

	const resetHandler = () => {
		setData({
			data: null,
			error: null,
			loading: false,
		});
	}

	return {
		...data,
		loadDiscount,
		resetHandler
	};
};

const useQueryDiscountByStatus = (status : number = 0) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadDiscount(status: number = 0) {
		try {
			const result = await queryByStatus(status);
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

	useEffect(() => {		
		loadDiscount(status);
	}, [status]);

	const resetHandler = () => {
		setData({
			data: null,
			error: null,
			loading: false,
		});
	}

	return {
		...data,
		loadDiscount,
		resetHandler
	};
};

const useInsertDiscount = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});
	
	const insertHandler = async (
		discount: Discount
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await insertDiscount(discount);
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

const useUpdateDiscount = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const updateHandler = async (
		discount: Discount
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const user = await updateDiscount(discount.discount_id, discount.name, discount.status, discount.rate);
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
		update: updateHandler,
		resetHandler
	};
};

const useDeleteDiscount = () => {
	const [data, setData] = useState<{
		data: boolean;
		error: Error | null;
		loading: boolean;
	}>({
		data: false,
		error: null,
		loading: false,
	});

	const deleteHandler = async (discount_id: string) => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const result = await deleteDiscount(discount_id);
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
		deleteDiscount: deleteHandler,
		resetHandler
	};
};

export { useDeleteDiscount, useInsertDiscount, useDiscounts, useUpdateDiscount, useQueryDiscountByStatus };
