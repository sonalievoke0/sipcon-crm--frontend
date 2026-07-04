import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrm } from '../context/CrmContext';
import StatusBadge from '../components/StatusBadge';
import RecordingModal from '../components/RecordingModal';

const TicketsView = () => {
  const { tickets, companies } = useCrm();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === 'All' || t.status === filter;

    const company = companies.find(c => c.company_id === t.company_id);
    const cName = t.company_name || company?.company_name || '';

    const matchesSearch = searchTerm === '' ||
      String(t.ticket_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      cName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.machine_name && t.machine_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.query_text && t.query_text.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const indexOfLastTicket = currentPage * itemsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const getTicketSummary = (t) => {
    return t.summary || t.notes || (t.query_text ? (t.query_text.length > 50 ? t.query_text.substring(0, 48) + '...' : t.query_text) : 'No summary');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '28px' }}>Support Tickets</h2>
          <p style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--color-text)', opacity: 0.7 }}>
            Manage customer queries, review ticket summaries, and listen to voice call recordings
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end', flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {['All', 'Open', 'In Progress', 'Resolved', 'Unresolved'].map(f => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setCurrentPage(1);
                }}
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
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <input
              type="text"
              placeholder="Search tickets by ID, company, query..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '10px 14px 10px 36px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              🔍
            </span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <div className="table-wrapper" style={{ margin: 0, border: 'none' }}>
          <table>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                <th style={{ padding: '16px', color: 'white', fontSize: '16px' }}>Ticket ID</th>
                <th style={{ padding: '16px', color: 'white', fontSize: '16px' }}>Company</th>
                <th style={{ padding: '16px', color: 'white', fontSize: '16px' }}>Machine</th>
                <th style={{ padding: '16px', color: 'white', width: '22%', fontSize: '16px' }}>Query</th>
                <th style={{ padding: '16px', color: 'white', width: '22%', fontSize: '16px' }}>Summary</th>
                <th style={{ padding: '16px', color: 'white', fontSize: '16px' }}>Status</th>
                <th style={{ padding: '16px', color: 'white', fontSize: '16px' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {currentTickets.map(t => {
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
                    <td style={{ fontSize: '15px', color: '#334155' }}>
                      {t.query_text.length > 55 ? t.query_text.substring(0, 52) + '...' : t.query_text}
                    </td>
                    <td>
                      <div style={{
                        padding: '6px 10px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#334155',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        lineHeight: '1.4'
                      }}>
                        📋 {getTicketSummary(t)}
                      </div>
                    </td>
                    <td><StatusBadge status={t.status} /></td>
                    <td style={{ fontSize: '15px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(t.created_at).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                );
              })}
              {currentTickets.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text)', opacity: 0.6 }}>
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            Previous
          </button>

          <span style={{ display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: '500' }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default TicketsView;
