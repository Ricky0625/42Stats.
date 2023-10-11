import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { GraphProps } from './GraphData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const optionsDef = {
  responsive: true,
  fill: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
}

const LineChartGraph = ({ options = optionsDef, data }: GraphProps) => {
  return <Line options={options} data={data} />;
}

export default LineChartGraph