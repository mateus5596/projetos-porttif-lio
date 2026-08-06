export default function ActivityFeed({ activities }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Atividade Recente</h3>
          <p className="card-subtitle">Últimas ações na plataforma</p>
        </div>
      </div>

      <div className="activity-list">
        {(activities || []).map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className={`activity-avatar ${activity.type}`}>
              {activity.avatar}
            </div>
            <div className="activity-content">
              <div className="activity-text">
                <strong>{activity.user}</strong> {activity.action}
              </div>
              <div className="activity-detail">{activity.detail}</div>
            </div>
            <span className="activity-time">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
