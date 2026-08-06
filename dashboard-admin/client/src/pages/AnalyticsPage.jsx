import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import {
  Eye, TrendingDown, Clock, Layers,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import StatsCard from '../components/StatsCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

const API = 'http://localhost:3001/api';

const statIcons = {
  pageViews: Eye,
  bounceRate: TrendingDown,
  avgSession: Clock,
  pagesPerSession: Layers,
};
const statTypes = {
  pageViews: 'revenue',
  bounceRate: 'signups',
  avgSession: 'users',
  pagesPerSession: 'conversion',
};

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [sources, setSources] = useState(null);
  const [pageviews, setPageviews] = useState(null);
  const [topPages, setTopPages] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [hourly, setHourly] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  useEffect(() => {
    Promise.all([
      fetch(`${API}/analytics/stats`).then(r => r.json()),
      fetch(`${API}/analytics/traffic-sources`).then(r => r.json()),
      fetch(`${API}/analytics/pageviews`).then(r => r.json()),
      fetch(`${API}/analytics/top-pages`).then(r => r.json()),
      fetch(`${API}/analytics/funnel`).then(r => r.json()),
      fetch(`${API}/analytics/hourly`).then(r => r.json()),
    ]).then(([s, src, pv, tp, fn, hr]) => {
      setStats(s); setSources(src); setPageviews(pv);
      setTopPages(tp); setFunnel(fn); setHourly(hr);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="skeleton" style={{width:'100%',height:'200px'}}/></div>;

  const COLORS = ['#00d4ff','#7c3aed','#22c55e','#f59e0b','#ef4444','#ec4899'];

  const sourceChartData = {
    labels: sources?.labels || [],
    datasets: [{
      data: sources?.data || [],
      backgroundColor: COLORS.map(c => `${c}cc`),
      hoverBackgroundColor: COLORS,
      borderColor: isDark ? '#0a0a0f' : '#ffffff',
      borderWidth: 3,
      hoverOffset: 8,
    }],
  };

  const pvChartData = {
    labels: pageviews?.labels || [],
    datasets: [
      {
        label: pageviews?.datasets?.[0]?.label || '',
        data: pageviews?.datasets?.[0]?.data || [],
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0,212,255,0.1)',
        borderWidth: 2.5, fill: true, tension: 0.4,
        pointRadius: 4, pointHoverRadius: 7,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: isDark ? '#0a0a0f' : '#fff',
        pointBorderWidth: 2,
      },
      {
        label: pageviews?.datasets?.[1]?.label || '',
        data: pageviews?.datasets?.[1]?.data || [],
        borderColor: '#7c3aed',
        backgroundColor: 'transparent',
        borderWidth: 2, fill: false, tension: 0.4,
        pointRadius: 0, borderDash: [5, 5],
      },
    ],
  };

  const hourlyData = {
    labels: hourly?.labels || [],
    datasets: [{
      label: 'Acessos',
      data: hourly?.data || [],
      backgroundColor: (ctx) => {
        const chart = ctx.chart;
        const { ctx: context, chartArea } = chart;
        if (!chartArea) return 'rgba(0,212,255,0.5)';
        const gradient = context.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(0,212,255,0.8)');
        gradient.addColorStop(1, 'rgba(124,58,237,0.3)');
        return gradient;
      },
      borderRadius: 4,
      borderSkipped: false,
      barPercentage: 0.7,
    }],
  };

  const maxFunnel = funnel?.[0]?.value || 1;

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
              <h3 className="card-title">Visualizações por Dia</h3>
              <p className="card-subtitle">Comparativo semanal</p>
            </div>
          </div>
          <div className="chart-container">
            <Line data={pvChartData} options={{
              responsive: true, maintainAspectRatio: false,
              interaction: { mode: 'index', intersect: false },
              plugins: {
                legend: { position: 'top', align: 'end', labels: { color: textColor, font: { family: 'Inter', size: 12 }, usePointStyle: true, padding: 20 } },
                tooltip: { backgroundColor: isDark ? 'rgba(15,15,24,0.95)' : 'rgba(255,255,255,0.95)', titleColor: isDark ? '#e2e8f0' : '#1e293b', bodyColor: textColor, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderWidth: 1, padding: 12, cornerRadius: 12 },
              },
              scales: {
                x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Inter', size: 11 } }, border: { display: false } },
                y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter', size: 11 }, callback: v => `${(v/1000).toFixed(0)}k` }, border: { display: false } },
              },
            }} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Fontes de Tráfego</h3>
              <p className="card-subtitle">Distribuição de origens</p>
            </div>
          </div>
          <div style={{ height: '190px' }}>
            <Doughnut data={sourceChartData} options={{
              responsive: true, maintainAspectRatio: false, cutout: '65%',
              plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? 'rgba(15,15,24,0.95)' : 'rgba(255,255,255,0.95)', titleColor: isDark ? '#e2e8f0' : '#1e293b', bodyColor: textColor, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: 12, cornerRadius: 12, callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } } },
            }} />
          </div>
          <div className="pie-legend">
            {sources?.labels?.map((label, i) => (
              <div key={label} className="pie-legend-item">
                <div className="pie-legend-color" style={{ background: COLORS[i] }} />
                <span className="pie-legend-label">{label}</span>
                <span className="pie-legend-value">{sources.data[i]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Traffic */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Tráfego por Hora</h3>
            <p className="card-subtitle">Distribuição de acessos ao longo do dia</p>
          </div>
        </div>
        <div className="chart-container">
          <Bar data={hourlyData} options={{
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? 'rgba(15,15,24,0.95)' : 'rgba(255,255,255,0.95)', titleColor: isDark ? '#e2e8f0' : '#1e293b', bodyColor: textColor, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: 12, cornerRadius: 12 } },
            scales: {
              x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Inter', size: 10 }, maxRotation: 0 }, border: { display: false } },
              y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter', size: 11 } }, border: { display: false } },
            },
          }} />
        </div>
      </div>

      <div className="bottom-row">
        {/* Top Pages Table */}
        <div className="card" style={{ padding: '24px 0' }}>
          <div className="card-header" style={{ padding: '0 24px', marginBottom: '12px' }}>
            <div>
              <h3 className="card-title">Páginas Mais Visitadas</h3>
              <p className="card-subtitle">Top páginas por visualizações</p>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="campaigns-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>Página</th>
                  <th>Visualizações</th>
                  <th>Únicos</th>
                  <th>Tempo Médio</th>
                  <th style={{ paddingRight: '24px' }}>Rejeição</th>
                </tr>
              </thead>
              <tbody>
                {topPages?.map((page, i) => (
                  <tr key={i}>
                    <td style={{ paddingLeft: '24px' }}>
                      <div>
                        <span className="campaign-name">{page.title}</span>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{page.path}</div>
                      </div>
                    </td>
                    <td>{page.views.toLocaleString('pt-BR')}</td>
                    <td>{page.unique.toLocaleString('pt-BR')}</td>
                    <td>{page.avgTime}</td>
                    <td style={{ paddingRight: '24px' }}>{page.bounceRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Funil de Conversão</h3>
              <p className="card-subtitle">Jornada do usuário</p>
            </div>
          </div>
          <div className="funnel-container">
            {funnel?.map((step, i) => (
              <div key={step.stage} className="funnel-step" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="funnel-bar-wrapper">
                  <div
                    className="funnel-bar"
                    style={{
                      width: `${(step.value / maxFunnel) * 100}%`,
                      background: step.color,
                    }}
                  />
                </div>
                <div className="funnel-info">
                  <span className="funnel-stage">{step.stage}</span>
                  <span className="funnel-value">{step.value.toLocaleString('pt-BR')}</span>
                </div>
                {i < funnel.length - 1 && (
                  <div className="funnel-conversion-rate">
                    {((funnel[i + 1].value / step.value) * 100).toFixed(1)}%
                    <ArrowDownRight size={12} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
