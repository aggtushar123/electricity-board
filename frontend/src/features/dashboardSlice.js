import { createSlice } from "@reduxjs/toolkit";

const initialRange = {
	startDate: new Date("2021-02-01"),
	endDate: new Date("2021-10-12"),
};

const initialChartData = [
	{
		label: "Approved",
		data: Array(12).fill(0),
	},
	{
		label: "Pending",
		data: Array(12).fill(0),
	},
	{
		label: "Connection Released",
		data: Array(12).fill(0),
	},
	{
		label: "Rejected",
		data: Array(12).fill(0),
	},
];

export const dashboardSlice = createSlice({
	name: "dashboard",
	initialState: {
		range: initialRange,
		connectionStatus: "approved",
		chartData: initialChartData,
	},
	reducers: {
		setDateRange: (state, action) => {
			state.range = action.payload;
		},
		setConnectionStatus: (state, action) => {
			state.connectionStatus = action.payload;
		},
		setChartData: (state, action) => {
			state.chartData = action.payload;
		},
	},
});

export const { setDateRange, setConnectionStatus, setChartData } =
	dashboardSlice.actions;

export default dashboardSlice.reducer;
