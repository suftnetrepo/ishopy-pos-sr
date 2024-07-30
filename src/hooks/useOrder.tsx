/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { Share } from "react-native";
import {
	queryAllOrders,
	queryOrderById,
	insertOrder,
	deleteOrder,
	queryOrdersByDateRange,
} from "../model/orders";
import { Order, OrderItem, Payment } from "../model/types";
import { insertOrderItem } from "../model/orderItems";
import { useAppContext } from "./appContext";
import { insertPayment } from "../model/payments";
import { guid } from "../utils/help";
import { printReceipt } from "../utils/printReceipt";
import { updateOccupancy } from "./useTable";

interface Initialize {
	data: Order[] | null | Order | [] | boolean;
	error: Error | null;
	loading: boolean;
}

const order: Order = {
	order_id: "",
	user_id: "",
	total_price: 0,
	table_id : "",
	total: 0,
	status: "pending",
	tax: 0,
	discount: 0,
	date: new Date(),
};

const payment: Payment = {
	id: "",
	payment_method: "",
	order_id: "",
	amount: 0,
	date: new Date(),
};

const useOrders = (load: boolean) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadOrders() {
		try {
			const result = await queryAllOrders();
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
		loadOrders();
	}, [load]);

	async function loadOrdersByDateRange(startDate: Date, endDate: Date) {
		try {
			const result = await queryOrdersByDateRange(startDate, endDate);
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
		loadOrdersByDateRange,
	};
};

const useQueryOrderById = (order_id: string) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: false,
	});

	useEffect(() => {
		async function load() {
			try {
				const result = await queryOrderById(order_id);
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
		...data,
	};
};

const useInsertOrder = (table_id : string) => {
	const {
		user,
		getItems,
		getTotal,
		getTotalPrice,
		getTotalTax,
		getTotalDiscount,
		shop,
	} = useAppContext();
	const items = getItems(table_id);
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const insertHandler = async (order: Order) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await insertOrder(order);
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

	const orderHandler = async () => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			order.order_id = guid();
			order.user_id = user?.user_id;
			order.discount = getTotalDiscount(table_id) || 0;
			order.tax = getTotalTax(table_id) || 0;
			order.total = getTotal(table_id) || 0;
			order.table_id = table_id;
			order.status = "completed";
			order.total_price = getTotalPrice(table_id) || 0;

			const orderResult = await insertOrder(order);

			if (orderResult) {
				for (const item of items) {
					const orderItem: OrderItem = {
						detail_id: guid(),
						order_id: orderResult.order_id,
						price: item.price,
						menu_id: item.id,
						menu_name: item.name,
						quantity: 1,
						date: new Date(),
						addOns:
							(item.addOns || []).length > 0 ? JSON.stringify(item.addOns) : "",
					};

					await insertOrderItem(orderItem);
				}
			}

			payment.id = guid();
			payment.amount = order.total_price;
			payment.order_id = orderResult.order_id;
			payment.payment_method = "Cash";

			await insertPayment(payment);
			await updateOccupancy(table_id, 0)

			setData({
				data: orderResult,
				error: null,
				loading: false,
			});

			return true;
		} catch (error) {
			setData({
				data: null,
				error: error as Error,
				loading: false,
			});
		}
	};

	const printHandler = (table_name:string, order: Order) => {
		try {
			const receiptData = {
				name: shop?.name,
				address: shop?.address,
				phone: shop?.mobile,
				email: shop?.email,
				orderNumber: order.order_id.slice(0, 8),
				table_name: table_name,
				date: order.date,
				cashier: `${user?.first_name} ${user?.last_name}`,
				items: items.map((item) => {				
					const addOnDetails = item.addOns?.map((addOn) => ({
						quantity: addOn.quantity,
						name: addOn.addOnName,
						price: addOn.price * (addOn.quantity || 0),
					})) || [];

					return {
						quantity: item.quantity,
						name: item.name,
						price: item.price,
						addOns: addOnDetails,
					};
				}),
				subtotal: getTotal(table_id),
				tax: getTotalTax(table_id),
				discount: getTotalDiscount(table_id),
				total: getTotalPrice(table_id),
				footerMessage: "Your satisfaction is our priority. Thank you for shopping with us!",
			};

			printReceipt(receiptData);
		} catch (error) {
			setData({
				data: null,
				error: error as Error,
				loading: false,
			});
		}
	};

	const shareReceipt = async (table_name :string, order: Order) => {
		const receiptData = {
			name: shop?.name,
			address: shop?.address,
			phone: shop?.mobile,
			email: shop?.email,
			orderNumber: order.order_id.slice(0, 8),			
			date: order.date,
			cashier: `${user?.first_name} ${user?.last_name}`,
			items: items.map((item) => {
				const addOnDetails = item.addOns?.map((addOn) => ({
					quantity: addOn.quantity,
					name: addOn.addOnName,
					price: addOn.price * (addOn.quantity || 0),
				})) || [];

				return {
					quantity: item.quantity,
					name: item.name,
					price: item.price,
					addOns: addOnDetails,
				};
			}),
			subtotal: getTotal(table_id),
			tax: getTotalTax(table_id),
			discount: getTotalDiscount(table_id),
			total: getTotalPrice(table_id),
			footerMessage:
				"Your satisfaction is our priority. Thank you for shopping with us!",
		};
		const {
			name,
			address,
			phone,
			email,
			cashier,
			date,
			orderNumber,			
			subtotal,
			tax,
			total,
			footerMessage,
		} = receiptData;
		const receiptText =
			`Receipt from ${name}\n\n` +
			`Order Number: ${orderNumber}\n` +
			`Table Number: ${table_name}\n` +
			`Date: ${new Date(date).toLocaleString()}\n` +
			`Cashier: ${cashier}\n\n` +
			`Items:\n` +
			items.map((item) => {
				const itemTotal = (item.price * item.quantity).toFixed(2);
				const addOnsText = item.addOns?.map(addOn =>
					`${addOn.quantity} ${addOn.addOnName} - ${(addOn.price * (addOn.quantity || 0)).toFixed(2)}\n`
				).join('') || '';
				return `${item.quantity} ${item.name} - ${itemTotal}\n${addOnsText}`;
			}).join("") +
			`\nSubtotal: ${subtotal.toFixed(2)}\n` +
			`Tax: ${tax.toFixed(2)}\n` +
			`Total: ${total.toFixed(2)}\n\n` +
			`Address: ${address}\n` +
			`Phone: ${phone}\n` +
			`Email: ${email}\n\n` +
			`${footerMessage}`;

		try {
			const result = await Share.share({
				title: "Receipt",
				message: receiptText,
			});

			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// Shared via activity type
				} else {
					// Shared
				}
			} else if (result.action === Share.dismissedAction) {
				// Dismissed
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
	};

	return {
		...data,
		insert: insertHandler,
		orderHandler,
		resetHandler,
		printHandler,
		shareReceipt,
	};
};

const useDeleteOrder = () => {
	const [data, setData] = useState<{
		data: boolean;
		error: Error | null;
		loading: boolean;
	}>({
		data: false,
		error: null,
		loading: false,
	});

	const deleteHandler = async (order_id: string) => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const result = await deleteOrder(order_id);
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

export { useDeleteOrder, useInsertOrder, useQueryOrderById, useOrders };
