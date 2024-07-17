import React from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

const Charts = () => {
	const chartData = useSelector((state) => state.dashboard.chartData);

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

	const data = {
		datasets: chartData.map((statusData) => ({
			label: statusData.label,
			data: statusData.data,
			borderColor: "rgb(75, 192, 192)",
			backgroundColor: "rgba(75, 192, 192, 0.2)",
		})),
		labels: months,
	};

	ChartJS.register(
		CategoryScale,
		LinearScale,
		BarElement,
		Title,
		Tooltip,
		Legend
	);

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: "Monthly Connection Request",
			},
		},
	};

	return (
		<div>
			<Bar options={options} data={data} />
		</div>
	);
};

export default Charts;
