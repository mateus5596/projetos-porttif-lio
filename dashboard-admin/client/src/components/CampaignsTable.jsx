import { useState } from 'react';

export default function CampaignsTable({ campaigns }) {
  const [filter, setFilter] = useState('Todas');

  const getStatusClass = (status) => {
    switch (status) {
      case 'Ativa': return 'active';
      case 'Pausada': return 'paused';
      case 'Finalizada': return 'finished';
      default: return '';
    }
  };

  return (
    <div className="card" style={{ padding: '24px 0' }}>
      <div className="card-header" style={{ padding: '0 24px', marginBottom: '12px' }}>
        <div>
          <h3 className="card-title">Campanhas Ativas</h3>
          <p className="card-subtitle">Performance das campanhas de marketing</p>
        </div>
        <div className="card-actions">
          <button className={`card-action-btn ${filter === 'Todas' ? 'active' : ''}`} onClick={() => setFilter('Todas')}>Todas</button>
          <button className={`card-action-btn ${filter === 'Ativas' ? 'active' : ''}`} onClick={() => setFilter('Ativas')}>Ativas</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="campaigns-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '24px' }}>Campanha</th>
              <th>Status</th>
              <th>Impressões</th>
              <th>Cliques</th>
              <th>CTR</th>
              <th>Conversões</th>
              <th>Receita</th>
              <th style={{ paddingRight: '24px' }}>Progresso</th>
            </tr>
          </thead>
          <tbody>
            {(campaigns || [])
              .filter(campaign => filter === 'Todas' || campaign.status === 'Ativa')
              .map((campaign) => (
              <tr key={campaign.id}>
                <td style={{ paddingLeft: '24px' }}>
                  <span className="campaign-name">{campaign.name}</span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </td>
                <td>{campaign.impressions?.toLocaleString('pt-BR')}</td>
                <td>{campaign.clicks?.toLocaleString('pt-BR')}</td>
                <td>{campaign.ctr}</td>
                <td>{campaign.conversions?.toLocaleString('pt-BR')}</td>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{campaign.revenue}</td>
                <td style={{ paddingRight: '24px', minWidth: '120px' }}>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
