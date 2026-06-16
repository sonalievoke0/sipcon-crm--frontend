import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrm } from '../context/CrmContext';

const LeadsView = () => {
  const { leads, companies } = useCrm();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Match lead to an existing company by company_name (case-insensitive)
  const findMatchedCompany = (lead) => {
    const leadCompany = (lead.company_name || '').trim().toLowerCase();
    if (!leadCompany) return null;
    return companies.find(
      (c) => (c.company_name || '').trim().toLowerCase() === leadCompany
    ) || null;
  };

  const filteredLeads = leads.filter((lead) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      (lead.name || lead.contact_name || '').toLowerCase().includes(searchLower) ||
      (lead.company_name || '').toLowerCase().includes(searchLower) ||
      (lead.email || '').toLowerCase().includes(searchLower) ||
      (lead.source || lead.machine_interest || '').toLowerCase().includes(searchLower);

    const status = lead.status || (lead.converted === 'TRUE' || lead.converted === true ? 'Converted' : 'New');
    const matchesFilter = filterStatus === 'All' || status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const statusColor = {
    New: { bg: 'rgba(255,193,7,0.15)', color: '#f59e0b' },
    Contacted: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
    Qualified: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
    Converted: { bg: 'rgba(15,181,174,0.15)', color: 'var(--color-accent)' },
    Lost: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Leads Pipeline</h2>
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '13px' }}>
            {leads.length} total · {leads.filter(l => !(l.converted === 'TRUE' || l.converted === true || l.status === 'Converted')).length} open
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px', width: '200px' }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px', background: 'var(--color-card)', color: 'var(--color-text)' }}
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {['New', 'Contacted', 'Qualified', 'Converted'].map((s) => {
          const count = leads.filter((l) => {
            const st = l.status || (l.converted === 'TRUE' || l.converted === true ? 'Converted' : 'New');
            return st === s;
          }).length;
          const col = statusColor[s];
          return (
            <div key={s} className="card" style={{ padding: '12px 16px', textAlign: 'center', cursor: 'pointer', border: filterStatus === s ? `1.5px solid ${col.color}` : '' }}
              onClick={() => setFilterStatus(filterStatus === s ? 'All' : s)}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: col.color }}>{count}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{s}</div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Contact Name</th>
                <th>Company Name</th>
                <th>Matched Company</th>
                <th>Phone / Email</th>
                <th>Source / Interest</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const matchedCompany = findMatchedCompany(lead);
                const status = lead.status || (lead.converted === 'TRUE' || lead.converted === true ? 'Converted' : 'New');
                const col = statusColor[status] || statusColor['New'];
                const contactName = lead.name || lead.contact_name || '—';
                const phone = lead.phone || lead.whatsapp_number || '—';
                const email = lead.email || '—';
                const source = lead.source || lead.machine_interest || '—';

                return (
                  <tr key={lead.lead_id || lead.id}>
                    <td style={{ fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}
                    </td>
                    <td style={{ fontWeight: '600' }}>{contactName}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{lead.company_name || '—'}</td>
                    <td>
                      {matchedCompany ? (
                        <span
                          onClick={() => navigate(`/companies/${matchedCompany.company_id}`)}
                          style={{
                            color: 'var(--color-secondary)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '13px',
                          }}
                          title="Click to view company"
                        >
                          🔗 {matchedCompany.company_name}
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>No match</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '13px' }}>{phone}</div>
                      {email !== '—' && <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{email}</div>}
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', backgroundColor: 'rgba(99,102,241,0.1)', color: '#6366f1', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>
                        {source}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: col.bg,
                        color: col.color,
                        whiteSpace: 'nowrap',
                      }}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
                    {search || filterStatus !== 'All' ? 'No leads match your filters.' : 'No leads yet. Leads from ManyChat will appear here.'}
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

export default LeadsView;
