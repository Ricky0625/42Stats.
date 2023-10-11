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

const LineChartGraph = ({ options = {}, data }: GraphProps) => {
  return <Line options={options} data={data} />;
}

export default LineChartGraph