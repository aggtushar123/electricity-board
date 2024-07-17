import React, { useState, useEffect, useCallback } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const columns = [
	{ id: "applicant_name", label: "Applicant Name", minWidth: 170 },
	{ id: "reviewer_name", label: "Reviewer Name", minWidth: 100 },
	{
		id: "date_of_application",
		label: "Application Date",
		minWidth: 100,
		align: "center",
		format: (value) => new Date(value).toLocaleDateString("en-US"),
	},
	{
		id: "status",
		label: "Status",
		minWidth: 170,
		align: "center",
	},
	{
		id: "edit_details",
		label: "Edit Details",
		minWidth: 170,
		align: "center",
	},
];

const ConnectionList = () => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [search, setSearch] = useState("");
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [appliedStartDate, setAppliedStartDate] = useState(null);
	const [appliedEndDate, setAppliedEndDate] = useState(null);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get("http://127.0.0.1:8000/user/list/");
				const responseData = response.data.data;

				const transformedData = responseData.map((item) => ({
					applicant_id: item.ID,
					applicant_name: item.applicant_name,
					reviewer_name:
						item.application?.reviews[0]?.reviewer?.reviewer_name ?? "N/A",
					date_of_application: item.application?.date_of_application,
					status: item.application?.status ?? "N/A",
				}));

				setData(transformedData);
				setLoading(false);
			} catch (err) {
				setError(err);
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const handleEdit = (id) => {
		navigate(`/editconnection/${id}`);
	};

	const handleApply = () => {
		setAppliedStartDate(startDate);
		setAppliedEndDate(endDate);
		setPage(0);
	};
	console.log(data);
	const filteredRows = useCallback(() => {
		return data.filter((row) => {
			const applicationDate = new Date(row.date_of_application);
			const matchesApplicantId = search
				? row.applicant_id.toString().includes(search)
				: true;
			const matchesDateRange =
				(!appliedStartDate || applicationDate >= appliedStartDate) &&
				(!appliedEndDate || applicationDate <= appliedEndDate);
			return matchesApplicantId && matchesDateRange;
		});
	}, [search, appliedStartDate, appliedEndDate, data]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error fetching data: {error.message}</div>;

	return (
		<Paper sx={{ width: "100%", overflow: "hidden" }}>
			<Typography
				gutterBottom
				variant="h5"
				component="div"
				sx={{ padding: "20px" }}
			>
				Connection List
			</Typography>

			<div
				style={{
					padding: "0 20px 20px 400px",
					display: "flex",
					alignItems: "center",
					zIndex: 1,
				}}
			>
				<TextField
					label="Search by Applicant ID"
					variant="outlined"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					sx={{ marginRight: "20px" }}
				/>
				<DatePicker
					selected={startDate}
					onChange={(date) => setStartDate(date)}
					selectsStart
					startDate={startDate}
					endDate={endDate}
					placeholderText="Start Date"
					style={{ marginRight: "120px" }}
				/>
				<DatePicker
					selected={endDate}
					onChange={(date) => setEndDate(date)}
					selectsEnd
					startDate={startDate}
					endDate={endDate}
					placeholderText="End Date"
					minDate={startDate}
				/>
				<Button
					variant="contained"
					onClick={handleApply}
					sx={{ marginLeft: "20px" }}
				>
					Apply
				</Button>
			</div>
			<TableContainer sx={{ maxHeight: 440, position: "relative", zIndex: 0 }}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{ minWidth: column.minWidth }}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredRows()
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => {
								return (
									<TableRow
										hover
										role="checkbox"
										tabIndex={-1}
										key={row.applicant_id}
									>
										{columns.map((column) => {
											const value = row[column.id];
											return (
												<TableCell key={column.id} align={column.align}>
													{column.id === "edit_details" ? (
														<Button
															variant="contained"
															onClick={() => handleEdit(row.applicant_id)}
														>
															Edit
														</Button>
													) : column.format && typeof value === "number" ? (
														column.format(value)
													) : (
														value
													)}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={filteredRows().length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};

export default ConnectionList;
