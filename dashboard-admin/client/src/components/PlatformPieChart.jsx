import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#00d4ff', '#7c3aed', '#22c55e', '#f59e0b'];

export default function PlatformPieChart({ data }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        data: data?.data || [],
        backgroundColor: COLORS.map((c) => `${c}cc`),
        hoverBackgroundColor: COLORS,
        borderColor: isDark ? '#0a0a0f' : '#ffffff',
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
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
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
        },
      },
    },
    animation: {
      animateRotate: true,
      duration: 1200,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Receita por Plataforma</h3>
          <p className="card-subtitle">Distribuição de acessos</p>
        </div>
      </div>

      <div style={{ height: '200px', position: 'relative' }}>
        <Doughnut data={chartData} options={options} />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {data?.data?.reduce((a, b) => a + b, 0) || 0}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
            Total
          </div>
        </div>
      </div>

      <div className="pie-legend">
        {(data?.labels || []).map((label, i) => (
          <div key={label} className="pie-legend-item">
            <div className="pie-legend-color" style={{ background: COLORS[i] }} />
            <span className="pie-legend-label">{label}</span>
            <span className="pie-legend-value">{data?.data?.[i]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
