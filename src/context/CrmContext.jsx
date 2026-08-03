import React, { createContext, useContext, useState, useEffect } from 'react';

const CrmContext = createContext();

const API_BASE = "https://sipcon-backend.evokeaisolutions.com/api";
const HEADERS = { 'x-api-key': 'sip_9k2mXqLvT4rNwZdBpFhJeYcU8aGs3Ro', 'x-client-source': 'evoke', 'Content-Type': 'application/json' };

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
          let cName = machine.company_name || 'Unknown Company';
          let company = derivedCompanies.find(c => c.company_name === cName);
          if (!company) {
            company = {
              company_id: companyIdCounter++,
              company_name: cName,
              industry: '',
              machine_name: machine.model || machine.machine_details || 'Unknown Model',
              city: machine.location || '',
              contact_name: machine.name || '',
              contact_number: machine.contact_number || '',
              mail_ID: machine.mail_ID || '',
              source: 'DB',
            };
            derivedCompanies.push(company);
          }

          let modelName = machine.model || machine.machine_details || 'Unknown Model';
          let product = derivedProducts.find(p => p.machine_name === modelName);
          if (!product) {
            product = {
              product_id: productIdCounter++,
              machine_name: modelName,
              description: machine.machine_details || '',
            };
            derivedProducts.push(product);
          }

          if (company && product) {
            derivedPurchases.push({
              purchase_id: purchaseIdCounter++,
              company_id: company.company_id,
              product_id: product.product_id,
              serial_no: machine.machine_serial_no || machine.machine_no || 'N/A',
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
              const lowerT = Object.keys(t).reduce((acc, key) => {
                acc[key.toLowerCase()] = t[key];
                return acc;
              }, {});

              let company = derivedCompanies.find(c => c.company_name === lowerT.company);
              if (!company && lowerT.company) {
                const tName = lowerT.company.toLowerCase();
                company = derivedCompanies.find(c => c.company_name.toLowerCase().includes(tName) || tName.includes(c.company_name.toLowerCase()));
              }

              let product = derivedProducts.find(p => p.machine_name === lowerT.machine);
              if (!product && lowerT.machine) {
                const mName = lowerT.machine.toLowerCase();
                product = derivedProducts.find(p => p.machine_name.toLowerCase().includes(mName) || mName.includes(p.machine_name.toLowerCase()));
              }

              return {
                ticket_id: lowerT.ticket_id,
                company_id: company ? company.company_id : null,
                product_id: product ? product.product_id : null,
                company_name: lowerT.company,
                client_name: lowerT.contact_name || lowerT.contact_person || lowerT.client_name || lowerT.name || '',
                client_number: String(lowerT.phone_number || lowerT.contact_number || lowerT.phone || lowerT.mobile || lowerT.client_number || ''),
                client_email: lowerT.email || lowerT.email_id || lowerT.mail_id || lowerT.client_email || (company ? company.mail_ID : '') || '',
                machine_name: lowerT.machine,
                query_text: lowerT.query,
                status: lowerT.status,
                priority: 'Medium',
                created_at: lowerT.created
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

          const lowerDbLog = Object.keys(dbLog).reduce((acc, key) => {
            acc[key.toLowerCase()] = dbLog[key];
            return acc;
          }, {});

          const levelLogs = [
            {
              log_id: `${ticketId}-1`,
              ticket_id: ticketId,
              staff_called: firstCallStaffId,
              level: 1,
              timestamp: lowerDbLog.firstcalldate || lowerDbLog.date || null,
              call_status: lowerDbLog.firstcallstatus || 'Pending',
              duration: lowerDbLog.firstduration || '-',
              recording_url: lowerDbLog.recordurl || lowerDbLog.firstrecordurl || lowerDbLog.recording_url || lowerDbLog.recording || null,
              summary: lowerDbLog.summary || null,
              outcome: lowerDbLog.firstcallstatus ? `Status: ${lowerDbLog.firstcallstatus}` : '-'
            },
            {
              log_id: `${ticketId}-2`,
              ticket_id: ticketId,
              staff_called: 'S6',
              level: 2,
              timestamp: lowerDbLog.secondcalldate || lowerDbLog.date || null,
              call_status: lowerDbLog.secondcallstatus || 'Pending',
              duration: lowerDbLog.secondduration || '-',
              recording_url: lowerDbLog.secondrecordurl || null,
              summary: null,
              outcome: lowerDbLog.secondcallstatus ? `Status: ${lowerDbLog.secondcallstatus}` : '-'
            },
            {
              log_id: `${ticketId}-3`,
              ticket_id: ticketId,
              staff_called: 'S7',
              level: 3,
              timestamp: lowerDbLog.thirdcalldate || lowerDbLog.date || null,
              call_status: lowerDbLog.thirdcallstatus || 'Pending',
              duration: lowerDbLog.thirdduration || '-',
              recording_url: lowerDbLog.thirdrecordurl || null,
              summary: null,
              outcome: lowerDbLog.thirdcallstatus ? `Status: ${lowerDbLog.thirdcallstatus}` : '-'
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
      Status: 'Connected'
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
          status: 'Connected',
          priority: 'Medium',
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
        setTickets(tickets => tickets.map(t => {
          if (String(t.ticket_id) === String(ticket_id)) {
            return {
              ...t,
              company_id: company ? company.company_id : t.company_id,
              product_id: product ? product.product_id : t.product_id,
              company_name: updatedTicket.Company || t.company_name,
              machine_name: updatedTicket.machine || t.machine_name,
              query_text: updatedTicket.Query || t.query_text,
              status: updatedTicket.Status || t.status,
              created_at: updatedTicket.Created || t.created_at
            };
          }
          return t;
        }));
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
    tickets, setTickets, updateTicket, createTicket, loadCallLogsForTicket,
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
