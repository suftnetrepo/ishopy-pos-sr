/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import {
	queryAllPayments,	
	queryPaymentsByDateRange,
	queryPaymentsByOrderId,
	insertPayment,
	deletePayment,
} from "../model/payments";
import { Payment } from "../model/types";

interface Initialize {
	data: Payment[] | null | Payment | [] | boolean;
	error: Error | null;
	loading: boolean;
}

const usePayments = (load: boolean) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadPayment() {
		try {
			const result = await queryAllPayments();
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

	useEffect(() => {		
		loadPayment();
	}, [load]);

	async function loadPaymentsByDateRange(startDate: Date, endDate: Date) {
		try {
			const result = await queryPaymentsByDateRange(startDate, endDate);
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

	const resetHandler = () => {
		setData({
			data: null,
			error: null,
			loading: false,
		});
	};

	return {
		...data,
		resetHandler,
		loadPaymentsByDateRange
	};
};

const usePaymentsByOrderId = (order_id: number) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const result = await queryPaymentsByOrderId(order_id);
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

const useInsertPayment = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: true,
	});

	const insertHandler = async (payment: Omit<Payment, "id">) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await insertPayment(payment);
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

const useDeletePayment = () => {
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
			const result = await deletePayment(id);
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
	useDeletePayment,
	useInsertPayment,
	usePayments,
	usePaymentsByOrderId	
};
