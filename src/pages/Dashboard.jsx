import React from 'react';
import StatusBadge from '../components/StatusBadge';
import { useCrm } from '../context/CrmContext';

const Dashboard = () => {
  const { tickets } = useCrm();

  const openTickets = tickets.filter(t => t.status === 'Open');
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress');
  const escalatedTickets = tickets.filter(t => t.status === 'Escalated');
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed');

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ marginBottom: 0, borderLeft: '4px solid var(--color-warning)' }}>
          <h3 style={{ color: 'var(--color-text)', opacity: 0.7, fontSize: '14px', marginTop: 0 }}>Open</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-warning)', margin: '8px 0 0' }}>
            {openTickets.length}
          </p>
        </div>
        <div className="card" style={{ marginBottom: 0, borderLeft: '4px solid var(--color-secondary)' }}>
          <h3 style={{ color: 'var(--color-text)', opacity: 0.7, fontSize: '14px', marginTop: 0 }}>In Progress</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-secondary)', margin: '8px 0 0' }}>
            {inProgressTickets.length}
          </p>
        </div>
        <div className="card" style={{ marginBottom: 0, borderLeft: '4px solid var(--color-danger)' }}>
          <h3 style={{ color: 'var(--color-text)', opacity: 0.7, fontSize: '14px', marginTop: 0 }}>Escalated</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-danger)', margin: '8px 0 0' }}>
            {escalatedTickets.length}
          </p>
        </div>
        <div className="card" style={{ marginBottom: 0, borderLeft: '4px solid var(--color-success)' }}>
          <h3 style={{ color: 'var(--color-text)', opacity: 0.7, fontSize: '14px', marginTop: 0 }}>Resolved / Closed</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-success)', margin: '8px 0 0' }}>
            {resolvedTickets.length}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Recent Tickets Table */}
        <div className="card" style={{ marginBottom: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginTop: 0 }}>Recent Tickets</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Query</th>
                  <th>Status</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.ticket_id}>
                    <td style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>{t.ticket_id}</td>
                    <td>{t.query_text.substring(0, 50)}...</td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>{t.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
