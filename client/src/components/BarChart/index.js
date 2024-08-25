import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement
);

function BarChart({ data, dataLabels }) {
  return (
    <Bar
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
            data: data[0],
            fill: false,
            borderColor: "pink",
            backgroundColor: "pink",
            tension: 0.3,
          },
          {
            label: dataLabels[1],
            data: data[1],
            fill: false,
            borderColor: "aliceblue",
            backgroundColor: "#7ec5f4",
            tension: 0.3,
          },
        ],
      }}
      height={"100px"}
      options={{
        maintainAspectRatio: false,
      }}
    />
  );
}

export { BarChart };
