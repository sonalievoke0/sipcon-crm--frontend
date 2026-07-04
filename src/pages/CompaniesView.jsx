import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrm } from '../context/CrmContext';

const CompaniesView = () => {
  const { purchases, companies, products, role } = useCrm();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Combine data to display as the Companies Directory based on installed machines
  const catalogData = purchases.map(purchase => {
    const company = companies.find(c => String(c.company_id) === String(purchase.company_id));
    const product = products.find(p => String(p.product_id) === String(purchase.product_id));

    return {
      id: purchase.purchase_id,
      company_id: purchase.company_id,
      serial_no: purchase.serial_no ? String(purchase.serial_no) : 'N/A',
      company_name: company ? String(company.company_name) : 'Unknown',
      machine_details: product ? String(product.description) : 'Unknown',
      model: product ? String(product.machine_name) : 'Unknown',
      location: purchase.location ? String(purchase.location) : '',
      contact_name: purchase.contact_name ? String(purchase.contact_name) : '',
      contact_number: purchase.contact_number ? String(purchase.contact_number) : '',
      mail_ID: purchase.mail_ID ? String(purchase.mail_ID) : '',
      DOI: purchase.DOI ? String(purchase.DOI) : '',
    };
  });

  const filteredCatalog = catalogData.filter(item => 
    String(item.serial_no).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.company_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.model).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.location).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.contact_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.contact_number).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.mail_ID).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.DOI).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCatalog.length / itemsPerPage);
  const paginatedCatalog = filteredCatalog.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '32px', letterSpacing: '-0.5px' }}>Companies Directory</h2>
          <p style={{ margin: '8px 0 0', color: 'var(--color-text)', opacity: 0.7, fontSize: '17px' }}>
            Directory of companies and installed machines
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                width: '300px',
                fontSize: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
        <div className="table-wrapper" style={{ margin: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)', width: '80px' }}>S.No.</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Company Name</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Name</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Sr No of Machines</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Machine Details</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Model</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Contact No.</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Email ID</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Location</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-white)' }}>Date of Installation</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCatalog.length > 0 ? (
                paginatedCatalog.map((item, idx) => {
                  const actualIdx = (currentPage - 1) * itemsPerPage + idx;
                  return (
                  <tr 
                  key={item.id} 
                  onClick={() => navigate(`/companies/${item.company_id}`)}
                  style={{ 
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#fafafa'}
                  >
                    <td style={{ padding: '16px 24px', fontWeight: '500', color: '#64748b' }}>{actualIdx + 1}</td>
                    <td style={{ padding: '16px 24px', fontWeight: '500', color: '#334155' }}>{item.company_name}</td>
                    <td style={{ padding: '16px 24px', color: '#334155', fontWeight: '500' }}>{item.contact_name || '-'}</td>
                    <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--color-primary)' }}>{item.serial_no}</td>
                    <td style={{ padding: '16px 24px', color: '#64748b', lineHeight: '1.5' }}>{item.machine_details}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--color-secondary)', fontWeight: '500' }}>{item.model}</td>
                    <td style={{ padding: '16px 24px', color: '#334155', fontWeight: '500' }}>{item.contact_number || '-'}</td>
                    <td style={{ padding: '16px 24px', color: '#334155' }}>{item.mail_ID || '-'}</td>
                    <td style={{ padding: '16px 24px', color: '#64748b' }}>{item.location || '-'}</td>
                    <td style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500' }}>{item.DOI || '-'}</td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    No companies found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
            <div style={{ color: 'var(--color-text)', opacity: 0.7, fontSize: '16px' }}>
              Showing {filteredCatalog.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredCatalog.length)} of {filteredCatalog.length} entries
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: currentPage === 1 ? '#f1f5f9' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px', fontWeight: 'bold' }}>
                {currentPage} / {totalPages || 1}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: currentPage === totalPages || totalPages === 0 ? '#f1f5f9' : '#fff', cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesView;
