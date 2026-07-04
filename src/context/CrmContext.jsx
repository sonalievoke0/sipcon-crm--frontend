import React, { createContext, useContext, useState, useEffect } from 'react';

const CrmContext = createContext();

const API_BASE = "https://sipcon-crm-backend-production.up.railway.app/api";
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
        console.log(machines)

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
              city: machine.location || '',
              contact_name: machine.name || '',
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
              location: machine.location || '',
              contact_name: machine.name || '',
              contact_number: machine.contact_number || '',
              mail_ID: machine.mail_ID || '',
              DOI: machine.DOI || '',
            });
          }
        });

        setCompanies(derivedCompanies);
        setProducts(derivedProducts);
        setPurchases(derivedPurchases);

        // Provide mock data for deleted endpoints
        setContacts([]);
        setLeads([]);

        const mockStaff = [
          { staff_id: 'S1', full_name: 'Amit Dhiman', role: 'Service Head', phone: '8950099633', email: 'support01@sipconinstrument.com' },
          { staff_id: 'S2', full_name: 'Arun Rawat', role: 'Service Engineer', phone: '9896021192', email: '' },
          { staff_id: 'S3', full_name: 'Shivani Rana', role: 'Service Engineer', phone: '9996901379', email: '' },
          { staff_id: 'S4', full_name: 'Shivani Saini', role: 'Service Engineer', phone: '9996901917', email: '' },
          { staff_id: 'S5', full_name: 'Khushi Joshi', role: 'Service Engineer', phone: '9996991294', email: 'south02@sipconinstrument.com' },
          { staff_id: 'S6', full_name: 'Arun Kumar', role: 'Sr. Sales Manager', phone: '8950099611', email: 'gujarat@sipconinstrument.com' },
          { staff_id: 'S7', full_name: 'Pawan Wadhawan', role: 'Director', phone: '9215699662', email: 'pawan@sipconinstrument.com' }
        ];
        setStaff(mockStaff);

        // Fetch real tickets from backend
        const ticketsRes = await fetch(`${API_BASE}/tickets`, opts);
        if (ticketsRes.ok) {
          const ticketsJson = await ticketsRes.json();
          if (ticketsJson.success && ticketsJson.data) {
            const mappedTickets = ticketsJson.data.map(t => {
              const company = derivedCompanies.find(c => c.company_name === t.Company);
              const product = derivedProducts.find(p => p.machine_name === t.machine);
              return {
                ticket_id: t.Ticket_ID,
                company_id: company ? company.company_id : null,
                product_id: product ? product.product_id : null,
                company_name: t.Company,
                machine_name: t.machine,
                query_text: t.Query,
                summary: t.Summary || t.summary || t.Notes || t.notes || t.Query,
                status: t.Status,
                priority: 'Medium',
                created_at: t.Created
              };
            });
            setTickets(mappedTickets);
          }
        }

        setCallLogs([]);
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

  const getDefaultCallLogs = (ticketId, machineName) => {
    let firstCallStaffId = 'S1'; // Default: Amit Dhiman
    if (machineName.includes('Profile Projector')) {
      firstCallStaffId = 'S2';
    } else if (machineName.includes('Die Genie') || machineName.includes('Moving Part Genie')) {
      firstCallStaffId = 'S3';
    } else if (machineName.includes('Vision Measuring Machine') || machineName.includes('CNC Machine')) {
      firstCallStaffId = 'S4';
    } else if (machineName.includes('Cable')) {
      firstCallStaffId = 'S5';
    }

    const secondCallStaffId = 'S6'; // Arun Kumar
    const lastCallStaffId = 'S7'; // Pawan Wadhawan

    return [
      { log_id: `${ticketId}-1`, ticket_id: ticketId, staff_called: firstCallStaffId, level: 1, timestamp: null, call_status: 'Pending', outcome: '-' },
      { log_id: `${ticketId}-2`, ticket_id: ticketId, staff_called: secondCallStaffId, level: 2, timestamp: null, call_status: 'Pending', outcome: '-' },
      { log_id: `${ticketId}-3`, ticket_id: ticketId, staff_called: lastCallStaffId, level: 3, timestamp: null, call_status: 'Pending', outcome: '-' }
    ];
  };

  const loadCallLogsForTicket = async (ticketId) => {
    try {
      const ticket = tickets.find(t => String(t.ticket_id) === String(ticketId));
      const machineName = ticket ? ticket.machine_name || '' : '';

      const res = await fetch(`${API_BASE}/call-logs/${ticketId}`, { headers: HEADERS });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const dbLog = json.data[0];

          let firstCallStaffId = 'S1';
          if (machineName.includes('Profile Projector')) {
            firstCallStaffId = 'S2';
          } else if (machineName.includes('Die Genie') || machineName.includes('Moving Part Genie')) {
            firstCallStaffId = 'S3';
          } else if (machineName.includes('Vision Measuring Machine') || machineName.includes('CNC Machine')) {
            firstCallStaffId = 'S4';
          } else if (machineName.includes('Cable')) {
            firstCallStaffId = 'S5';
          }

          const levelLogs = [
            {
              log_id: `${ticketId}-1`,
              ticket_id: ticketId,
              staff_called: firstCallStaffId,
              level: 1,
              timestamp: dbLog.firstCallDate || null,
              call_status: dbLog.firstCallStatus || 'Pending',
              duration: dbLog.firstDuration || '-',
              outcome: dbLog.firstCallStatus ? `Status: ${dbLog.firstCallStatus}` : '-'
            },
            {
              log_id: `${ticketId}-2`,
              ticket_id: ticketId,
              staff_called: 'S6',
              level: 2,
              timestamp: dbLog.secondCallDate || null,
              call_status: dbLog.secondCallStatus || 'Pending',
              duration: dbLog.secondDuration || '-',
              outcome: dbLog.secondCallStatus ? `Status: ${dbLog.secondCallStatus}` : '-'
            },
            {
              log_id: `${ticketId}-3`,
              ticket_id: ticketId,
              staff_called: 'S7',
              level: 3,
              timestamp: dbLog.thirdCallDate || null,
              call_status: dbLog.thirdCallStatus || 'Pending',
              duration: dbLog.thirdDuration || '-',
              outcome: dbLog.thirdCallStatus ? `Status: ${dbLog.thirdCallStatus}` : '-'
            }
          ];

          setCallLogs(prev => {
            const filtered = prev.filter(l => String(l.ticket_id) !== String(ticketId));
            return [...filtered, ...levelLogs];
          });
          return;
        }
      }

      // Default pending fallback
      const defaultLogs = getDefaultCallLogs(ticketId, machineName);
      setCallLogs(prev => {
        const filtered = prev.filter(l => String(l.ticket_id) !== String(ticketId));
        return [...filtered, ...defaultLogs];
      });
    } catch (err) {
      console.error('Failed to fetch call logs for ticket:', err);
    }
  };

  const fetchRecording = async (ticketID) => {
    try {
      console.log('Calling recording API for ticket:', ticketID);
      const res = await fetch(`${API_BASE}/recording/${ticketID}`, {
        headers: HEADERS
      });

      const data = await res.json().catch(() => ({}));
      console.log('Recording API response:', data);

      if (!res.ok) {
        return {
          success: false,
          message: data.message || 'Recording not found.'
        };
      }

      return data;
    } catch (err) {
      console.error('Failed to fetch recording:', err);
      return {
        success: false,
        message: 'Unable to load recording. Please try again later.'
      };
    }
  };

  const createTicket = async (ticketData) => {
    const newTicketId = `TICK-${Date.now()}`;
    const company = companies.find(c => String(c.company_id) === String(ticketData.company_id));
    const companyName = company ? company.company_name : 'Unknown';
    const product = products.find(p => String(p.product_id) === String(ticketData.product_id));
    const machineName = product ? product.machine_name : '';
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const backendTicket = {
      Ticket_ID: newTicketId,
      Company: companyName,
      Query: ticketData.query_text,
      machine: machineName,
      Created: createdAt,
      Status: 'Open'
    };

    try {
      const res = await fetch(`${API_BASE}/add-ticket`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(backendTicket)
      });

      if (res.ok) {
        const newTicket = {
          ticket_id: newTicketId,
          company_id: ticketData.company_id,
          product_id: ticketData.product_id,
          company_name: companyName,
          machine_name: machineName,
          query_text: ticketData.query_text,
          status: 'Open',
          priority: 'Medium',
          summary: ticketData.summary || ticketData.query_text,
          created_at: createdAt
        };
        setTickets(prev => [...prev, newTicket]);
        return newTicketId;
      }
    } catch (err) {
      console.error('Failed to create ticket in backend:', err);
    }
  };

  const updateTicket = async (ticket_id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticket_id}`, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updatedTicket = await res.json();
        const company = companies.find(c => c.company_name === updatedTicket.Company);
        const product = products.find(p => p.machine_name === updatedTicket.machine);
        const mappedTicket = {
          ticket_id: updatedTicket.Ticket_ID,
          company_id: company ? company.company_id : null,
          product_id: product ? product.product_id : null,
          company_name: updatedTicket.Company,
          machine_name: updatedTicket.machine,
          query_text: updatedTicket.Query,
          summary: updatedTicket.Summary || updatedTicket.summary || updatedTicket.Notes || updatedTicket.notes || updatedTicket.Query,
          status: updatedTicket.Status,
          priority: 'Medium',
          created_at: updatedTicket.Created
        };

        setTickets(tickets => tickets.map(t => String(t.ticket_id) === String(ticket_id) ? mappedTicket : t));
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

  const uploadCsv = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/upload-machines`, {
        method: 'POST',
        headers: {
          'x-api-key': HEADERS['x-api-key']
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await res.json();
      // Refresh the data after successful upload
      fetchAllData();
      return data;
    } catch (err) {
      console.error('Failed to upload CSV:', err);
      throw err;
    }
  };

  const value = {
    role, setRole,
    companies, setCompanies,
    contacts, setContacts,
    products, setProducts, updateProduct,
    purchases, setPurchases,
    staff, setStaff,
    tickets, setTickets, updateTicket, createTicket, loadCallLogsForTicket, fetchRecording,
    leads, setLeads,
    callLogs, setCallLogs, uploadCsv,
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
