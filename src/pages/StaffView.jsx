import React from 'react';
import { useCrm } from '../context/CrmContext';

const StaffView = () => {
  const { staff, products, role } = useCrm();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Team & Routing</h2>
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
            + Add Staff
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Service & Sales Team</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Level</th>
                  <th>Contact</th>
                  <th>Machines Handled</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(s => (
                  <tr key={s.staff_id}>
                    <td style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{s.full_name}</td>
                    <td>{s.designation}</td>
                    <td>
                      <span style={{ 
                        padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: 'var(--color-bg)', color: 'var(--color-text)'
                      }}>
                        L{s.level}
                      </span>
                    </td>
                    <td>
                      <div>{s.phone}</div>
                      <div style={{ fontSize: '12px', opacity: 0.7 }}>{s.email}</div>
                    </td>
                    <td>
                      {s.products_handled === 'All' ? 'All Machines' : 
                        products.filter(p => s.products_handled.includes(p.product_id))
                                .map(p => p.machine_name)
                                .join(', ')
                      }
                    </td>
                    <td>
                      <span style={{ color: s.active ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 'bold' }}>
                        {s.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Escalation Routing by Product</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Machine Name</th>
                  <th>Level 1 (First Contact)</th>
                  <th>Level 2 (Escalation)</th>
                  <th>Level 3 (Director)</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const getStaffForLevel = (level) => {
                    const assigned = staff.filter(s => 
                      s.level === level && 
                      (s.products_handled === 'All' || s.products_handled.includes(p.product_id))
                    );
                    return assigned.length > 0 ? assigned.map(a => a.full_name).join(', ') : 'Unassigned';
                  };

                  return (
                    <tr key={p.product_id}>
                      <td style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>{p.machine_name}</td>
                      <td>{getStaffForLevel(1)}</td>
                      <td>{getStaffForLevel(2)}</td>
                      <td>{getStaffForLevel(3)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffView;
