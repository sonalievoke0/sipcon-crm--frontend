import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrm } from '../context/CrmContext';
import StatusBadge from '../components/StatusBadge';
import WaveAudioPlayer from '../components/WaveAudioPlayer';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, updateTicket, companies, contacts, products, staff, callLogs, role, loadCallLogsForTicket } = useCrm();
  const [showRecordings, setShowRecordings] = useState(false);

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
  const product = products.find(p => String(p.product_id) === String(ticket.product_id));
  const ticketLogs = callLogs.filter(l => String(l.ticket_id) === String(ticket.ticket_id)).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const handleStatusChange = async (newStatus) => {
    await updateTicket(ticket.ticket_id, { status: newStatus });
  };

  const hasConnectedCall = ticketLogs.some(log => log.call_status && (log.call_status.toLowerCase().includes('connected') || log.call_status.toLowerCase().includes('answered')));

  const recordedLogs = ticketLogs
    .filter(log => log.call_status && (log.call_status.toLowerCase().includes('connected') || log.call_status.toLowerCase().includes('answered')))
    .sort((a, b) => a.level - b.level);

  const getNextStatusOptions = () => {
    switch (ticket.status) {
      case 'Connected': return ['In Progress'];
      case 'In Progress': return ['Escalated', 'Resolved'];
      case 'Escalated': return ['Resolved'];
      case 'Resolved': return ['Reopen (Connected)'];
      default: return [];
    }
  };

  const formatLogDate = (dateString) => {
    if (!dateString) return '-';
    if (typeof dateString === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      return dateString;
    }
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-GB').replace(/\//g, '-');
    } catch {
      return dateString;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/tickets')}
            style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            ← Back
          </button>
          <h1 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {ticket.ticket_id}
            <StatusBadge status={ticket.status} />
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {getNextStatusOptions().map(statusLabel => {
            const actualStatus = statusLabel.includes('Reopen') ? 'Connected' : statusLabel;
            return (
              <button
                key={statusLabel}
                onClick={() => handleStatusChange(actualStatus)}
                style={{
                  padding: '8px 16px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Mark as {statusLabel}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '18px' }}>Query Details</h2>
            
            {(hasConnectedCall && ticket.status && (ticket.status.toLowerCase() === 'resolved' || ticket.status.toLowerCase() === 'unresolved')) && (
              <button 
                onClick={() => setShowRecordings(!showRecordings)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: showRecordings ? 'var(--color-white)' : 'var(--color-primary)',
                  color: showRecordings ? 'var(--color-primary)' : 'var(--color-white)',
                  border: `2px solid var(--color-primary)`,
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: showRecordings ? 'none' : '0 4px 8px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease',
                  transform: showRecordings ? 'translateY(2px)' : 'none'
                }}
                onMouseOver={(e) => {
                  if(!showRecordings) {
                    e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
                    e.currentTarget.style.borderColor = 'var(--color-secondary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
                  }
                }}
                onMouseOut={(e) => {
                  if(!showRecordings) {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                  }
                }}
              >
                🎧 {showRecordings ? 'Hide Recording' : 'View Call Recording'}
              </button>
            )}
          </div>
          <div style={{ backgroundColor: 'var(--color-bg)', padding: '16px', borderRadius: '6px', fontSize: '16px', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
            {ticket.query_text}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
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

      {showRecordings && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card" style={{ 
            backgroundColor: '#173d72',
            color: 'white',
            borderRadius: '20px', 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)', 
            position: 'relative',
            maxWidth: '600px',
            width: '100%',
            border: 'none',
            padding: '32px'
          }}>
            <button 
              onClick={() => setShowRecordings(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: 'white', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
              title="Close"
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ margin: 0, color: 'white', fontSize: '24px' }}>Call Recording</h3>
              <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>
                Listen to the conversation recording and read the AI summary associated with this ticket.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {recordedLogs.length > 0 ? recordedLogs.map(log => (
                <div key={log.log_id} style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', padding: '20px', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                  
                  {log.recording_url ? (
                    <div style={{ marginBottom: '24px', backgroundColor: 'white', padding: '16px', borderRadius: '12px' }}>
                      <WaveAudioPlayer url={log.recording_url} />
                    </div>
                  ) : (
                    <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', textAlign: 'center' }}>
                       Recording audio not available yet.
                    </div>
                  )}

                  {log.summary ? (
                    <div>
                      <h4 style={{ margin: '0 0 12px 0', color: 'white', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        Summary
                      </h4>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6' }}>
                        {log.summary}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h4 style={{ margin: '0 0 12px 0', color: 'white', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        Summary
                      </h4>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.6', fontStyle: 'italic' }}>
                        No summary available.
                      </p>
                    </div>
                  )}
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.7)' }}>
                  No connected calls found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '24px' }}>
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
                    <td>{formatLogDate(log.timestamp)}</td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text)' }}>
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
