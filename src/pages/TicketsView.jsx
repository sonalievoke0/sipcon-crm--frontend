import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrm } from '../context/CrmContext';
import StatusBadge from '../components/StatusBadge';

const TicketsView = () => {
  const { tickets, companies } = useCrm();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filteredTickets = filter === 'All' 
    ? tickets 
    : tickets.filter(t => t.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Support Tickets</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Open', 'In Progress', 'Escalated', 'Resolved', 'Closed'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--color-border)',
                backgroundColor: filter === f ? 'var(--color-secondary)' : 'var(--color-white)',
                color: filter === f ? 'var(--color-white)' : 'var(--color-text)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Company</th>
                <th>Query</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(t => {
                const company = companies.find(c => c.company_id === t.company_id);
                return (
                  <tr 
                    key={t.ticket_id} 
                    onClick={() => navigate(`/tickets/${t.ticket_id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{t.ticket_id}</td>
                    <td>{company ? company.company_name : 'Unknown'}</td>
                    <td>{t.query_text}</td>
                    <td style={{ 
                      color: t.priority === 'Critical' ? 'var(--color-danger)' : 
                             t.priority === 'High' ? 'var(--color-warning)' : 'inherit',
                      fontWeight: t.priority === 'Critical' || t.priority === 'High' ? 'bold' : 'normal'
                    }}>
                      {t.priority}
                    </td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>{new Date(t.created_at).toLocaleDateString()}</td>
                  </tr>
                )
              })}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text)', opacity: 0.6 }}>
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TicketsView;
