/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { queryAllCategories, queryCategoriesByStatus, queryCategoryById, deleteCategory, insertCategory, updateCategory } from "../model/category";
import { Category } from "../model/types";
interface Initialize {
	data: Category[] | null | Category | [] | boolean;
	error: Error | null;
	loading: boolean;
}

const useCategories = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadCategories() {
		try {
			const result = await queryAllCategories();
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
		loadCategories();
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
		loadCategories,
		resetHandler
	};
};

const useQueryCategoriesByStatus = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadCategoriesByStatus(status: number) {
		try {
			const result = await queryCategoriesByStatus(status);
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
	}

	useEffect(() => {		
		loadCategoriesByStatus(1);
	}, []);

	const resetHandler = () => {
		setData({
			data: null,
			error: null,
			loading: false,
		});
	}
	const allCategory: Category = {
		color_code: '',
		category_id: -1,
		name: 'All',
		status: 1
	}

	const newData = Array.isArray(data.data) ? [allCategory, ...data.data,] : [allCategory];
		
	return {
		...data,
		data: newData,		
		resetHandler
	};
};

const useQueryCategoryById = async (category_id: number) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const results = await queryCategoryById(category_id);
				setData({
					data: results,
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
const useInsertCategory = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const insertCategoryHandler = async (
		name: string,
		status: number = 0,
		color_code : string
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await insertCategory(name, status, color_code);
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
		insertCategory: insertCategoryHandler,
		resetHandler
	};
};
const useUpdateCategory = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const updateCategoryHandler = async (
		category_id: number,
		name: string,
		status: number,
		color_code : string
	) => {
		setData((prev) => ({ ...prev, loading: true }));
		
		try {
			const result = await updateCategory(category_id, name, status, color_code);
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
		updateCategory: updateCategoryHandler,
		resetHandler
	};
};
const useDeleteCategory = () => {
	const [data, setData] = useState<{
		data: boolean;
		error: Error | null;
		loading: boolean;
	}>({
		data: false,
		error: null,
		loading: false,
	});

	const deleteCategoryHandler = async (category_id: number) => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const result = await deleteCategory(category_id);
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
		deleteCategory: deleteCategoryHandler,
		resetHandler
	};
};

export { useInsertCategory, useUpdateCategory, useQueryCategoriesByStatus, useQueryCategoryById, useDeleteCategory, updateCategory, useCategories };
