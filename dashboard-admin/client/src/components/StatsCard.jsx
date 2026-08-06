import { TrendingUp, TrendingDown } from 'lucide-react';

const sparklineData = {
  revenue: [35, 50, 40, 65, 55, 72, 60, 80, 70, 90, 75, 95],
  users: [20, 35, 45, 30, 55, 48, 60, 52, 70, 65, 78, 85],
  signups: [60, 45, 55, 35, 50, 40, 48, 38, 52, 42, 55, 45],
  conversion: [30, 42, 50, 55, 48, 62, 58, 68, 72, 65, 78, 82],
};

export default function StatsCard({ icon: Icon, stat, type }) {
  const isPositive = stat.change >= 0;
  const bars = sparklineData[type] || sparklineData.revenue;
  const maxVal = Math.max(...bars);

  return (
    <div className="card stat-card">
      <div className="stat-header">
        <div className={`stat-icon ${type}`}>
          <Icon size={22} />
        </div>
        <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {isPositive ? '+' : ''}{stat.change}%
        </div>
      </div>

      <div className="stat-value">{stat.value}</div>
      <div className="stat-label">{stat.label}</div>

      <div className="stat-sparkline">
        {bars.map((val, i) => (
          <div
            key={i}
            className="bar"
            style={{ height: `${(val / maxVal) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
