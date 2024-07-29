/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import {
	queryAllMenus,
	queryMenuByBarCode,
	queryMenuByCategory,
	queryMenuById,
	queryMenuByName,
	queryMenuByStatus,
	insertMenu,
	updateMenu,
	deleteMenu
} from "../model/menu";
import { Menu } from "../model/menu";

interface Initialize {
	data: Menu[] | null | Menu | [] | boolean;
	error: Error | null;
	loading: boolean;
}

const useMenus = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadMenus() {
		try {
			const result = await queryAllMenus();
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
		loadMenus();
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
		loadMenus
	};
};

const useQueryMenuByStatus = (status: number) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadMenuByStatus(status: number) {
		try {
			const results = await queryMenuByStatus(status);
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

	async function loadMenuByCategory(category_id: string) {
		try {
			setData((prev) => ({ ...prev, loading: true }));
			const result = category_id === "-1" ? await queryMenuByStatus(1) : await queryMenuByCategory(category_id);
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

	async function loadMenuByName(term: string) {
		try {
			setData((prev) => ({ ...prev, loading: true }));
			const result = await queryMenuByName(term);
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
		loadMenuByStatus(status);
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
		loadMenuByCategory,
		loadMenuByName
	};
};

const useQueryMenuByCategory = (category_id: string) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const results = await queryMenuByCategory(category_id);
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

const useQueryMenuById = (product_id: number) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const results = await queryMenuById(product_id);
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

const useQueryMenuByBarCode = (bar_code: string) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const results = await queryMenuByBarCode(bar_code);
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

const useInsertMenu = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const insertHandler = async (menu: Omit<Menu, "menu_id">) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await insertMenu(menu);
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

const useUpdateMenu = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const updateHandler = async (menu_id: number, menu: Menu) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await updateMenu(menu_id, menu);
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

const useDeleteMenu = () => {
	const [data, setData] = useState<{
		data: boolean;
		error: Error | null;
		loading: boolean;
	}>({
		data: false,
		error: null,
		loading: true,
	});

	const deleteHandler = async (menu_id: number) => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const result = await deleteMenu(menu_id);
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
		deleteMenu: deleteHandler,
		resetHandler
	};
};

export {
	useDeleteMenu,
	useInsertMenu,
	useQueryMenuByBarCode,
	useQueryMenuByCategory,
	useQueryMenuById,
	useQueryMenuByStatus,
	useUpdateMenu,
	useMenus,
};
