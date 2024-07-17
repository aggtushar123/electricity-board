import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import SideNav from "../components/SideNav";
import Box from "@mui/material/Box";
import Charts from "../components/Charts";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import DatePicker from "react-datepicker";
import {
	setDateRange,
	setConnectionStatus,
	setChartData,
} from "../features/dashboardSlice";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const Home = () => {
	const range = useSelector((state) => state.dashboard.range);
	const connectionStatus = useSelector(
		(state) => state.dashboard.connectionStatus
	);
	const dispatch = useDispatch();

	const [open, setOpen] = useState(true);
	const refOne = useRef(null);

	useEffect(() => {
		document.addEventListener("keydown", hideOnEscape, true);
		document.addEventListener("click", hideOnClickOutside, true);

		return () => {
			document.removeEventListener("keydown", hideOnEscape, true);
			document.removeEventListener("click", hideOnClickOutside, true);
		};
	}, []);

	const hideOnEscape = (e) => {
		if (e.key === "Escape") {
			setOpen(false);
		}
	};

	const hideOnClickOutside = (e) => {
		if (refOne.current && !refOne.current.contains(e.target)) {
			setOpen(false);
		}
	};

	const fetchDashboardData = async (e) => {
		e.preventDefault();

		const requestData = {
			startMonth: range.startDate.getMonth() + 1,
			startYear: range.startDate.getFullYear(),
			endMonth: range.endDate.getMonth() + 1,
			endYear: range.endDate.getFullYear(),
			status: connectionStatus,
		};

		try {
			const response = await axios.post(
				"http://127.0.0.1:8000/user/dashboard/",
				requestData
			);
			console.log(response.data);
			const filteredData = response.data.data;

			const months = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];

			const chartData = {
				label: response.data.label,
				data: months.map((month, index) => {
					const monthData = filteredData.find((item) => item.month === month);
					return monthData ? monthData.count : 0;
				}),
			};

			dispatch(setChartData([chartData]));
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
		}
	};

	return (
		<>
			<Box height={30} />
			<Box sx={{ display: "flex" }}>
				<Box width="70%" pl={30} pt={10}>
					<SideNav />
					<Box sx={{ flexGrow: 1, p: 5 }}>
						<Charts />
					</Box>
				</Box>
				<Box width="30%" pt={20}>
					<Box sx={{ p: 2 }}>
						<h2>Filter</h2>
						<form onSubmit={fetchDashboardData}>
							<div className="calendarWrap">
								<div ref={refOne}>
									<DatePicker
										selected={range.startDate}
										onChange={(date) =>
											dispatch(setDateRange({ ...range, startDate: date }))
										}
										selectsStart
										startDate={range.startDate}
										endDate={range.endDate}
										placeholderText="Start Date"
										className="calendarElement"
									/>

									<DatePicker
										selected={range.endDate}
										onChange={(date) =>
											dispatch(setDateRange({ ...range, endDate: date }))
										}
										selectsEnd
										startDate={range.startDate}
										endDate={range.endDate}
										placeholderText="End Date"
										minDate={range.startDate}
										className="calendarElement"
									/>
								</div>
							</div>
							<FormControl component="fieldset" sx={{ mt: 2 }}>
								<FormLabel>Select Connection Status</FormLabel>
								<RadioGroup
									row
									aria-labelledby="connection-status-radio-buttons-group-label"
									name="connection-status-radio-buttons-group"
									value={connectionStatus}
									onChange={(e) =>
										dispatch(setConnectionStatus(e.target.value))
									}
								>
									<FormControlLabel
										value="Approved"
										control={<Radio />}
										label="Approved"
									/>
									<FormControlLabel
										value="Pending"
										control={<Radio />}
										label="Pending"
									/>
									<FormControlLabel
										value="Connection Released"
										control={<Radio />}
										label="Connection Released"
									/>
									<FormControlLabel
										value="Rejected"
										control={<Radio />}
										label="Rejected"
									/>
								</RadioGroup>
							</FormControl>
							<Button type="submit" variant="contained" sx={{ mt: 2 }}>
								Apply
							</Button>
						</form>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default Home;
