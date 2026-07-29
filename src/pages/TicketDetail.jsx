import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrm } from '../context/CrmContext';
import StatusBadge from '../components/StatusBadge';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, updateTicket, companies, contacts, products, staff, callLogs, role, loadCallLogsForTicket } = useCrm();

  const ticket = tickets.find(t => String(t.ticket_id) === String(id));

  useEffect(() => {
    if (ticket?.ticket_id) {
      loadCallLogsForTicket(ticket.ticket_id);
    }
  }, [ticket?.ticket_id]);

  if (!ticket) {
    return <div style={{ padding: '24px' }}>Ticket not found.</div>;
  }

  const company = companies.find(c => String(c.company_id) === String(ticket.company_id));
  const contact = contacts.find(c => String(c.contact_id) === String(ticket.contact_id));
  const product = products.find(p => String(p.product_id) === String(ticket.product_id));
  const assignedStaff = staff.find(s => String(s.staff_id) === String(ticket.assigned_to));
  const ticketLogs = callLogs.filter(l => String(l.ticket_id) === String(ticket.ticket_id)).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

  const handleStatusChange = async (newStatus) => {
    await updateTicket(ticket.ticket_id, { status: newStatus });
  };

  const getNextStatusOptions = () => {
    switch (ticket.status) {
      case 'Connected': return ['In Progress'];
      case 'In Progress': return ['Escalated', 'Resolved'];
      case 'Escalated': return ['Resolved'];
      case 'Resolved': return ['Reopen (Connected)'];
      default: return [];
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/tickets')}
            style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: 'var(--color-white)' }}
          >
            &larr; Back
          </button>
          <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>{ticket.ticket_id}</h2>
          <StatusBadge status={ticket.status} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {getNextStatusOptions().map(statusLabel => {
            const actualStatus = statusLabel.includes('Reopen') ? 'Connected' : statusLabel;
            return (
              <button
                key={statusLabel}
                onClick={() => handleStatusChange(actualStatus)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Mark as {statusLabel}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Query Details</h3>
          <div style={{ backgroundColor: 'var(--color-bg)', padding: '16px', borderRadius: '6px', fontSize: '16px', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
            {ticket.query_text}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontSize: '16px', color: 'var(--color-text)' }}>Company:</strong> 
              <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{ticket.company_name || company?.company_name || 'Unknown'}</span>
            </div>
            <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontSize: '16px', color: 'var(--color-text)' }}>Machine:</strong> 
              <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{ticket.machine_name || product?.machine_name || 'Unknown'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}><strong>Created At:</strong>&nbsp;{new Date(ticket.created_at).toLocaleDateString('en-GB')}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Call & Escalation History</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Level</th>
                <th>Assigned Person</th>
                <th>Designation</th>
                <th>Mobile Number</th>
                <th>Call Status</th>
                <th>Duration</th>
                <th>Last Call Date</th>
              </tr>
            </thead>
            <tbody>
              {ticketLogs.length > 0 ? ticketLogs.map(log => {
                const calledStaff = staff.find(s => String(s.staff_id) === String(log.staff_called));
                const levelNames = ['First Call', 'Second Call', 'Third Call', 'Fourth Call'];
                const levelName = levelNames[log.level - 1] || `Level ${log.level} Call`;

                return (
                  <tr key={log.log_id}>
                    <td>{levelName}</td>
                    <td>{calledStaff?.full_name || 'Unknown Staff'}</td>
                    <td>{calledStaff?.role || '-'}</td>
                    <td>{calledStaff?.phone || '+91 XXXXX XXXXX'}</td>
                    <td>{log.call_status}</td>
                    <td>{log.duration || '-'}</td>
                    <td>{log.timestamp ? new Date(log.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-') : '-'}</td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text)', opacity: 0.6 }}>
                    No call logs available.
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

export default TicketDetail;
