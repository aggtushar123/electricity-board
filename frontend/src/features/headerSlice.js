import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	value: true, // This controls the state of the side navigation drawer
};

export const headerSlice = createSlice({
	name: "header",
	initialState,
	reducers: {
		toggleDrawer: (state) => {
			state.value = !state.value;
		},
	},
});

export const { toggleFalse, toggleTrue, toggleDrawer } = headerSlice.actions;

export default headerSlice.reducer;
