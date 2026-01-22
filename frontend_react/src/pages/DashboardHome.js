import React from 'react';
import '../ui/theme.css';

// PUBLIC_INTERFACE
export default function DashboardHome() {
  /** Protected dashboard landing page placeholder. */
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Welcome</h1>
      <p style={{ color: 'var(--ocean-muted)', maxWidth: 720 }}>
        This is the protected dashboard shell. Next steps will add repair booking, status tracking,
        and realtime updates.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 12,
          marginTop: 16
        }}
      >
        <div className="card" style={{ width: 'auto' }}>
          <h3 className="cardTitle">Customer</h3>
          <div className="cardBody">
            <div style={{ color: 'var(--ocean-muted)' }}>
              Book repairs, track status, view history.
            </div>
          </div>
        </div>
        <div className="card" style={{ width: 'auto' }}>
          <h3 className="cardTitle">Technician</h3>
          <div className="cardBody">
            <div style={{ color: 'var(--ocean-muted)' }}>
              Manage assigned repairs and update status.
            </div>
          </div>
        </div>
        <div className="card" style={{ width: 'auto' }}>
          <h3 className="cardTitle">Admin</h3>
          <div className="cardBody">
            <div style={{ color: 'var(--ocean-muted)' }}>
              Operations, statistics, and payments (coming soon).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
