import React, { createContext, useContext, useState, useEffect } from 'react';

const CrmContext = createContext();

const API_BASE = 'https://sipcon-crm-backend.onrender.com/api';
const HEADERS = { 'x-api-key': 'sip_9k2mXqLvT4rNwZdBpFhJeYcU8aGs3Ro', 'Content-Type': 'application/json' };

export const CrmProvider = ({ children }) => {
  const [role, setRole] = useState('Admin'); // 'Admin' or 'Staff'

  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [staff, setStaff] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [leads, setLeads] = useState([]);
  const [callLogs, setCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const opts = { headers: HEADERS };
      const [compRes, contRes, prodRes, purRes, staffRes, tickRes, leadsRes, callRes] = await Promise.all([
        fetch(`${API_BASE}/companies`, opts),
        fetch(`${API_BASE}/contacts`, opts),
        fetch(`${API_BASE}/products`, opts),
        fetch(`${API_BASE}/purchases`, opts),
        fetch(`${API_BASE}/staff`, opts),
        fetch(`${API_BASE}/tickets`, opts),
        fetch(`${API_BASE}/leads`, opts),
        fetch(`${API_BASE}/call_logs`, opts)
      ]);

      if (compRes.ok) setCompanies(await compRes.json());
      if (contRes.ok) setContacts(await contRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (purRes.ok) setPurchases(await purRes.json());
      if (staffRes.ok) setStaff(await staffRes.json());
      if (tickRes.ok) setTickets(await tickRes.json());
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (callRes.ok) setCallLogs(await callRes.json());
    } catch (error) {
      console.error('Failed to fetch data from backend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Poll for new leads every 10 seconds
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/leads`, { headers: HEADERS });
        if (res.ok) setLeads(await res.json());
      } catch (err) { }
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // Update functions that persist to backend
  const updateTicket = async (ticket_id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticket_id}`, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updatedTicket = await res.json();
        setTickets(tickets.map(t => String(t.ticket_id) === String(ticket_id) ? updatedTicket : t));
      }
    } catch (err) {
      console.error('Failed to update ticket:', err);
    }
  };

  const updateProduct = async (product_id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/products/${product_id}`, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updatedProduct = await res.json();
        setProducts(products.map(p => String(p.product_id) === String(product_id) ? updatedProduct : p));
      }
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const value = {
    role, setRole,
    companies, setCompanies,
    contacts, setContacts,
    products, setProducts, updateProduct,
    purchases, setPurchases,
    staff, setStaff,
    tickets, setTickets, updateTicket,
    leads, setLeads,
    callLogs, setCallLogs,
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading CRM Data from Backend...</div>;

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
