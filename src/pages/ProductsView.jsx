import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';

const ProductsView = () => {
  const { products, updateProduct, role } = useCrm();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditClick = (product) => {
    setEditingId(product.product_id);
    setEditForm(product);
  };

  const handleSave = async () => {
    await updateProduct(editingId, editForm);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Product Catalog</h2>
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
            + Add Machine
          </button>
        )}
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Machine Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                {role === 'Admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.product_id}>
                  {editingId === p.product_id ? (
                    <>
                      <td><input type="text" name="machine_name" value={editForm.machine_name} onChange={handleChange} style={{ width: '100%', padding: '4px' }} /></td>
                      <td><input type="text" name="category" value={editForm.category} onChange={handleChange} style={{ width: '100%', padding: '4px' }} /></td>
                      <td><input type="text" name="description" value={editForm.description} onChange={handleChange} style={{ width: '100%', padding: '4px' }} /></td>
                      <td><input type="checkbox" name="active" checked={editForm.active} onChange={handleChange} /> Active</td>
                      <td>
                        <button onClick={handleSave} style={{ padding: '4px 8px', backgroundColor: 'var(--color-success)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                        <button onClick={() => setEditingId(null)} style={{ padding: '4px 8px', marginLeft: '8px', backgroundColor: 'var(--color-border)', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>{p.machine_name}</td>
                      <td>{p.category}</td>
                      <td>{p.description}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                          backgroundColor: p.active ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                          color: p.active ? 'var(--color-success)' : 'var(--color-danger)'
                        }}>
                          {p.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {role === 'Admin' && (
                        <td>
                          <button 
                            onClick={() => handleEditClick(p)}
                            style={{ padding: '4px 12px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsView;
