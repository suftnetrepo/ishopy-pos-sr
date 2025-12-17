
import { useEffect, useState } from "react";
import { queryAllTables, queryTablesByStatus, insertTable, updateTable, deleteTable, updateOccupancy, resetOccupancy } from "../model/table";
import { Table } from "../model/types";
import { set } from "@legendapp/state/src/ObservableObject";

interface Initialize {
	data: Table[] | null | Table | [] | boolean;
	error: Error | null;
	loading: boolean;
}

const useTables = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadTables() {
		try {
			const result = await queryAllTables();
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
		loadTables();
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
		loadTables,
		resetHandler,

	};
};
const useQueryTablesByStatus = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function handleOccupancy(body: any) {
		try {
			const { table_id, isOccupied, guest_count, guest_name, start_time } = body
			const result = await updateOccupancy(table_id, isOccupied, guest_count, guest_name, start_time);
			console.log('Occupancy update result:', result);

			if (result) {
				setData(prev => ({
					...prev,
					loading: false,
					error: null,
					data: Array.isArray(prev.data) ? prev.data.map(table =>
						typeof table === 'object' && 'table_id' in table && table.table_id === table_id
							? { ...table, isOccupied, guest_count, guest_name, start_time }
							: table
					) : prev.data
				}));
			}

			return true
		} catch (error) {
			setData({
				data: null,
				error: error as Error,
				loading: false,
			});
		}
	}

	async function handleResetOccupancy(table_id: string) {
		try {
			const result = await resetOccupancy(table_id);
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

	async function loadTablesByStatus(status: number) {
		try {
			const result = await queryTablesByStatus(status);
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
		loadTablesByStatus(1);
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
		handleOccupancy,
		handleResetOccupancy
	};
};
const useInsertTable = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const insertTableHandler = async (
		tableName: string,
		status: number,
		isOccupied: number,
		size: number
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await insertTable(tableName, status, isOccupied, size);
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
		insertTable: insertTableHandler,
		resetHandler
	};
};
const useUpdateTable = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const updateTableHandler = async (
		table_id: number,
		tableName: string,
		status: number,
		isOccupied: number,
		size: number
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await updateTable(table_id, tableName, status, isOccupied, size);
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
		updateTable: updateTableHandler,
		resetHandler
	};
};
const useDeleteTable = () => {
	const [data, setData] = useState<{
		data: boolean;
		error: Error | null;
		loading: boolean;
	}>({
		data: false,
		error: null,
		loading: false,
	});

	const deleteTableHandler = async (table_id: number) => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const result = await deleteTable(table_id);
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
		deleteTable: deleteTableHandler,
		resetHandler
	};
};

export { useTables, useUpdateTable, useDeleteTable, useQueryTablesByStatus, useInsertTable, updateOccupancy };
