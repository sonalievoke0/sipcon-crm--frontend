import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCrm } from '../context/CrmContext';
import StatusBadge from '../components/StatusBadge';

const TicketsView = () => {
  const { tickets, companies } = useCrm();
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState(location.state?.filter || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 20;

  const filteredTickets = tickets.filter(t => {
    const statusMatch = filter === 'All' || (t.status && t.status.trim().toLowerCase() === filter.toLowerCase());
    if (!statusMatch) return false;

    if (!searchQuery) return true;

    const company = companies.find(c => c.company_id === t.company_id);
    const companyName = t.company_name || company?.company_name || 'Unknown';
    const clientName = t.client_name || '';
    const contactNumber = t.client_number || '';
    const q = searchQuery.toLowerCase();

    return (
      (t.ticket_id && String(t.ticket_id).toLowerCase().includes(q)) ||
      (companyName.toLowerCase().includes(q)) ||
      (clientName.toLowerCase().includes(q)) ||
      (contactNumber.toLowerCase().includes(q)) ||
      (t.machine_name && t.machine_name.toLowerCase().includes(q)) ||
      (t.query_text && t.query_text.toLowerCase().includes(q)) ||
      (t.status && t.status.toLowerCase().includes(q))
    );
  });

  // Pagination logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Support Tickets</h2>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Connected', 'In Progress', 'Unresolved', 'Resolved'].map(f => (
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
                  transition: 'all 0.2s'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          placeholder="Search tickets by ID, company, machine, or query..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            width: '100%',
            padding: '10px 14px',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            fontSize: '15px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Company</th>
                <th>Client Name</th>
                <th>Contact No.</th>
                <th>Email ID</th>
                <th>Machine</th>
                <th>Query</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {currentTickets.map(t => {
                const company = companies.find(c => c.company_id === t.company_id);

                return (
                  <tr
                    key={t.ticket_id}
                    onClick={() => navigate(`/tickets/${t.ticket_id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{t.ticket_id}</td>
                    <td>{t.company_name || company?.company_name || 'Unknown'}</td>
                    <td>{t.client_name || 'N/A'}</td>
                    <td>{t.client_number || 'N/A'}</td>
                    <td>{t.client_email || 'N/A'}</td>
                    <td>{t.machine_name || 'N/A'}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={t.query_text}>{t.query_text}</td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>{new Date(t.created_at).toLocaleDateString('en-GB')}</td>
                  </tr>
                )
              })}
              {currentTickets.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text)' }}>
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px', gap: '16px' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: currentPage === 1 ? '#f5f5f5' : 'var(--color-white)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>

          <span style={{ color: 'var(--color-text)' }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'var(--color-white)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketsView;
