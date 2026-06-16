import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrm } from '../context/CrmContext';

const CompaniesView = () => {
  const { companies, contacts, role } = useCrm();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredCompanies = companies.filter(c => 
    c.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Companies Directory</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <input 
            type="text" 
            placeholder="Search companies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '250px' }}
          />
          {role === 'Admin' && (
            <button style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              + Add Company
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Industry</th>
                <th>Location</th>
                <th>Primary Contact</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map(c => {
                const primaryContact = contacts.find(contact => contact.company_id === c.company_id && contact.is_primary);
                return (
                  <tr 
                    key={c.company_id} 
                    onClick={() => navigate(`/companies/${c.company_id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>{c.company_name}</td>
                    <td>{c.industry || '-'}</td>
                    <td>{c.city}</td>
                    <td>
                      {primaryContact ? (
                        <div>
                          <div>{primaryContact.full_name}</div>
                          <div style={{ fontSize: '12px', opacity: 0.7 }}>{primaryContact.whatsapp_number}</div>
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: c.source === 'Existing' ? 'var(--color-bg)' : 'rgba(15, 181, 174, 0.1)',
                        color: c.source === 'Existing' ? 'var(--color-text)' : 'var(--color-accent)',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {c.source}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompaniesView;
