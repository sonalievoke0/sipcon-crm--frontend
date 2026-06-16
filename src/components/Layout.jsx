import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ticket, Building2, Users, Package, BarChart2, Inbox } from 'lucide-react';
import logoImg from '../assets/image.png';
import { useCrm } from '../context/CrmContext';

const Layout = () => {
  const location = useLocation();
  const { role, setRole } = useCrm();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['Admin', 'Staff'] },
    { path: '/director-dashboard', label: 'Director Dash', icon: <BarChart2 size={20} />, roles: ['Admin'] },
    { path: '/tickets', label: 'Tickets', icon: <Ticket size={20} />, roles: ['Admin', 'Staff'] },
    { path: '/companies', label: 'Companies', icon: <Building2 size={20} />, roles: ['Admin', 'Staff'] },
    { path: '/leads', label: 'Leads', icon: <Inbox size={20} />, roles: ['Admin', 'Staff'] },
    { path: '/products', label: 'Products Catalog', icon: <Package size={20} />, roles: ['Admin'] },
    { path: '/staff', label: 'Team & Routing', icon: <Users size={20} />, roles: ['Admin'] },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
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
          <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>Powered by Evoke AI</span>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
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
    </div>
  );
};

export default Layout;
