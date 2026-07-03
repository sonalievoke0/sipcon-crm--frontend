import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrm } from '../context/CrmContext';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { companies, contacts, purchases, products } = useCrm();

  const company = companies.find(c => c.company_id === parseInt(id));

  if (!company) {
    return <div style={{ padding: '24px' }}>Company not found.</div>;
  }

  const primaryContact = contacts.find(c => c.company_id === company.company_id && c.is_primary);
  const companyPurchases = purchases.filter(p => p.company_id === company.company_id);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/companies')}
          style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: 'var(--color-white)' }}
        >
          &larr; Back
        </button>
        <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>{company.company_name}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        <div className="card" style={{ maxWidth: '600px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>Company Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
              <strong style={{ color: 'var(--color-text)', opacity: 0.8 }}>Company Name:</strong> 
              <span style={{ fontWeight: '500', color: 'var(--color-primary)' }}>{company.company_name}</span>
            </div>
          </div>
        </div>

        {/* Installed Machines */}
        <div className="card">
          <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>Installed Machines</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {companyPurchases.length > 0 ? (
              companyPurchases.map(purchase => {
                const product = products.find(p => p.product_id === purchase.product_id);
                return (
                  <div key={purchase.purchase_id} style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-bg)' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--color-secondary)', fontSize: '16px', marginBottom: '4px' }}>
                      {product?.machine_name || 'Unknown Model'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text)', opacity: 0.8, marginBottom: '8px' }}>
                      {product?.description || 'No details'}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '500', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                      <div><strong>Serial No:</strong> {purchase.serial_no || 'N/A'}</div>
                      {purchase.location && <div><strong>Location:</strong> {purchase.location}</div>}
                      {purchase.contact_name && <div><strong>Contact Name:</strong> {purchase.contact_name}</div>}
                      {purchase.contact_number && <div><strong>Contact No:</strong> {purchase.contact_number}</div>}
                      {purchase.mail_ID && <div><strong>Email ID:</strong> {purchase.mail_ID}</div>}
                      {purchase.DOI && <div><strong>Date of Installation:</strong> {purchase.DOI}</div>}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text)', opacity: 0.7 }}>
                No machines found for this company.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
