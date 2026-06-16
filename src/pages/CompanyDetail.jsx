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

  const companyContacts = contacts.filter(c => c.company_id === company.company_id);
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Profile Card */}
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Company Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><strong>Industry:</strong> {company.industry || '-'}</div>
              <div><strong>Location:</strong> {company.city}</div>
              <div><strong>Address:</strong> {company.address || '-'}</div>
              <div><strong>GST/Reg:</strong> {company.gst_or_reg_no || '-'}</div>
              <div><strong>Source:</strong> {company.source}</div>
              <div><strong>Created:</strong> {new Date(company.created_at).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Contacts Card */}
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Contacts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {companyContacts.map(contact => (
                <div key={contact.contact_id} style={{ padding: '12px', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    {contact.full_name} {contact.is_primary && <span style={{ fontSize: '10px', backgroundColor: 'var(--color-accent)', color: 'white', padding: '2px 6px', borderRadius: '10px', marginLeft: '8px' }}>Primary</span>}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px' }}>{contact.designation}</div>
                  <div style={{ fontSize: '13px' }}><strong>WhatsApp:</strong> {contact.whatsapp_number}</div>
                  <div style={{ fontSize: '13px' }}><strong>Email:</strong> {contact.email || '-'}</div>
                </div>
              ))}
              {companyContacts.length === 0 && <div>No contacts found.</div>}
            </div>
          </div>
        </div>

        {/* Machines Purchased */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Purchased Machines</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Machine</th>
                  <th>Serial No</th>
                  <th>Purchase Date</th>
                  <th>AMC Status</th>
                </tr>
              </thead>
              <tbody>
                {companyPurchases.map(purchase => {
                  const product = products.find(p => p.product_id === purchase.product_id);
                  return (
                    <tr key={purchase.purchase_id}>
                      <td style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>{product?.machine_name || 'Unknown'}</td>
                      <td>{purchase.serial_no || '-'}</td>
                      <td>{new Date(purchase.purchase_date).toLocaleDateString()}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                          backgroundColor: purchase.amc_status === 'Active' ? 'var(--color-success)' : 'var(--color-danger)',
                          color: 'var(--color-white)'
                        }}>
                          {purchase.amc_status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {companyPurchases.length === 0 && <div style={{ padding: '16px' }}>No machines purchased yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
