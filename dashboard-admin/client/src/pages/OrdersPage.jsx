import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import { ShoppingCart, Clock, Receipt, RotateCcw } from 'lucide-react';
import StatsCard from '../components/StatsCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

const API = 'http://localhost:3001/api';

const statIcons = { totalOrders: ShoppingCart, pendingOrders: Clock, avgTicket: Receipt, returnRate: RotateCcw };
const statTypes = { totalOrders: 'revenue', pendingOrders: 'signups', avgTicket: 'conversion', returnRate: 'users' };

export default function OrdersPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState(null);
  const [byMonth, setByMonth] = useState(null);
  const [byCategory, setByCategory] = useState(null);
  const [byStatus, setByStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableFilter, setTableFilter] = useState('Todos');

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  useEffect(() => {
    Promise.all([
      fetch(`${API}/orders/stats`).then(r => r.json()),
      fetch(`${API}/orders/list`).then(r => r.json()),
      fetch(`${API}/orders/by-month`).then(r => r.json()),
      fetch(`${API}/orders/by-category`).then(r => r.json()),
      fetch(`${API}/orders/by-status`).then(r => r.json()),
    ]).then(([s, ol, bm, bc, bs]) => {
      setStats(s); setOrders(ol); setByMonth(bm); setByCategory(bc); setByStatus(bs);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="skeleton" style={{width:'100%',height:'200px'}}/></div>;

  const COLORS = ['#00d4ff', '#7c3aed', '#22c55e', '#f59e0b', '#ef4444'];

  const monthData = {
    labels: byMonth?.labels || [],
    datasets: [{
      label: 'Pedidos',
      data: byMonth?.datasets?.[0]?.data || [],
      backgroundColor: (ctx) => {
        const chart = ctx.chart;
        const { ctx: context, chartArea } = chart;
        if (!chartArea) return 'rgba(0,212,255,0.6)';
        const gradient = context.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(0,212,255,0.8)');
        gradient.addColorStop(1, 'rgba(124,58,237,0.4)');
        return gradient;
      },
      borderRadius: 8,
      borderSkipped: false,
      barPercentage: 0.6,
    }],
  };

  const catData = {
    labels: byCategory?.labels || [],
    datasets: [{
      data: byCategory?.data || [],
      backgroundColor: COLORS.slice(0, 4).map(c => `${c}cc`),
      hoverBackgroundColor: COLORS.slice(0, 4),
      borderColor: isDark ? '#0a0a0f' : '#ffffff',
      borderWidth: 3,
    }],
  };

  const getOrderStatusClass = (status) => {
    switch (status) {
      case 'Concluído': return 'active';
      case 'Processando': return 'paused';
      case 'Pendente': return 'paused';
      case 'Cancelado': return 'finished';
      case 'Reembolsado': return 'finished';
      default: return '';
    }
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
              <h3 className="card-title">Pedidos por Mês</h3>
              <p className="card-subtitle">Volume mensal de pedidos</p>
            </div>
          </div>
          <div className="chart-container">
            <Bar data={monthData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: isDark ? 'rgba(15,15,24,0.95)' : 'rgba(255,255,255,0.95)', titleColor: isDark ? '#e2e8f0' : '#1e293b', bodyColor: textColor, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: 12, cornerRadius: 12 },
              },
              scales: {
                x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Inter', size: 11 } }, border: { display: false } },
                y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter', size: 11 } }, border: { display: false } },
              },
            }} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Receita por Categoria</h3>
              <p className="card-subtitle">Distribuição por tipo de plano</p>
            </div>
          </div>
          <div style={{ height: '190px' }}>
            <Doughnut data={catData} options={{
              responsive: true, maintainAspectRatio: false, cutout: '65%',
              plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? 'rgba(15,15,24,0.95)' : 'rgba(255,255,255,0.95)', titleColor: isDark ? '#e2e8f0' : '#1e293b', bodyColor: textColor, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: 12, cornerRadius: 12, callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } } },
            }} />
          </div>
          <div className="pie-legend">
            {byCategory?.labels?.map((label, i) => (
              <div key={label} className="pie-legend-item">
                <div className="pie-legend-color" style={{ background: COLORS[i] }} />
                <span className="pie-legend-label">{label}</span>
                <span className="pie-legend-value">{byCategory.data[i]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ padding: '24px 0' }}>
        <div className="card-header" style={{ padding: '0 24px', marginBottom: '12px' }}>
          <div>
            <h3 className="card-title">Pedidos Recentes</h3>
            <p className="card-subtitle">Últimos pedidos realizados</p>
          </div>
          <div className="card-actions">
            <button className={`card-action-btn ${tableFilter === 'Todos' ? 'active' : ''}`} onClick={() => setTableFilter('Todos')}>Todos</button>
            <button className={`card-action-btn ${tableFilter === 'Pendentes' ? 'active' : ''}`} onClick={() => setTableFilter('Pendentes')}>Pendentes</button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="campaigns-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '24px' }}>ID</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Data</th>
                <th style={{ paddingRight: '24px' }}>Método</th>
              </tr>
            </thead>
            <tbody>
              {(orders || [])
                .filter(order => {
                  if (tableFilter === 'Pendentes') return order.status === 'Pendente' || order.status === 'Processando';
                  return true;
                })
                .map(order => (
                <tr key={order.id}>
                  <td style={{ paddingLeft: '24px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent-start)' }}>{order.id}</span>
                  </td>
                  <td><span className="campaign-name">{order.customer}</span></td>
                  <td>{order.product}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.amount}</td>
                  <td><span className={`status-badge ${getOrderStatusClass(order.status)}`}>{order.status}</span></td>
                  <td>{order.date}</td>
                  <td style={{ paddingRight: '24px' }}>{order.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders by Status */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Status dos Pedidos</h3>
            <p className="card-subtitle">Distribuição geral por status</p>
          </div>
        </div>
        <div className="status-bars-container">
          {byStatus?.labels?.map((label, i) => {
            const total = byStatus.data.reduce((a, b) => a + b, 0);
            const pct = ((byStatus.data[i] / total) * 100).toFixed(1);
            return (
              <div key={label} className="status-bar-item">
                <div className="status-bar-header">
                  <span className="status-bar-label">{label}</span>
                  <span className="status-bar-value">{byStatus.data[i].toLocaleString('pt-BR')} ({pct}%)</span>
                </div>
                <div className="progress-bar-container" style={{ height: '8px' }}>
                  <div className="progress-bar-fill" style={{ width: `${pct}%`, background: COLORS[i] }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
