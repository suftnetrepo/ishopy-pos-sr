/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import {
	queryAllProducts,
	queryProductByBarCode,
	queryProductByCategory,
	queryProductById,
	queryProductByStatus,
	insertProduct,
	updateProduct,
	deleteProduct,
	queryProductByName
} from "../model/product";
import { Product } from "../model/product";

interface Initialize {
	data: Product[] | null | Product | [] | boolean;
	error: Error | null;
	loading: boolean;
}

const useProducts = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadProducts() {
		try {
			const result = await queryAllProducts();
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
		loadProducts();
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
		resetHandler,
		loadProducts
	};
};

const useQueryProductByStatus = (status: number) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadProductByStatus(status: number) {
		try {
			const results = await queryProductByStatus(status);
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

	async function loadProductByCategory(category_id: number) {
		try {
			setData((prev) => ({ ...prev, loading: true }));
			const result = category_id === -1 ? await queryProductByStatus(1) : await queryProductByCategory(category_id);
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
	}

	async function loadProductByName(term: string) {
		try {
			setData((prev) => ({ ...prev, loading: true }));
			const result = await queryProductByName(term);
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
	}

	useEffect(() => {
		loadProductByStatus(status);
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
		resetHandler,
		loadProductByCategory,
		loadProductByName
	};
};

const useQueryProductByCategory = (category_id: number) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const results = await queryProductByCategory(category_id);
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

const useQueryProductById = (product_id: number) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const results = await queryProductById(product_id);
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

const useQueryProductByBarCode = (bar_code: string) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const results = await queryProductByBarCode(bar_code);
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

const useInsertProduct = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const insertHandler = async (product: Omit<Product, "product_id">) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await insertProduct(product);
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

const useUpdateProduct = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const updateHandler = async (product_id: number, product: Product) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const user = await updateProduct(product_id, product);
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

const useDeleteProduct = () => {
	const [data, setData] = useState<{
		data: boolean;
		error: Error | null;
		loading: boolean;
	}>({
		data: false,
		error: null,
		loading: true,
	});

	const deleteHandler = async (product_id: number) => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const result = await deleteProduct(product_id);
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
		deleteProduct: deleteHandler,
		resetHandler
	};
};

export {
	useProducts,
	useQueryProductByStatus,
	useDeleteProduct,
	useInsertProduct,
	useQueryProductByBarCode,
	useQueryProductByCategory,
	useQueryProductById,
	useUpdateProduct,
};
