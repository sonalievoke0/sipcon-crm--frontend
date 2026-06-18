import React, { createContext, useContext, useState, useEffect } from 'react';

const CrmContext = createContext();

const API_BASE = 'http://localhost:5000/api';
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
      const res = await fetch(`${API_BASE}/machines`, opts);
      
      if (res.ok) {
        const machines = await res.json();
        
        const derivedCompanies = [];
        const derivedProducts = [];
        const derivedPurchases = [];
        
        let companyIdCounter = 1;
        let productIdCounter = 1;
        let purchaseIdCounter = 1;

        machines.forEach(machine => {
          let company = derivedCompanies.find(c => c.company_name === machine.company_name);
          if (!company && machine.company_name) {
            company = {
              company_id: companyIdCounter++,
              company_name: machine.company_name,
              industry: '',
              city: '',
              source: 'DB',
            };
            derivedCompanies.push(company);
          }
          
          let product = derivedProducts.find(p => p.machine_name === machine.model);
          if (!product && machine.model) {
            product = {
              product_id: productIdCounter++,
              machine_name: machine.model,
              description: machine.machine_details,
            };
            derivedProducts.push(product);
          }
          
          if (company && product) {
            derivedPurchases.push({
              purchase_id: purchaseIdCounter++,
              company_id: company.company_id,
              product_id: product.product_id,
              serial_no: machine.machine_serial_no || machine.machine_no,
            });
          }
        });

        setCompanies(derivedCompanies);
        setProducts(derivedProducts);
        setPurchases(derivedPurchases);
        
        // Provide mock data for deleted endpoints
        setContacts([]);
        setStaff([]);
        setLeads([]);
        setCallLogs([]);
        setTickets([
          { ticket_id: 'TICK-MOCK', status: 'Open', query_text: 'Example mock ticket since backend tickets route was deleted', priority: 'Medium' }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch data from backend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
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
