import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
	Box,
	TextField,
	FormControl,
	Select,
	MenuItem,
	InputLabel,
	Button,
	Grid,
	Container,
	Typography,
	TextareaAutosize,
	Snackbar,
	Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const backendBaseURL = "http://127.0.0.1:8000";
const getHeader = () => ({
	"Content-Type": "application/json",
});

const EditConnection = () => {
	const { control, handleSubmit, setValue, watch } = useForm();
	const navigate = useNavigate();
	const { id } = useParams();
	const [status, setStatus] = useState("");
	const [formData, setFormData] = useState(null);
	const [notification, setNotification] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	const fetchUserDetails = async () => {
		try {
			const response = await axios.get(`${backendBaseURL}/user/details/${id}`, {
				headers: getHeader(),
			});
			const userDetails = response.data.data;

			// Set the values from the nested structure
			setValue("ID", userDetails.ID);
			setValue("Applicant_Name", userDetails.applicant_name);
			setValue("Gender", userDetails.gender);
			setValue("District", userDetails.address.district);
			setValue("State", userDetails.address.state);
			setValue("Pincode", userDetails.address.pincode);
			setValue("Ownership", userDetails.ownership);
			setValue("Category", userDetails.application.category);
			setValue("Load_Applied", userDetails.application.load_applied);
			setValue("GovtID_Type", userDetails.government_id.govt_id_type);
			setValue("ID_Number", userDetails.government_id.id_number);
			setValue(
				"Reviewer_ID",
				userDetails.application.reviews[0]?.reviewer.reviewer_id ?? ""
			);
			setValue(
				"Reviewer_Name",
				userDetails.application.reviews[0]?.reviewer.reviewer_name ?? ""
			);
			setValue(
				"Reviewer_Comments",
				userDetails.application.reviews[0]?.reviewer_comments ?? ""
			);

			setStatus(userDetails.application.status.toLowerCase());
			setFormData(userDetails);
		} catch (error) {
			console.error("Error fetching user details:", error);
			showNotification("Error fetching user details", "error");
		}
	};

	useEffect(() => {
		fetchUserDetails();
	}, [id]);

	const onSubmit = async (formData) => {
		try {
			await axios.patch(`${backendBaseURL}/user/edit/${id}/`, formData, {
				headers: getHeader(),
			});
			showNotification("Connection updated successfully", "success");
			await fetchUserDetails();
		} catch (error) {
			console.error("Error updating request:", error);
			showNotification("Error updating connection", "error");
		}
	};

	const showNotification = (message, severity) => {
		setNotification({ open: true, message, severity });
	};

	const handleCloseNotification = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setNotification({ ...notification, open: false });
	};

	const handleInputChange = (field, value) => {
		setValue(field, value);

		setFormData((prevData) => ({
			...prevData,
			[field]: value,
		}));
	};

	const statusClass = (status) => {
		const statusClasses = {
			approved: "success.main",
			pending: "warning.main",
			rejected: "error.main",
		};
		return statusClasses[status] || "text.primary";
	};

	return (
		<Container maxWidth="lg" sx={{ mb: 10 }}>
			<Box
				component="form"
				sx={{
					flexGrow: 1,
					p: 10,
					maxWidth: "80%",
					margin: "auto",
					backgroundColor: "#f9f9f9",
					boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
					borderRadius: "10px",
				}}
				onSubmit={handleSubmit(onSubmit)}
			>
				<Typography variant="h4" gutterBottom>
					{watch("Applicant_Name") || "Connection"} Details
				</Typography>
				<Grid container spacing={3}>
					<Grid item xs={12} md={8}>
						<Typography variant="h6" gutterBottom>
							Connection ID: {watch("ID")}
						</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<Controller
									name="Applicant_Name"
									control={control}
									rules={{ required: "Applicant name is required" }}
									render={({ field, fieldState: { error } }) => (
										<TextField
											{...field}
											fullWidth
											label="Applicant Name"
											InputLabelProps={{ shrink: true }}
											error={!!error}
											helperText={error?.message}
											onChange={(e) =>
												handleInputChange("Applicant_Name", e.target.value)
											}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Controller
									name="Gender"
									control={control}
									rules={{ required: "Gender is required" }}
									render={({ field, fieldState: { error } }) => (
										<FormControl fullWidth error={!!error}>
											<InputLabel>Gender</InputLabel>
											<Select
												{...field}
												value={field.value || "Gender"}
												onChange={(e) =>
													handleInputChange("Gender", e.target.value)
												}
											>
												<MenuItem value="Male">Male</MenuItem>
												<MenuItem value="Female">Female</MenuItem>
												<MenuItem value="Other">Other</MenuItem>
											</Select>
										</FormControl>
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Controller
									name="District"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											fullWidth
											InputLabelProps={{ shrink: true }}
											label="District"
											onChange={(e) =>
												handleInputChange("District", e.target.value)
											}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Controller
									name="State"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											fullWidth
											InputLabelProps={{ shrink: true }}
											label="State"
											onChange={(e) =>
												handleInputChange("State", e.target.value)
											}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Controller
									name="Pincode"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											fullWidth
											InputLabelProps={{ shrink: true }}
											label="Pincode"
											type="number"
											onChange={(e) =>
												handleInputChange("Pincode", e.target.value)
											}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Controller
									name="Ownership"
									control={control}
									render={({ field }) => (
										<FormControl fullWidth>
											<InputLabel>Ownership</InputLabel>
											<Select
												{...field}
												value={field.value || "Ownership"}
												onChange={(e) =>
													handleInputChange("Ownership", e.target.value)
												}
											>
												<MenuItem value="JOINT">Joint</MenuItem>
												<MenuItem value="INDIVIDUAL">Individual</MenuItem>
											</Select>
										</FormControl>
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Controller
									name="Category"
									control={control}
									render={({ field }) => (
										<FormControl fullWidth>
											<InputLabel>Category</InputLabel>
											<Select
												{...field}
												value={field.value || "Category"}
												onChange={(e) =>
													handleInputChange("Category", e.target.value)
												}
											>
												<MenuItem value="Commercial">Commercial</MenuItem>
												<MenuItem value="Residential">Residential</MenuItem>
											</Select>
										</FormControl>
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Controller
									name="Load_Applied"
									control={control}
									rules={{
										required: "Load Applied is required",
										min: { value: 1, message: "Must be at least 1" },
										max: { value: 200, message: "Must not exceed 200" },
									}}
									render={({ field, fieldState: { error } }) => (
										<TextField
											{...field}
											fullWidth
											label="Load Applied (KV)"
											type="number"
											InputLabelProps={{ shrink: true }}
											error={!!error}
											helperText={error?.message}
											onChange={(e) =>
												handleInputChange("Load_Applied", e.target.value)
											}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Controller
									name="GovtID_Type"
									control={control}
									render={({ field }) => (
										<FormControl fullWidth>
											<InputLabel>Govt ID Type</InputLabel>
											<Select
												readOnly
												{...field}
												value={field.value || "Govt Id Type"}
											>
												<MenuItem value="AADHAR">Aadhar</MenuItem>
												<MenuItem value="PAN">PAN</MenuItem>
												<MenuItem value="PASSPORT">Passport</MenuItem>
												<MenuItem value="VOTER_ID">Voter ID</MenuItem>
											</Select>
										</FormControl>
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Controller
									name="ID_Number"
									control={control}
									render={({ field }) => (
										<TextField
											InputProps={{ readOnly: true }}
											{...field}
											fullWidth
											InputLabelProps={{ shrink: true }}
											label="ID Number"
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Controller
									name="Reviewer_ID"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											InputProps={{ readOnly: true }}
											fullWidth
											InputLabelProps={{ shrink: true }}
											label="Reviewer ID"
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Controller
									name="Reviewer_Name"
									control={control}
									render={({ field }) => (
										<TextField
											InputProps={{ readOnly: true }}
											{...field}
											fullWidth
											InputLabelProps={{ shrink: true }}
											label="Reviewer Name"
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<Controller
									name="Reviewer_Comments"
									control={control}
									render={({ field }) => (
										<TextareaAutosize
											readOnly
											{...field}
											minRows={3}
											InputLabelProps={{ shrink: true }}
											placeholder="Reviewer Comments"
											style={{ width: "100%", padding: "10px" }}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={4}>
						<Typography variant="h6" color={statusClass(status)}>
							Status: {status.toUpperCase()}
						</Typography>

						<Box sx={{ mt: 2 }}>
							<Typography variant="subtitle1">Load Applied (in KV)</Typography>
							<Typography variant="h4">{watch("Load_Applied")}</Typography>
						</Box>
					</Grid>
				</Grid>
				<Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
					<Link to="/" style={{ textDecoration: "none" }}>
						<Button variant="outlined">Back</Button>
					</Link>
					<Button type="submit" variant="contained" color="primary">
						Update
					</Button>
				</Box>
			</Box>
			<Snackbar
				open={notification.open}
				autoHideDuration={6000}
				onClose={handleCloseNotification}
			>
				<Alert
					onClose={handleCloseNotification}
					severity={notification.severity}
					sx={{ width: "100%" }}
				>
					{notification.message}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default EditConnection;
