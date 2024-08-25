import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChart({ data, labels, dataLabels }) {
  let colors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
  ];

  return (
    <Doughnut
      data={{
        labels: [...labels],
        datasets: [
          {
            label: "Solicitudes",
            data: [...data],
            backgroundColor: [
              ...colors
                .filter((item, index) => index <= data.length - 1)
                .map((item) => item),
            ],

            // borderColor: [
            //   "rgba(255, 99, 132, 1)",
            //   "rgba(54, 162, 235, 1)",
            //   "rgba(255, 206, 86, 1)",
            //   "rgba(75, 192, 192, 1)",
            //   "rgba(153, 102, 255, 1)",
            //   "rgba(255, 159, 64, 1)",
            // ],
            borderWidth: 1,
          },
        ],
      }}
      options={{
        font: {
          family: "Poppins",
        },
        animation: {
          duration: 1000,
        },
        plugins: {
          tooltip: {
            callbacks: {
              afterLabel: function (data) {
                let percent =
                  (data.dataset.data[data.dataIndex] /
                    data.dataset.data.reduce(
                      (acc, item) => acc + parseFloat(item || 0),
                      0
                    )) *
                  100;

                return `${percent.toFixed(2)}%`;
              },
            },
          },
        },
      }}
    />
  );
}

export { DoughnutChart };
