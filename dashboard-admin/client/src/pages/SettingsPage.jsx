import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  User, Mail, Phone, Building2, Globe, Languages,
  Shield, Key, Monitor, Smartphone, Bell, BellOff,
  Save, Sun, Moon, Check,
} from 'lucide-react';

const API = 'http://localhost:3001/api';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({});

  useEffect(() => {
    fetch(`${API}/settings`).then(r => r.json())
      .then(data => {
        setSettings(data);
        setNotifications(data.notifications || {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="skeleton" style={{width:'100%',height:'200px'}}/></div>;

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'appearance', label: 'Aparência', icon: Sun },
  ];

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationLabels = {
    email: 'Notificações por E-mail',
    push: 'Notificações Push',
    sms: 'Notificações por SMS',
    weeklyReport: 'Relatório Semanal',
    newUsers: 'Novos Usuários',
    salesAlerts: 'Alertas de Vendas',
    systemUpdates: 'Atualizações do Sistema',
  };

  const notificationDescriptions = {
    email: 'Receber atualizações por e-mail',
    push: 'Receber notificações no navegador',
    sms: 'Receber alertas importantes por SMS',
    weeklyReport: 'Resumo semanal de performance',
    newUsers: 'Alerta quando novos usuários se cadastram',
    salesAlerts: 'Notificar sobre vendas realizadas',
    systemUpdates: 'Avisos de manutenção e updates',
  };

  return (
    <div className="settings-layout">
      {/* Settings Tabs */}
      <div className="settings-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Content */}
      <div className="settings-content">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card settings-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Informações do Perfil</h3>
                <p className="card-subtitle">Gerencie suas informações pessoais</p>
              </div>
              <button className="save-btn"><Save size={16} /> Salvar</button>
            </div>

            <div className="settings-avatar-section">
              <div className="settings-avatar">{settings?.profile?.avatar}</div>
              <div>
                <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{settings?.profile?.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{settings?.profile?.role}</p>
              </div>
            </div>

            <div className="settings-form">
              <div className="form-row">
                <div className="form-group">
                  <label><User size={14} /> Nome Completo</label>
                  <input type="text" defaultValue={settings?.profile?.name} />
                </div>
                <div className="form-group">
                  <label><Mail size={14} /> E-mail</label>
                  <input type="email" defaultValue={settings?.profile?.email} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><Phone size={14} /> Telefone</label>
                  <input type="tel" defaultValue={settings?.profile?.phone} />
                </div>
                <div className="form-group">
                  <label><Building2 size={14} /> Empresa</label>
                  <input type="text" defaultValue={settings?.profile?.company} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><Globe size={14} /> Fuso Horário</label>
                  <input type="text" defaultValue={settings?.profile?.timezone} readOnly />
                </div>
                <div className="form-group">
                  <label><Languages size={14} /> Idioma</label>
                  <input type="text" defaultValue={settings?.profile?.language} readOnly />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="card settings-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Preferências de Notificações</h3>
                <p className="card-subtitle">Configure como deseja ser notificado</p>
              </div>
            </div>

            <div className="notifications-list">
              {Object.entries(notificationLabels).map(([key, label]) => (
                <div key={key} className="notification-item">
                  <div className="notification-info">
                    <div className="notification-label">{label}</div>
                    <div className="notification-desc">{notificationDescriptions[key]}</div>
                  </div>
                  <button
                    className={`toggle-switch ${notifications[key] ? 'active' : ''}`}
                    onClick={() => toggleNotification(key)}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="card settings-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Segurança da Conta</h3>
                <p className="card-subtitle">Gerencie a segurança da sua conta</p>
              </div>
            </div>

            <div className="security-section">
              <div className="security-item">
                <div className="security-icon" style={{ background: 'rgba(34,197,94,0.12)' }}>
                  <Shield size={20} style={{ color: '#22c55e' }} />
                </div>
                <div className="security-info">
                  <h4>Autenticação em Dois Fatores</h4>
                  <p>{settings?.security?.twoFactor ? 'Ativada — sua conta está protegida' : 'Desativada — recomendamos ativar'}</p>
                </div>
                <span className={`status-badge ${settings?.security?.twoFactor ? 'active' : 'paused'}`}>
                  {settings?.security?.twoFactor ? 'Ativa' : 'Inativa'}
                </span>
              </div>

              <div className="security-item">
                <div className="security-icon" style={{ background: 'rgba(0,212,255,0.12)' }}>
                  <Key size={20} style={{ color: '#00d4ff' }} />
                </div>
                <div className="security-info">
                  <h4>Última alteração de senha</h4>
                  <p>{settings?.security?.lastPasswordChange}</p>
                </div>
                <button className="card-action-btn">Alterar Senha</button>
              </div>

              <div className="security-item">
                <div className="security-icon" style={{ background: 'rgba(124,58,237,0.12)' }}>
                  <Monitor size={20} style={{ color: '#7c3aed' }} />
                </div>
                <div className="security-info">
                  <h4>Sessões Ativas</h4>
                  <p>{settings?.security?.activeSessions} dispositivos conectados</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '16px' }}>Histórico de Login</h4>
              <div className="login-history">
                {settings?.security?.loginHistory?.map((entry, i) => (
                  <div key={i} className="login-entry">
                    <div className="login-device-icon">
                      {entry.device.includes('iPhone') || entry.device.includes('Android')
                        ? <Smartphone size={18} />
                        : <Monitor size={18} />
                      }
                    </div>
                    <div className="login-info">
                      <span className="login-device">{entry.device}</span>
                      <span className="login-location">{entry.location} — {entry.time}</span>
                    </div>
                    <span className={`status-badge ${entry.status === 'Ativa' ? 'active' : 'finished'}`}>
                      {entry.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="card settings-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Aparência</h3>
                <p className="card-subtitle">Personalize a aparência do painel</p>
              </div>
            </div>

            <div className="appearance-section">
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '16px' }}>Tema</h4>
              <div className="theme-options">
                <button
                  className={`theme-option ${theme === 'dark' ? 'selected' : ''}`}
                  onClick={() => theme !== 'dark' && toggleTheme()}
                >
                  <div className="theme-preview dark-preview">
                    <div className="preview-sidebar" />
                    <div className="preview-content">
                      <div className="preview-header" />
                      <div className="preview-cards">
                        <div /><div /><div />
                      </div>
                    </div>
                  </div>
                  <div className="theme-option-label">
                    <Moon size={16} />
                    <span>Modo Escuro</span>
                    {theme === 'dark' && <Check size={16} className="theme-check" />}
                  </div>
                </button>

                <button
                  className={`theme-option ${theme === 'light' ? 'selected' : ''}`}
                  onClick={() => theme !== 'light' && toggleTheme()}
                >
                  <div className="theme-preview light-preview">
                    <div className="preview-sidebar" />
                    <div className="preview-content">
                      <div className="preview-header" />
                      <div className="preview-cards">
                        <div /><div /><div />
                      </div>
                    </div>
                  </div>
                  <div className="theme-option-label">
                    <Sun size={16} />
                    <span>Modo Claro</span>
                    {theme === 'light' && <Check size={16} className="theme-check" />}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
