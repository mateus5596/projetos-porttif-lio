import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UsersPage from './pages/UsersPage';
import OrdersPage from './pages/OrdersPage';
import CampaignsPage from './pages/CampaignsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

const pages = {
  dashboard: DashboardPage,
  analytics: AnalyticsPage,
  users: UsersPage,
  orders: OrdersPage,
  campaigns: CampaignsPage,
  reports: ReportsPage,
  settings: SettingsPage,
};

function AppLayout() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const ActivePage = pages[activeNav] || DashboardPage;

  return (
    <div className="app-layout">
      <Sidebar activeItem={activeNav} onItemClick={setActiveNav} />
      <main className="main-content">
        <Header />
        <div className="content-area">
          <ActivePage key={activeNav} />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}
