import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { useCrm } from '../context/CrmContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { tickets, companies } = useCrm();

  const openTickets = tickets.filter(t => t.status === 'Open');
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress');
  const escalatedTickets = tickets.filter(t => t.status === 'Escalated');
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed');

  const recentCompanies = companies.slice(0, 5);

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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
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

        {/* Recent Companies */}
        <div className="card" style={{ marginBottom: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginTop: 0 }}>Recent Companies</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentCompanies.map(company => (
              <div 
                key={company.company_id} 
                onClick={() => navigate(`/companies/${company.company_id}`)}
                style={{ 
                  padding: '16px', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '8px', 
                  backgroundColor: 'var(--color-bg)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
              >
                <div style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{company.company_name}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text)', opacity: 0.8 }}>{company.city}</div>
                <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-accent)', fontWeight: 'bold' }}>{company.industry || 'No Industry Specified'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
