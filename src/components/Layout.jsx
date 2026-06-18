import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ticket, Building2, Users, Package, BarChart2, Inbox, Upload, X } from 'lucide-react';
import logoImg from '../assets/image.png';
import { useCrm } from '../context/CrmContext';

const Layout = () => {
  const location = useLocation();
  const { role, setRole } = useCrm();
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['Admin', 'Staff'] },
    { path: '/director-dashboard', label: 'Director Dash', icon: <BarChart2 size={20} />, roles: ['Admin'] },
    { path: '/tickets', label: 'Tickets', icon: <Ticket size={20} />, roles: ['Admin', 'Staff'] },
    { path: '/companies', label: 'Companies', icon: <Building2 size={20} />, roles: ['Admin', 'Staff'] },
    { path: '/products', label: 'Products Catalog', icon: <Package size={20} />, roles: ['Admin'] }
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(role));

  const handleFileUpload = () => {
    if (selectedFile) {
      // Mock upload process: shows alert and acts as if data is uploaded
      alert(`Successfully processed "${selectedFile.name}"! Data has been uploaded to the database.`);
      setIsCsvModalOpen(false);
      setSelectedFile(null);
    } else {
      alert("Please select a CSV file first.");
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Sidebar */}
      <div style={{
        width: '260px',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-white)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img src={logoImg} alt="Sipcon Logo" style={{ maxWidth: '100%', maxHeight: '60px', objectFit: 'contain' }} />
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {visibleNavItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  color: 'var(--color-white)',
                  textDecoration: 'none',
                  backgroundColor: isActive ? 'var(--color-secondary)' : 'transparent',
                  borderLeft: isActive ? '4px solid var(--color-accent)' : '4px solid transparent',
                  transition: 'all 0.2s',
                  gap: '12px'
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div style={{ padding: '24px', fontSize: '12px', opacity: 0.8 }}>
          <a href="https://evokeaisolutions.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 'bold', textDecoration: 'none' }}>Powered by Evoke AI</a>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          height: '64px',
          backgroundColor: 'var(--color-white)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-heading)', color: 'var(--color-text)' }}>
            {navItems.find(i => i.path === location.pathname || (i.path !== '/' && location.pathname.startsWith(i.path)))?.label || 'Overview'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            {/* Upload CSV Button */}
            <button 
              onClick={() => setIsCsvModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-primary)', // Theme blue color
                color: 'var(--color-white)', // White font for better contrast
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'background-color 0.2s'
              }}
            >
              <Upload size={16} color="#fff" />
              Upload CSV
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginLeft: '16px' }}>
              <span style={{ color: 'var(--color-text)', opacity: 0.7 }}>Role:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-white)'
                }}
              >
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              AM
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '32px', flex: 1, backgroundColor: 'var(--color-bg)', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      {/* CSV Upload Modal */}
      {isCsvModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: '12px',
            padding: '32px',
            width: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsCsvModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ margin: '0 0 16px 0', color: 'var(--color-primary)' }}>Upload Data to Database</h2>
            <p style={{ margin: '0 0 24px 0', color: 'var(--color-text)', opacity: 0.7, fontSize: '14px' }}>
              Select a CSV file to parse and insert the records into the database.
            </p>
            
            <div style={{ 
              border: '2px dashed var(--color-border)', 
              borderRadius: '8px', 
              padding: '32px', 
              textAlign: 'center',
              marginBottom: '24px',
              backgroundColor: 'var(--color-bg)'
            }}>
              <input 
                type="file" 
                accept=".csv"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ width: '100%' }}
              />
            </div>

            <button 
              onClick={handleFileUpload}
              style={{
                width: '100%',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                padding: '12px',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Upload to Database
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
