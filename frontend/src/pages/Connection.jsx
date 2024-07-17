import React from "react";
import SideNav from "../components/SideNav";
import Box from "@mui/material/Box";
import ConnectionList from "./connections/ConnectionList";

const Connection = () => {
	return (
		<>
			<Box height={70} />
			<Box sx={{ display: "flex" }}>
				<SideNav />
				<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
					<ConnectionList />
				</Box>
			</Box>
		</>
	);
};

export default Connection;
