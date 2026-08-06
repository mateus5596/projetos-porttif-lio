import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShoppingCart,
  Megaphone,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', badge: null },
  { icon: BarChart3, label: 'Analíticos', id: 'analytics', badge: null },
  { icon: Users, label: 'Usuários', id: 'users', badge: '2.4k' },
  { icon: ShoppingCart, label: 'Pedidos', id: 'orders', badge: '18' },
  { icon: Megaphone, label: 'Campanhas', id: 'campaigns', badge: null },
  { icon: FileText, label: 'Relatórios', id: 'reports', badge: null },
];

const settingsItems = [
  { icon: Settings, label: 'Configurações', id: 'settings', badge: null },
];

export default function Sidebar({ activeItem = 'dashboard', onItemClick }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">N</div>
        <span className="logo-text">NEXUS</span>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-title">Principal</span>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => onItemClick?.(item.id)}
            >
              <Icon className="nav-icon" size={20} />
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          );
        })}

        <span className="sidebar-section-title">Sistema</span>
        {settingsItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => onItemClick?.(item.id)}
            >
              <Icon className="nav-icon" size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">MH</div>
          <div className="user-info">
            <div className="user-name">Mateus Henrique</div>
            <div className="user-role">Administrador</div>
          </div>
          <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </aside>
  );
}
