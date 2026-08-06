import { useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RevenueChart({ data }) {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('12m');
  const chartRef = useRef(null);

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const labels = data?.labels || [];
  const ds1 = data?.datasets?.[0]?.data || [];
  const ds2 = data?.datasets?.[1]?.data || [];
  const sliceIndex = filter === '6m' ? -6 : 0;

  const chartData = {
    labels: labels.slice(sliceIndex),
    datasets: [
      {
        label: data?.datasets?.[0]?.label || 'Receita 2025',
        data: ds1.slice(sliceIndex),
        borderColor: '#00d4ff',
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: context, chartArea } = chart;
          if (!chartArea) return 'rgba(0, 212, 255, 0.1)';
          const gradient = context.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(0, 212, 255, 0.25)');
          gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
          return gradient;
        },
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#00d4ff',
        pointHoverBorderColor: isDark ? '#0a0a0f' : '#ffffff',
        pointHoverBorderWidth: 3,
      },
      {
        label: data?.datasets?.[1]?.label || 'Receita 2024',
        data: ds2.slice(sliceIndex),
        borderColor: '#7c3aed',
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: context, chartArea } = chart;
          if (!chartArea) return 'rgba(124, 58, 237, 0.1)';
          const gradient = context.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(124, 58, 237, 0.15)');
          gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
          return gradient;
        },
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#7c3aed',
        pointHoverBorderColor: isDark ? '#0a0a0f' : '#ffffff',
        pointHoverBorderWidth: 3,
        borderDash: [5, 5],
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
          pointStyle: 'circle',
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
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed.y;
            return ` ${ctx.dataset.label}: R$ ${value.toLocaleString('pt-BR')}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor, drawBorder: false },
        ticks: {
          color: textColor,
          font: { family: 'Inter', size: 11 },
        },
        border: { display: false },
      },
      y: {
        grid: { color: gridColor, drawBorder: false },
        ticks: {
          color: textColor,
          font: { family: 'Inter', size: 11 },
          callback: (value) => `R$ ${(value / 1000).toFixed(0)}k`,
        },
        border: { display: false },
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Receita Mensal</h3>
          <p className="card-subtitle">Comparativo anual de receitas</p>
        </div>
        <div className="card-actions">
          <button className={`card-action-btn ${filter === '12m' ? 'active' : ''}`} onClick={() => setFilter('12m')}>12 Meses</button>
          <button className={`card-action-btn ${filter === '6m' ? 'active' : ''}`} onClick={() => setFilter('6m')}>6 Meses</button>
        </div>
      </div>
      <div className="chart-container">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
}
