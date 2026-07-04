import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import RecordingModal from '../components/RecordingModal';
import { useCrm } from '../context/CrmContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { tickets, companies } = useCrm();

  const openTickets = tickets.filter(t => t.status === 'Open');
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress');
  const escalatedTickets = tickets.filter(t => t.status === 'Escalated');
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed');

  const recentCompanies = companies.slice(0, 5);

  const getTicketSummary = (t) => {
    return t.summary || t.notes || (t.query_text ? (t.query_text.length > 35 ? t.query_text.substring(0, 32) + '...' : t.query_text) : 'No summary');
  };

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ marginBottom: 0, borderLeft: '4px solid var(--color-warning)' }}>
          <h3 style={{ color: 'var(--color-text)', opacity: 0.7, fontSize: '16px', marginTop: 0 }}>Open</h3>
          <p style={{ fontSize: '38px', fontWeight: 'bold', color: 'var(--color-warning)', margin: '8px 0 0' }}>
            {openTickets.length}
          </p>
        </div>
        <div className="card" style={{ marginBottom: 0, borderLeft: '4px solid var(--color-secondary)' }}>
          <h3 style={{ color: 'var(--color-text)', opacity: 0.7, fontSize: '16px', marginTop: 0 }}>In Progress</h3>
          <p style={{ fontSize: '38px', fontWeight: 'bold', color: 'var(--color-secondary)', margin: '8px 0 0' }}>
            {inProgressTickets.length}
          </p>
        </div>
        <div className="card" style={{ marginBottom: 0, borderLeft: '4px solid var(--color-danger)' }}>
          <h3 style={{ color: 'var(--color-text)', opacity: 0.7, fontSize: '16px', marginTop: 0 }}>Escalated</h3>
          <p style={{ fontSize: '38px', fontWeight: 'bold', color: 'var(--color-danger)', margin: '8px 0 0' }}>
            {escalatedTickets.length}
          </p>
        </div>
        <div className="card" style={{ marginBottom: 0, borderLeft: '4px solid var(--color-success)' }}>
          <h3 style={{ color: 'var(--color-text)', opacity: 0.7, fontSize: '16px', marginTop: 0 }}>Resolved / Closed</h3>
          <p style={{ fontSize: '38px', fontWeight: 'bold', color: 'var(--color-success)', margin: '8px 0 0' }}>
            {resolvedTickets.length}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Tickets Table */}
        <div className="card" style={{ marginBottom: 0, height: '100%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>Recent Tickets</h3>
          </div>
          <div className="table-wrapper" style={{ margin: 0, border: 'none' }}>
            <table>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                  <th style={{ padding: '14px 16px', color: 'white', fontSize: '16px' }}>Ticket ID</th>
                  <th style={{ padding: '14px 16px', color: 'white', fontSize: '16px' }}>Query</th>
                  <th style={{ padding: '14px 16px', color: 'white', fontSize: '16px' }}>Summary</th>
                  <th style={{ padding: '14px 16px', color: 'white', fontSize: '16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.slice(0, 6).map(t => (
                  <tr 
                    key={t.ticket_id}
                    onClick={() => navigate(`/tickets/${t.ticket_id}`)}
                    style={{ cursor: 'pointer', transition: 'background-color 0.15s' }}
                  >
                    <td style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{t.ticket_id}</td>
                    <td style={{ fontSize: '15px' }}>{t.query_text.substring(0, 40)}...</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#334155',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: '500',
                        display: 'inline-block'
                      }}>
                        📋 {getTicketSummary(t)}
                      </span>
                    </td>
                    <td><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Companies */}
        <div className="card" style={{ marginBottom: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginTop: 0, fontSize: '20px' }}>Recent Companies</h3>
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
                <div style={{ fontWeight: 'bold', color: 'var(--color-primary)', fontSize: '16px' }}>{company.company_name}</div>
                <div style={{ fontSize: '14px', color: 'var(--color-text)', opacity: 0.8 }}>{company.city}</div>
                <div style={{ marginTop: '8px', fontSize: '15px', color: 'var(--color-accent)', fontWeight: 'bold' }}>{company.industry || 'No Industry Specified'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
