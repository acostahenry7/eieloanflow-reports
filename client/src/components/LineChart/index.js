import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function LineChart({ data, dataLabels }) {
  return (
    <Line
      data={{
        labels: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
        datasets: [
          {
            label: dataLabels[0],
            data: data,
            fill: true,
            borderColor: "rgb(75, 192, 192)",
            pointHoverBorderWidth: 5,
            tension: 0.3,
          },
        ],
      }}
      height={"100px"}
      options={{
        maintainAspectRatio: false,
        scales: {
          // x: {
          //   grid: {
          //     display: false,
          //   },
          // },
          // y: {
          //   grid: {
          //     display: false,
          //   },
          // },
        },
      }}
    />
  );
}

export { LineChart };
