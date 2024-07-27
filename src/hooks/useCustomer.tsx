/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import {
	queryCustomerByEmail,
	queryCustomerById,
	queryCustomerByPhone,
	queryCustomers,
	insertCustomer,
	deleteCustomer,
	updateCustomer,
} from "../model/customer";
import { Customer } from "../model/customer";

interface Initialize {
	data: Customer[] | null | Customer | [] | boolean;
	error: Error | null;
	loading: boolean;
}

const useCustomers = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const result = await queryCustomers();
				setData((prev) => ({
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
		data: data.data,
		error: data.error,
	};
};

const useQueryCustomerById = (id: number) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const result = await queryCustomerById(id);
				setData((prev) => ({
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
		data: data.data,
		error: data.error,
	};
};

const useQueryCustomerByEmail = (email: string) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const result = await queryCustomerByEmail(email);
				setData((prev) => ({
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
		data: data.data,
		error: data.error,
	};
};

const useQueryCustomerByPhone = (phone: string) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const result = await queryCustomerByPhone(phone);
				setData((prev) => ({
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
		data: data.data,
		error: data.error,
	};
};

const useInsertCustomer = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: true,
	});

	const insertHandler = async (name: string, email: string, phone: string) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await insertCustomer(name, email, phone);
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

const useUpdateCustomer = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: true,
	});

	const updateHandler = async (
		id: number,
		name: string,
		email: string,
		phone: string,
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const user = await updateCustomer(id, name, email, phone);
			setData({
				data: user,
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
		update: updateHandler,
	};
};

const useDeleteCustomer = () => {
	const [data, setData] = useState<{
		data: boolean;
		error: Error | null;
		loading: boolean;
	}>({
		data: false,
		error: null,
		loading: true,
	});

	const deleteHandler = async (id: number) => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const result = await deleteCustomer(id);
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
	useCustomers,
	useInsertCustomer,
	useDeleteCustomer,
	useUpdateCustomer,
	useQueryCustomerByEmail,
	useQueryCustomerById,
	useQueryCustomerByPhone,
};
