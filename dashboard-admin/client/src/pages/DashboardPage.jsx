import { useState, useEffect } from 'react';
import { DollarSign, Users, UserPlus, TrendingUp } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import RevenueChart from '../components/RevenueChart';
import UsersChart from '../components/UsersChart';
import PlatformPieChart from '../components/PlatformPieChart';
import CampaignsTable from '../components/CampaignsTable';
import ActivityFeed from '../components/ActivityFeed';

const API = 'http://localhost:3001/api';

const statIcons = {
  totalRevenue: DollarSign,
  activeUsers: Users,
  newSignups: UserPlus,
  conversionRate: TrendingUp,
};
const statTypes = {
  totalRevenue: 'revenue',
  activeUsers: 'users',
  newSignups: 'signups',
  conversionRate: 'conversion',
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [users, setUsers] = useState(null);
  const [platforms, setPlatforms] = useState(null);
  const [campaigns, setCampaigns] = useState(null);
  const [activities, setActivities] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/stats`).then(r => r.json()),
      fetch(`${API}/revenue`).then(r => r.json()),
      fetch(`${API}/users`).then(r => r.json()),
      fetch(`${API}/platforms`).then(r => r.json()),
      fetch(`${API}/campaigns`).then(r => r.json()),
      fetch(`${API}/activities`).then(r => r.json()),
    ]).then(([s, r, u, p, c, a]) => {
      setStats(s); setRevenue(r); setUsers(u);
      setPlatforms(p); setCampaigns(c); setActivities(a);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="stats-row">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card stat-card">
            <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '12px' }} />
            <div className="skeleton" style={{ width: '120px', height: '32px', marginTop: '16px' }} />
            <div className="skeleton" style={{ width: '80px', height: '16px', marginTop: '8px' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      <div className="stats-row">
        {stats && Object.entries(stats).map(([key, stat]) => (
          <StatsCard key={key} icon={statIcons[key]} stat={stat} type={statTypes[key]} />
        ))}
      </div>
      <div className="charts-row">
        <RevenueChart data={revenue} />
        <PlatformPieChart data={platforms} />
      </div>
      <UsersChart data={users} />
      <div className="bottom-row">
        <CampaignsTable campaigns={campaigns} />
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
}
