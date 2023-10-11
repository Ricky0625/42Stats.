import { Bar } from "react-chartjs-2"
import { GraphProps } from "./GraphData"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

const options = {
  responsive: true,
  fill: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      onClick: () => { },
    },
  },
}

const BarChartGraph = ({ data }: GraphProps) => {
  return <Bar options={options} data={data} />
}

export default BarChartGraph