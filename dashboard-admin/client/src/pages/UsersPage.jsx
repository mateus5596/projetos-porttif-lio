import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import { Users, UserCheck, Crown, UserMinus } from 'lucide-react';
import StatsCard from '../components/StatsCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

const API = 'http://localhost:3001/api';

const statIcons = { totalUsers: Users, activeToday: UserCheck, premiumUsers: Crown, churnRate: UserMinus };
const statTypes = { totalUsers: 'users', activeToday: 'revenue', premiumUsers: 'conversion', churnRate: 'signups' };

export default function UsersPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState(null);
  const [byPlan, setByPlan] = useState(null);
  const [growth, setGrowth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableFilter, setTableFilter] = useState('Todos');

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  useEffect(() => {
    Promise.all([
      fetch(`${API}/users/stats`).then(r => r.json()),
      fetch(`${API}/users/list`).then(r => r.json()),
      fetch(`${API}/users/by-plan`).then(r => r.json()),
      fetch(`${API}/users/growth`).then(r => r.json()),
    ]).then(([s, ul, bp, g]) => {
      setStats(s); setUsersList(ul); setByPlan(bp); setGrowth(g);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="skeleton" style={{width:'100%',height:'200px'}}/></div>;

  const PLAN_COLORS = ['#64748b', '#00d4ff', '#7c3aed'];

  const growthData = {
    labels: growth?.labels || [],
    datasets: [{
      label: 'Total de Usuários',
      data: growth?.data || [],
      borderColor: '#00d4ff',
      backgroundColor: (ctx) => {
        const chart = ctx.chart;
        const { ctx: context, chartArea } = chart;
        if (!chartArea) return 'rgba(0,212,255,0.1)';
        const gradient = context.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(0,212,255,0.2)');
        gradient.addColorStop(1, 'rgba(0,212,255,0)');
        return gradient;
      },
      borderWidth: 2.5, fill: true, tension: 0.4,
      pointRadius: 4, pointHoverRadius: 7,
      pointBackgroundColor: '#00d4ff',
      pointBorderColor: isDark ? '#0a0a0f' : '#fff',
      pointBorderWidth: 2,
    }],
  };

  const planData = {
    labels: byPlan?.labels || [],
    datasets: [{
      data: byPlan?.data || [],
      backgroundColor: PLAN_COLORS.map(c => `${c}cc`),
      hoverBackgroundColor: PLAN_COLORS,
      borderColor: isDark ? '#0a0a0f' : '#ffffff',
      borderWidth: 3,
    }],
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Ativo': return 'active';
      case 'Inativo': return 'paused';
      case 'Suspenso': return 'finished';
      default: return '';
    }
  };

  const getPlanStyle = (plan) => {
    switch (plan) {
      case 'Enterprise': return { background: 'rgba(124,58,237,0.15)', color: '#7c3aed' };
      case 'Pro': return { background: 'rgba(0,212,255,0.15)', color: '#00d4ff' };
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

      <div className="charts-row">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Crescimento de Usuarios</h3>
              <p className="card-subtitle">Total acumulado por mês</p>
            </div>
          </div>
          <div className="chart-container">
            <Line data={growthData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: isDark ? 'rgba(15,15,24,0.95)' : 'rgba(255,255,255,0.95)', titleColor: isDark ? '#e2e8f0' : '#1e293b', bodyColor: textColor, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: 12, cornerRadius: 12, callbacks: { label: ctx => ` ${ctx.parsed.y.toLocaleString('pt-BR')} usuários` } },
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
              <h3 className="card-title">Usuários por Plano</h3>
              <p className="card-subtitle">Distribuição atual</p>
            </div>
          </div>
          <div style={{ height: '190px' }}>
            <Doughnut data={planData} options={{
              responsive: true, maintainAspectRatio: false, cutout: '65%',
              plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? 'rgba(15,15,24,0.95)' : 'rgba(255,255,255,0.95)', titleColor: isDark ? '#e2e8f0' : '#1e293b', bodyColor: textColor, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: 12, cornerRadius: 12, callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed.toLocaleString('pt-BR')}` } } },
            }} />
          </div>
          <div className="pie-legend">
            {byPlan?.labels?.map((label, i) => (
              <div key={label} className="pie-legend-item">
                <div className="pie-legend-color" style={{ background: PLAN_COLORS[i] }} />
                <span className="pie-legend-label">{label}</span>
                <span className="pie-legend-value">{byPlan.data[i].toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: '24px 0' }}>
        <div className="card-header" style={{ padding: '0 24px', marginBottom: '12px' }}>
          <div>
            <h3 className="card-title">Lista de Usuários</h3>
            <p className="card-subtitle">Gerenciar usuários da plataforma</p>
          </div>
          <div className="card-actions">
            <button className={`card-action-btn ${tableFilter === 'Todos' ? 'active' : ''}`} onClick={() => setTableFilter('Todos')}>Todos</button>
            <button className={`card-action-btn ${tableFilter === 'Ativos' ? 'active' : ''}`} onClick={() => setTableFilter('Ativos')}>Ativos</button>
            <button className={`card-action-btn ${tableFilter === 'Premium' ? 'active' : ''}`} onClick={() => setTableFilter('Premium')}>Premium</button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="campaigns-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '24px' }}>Usuário</th>
                <th>Plano</th>
                <th>Status</th>
                <th>Cadastro</th>
                <th>Último Acesso</th>
                <th style={{ paddingRight: '24px' }}>Receita</th>
              </tr>
            </thead>
            <tbody>
              {(usersList || [])
                .filter(user => {
                  if (tableFilter === 'Ativos') return user.status === 'Ativo';
                  if (tableFilter === 'Premium') return user.plan === 'Enterprise' || user.plan === 'Pro';
                  return true;
                })
                .map(user => (
                <tr key={user.id}>
                  <td style={{ paddingLeft: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="activity-avatar sale">{user.avatar}</div>
                      <div>
                        <span className="campaign-name">{user.name}</span>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ ...getPlanStyle(user.plan), padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                      {user.plan}
                    </span>
                  </td>
                  <td><span className={`status-badge ${getStatusClass(user.status)}`}>{user.status}</span></td>
                  <td>{user.joined}</td>
                  <td>{user.lastActive}</td>
                  <td style={{ paddingRight: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>{user.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
