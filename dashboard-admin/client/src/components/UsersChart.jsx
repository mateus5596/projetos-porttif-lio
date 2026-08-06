import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function UsersChart({ data }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: data?.datasets?.[0]?.label || 'Novos Usuários',
        data: data?.datasets?.[0]?.data || [],
        backgroundColor: 'rgba(0, 212, 255, 0.7)',
        hoverBackgroundColor: 'rgba(0, 212, 255, 0.9)',
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
      {
        label: data?.datasets?.[1]?.label || 'Recorrentes',
        data: data?.datasets?.[1]?.data || [],
        backgroundColor: 'rgba(124, 58, 237, 0.7)',
        hoverBackgroundColor: 'rgba(124, 58, 237, 0.9)',
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: textColor,
          font: { family: 'Inter', size: 12 },
          usePointStyle: true,
          pointStyle: 'rectRounded',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(15, 15, 24, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDark ? '#e2e8f0' : '#1e293b',
        bodyColor: isDark ? '#94a3b8' : '#475569',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        titleFont: { family: 'Inter', weight: '600', size: 13 },
        bodyFont: { family: 'Inter', size: 12 },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          color: textColor,
          font: { family: 'Inter', size: 11 },
        },
        border: { display: false },
      },
      y: {
        stacked: true,
        grid: { color: gridColor, drawBorder: false },
        ticks: {
          color: textColor,
          font: { family: 'Inter', size: 11 },
          callback: (value) => `${(value / 1000).toFixed(0)}k`,
        },
        border: { display: false },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Aquisição de Usuários</h3>
          <p className="card-subtitle">Novos vs. recorrentes por mês</p>
        </div>
      </div>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
