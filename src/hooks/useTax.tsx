/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { queryAllTaxes, insertTax, queryByStatus, updateTax, deleteTax } from "../model/tax";
import { Tax } from "../model/types";

interface Initialize {
	data: Tax[] | null | Tax | [] | boolean;
	error: Error | null;
	loading: boolean;
}

const useTaxes = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadTaxes() {
		try {
			const result = await queryAllTaxes();
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
		loadTaxes();
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
		loadTaxes,
		resetHandler
	};
};

const useQueryTaxByStatus = (status: number = 0) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadTaxes(status: number = 0) {
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
		loadTaxes(status);
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
		resetHandler
	};
};

const useInsertTax = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const insertHandler = async (
		tax: Tax
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await insertTax(tax);
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

const useUpdateTax = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const updateHandler = async (
		tax: Tax
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const user = await updateTax(tax.tax_id, tax.name, tax.status, tax.rate);
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

const useDeleteTax = () => {
	const [data, setData] = useState<{
		data: boolean;
		error: Error | null;
		loading: boolean;
	}>({
		data: false,
		error: null,
		loading: false,
	});

	const deleteHandler = async (tax_id: number) => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const result = await deleteTax(tax_id);
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
		deleteTax: deleteHandler,
		resetHandler
	};
};

export { useDeleteTax, useUpdateTax, useInsertTax, useTaxes, useQueryTaxByStatus };
