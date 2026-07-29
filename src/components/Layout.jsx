import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ticket, Building2, Users, Package, BarChart2, Inbox, X } from 'lucide-react';
import logoImg from '../assets/image.png';
import evokeLogo from '../assets/evoke.png';
import { useCrm } from '../context/CrmContext';

const Layout = ({ onLogout }) => {
  const location = useLocation();
  const { role, setRole } = useCrm();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['Admin', 'Staff'] },
    { path: '/tickets', label: 'Tickets', icon: <Ticket size={20} />, roles: ['Admin', 'Staff'] },
    { path: '/companies', label: 'Companies', icon: <Building2 size={20} />, roles: ['Admin', 'Staff'] }
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(role));



  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
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
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: 0 }}>
          <img src={evokeLogo} alt="Evoke AI Logo" style={{ height: '52px', objectFit: 'contain', marginRight: '-6px' }} />
          <a href="https://evokeaisolutions.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-white)', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>Powered by Evoke AI</a>
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
            {onLogout && (
              <button
                onClick={onLogout}
                style={{
                  padding: '6px 16px',
                  backgroundColor: 'var(--color-primary)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: 'var(--color-white)',
                  fontSize: '14px',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Logout
              </button>
            )}

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


    </div>
  );
};

export default Layout;
