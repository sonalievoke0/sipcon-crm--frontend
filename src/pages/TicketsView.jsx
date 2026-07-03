import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrm } from '../context/CrmContext';
import StatusBadge from '../components/StatusBadge';
import RecordingModal from '../components/RecordingModal';

const TicketsView = () => {
  const { tickets, companies } = useCrm();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [selectedTicketForAudio, setSelectedTicketForAudio] = useState(null);

  const filteredTickets = filter === 'All' 
    ? tickets 
    : tickets.filter(t => t.status === filter);

  const getTicketSummary = (t) => {
    return t.summary || t.notes || (t.query_text ? (t.query_text.length > 50 ? t.query_text.substring(0, 48) + '...' : t.query_text) : 'No summary');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '24px' }}>Support Tickets</h2>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--color-text)', opacity: 0.7 }}>
            Manage customer queries, review ticket summaries, and listen to voice call recordings
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                transition: 'all 0.2s',
                boxShadow: filter === f ? '0 2px 6px rgba(46, 111, 181, 0.3)' : 'none'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <div className="table-wrapper" style={{ margin: 0, border: 'none' }}>
          <table>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                <th style={{ padding: '16px', color: 'white' }}>Ticket ID</th>
                <th style={{ padding: '16px', color: 'white' }}>Company</th>
                <th style={{ padding: '16px', color: 'white' }}>Machine</th>
                <th style={{ padding: '16px', color: 'white', width: '22%' }}>Query</th>
                <th style={{ padding: '16px', color: 'white', width: '22%' }}>Summary</th>
                <th style={{ padding: '16px', color: 'white', textAlign: 'center' }}>Recording</th>
                <th style={{ padding: '16px', color: 'white' }}>Status</th>
                <th style={{ padding: '16px', color: 'white' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(t => {
                const company = companies.find(c => c.company_id === t.company_id);
                return (
                  <tr 
                    key={t.ticket_id} 
                    onClick={() => navigate(`/tickets/${t.ticket_id}`)}
                    style={{ cursor: 'pointer', transition: 'background-color 0.15s' }}
                  >
                    <td style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{t.ticket_id}</td>
                    <td style={{ fontWeight: '500' }}>{t.company_name || company?.company_name || 'Unknown'}</td>
                    <td style={{ color: '#475569' }}>{t.machine_name || 'N/A'}</td>
                    <td style={{ fontSize: '13px', color: '#334155' }}>
                      {t.query_text.length > 55 ? t.query_text.substring(0, 52) + '...' : t.query_text}
                    </td>
                    <td>
                      <div style={{
                        padding: '6px 10px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#334155',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        lineHeight: '1.4'
                      }}>
                        📋 {getTicketSummary(t)}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicketForAudio(t);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          backgroundColor: 'rgba(22, 64, 122, 0.12)',
                          color: 'var(--color-primary)',
                          border: '1px solid rgba(22, 64, 122, 0.35)',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(22, 64, 122, 0.1)',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'scale(1.04)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(22, 64, 122, 0.12)';
                          e.currentTarget.style.color = 'var(--color-primary)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <span style={{ fontSize: '15px' }}>🎵</span>
                        <span>Listen</span>
                      </button>
                    </td>
                    <td><StatusBadge status={t.status} /></td>
                    <td style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(t.created_at).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                );
              })}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text)', opacity: 0.6 }}>
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Recording Modal */}
      <RecordingModal 
        ticket={selectedTicketForAudio} 
        onClose={() => setSelectedTicketForAudio(null)} 
      />
    </div>
  );
};

export default TicketsView;
