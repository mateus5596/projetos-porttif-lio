const http = require('node:http');

const PORT = 3001;

// ── Mock Data — Dashboard ──────────────────────────────────

const stats = {
  totalRevenue: { value: 'R$ 1.284.320', change: 12.5, label: 'Receita Total' },
  activeUsers: { value: '89.420', change: 8.2, label: 'Usuários Ativos' },
  newSignups: { value: '4.812', change: -3.1, label: 'Novos Cadastros' },
  conversionRate: { value: '88.9%', change: 4.7, label: 'Taxa de Conversão' },
};

const revenueData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  datasets: [
    { label: 'Receita 2025', data: [65000, 72000, 68000, 85000, 92000, 88000, 105000, 115000, 98000, 122000, 130000, 128000] },
    { label: 'Receita 2024', data: [45000, 52000, 58000, 55000, 62000, 70000, 75000, 82000, 78000, 90000, 95000, 100000] },
  ],
};

const usersData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  datasets: [
    { label: 'Novos Usuários', data: [1200, 1900, 1500, 2200, 2800, 2400, 3100, 3500, 2900, 3800, 4200, 4100] },
    { label: 'Recorrentes', data: [3200, 3500, 3800, 4100, 4500, 4800, 5200, 5600, 5100, 5800, 6200, 6500] },
  ],
};

const platformData = {
  labels: ['Desktop', 'Mobile', 'Tablet', 'Smart TV'],
  data: [45, 35, 12, 8],
};

const campaigns = [
  { id: 1, name: 'Black Friday 2025', status: 'Ativa', impressions: 125000, clicks: 8750, ctr: '7.0%', conversions: 1250, revenue: 'R$ 187.500', progress: 78 },
  { id: 2, name: 'Lançamento App v3', status: 'Ativa', impressions: 98000, clicks: 6860, ctr: '7.0%', conversions: 980, revenue: 'R$ 147.000', progress: 62 },
  { id: 3, name: 'Campanha Verão', status: 'Pausada', impressions: 45000, clicks: 2250, ctr: '5.0%', conversions: 450, revenue: 'R$ 67.500', progress: 35 },
  { id: 4, name: 'Dia dos Namorados', status: 'Finalizada', impressions: 200000, clicks: 16000, ctr: '8.0%', conversions: 2400, revenue: 'R$ 360.000', progress: 100 },
  { id: 5, name: 'Volta às Aulas', status: 'Ativa', impressions: 67000, clicks: 4020, ctr: '6.0%', conversions: 670, revenue: 'R$ 100.500', progress: 45 },
];

const activities = [
  { id: 1, type: 'sale', user: 'Maria Silva', action: 'realizou uma compra', detail: 'Plano Enterprise — R$ 2.499/mês', time: '2 min atrás', avatar: 'MS' },
  { id: 2, type: 'signup', user: 'João Santos', action: 'criou uma conta', detail: 'via Google OAuth', time: '8 min atrás', avatar: 'JS' },
  { id: 3, type: 'upgrade', user: 'Ana Costa', action: 'fez upgrade do plano', detail: 'Pro → Enterprise', time: '15 min atrás', avatar: 'AC' },
  { id: 4, type: 'support', user: 'Carlos Lima', action: 'abriu um ticket', detail: 'Integração API — Prioridade Alta', time: '23 min atrás', avatar: 'CL' },
  { id: 5, type: 'sale', user: 'Fernanda Souza', action: 'realizou uma compra', detail: 'Plano Pro — R$ 899/mês', time: '31 min atrás', avatar: 'FS' },
  { id: 6, type: 'review', user: 'Pedro Alves', action: 'deixou uma avaliação', detail: '⭐⭐⭐⭐⭐ — "Excelente plataforma!"', time: '45 min atrás', avatar: 'PA' },
  { id: 7, type: 'signup', user: 'Lucia Mendes', action: 'criou uma conta', detail: 'via formulário', time: '1h atrás', avatar: 'LM' },
  { id: 8, type: 'upgrade', user: 'Roberto Nunes', action: 'fez upgrade do plano', detail: 'Free → Pro', time: '1h atrás', avatar: 'RN' },
];

// ── Mock Data — Analytics ──────────────────────────────────

const analyticsStats = {
  pageViews: { value: '2.847.320', change: 15.3, label: 'Visualizações' },
  bounceRate: { value: '32.4%', change: -5.2, label: 'Taxa de Rejeição' },
  avgSession: { value: '4m 32s', change: 8.7, label: 'Sessão Média' },
  pagesPerSession: { value: '5.8', change: 3.1, label: 'Páginas/Sessão' },
};

const trafficSources = {
  labels: ['Orgânico', 'Direto', 'Redes Sociais', 'E-mail', 'Referências', 'Pago'],
  data: [38, 22, 18, 12, 6, 4],
};

const pageViewsTrend = {
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  datasets: [
    { label: 'Esta Semana', data: [42000, 48000, 51000, 45000, 55000, 38000, 32000] },
    { label: 'Semana Passada', data: [38000, 42000, 45000, 40000, 48000, 35000, 28000] },
  ],
};

const topPages = [
  { path: '/dashboard', title: 'Dashboard Principal', views: 45200, unique: 32100, avgTime: '3m 45s', bounceRate: '22%' },
  { path: '/produtos', title: 'Catálogo de Produtos', views: 38400, unique: 28700, avgTime: '5m 12s', bounceRate: '18%' },
  { path: '/checkout', title: 'Checkout', views: 22100, unique: 19800, avgTime: '2m 33s', bounceRate: '45%' },
  { path: '/blog', title: 'Blog & Artigos', views: 18900, unique: 15200, avgTime: '6m 08s', bounceRate: '28%' },
  { path: '/precos', title: 'Página de Preços', views: 15600, unique: 12400, avgTime: '4m 22s', bounceRate: '35%' },
  { path: '/suporte', title: 'Central de Ajuda', views: 12300, unique: 9800, avgTime: '3m 55s', bounceRate: '30%' },
];

const conversionFunnel = [
  { stage: 'Visitantes', value: 125000, color: '#00d4ff' },
  { stage: 'Cadastros', value: 45000, color: '#7c3aed' },
  { stage: 'Ativações', value: 28000, color: '#22c55e' },
  { stage: 'Assinantes', value: 12000, color: '#f59e0b' },
  { stage: 'Renovações', value: 8500, color: '#ec4899' },
];

const hourlyTraffic = {
  labels: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}h`),
  data: [120, 80, 45, 30, 25, 35, 180, 420, 680, 850, 920, 880, 760, 820, 900, 950, 870, 680, 520, 450, 380, 310, 250, 180],
};

// ── Mock Data — Users ──────────────────────────────────────

const usersStats = {
  totalUsers: { value: '124.830', change: 6.8, label: 'Total de Usuários' },
  activeToday: { value: '12.450', change: 12.3, label: 'Ativos Hoje' },
  premiumUsers: { value: '18.920', change: 9.5, label: 'Usuários Premium' },
  churnRate: { value: '2.3%', change: -1.8, label: 'Taxa de Churn' },
};

const usersList = [
  { id: 1, name: 'Maria Silva', email: 'maria@email.com', plan: 'Enterprise', status: 'Ativo', joined: '15/01/2025', lastActive: '2 min atrás', revenue: 'R$ 29.988', avatar: 'MS' },
  { id: 2, name: 'João Santos', email: 'joao@email.com', plan: 'Pro', status: 'Ativo', joined: '22/02/2025', lastActive: '15 min atrás', revenue: 'R$ 10.788', avatar: 'JS' },
  { id: 3, name: 'Ana Costa', email: 'ana@email.com', plan: 'Enterprise', status: 'Ativo', joined: '08/03/2025', lastActive: '1h atrás', revenue: 'R$ 24.990', avatar: 'AC' },
  { id: 4, name: 'Carlos Lima', email: 'carlos@email.com', plan: 'Free', status: 'Inativo', joined: '14/04/2025', lastActive: '3 dias atrás', revenue: 'R$ 0', avatar: 'CL' },
  { id: 5, name: 'Fernanda Souza', email: 'fernanda@email.com', plan: 'Pro', status: 'Ativo', joined: '29/05/2025', lastActive: '30 min atrás', revenue: 'R$ 5.394', avatar: 'FS' },
  { id: 6, name: 'Pedro Alves', email: 'pedro@email.com', plan: 'Pro', status: 'Ativo', joined: '10/06/2025', lastActive: '5 min atrás', revenue: 'R$ 4.495', avatar: 'PA' },
  { id: 7, name: 'Lucia Mendes', email: 'lucia@email.com', plan: 'Free', status: 'Ativo', joined: '18/07/2025', lastActive: '2h atrás', revenue: 'R$ 0', avatar: 'LM' },
  { id: 8, name: 'Roberto Nunes', email: 'roberto@email.com', plan: 'Enterprise', status: 'Ativo', joined: '03/01/2025', lastActive: '10 min atrás', revenue: 'R$ 29.988', avatar: 'RN' },
  { id: 9, name: 'Camila Ribeiro', email: 'camila@email.com', plan: 'Pro', status: 'Suspenso', joined: '25/03/2025', lastActive: '1 semana atrás', revenue: 'R$ 3.596', avatar: 'CR' },
  { id: 10, name: 'Thiago Oliveira', email: 'thiago@email.com', plan: 'Enterprise', status: 'Ativo', joined: '12/02/2025', lastActive: '20 min atrás', revenue: 'R$ 22.491', avatar: 'TO' },
];

const usersByPlan = {
  labels: ['Free', 'Pro', 'Enterprise'],
  data: [68200, 38710, 17920],
};

const userGrowth = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  data: [82000, 86500, 91200, 95800, 99400, 103200, 107500, 111800, 115200, 119000, 122400, 124830],
};

// ── Mock Data — Orders ─────────────────────────────────────

const ordersStats = {
  totalOrders: { value: '18.432', change: 14.2, label: 'Total de Pedidos' },
  pendingOrders: { value: '234', change: -8.5, label: 'Pendentes' },
  avgTicket: { value: 'R$ 342', change: 5.3, label: 'Ticket Médio' },
  returnRate: { value: '3.2%', change: -2.1, label: 'Taxa de Devolução' },
};

const ordersList = [
  { id: '#ORD-7841', customer: 'Maria Silva', product: 'Plano Enterprise Anual', amount: 'R$ 29.988', status: 'Concluído', date: '05/08/2025', method: 'Cartão de Crédito' },
  { id: '#ORD-7840', customer: 'João Santos', product: 'Plano Pro Mensal', amount: 'R$ 899', status: 'Processando', date: '05/08/2025', method: 'PIX' },
  { id: '#ORD-7839', customer: 'Ana Costa', product: 'Plano Enterprise Semestral', amount: 'R$ 14.994', status: 'Concluído', date: '04/08/2025', method: 'Boleto' },
  { id: '#ORD-7838', customer: 'Carlos Lima', product: 'Plano Pro Anual', amount: 'R$ 10.788', status: 'Pendente', date: '04/08/2025', method: 'Cartão de Crédito' },
  { id: '#ORD-7837', customer: 'Fernanda Souza', product: 'Plano Pro Mensal', amount: 'R$ 899', status: 'Concluído', date: '04/08/2025', method: 'PIX' },
  { id: '#ORD-7836', customer: 'Pedro Alves', product: 'Plano Enterprise Mensal', amount: 'R$ 2.499', status: 'Concluído', date: '03/08/2025', method: 'Cartão de Crédito' },
  { id: '#ORD-7835', customer: 'Lucia Mendes', product: 'Upgrade Pro → Enterprise', amount: 'R$ 1.600', status: 'Concluído', date: '03/08/2025', method: 'PIX' },
  { id: '#ORD-7834', customer: 'Roberto Nunes', product: 'Plano Enterprise Anual', amount: 'R$ 29.988', status: 'Reembolsado', date: '02/08/2025', method: 'Cartão de Crédito' },
  { id: '#ORD-7833', customer: 'Camila Ribeiro', product: 'Plano Pro Trimestral', amount: 'R$ 2.697', status: 'Concluído', date: '02/08/2025', method: 'Boleto' },
  { id: '#ORD-7832', customer: 'Thiago Oliveira', product: 'Plano Pro Mensal', amount: 'R$ 899', status: 'Cancelado', date: '01/08/2025', method: 'PIX' },
];

const ordersByMonth = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  datasets: [
    { label: 'Pedidos', data: [980, 1120, 1050, 1340, 1480, 1380, 1620, 1780, 1550, 1890, 2050, 2000] },
  ],
};

const revenueByCategory = {
  labels: ['Enterprise', 'Pro', 'Upgrades', 'Add-ons'],
  data: [52, 30, 12, 6],
};

const ordersByStatus = {
  labels: ['Concluído', 'Processando', 'Pendente', 'Cancelado', 'Reembolsado'],
  data: [14200, 1850, 1230, 780, 372],
};

// ── Mock Data — Campaigns (expanded) ───────────────────────

const campaignsStats = {
  activeCampaigns: { value: '12', change: 20.0, label: 'Campanhas Ativas' },
  totalSpent: { value: 'R$ 284.500', change: 15.2, label: 'Investido' },
  avgRoi: { value: '340%', change: 22.8, label: 'ROI Médio' },
  totalLeads: { value: '8.420', change: 18.5, label: 'Leads Gerados' },
};

const campaignPerformance = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
  datasets: [
    { label: 'Investimento', data: [18000, 22000, 25000, 28000, 32000, 35000, 38000, 42000] },
    { label: 'Retorno', data: [45000, 62000, 78000, 92000, 108000, 125000, 140000, 158000] },
  ],
};

const campaignsByChannel = {
  labels: ['Google Ads', 'Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok'],
  data: [32, 25, 20, 12, 7, 4],
};

const allCampaigns = [
  ...campaigns,
  { id: 6, name: 'Remarketing Q3', status: 'Ativa', impressions: 89000, clicks: 5340, ctr: '6.0%', conversions: 712, revenue: 'R$ 106.800', progress: 55 },
  { id: 7, name: 'Newsletter Premium', status: 'Ativa', impressions: 42000, clicks: 3360, ctr: '8.0%', conversions: 504, revenue: 'R$ 75.600', progress: 70 },
  { id: 8, name: 'Webinar Series', status: 'Finalizada', impressions: 35000, clicks: 4200, ctr: '12.0%', conversions: 840, revenue: 'R$ 126.000', progress: 100 },
  { id: 9, name: 'Parceria Influencers', status: 'Pausada', impressions: 156000, clicks: 7800, ctr: '5.0%', conversions: 624, revenue: 'R$ 93.600', progress: 40 },
  { id: 10, name: 'Programa Afiliados', status: 'Ativa', impressions: 210000, clicks: 12600, ctr: '6.0%', conversions: 1890, revenue: 'R$ 283.500', progress: 82 },
];

// ── Mock Data — Reports ────────────────────────────────────

const reportsStats = {
  generatedReports: { value: '342', change: 8.4, label: 'Relatórios Gerados' },
  scheduledReports: { value: '18', change: 12.0, label: 'Agendados' },
  avgDownloads: { value: '1.245', change: 5.6, label: 'Downloads/Mês' },
  dataAccuracy: { value: '99.7%', change: 0.3, label: 'Precisão dos Dados' },
};

const reportsList = [
  { id: 1, name: 'Relatório Mensal — Julho 2025', type: 'Financeiro', created: '01/08/2025', size: '2.4 MB', status: 'Pronto', downloads: 45 },
  { id: 2, name: 'Análise de Churn Q2 2025', type: 'Usuários', created: '28/07/2025', size: '1.8 MB', status: 'Pronto', downloads: 32 },
  { id: 3, name: 'Performance Campanhas Jul', type: 'Marketing', created: '25/07/2025', size: '3.1 MB', status: 'Pronto', downloads: 28 },
  { id: 4, name: 'Relatório Executivo — Semestral', type: 'Executivo', created: '15/07/2025', size: '5.2 MB', status: 'Pronto', downloads: 89 },
  { id: 5, name: 'Análise de Cohort — Retenção', type: 'Usuários', created: '10/07/2025', size: '1.5 MB', status: 'Pronto', downloads: 21 },
  { id: 6, name: 'ROI Campanhas — Semestral', type: 'Marketing', created: '05/07/2025', size: '2.8 MB', status: 'Pronto', downloads: 56 },
  { id: 7, name: 'Previsão de Receita Q3', type: 'Financeiro', created: '01/07/2025', size: '1.2 MB', status: 'Gerando', downloads: 0 },
  { id: 8, name: 'Análise de NPS — Jun 2025', type: 'Usuários', created: '28/06/2025', size: '980 KB', status: 'Pronto', downloads: 38 },
];

const revenueByMonth = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
  datasets: [
    { label: 'Receita Bruta', data: [85000, 92000, 88000, 105000, 115000, 98000, 122000, 130000] },
    { label: 'Receita Líquida', data: [72000, 78000, 75000, 89000, 97000, 83000, 103000, 110000] },
    { label: 'Custos', data: [13000, 14000, 13000, 16000, 18000, 15000, 19000, 20000] },
  ],
};

// ── Mock Data — Settings ───────────────────────────────────

const settingsData = {
  profile: {
    name: 'Mateus Henrique',
    email: 'mateus@nexus.dev',
    role: 'Administrador',
    phone: '+55 (11) 99999-0000',
    company: 'NEXUS Technologies',
    timezone: 'America/Sao_Paulo (GMT-3)',
    language: 'Português (Brasil)',
    avatar: 'MH',
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    weeklyReport: true,
    newUsers: true,
    salesAlerts: true,
    systemUpdates: false,
  },
  security: {
    twoFactor: true,
    lastPasswordChange: '15/06/2025',
    activeSessions: 3,
    loginHistory: [
      { device: 'Chrome — Windows 11', location: 'São Paulo, BR', time: 'Agora', status: 'Ativa' },
      { device: 'Safari — iPhone 15', location: 'São Paulo, BR', time: '2h atrás', status: 'Ativa' },
      { device: 'Firefox — macOS', location: 'Rio de Janeiro, BR', time: '1 dia atrás', status: 'Expirada' },
    ],
  },
};

// ── Routes ─────────────────────────────────────────────────

const routes = {
  // Dashboard
  '/api/stats': () => stats,
  '/api/revenue': () => revenueData,
  '/api/users': () => usersData,
  '/api/platforms': () => platformData,
  '/api/campaigns': () => campaigns,
  '/api/activities': () => activities,
  // Analytics
  '/api/analytics/stats': () => analyticsStats,
  '/api/analytics/traffic-sources': () => trafficSources,
  '/api/analytics/pageviews': () => pageViewsTrend,
  '/api/analytics/top-pages': () => topPages,
  '/api/analytics/funnel': () => conversionFunnel,
  '/api/analytics/hourly': () => hourlyTraffic,
  // Users
  '/api/users/stats': () => usersStats,
  '/api/users/list': () => usersList,
  '/api/users/by-plan': () => usersByPlan,
  '/api/users/growth': () => userGrowth,
  // Orders
  '/api/orders/stats': () => ordersStats,
  '/api/orders/list': () => ordersList,
  '/api/orders/by-month': () => ordersByMonth,
  '/api/orders/by-category': () => revenueByCategory,
  '/api/orders/by-status': () => ordersByStatus,
  // Campaigns
  '/api/campaigns/stats': () => campaignsStats,
  '/api/campaigns/all': () => allCampaigns,
  '/api/campaigns/performance': () => campaignPerformance,
  '/api/campaigns/by-channel': () => campaignsByChannel,
  // Reports
  '/api/reports/stats': () => reportsStats,
  '/api/reports/list': () => reportsList,
  '/api/reports/revenue': () => revenueByMonth,
  // Settings
  '/api/settings': () => settingsData,
};

// ── Server ─────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  if (req.method === 'GET' && routes[pathname]) {
    const data = routes[pathname]();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
    return;
  }

  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Rota não encontrada' }));
});

server.listen(PORT, () => {
  console.log(`\n  🚀 API Server rodando em http://localhost:${PORT}`);
  console.log(`  📊 ${Object.keys(routes).length} endpoints disponíveis\n`);
});
