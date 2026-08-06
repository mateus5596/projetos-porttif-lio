import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import { FileText, CalendarClock, Download, CheckCircle2, FileDown, Eye } from 'lucide-react';
import StatsCard from '../components/StatsCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend);

const API = 'http://localhost:3001/api';

const statIcons = { generatedReports: FileText, scheduledReports: CalendarClock, avgDownloads: Download, dataAccuracy: CheckCircle2 };
const statTypes = { generatedReports: 'revenue', scheduledReports: 'users', avgDownloads: 'conversion', dataAccuracy: 'signups' };

export default function ReportsPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartFilter, setChartFilter] = useState('8m');
  const [tableFilter, setTableFilter] = useState('Todos');

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  useEffect(() => {
    Promise.all([
      fetch(`${API}/reports/stats`).then(r => r.json()),
      fetch(`${API}/reports/list`).then(r => r.json()),
      fetch(`${API}/reports/revenue`).then(r => r.json()),
    ]).then(([s, rl, rv]) => {
      setStats(s); setReports(rl); setRevenue(rv);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="skeleton" style={{width:'100%',height:'200px'}}/></div>;

  const COLORS_LINES = ['#00d4ff', '#22c55e', '#ef4444'];

  const sliceIndex = chartFilter === '8m' ? -8 : 0;
  const labels = revenue?.labels || [];

  const revenueChartData = {
    labels: labels.slice(sliceIndex),
    datasets: (revenue?.datasets || []).map((ds, i) => ({
      label: ds.label,
      data: ds.data.slice(sliceIndex),
      borderColor: COLORS_LINES[i],
      backgroundColor: i === 0 ? 'rgba(0,212,255,0.06)' : 'transparent',
      borderWidth: i === 0 ? 2.5 : 2,
      fill: i === 0,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 7,
      pointBackgroundColor: COLORS_LINES[i],
      pointBorderColor: isDark ? '#0a0a0f' : '#fff',
      pointBorderWidth: 2,
      borderDash: i === 2 ? [5, 5] : [],
    })),
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Financeiro': return { background: 'rgba(0,212,255,0.12)', color: '#00d4ff' };
      case 'Marketing': return { background: 'rgba(124,58,237,0.12)', color: '#7c3aed' };
      case 'Usuários': return { background: 'rgba(34,197,94,0.12)', color: '#22c55e' };
      case 'Executivo': return { background: 'rgba(245,158,11,0.12)', color: '#f59e0b' };
      default: return { background: 'var(--bg-input)', color: 'var(--text-muted)' };
    }
  };

  return (
    <div className="dashboard-grid">
      <div className="stats-row">
        {stats && Object.entries(stats).map(([key, stat]) => (
          <StatsCard key={key} icon={statIcons[key]} stat={stat} type={statTypes[key]} />
        ))}
      </div>

      {/* Revenue Breakdown */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Receita Bruta vs Líquida vs Custos</h3>
            <p className="card-subtitle">Análise financeira consolidada</p>
          </div>
          <div className="card-actions">
            <button className={`card-action-btn ${chartFilter === '8m' ? 'active' : ''}`} onClick={() => setChartFilter('8m')}>8 Meses</button>
            <button className={`card-action-btn ${chartFilter === 'Anual' ? 'active' : ''}`} onClick={() => setChartFilter('Anual')}>Anual</button>
          </div>
        </div>
        <div className="chart-container">
          <Line data={revenueChartData} options={{
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

      {/* Reports Table */}
      <div className="card" style={{ padding: '24px 0' }}>
        <div className="card-header" style={{ padding: '0 24px', marginBottom: '12px' }}>
          <div>
            <h3 className="card-title">Relatórios Disponíveis</h3>
            <p className="card-subtitle">Histórico de relatórios gerados</p>
          </div>
          <div className="card-actions">
            <button className={`card-action-btn ${tableFilter === 'Todos' ? 'active' : ''}`} onClick={() => setTableFilter('Todos')}>Todos</button>
            <button className={`card-action-btn ${tableFilter === 'Financeiro' ? 'active' : ''}`} onClick={() => setTableFilter('Financeiro')}>Financeiro</button>
            <button className={`card-action-btn ${tableFilter === 'Marketing' ? 'active' : ''}`} onClick={() => setTableFilter('Marketing')}>Marketing</button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="campaigns-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '24px' }}>Nome do Relatório</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Tamanho</th>
                <th>Status</th>
                <th>Downloads</th>
                <th style={{ paddingRight: '24px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {(reports || [])
                .filter(report => {
                  if (tableFilter === 'Financeiro') return report.type === 'Financeiro';
                  if (tableFilter === 'Marketing') return report.type === 'Marketing';
                  return true;
                })
                .map(report => (
                <tr key={report.id}>
                  <td style={{ paddingLeft: '24px' }}>
                    <span className="campaign-name">{report.name}</span>
                  </td>
                  <td>
                    <span style={{ ...getTypeColor(report.type), padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                      {report.type}
                    </span>
                  </td>
                  <td>{report.created}</td>
                  <td>{report.size}</td>
                  <td>
                    <span className={`status-badge ${report.status === 'Pronto' ? 'active' : 'paused'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>{report.downloads}</td>
                  <td style={{ paddingRight: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="report-action-btn" title="Download">
                        <FileDown size={16} />
                      </button>
                      <button className="report-action-btn" title="Visualizar">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
