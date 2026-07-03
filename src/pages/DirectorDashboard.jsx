import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';

const DirectorDashboard = () => {
  const { purchases, companies, products } = useCrm();
  const [searchTerm, setSearchTerm] = useState('');

  // Combine data for the table
  const machineData = purchases.map(purchase => {
    const company = companies.find(c => String(c.company_id) === String(purchase.company_id));
    const product = products.find(p => String(p.product_id) === String(purchase.product_id));

    return {
      id: purchase.purchase_id,
      serial_no: purchase.serial_no ? String(purchase.serial_no) : 'N/A',
      company_name: company ? String(company.company_name) : 'Unknown',
      machine_details: product ? String(product.description) : 'Unknown',
      model: product ? String(product.machine_name) : 'Unknown',
      contact_number: purchase.contact_number ? String(purchase.contact_number) : '',
      mail_ID: purchase.mail_ID ? String(purchase.mail_ID) : '',
      DOI: purchase.DOI ? String(purchase.DOI) : '',
    };
  });

  const filteredMachines = machineData.filter(m => 
    String(m.serial_no).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(m.company_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(m.model).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(m.contact_number).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(m.mail_ID).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(m.DOI).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '28px', letterSpacing: '-0.5px' }}>
            Director's Dashboard
          </h2>
          <p style={{ margin: '8px 0 0', color: 'var(--color-text)', opacity: 0.7, fontSize: '15px' }}>
            Overview of installed machines and their details
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search machines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              width: '300px',
              fontSize: '14px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--color-primary)', background: 'linear-gradient(145deg, #ffffff, #f9fafb)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--color-text)', opacity: 0.7, marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Machines</h3>
          <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--color-primary)', marginTop: '8px' }}>
            {machineData.length}
          </div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--color-secondary)', background: 'linear-gradient(145deg, #ffffff, #f9fafb)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--color-text)', opacity: 0.7, marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Companies</h3>
          <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--color-secondary)', marginTop: '8px' }}>
            {new Set(machineData.map(m => m.company_name)).size}
          </div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--color-accent)', background: 'linear-gradient(145deg, #ffffff, #f9fafb)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--color-text)', opacity: 0.7, marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product Models</h3>
          <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--color-accent)', marginTop: '8px' }}>
            {new Set(machineData.map(m => m.model)).size}
          </div>
        </div>
      </div>

      {/* Machines Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', backgroundColor: '#fafafa' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--color-primary)' }}>Machine Directory</h3>
        </div>
        <div className="table-wrapper" style={{ margin: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Sr No of Machines</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Company Name</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Machine Details</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Model</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Contact No.</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Email ID</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Date of Installation</th>
              </tr>
            </thead>
            <tbody>
              {filteredMachines.length > 0 ? (
                filteredMachines.map((m, idx) => (
                  <tr key={m.id} style={{ 
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#fafafa'}
                  >
                    <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--color-primary)' }}>{m.serial_no}</td>
                    <td style={{ padding: '16px 24px', fontWeight: '500', color: '#334155' }}>{m.company_name}</td>
                    <td style={{ padding: '16px 24px', color: '#64748b', lineHeight: '1.5' }}>{m.machine_details}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--color-secondary)', fontWeight: '500' }}>{m.model}</td>
                    <td style={{ padding: '16px 24px', color: '#334155', fontWeight: '500' }}>{m.contact_number || '-'}</td>
                    <td style={{ padding: '16px 24px', color: '#334155' }}>{m.mail_ID || '-'}</td>
                    <td style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500' }}>{m.DOI || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    No machines found matching your search.
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

export default DirectorDashboard;
