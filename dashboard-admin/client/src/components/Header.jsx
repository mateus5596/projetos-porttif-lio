import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-greeting">
          {getGreeting()}, Mateus 👋
        </h1>
        <p className="header-subtitle">
          Aqui está o resumo do seu painel hoje.
        </p>
      </div>

      <div className="header-right">
        <div className="search-box">
          <Search className="search-icon" size={16} />
          <input type="text" placeholder="Buscar..." />
        </div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Mudar para Light' : 'Mudar para Dark'}
        >
          <span className="toggle-icon">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </span>
        </button>

        <button className="header-btn">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>

        <div className="header-avatar">MH</div>
      </div>
    </header>
  );
}
