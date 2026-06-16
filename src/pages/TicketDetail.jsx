import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrm } from '../context/CrmContext';
import StatusBadge from '../components/StatusBadge';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, updateTicket, companies, contacts, products, staff, callLogs, role } = useCrm();

  const ticket = tickets.find(t => String(t.ticket_id) === String(id));

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
      case 'Open': return ['In Progress'];
      case 'In Progress': return ['Escalated', 'Resolved'];
      case 'Escalated': return ['Resolved'];
      case 'Resolved': return ['Closed'];
      case 'Closed': return ['Reopen (Open)'];
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
            const actualStatus = statusLabel.includes('Reopen') ? 'Open' : statusLabel;
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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Query Details</h3>
            <div style={{ backgroundColor: 'var(--color-bg)', padding: '16px', borderRadius: '6px', fontSize: '16px', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
              {ticket.query_text}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><strong>Machine:</strong> {product?.machine_name || 'Unknown'}</div>
              <div><strong>Priority:</strong> <span style={{ color: ticket.priority === 'Critical' ? 'var(--color-danger)' : 'inherit' }}>{ticket.priority}</span></div>
              <div><strong>Created At:</strong> {new Date(ticket.created_at).toLocaleString()}</div>
              <div><strong>Internal Notes:</strong> {ticket.notes || '-'}</div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Call & Escalation History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {ticketLogs.map(log => {
                const calledStaff = staff.find(s => s.staff_id === log.staff_called);
                return (
                  <div key={log.log_id} style={{ borderLeft: '4px solid var(--color-secondary)', paddingLeft: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: 'var(--color-primary)' }}>{calledStaff?.full_name || 'Unknown Staff'} (L{log.level})</strong>
                      <span style={{ fontSize: '12px', opacity: 0.7 }}>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div style={{ marginBottom: '4px', fontSize: '13px' }}>
                      Status: <strong>{log.call_status}</strong>
                    </div>
                    <div style={{ fontSize: '14px', backgroundColor: 'var(--color-bg)', padding: '8px', borderRadius: '4px' }}>
                      {log.outcome}
                    </div>
                  </div>
                )
              })}
              {ticketLogs.length === 0 && <div>No call logs available.</div>}
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Customer Info</h3>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{company?.company_name || 'Unknown Company'}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{company?.city}</div>
            </div>
            {contact && (
              <div style={{ padding: '12px', backgroundColor: 'var(--color-bg)', borderRadius: '6px' }}>
                <div style={{ fontWeight: 'bold' }}>{contact.full_name}</div>
                <div style={{ fontSize: '12px', marginBottom: '8px' }}>{contact.designation}</div>
                <div>📞 {contact.whatsapp_number}</div>
                {contact.email && <div>✉️ {contact.email}</div>}
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Assignment</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {assignedStaff?.full_name.substring(0, 2).toUpperCase() || '?'}
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>{assignedStaff?.full_name || 'Unassigned'}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Level {ticket.current_level} Engineer</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
