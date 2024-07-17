import { configureStore } from "@reduxjs/toolkit";
import headerReducer from "./features/headerSlice";
import dashboardReducer from "./features/dashboardSlice";

export const store = configureStore({
	reducer: {
		header: headerReducer,
		dashboard: dashboardReducer,
	},
});
