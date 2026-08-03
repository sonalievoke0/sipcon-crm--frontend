import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { useCrm } from '../context/CrmContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { tickets, companies } = useCrm();

  const getTicketsByStatus = (statusList) => {
    return tickets.filter(t => t.status && statusList.includes(t.status.trim().toLowerCase()));
  };

  const connectedTickets = getTicketsByStatus(['connected']);
  const inProgressTickets = getTicketsByStatus(['in progress']);
  const escalatedTickets = getTicketsByStatus(['escalated']);
  const unresolvedTickets = getTicketsByStatus(['unresolved']);
  const resolvedTickets = getTicketsByStatus(['resolved']);

  const recentCompanies = [...companies].reverse().slice(0, 5);

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div 
          className="card" 
          style={{ marginBottom: 0, borderLeft: '4px solid #f97316', cursor: 'pointer' }}
          onClick={() => navigate('/tickets', { state: { filter: 'Escalated' } })}
        >
          <h3 style={{ color: 'var(--color-text)', fontSize: '14px', marginTop: 0 }}>Escalated</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f97316', margin: '8px 0 0' }}>
            {escalatedTickets.length}
          </p>
        </div>
        <div 
          className="card" 
          style={{ marginBottom: 0, borderLeft: '4px solid #f97316', cursor: 'pointer' }}
          onClick={() => navigate('/tickets', { state: { filter: 'In Progress' } })}
        >
          <h3 style={{ color: 'var(--color-text)', fontSize: '14px', marginTop: 0 }}>In Progress</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f97316', margin: '8px 0 0' }}>
            {inProgressTickets.length}
          </p>
        </div>
        <div 
          className="card" 
          style={{ marginBottom: 0, borderLeft: '4px solid #f97316', cursor: 'pointer' }}
          onClick={() => navigate('/tickets', { state: { filter: 'Connected' } })}
        >
          <h3 style={{ color: 'var(--color-text)', fontSize: '14px', marginTop: 0 }}>Connected</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f97316', margin: '8px 0 0' }}>
            {connectedTickets.length}
          </p>
        </div>
        <div 
          className="card" 
          style={{ marginBottom: 0, borderLeft: '4px solid var(--color-danger)', cursor: 'pointer' }}
          onClick={() => navigate('/tickets', { state: { filter: 'Unresolved' } })}
        >
          <h3 style={{ color: 'var(--color-text)', fontSize: '14px', marginTop: 0 }}>Unresolved</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-danger)', margin: '8px 0 0' }}>
            {unresolvedTickets.length}
          </p>
        </div>
        <div 
          className="card" 
          style={{ marginBottom: 0, borderLeft: '4px solid var(--color-success)', cursor: 'pointer' }}
          onClick={() => navigate('/tickets', { state: { filter: 'Resolved' } })}
        >
          <h3 style={{ color: 'var(--color-text)', fontSize: '14px', marginTop: 0 }}>Resolved</h3>
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
                </tr>
              </thead>
              <tbody>
                {tickets.slice(0, 5).map(t => (
                  <tr key={t.ticket_id}>
                    <td style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>{t.ticket_id}</td>
                    <td>{t.query_text.substring(0, 50)}...</td>
                    <td><StatusBadge status={t.status} /></td>
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
                <div style={{ fontSize: '12px', color: 'var(--color-text)' }}>{company.city}</div>
                <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-accent)', fontWeight: 'bold' }}>{company.machine_name || 'No Machine Specified'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
