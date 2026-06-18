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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card" style={{ maxWidth: '600px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>Company Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
              <strong style={{ color: 'var(--color-text)', opacity: 0.8 }}>Company Name:</strong> 
              <span style={{ fontWeight: '500', color: 'var(--color-primary)' }}>{company.company_name}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
              <strong style={{ color: 'var(--color-text)', opacity: 0.8 }}>Industry:</strong> 
              <span>{company.industry || '-'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
              <strong style={{ color: 'var(--color-text)', opacity: 0.8 }}>Location:</strong> 
              <span>{company.city}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
              <strong style={{ color: 'var(--color-text)', opacity: 0.8 }}>Primary Contact:</strong> 
              <span>
                {primaryContact ? (
                  <span>
                    {primaryContact.full_name} <br/>
                    <span style={{ fontSize: '13px', opacity: 0.7 }}>{primaryContact.whatsapp_number}</span>
                  </span>
                ) : '-'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
              <strong style={{ color: 'var(--color-text)', opacity: 0.8 }}>Source:</strong> 
              <span>
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: company.source === 'Existing' ? 'var(--color-bg)' : 'rgba(15, 181, 174, 0.1)',
                  color: company.source === 'Existing' ? 'var(--color-text)' : 'var(--color-accent)',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {company.source}
                </span>
              </span>
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
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>
                      <strong>Serial No:</strong> {purchase.serial_no || 'N/A'}
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
