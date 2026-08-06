import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import { Megaphone, Wallet, TrendingUp, Target } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import CampaignsTable from '../components/CampaignsTable';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

const API = 'http://localhost:3001/api';

const statIcons = { activeCampaigns: Megaphone, totalSpent: Wallet, avgRoi: TrendingUp, totalLeads: Target };
const statTypes = { activeCampaigns: 'users', totalSpent: 'signups', avgRoi: 'conversion', totalLeads: 'revenue' };

export default function CampaignsPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [allCampaigns, setAllCampaigns] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [byChannel, setByChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  useEffect(() => {
    Promise.all([
      fetch(`${API}/campaigns/stats`).then(r => r.json()),
      fetch(`${API}/campaigns/all`).then(r => r.json()),
      fetch(`${API}/campaigns/performance`).then(r => r.json()),
      fetch(`${API}/campaigns/by-channel`).then(r => r.json()),
    ]).then(([s, c, p, ch]) => {
      setStats(s); setAllCampaigns(c); setPerformance(p); setByChannel(ch);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="skeleton" style={{width:'100%',height:'200px'}}/></div>;

  const COLORS = ['#00d4ff', '#7c3aed', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'];

  const perfData = {
    labels: performance?.labels || [],
    datasets: [
      {
        label: performance?.datasets?.[0]?.label || 'Investimento',
        data: performance?.datasets?.[0]?.data || [],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.08)',
        borderWidth: 2, fill: true, tension: 0.4,
        pointRadius: 4, pointHoverRadius: 7,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: isDark ? '#0a0a0f' : '#fff', pointBorderWidth: 2,
      },
      {
        label: performance?.datasets?.[1]?.label || 'Retorno',
        data: performance?.datasets?.[1]?.data || [],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.08)',
        borderWidth: 2.5, fill: true, tension: 0.4,
        pointRadius: 4, pointHoverRadius: 7,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: isDark ? '#0a0a0f' : '#fff', pointBorderWidth: 2,
      },
    ],
  };

  const channelData = {
    labels: byChannel?.labels || [],
    datasets: [{
      data: byChannel?.data || [],
      backgroundColor: COLORS.map(c => `${c}cc`),
      hoverBackgroundColor: COLORS,
      borderColor: isDark ? '#0a0a0f' : '#ffffff',
      borderWidth: 3,
    }],
  };

  return (
    <div className="dashboard-grid">
      <div className="stats-row">
        {stats && Object.entries(stats).map(([key, stat]) => (
          <StatsCard key={key} icon={statIcons[key]} stat={stat} type={statTypes[key]} />
        ))}
      </div>

      <div className="charts-row">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Investimento vs Retorno</h3>
              <p className="card-subtitle">Performance acumulada das campanhas</p>
            </div>
          </div>
          <div className="chart-container">
            <Line data={perfData} options={{
              responsive: true, maintainAspectRatio: false,
              interaction: { mode: 'index', intersect: false },
              plugins: {
                legend: { position: 'top', align: 'end', labels: { color: textColor, font: { family: 'Inter', size: 12 }, usePointStyle: true, padding: 20 } },
                tooltip: { backgroundColor: isDark ? 'rgba(15,15,24,0.95)' : 'rgba(255,255,255,0.95)', titleColor: isDark ? '#e2e8f0' : '#1e293b', bodyColor: textColor, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: 12, cornerRadius: 12, callbacks: { label: ctx => ` ${ctx.dataset.label}: R$ ${ctx.parsed.y.toLocaleString('pt-BR')}` } },
              },
              scales: {
                x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Inter', size: 11 } }, border: { display: false } },
                y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter', size: 11 }, callback: v => `R$ ${(v/1000).toFixed(0)}k` }, border: { display: false } },
              },
            }} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Canais de Marketing</h3>
              <p className="card-subtitle">Distribuição do investimento</p>
            </div>
          </div>
          <div style={{ height: '190px' }}>
            <Doughnut data={channelData} options={{
              responsive: true, maintainAspectRatio: false, cutout: '65%',
              plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? 'rgba(15,15,24,0.95)' : 'rgba(255,255,255,0.95)', titleColor: isDark ? '#e2e8f0' : '#1e293b', bodyColor: textColor, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: 12, cornerRadius: 12, callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } } },
            }} />
          </div>
          <div className="pie-legend">
            {byChannel?.labels?.map((label, i) => (
              <div key={label} className="pie-legend-item">
                <div className="pie-legend-color" style={{ background: COLORS[i] }} />
                <span className="pie-legend-label">{label}</span>
                <span className="pie-legend-value">{byChannel.data[i]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CampaignsTable campaigns={allCampaigns} />
    </div>
  );
}
