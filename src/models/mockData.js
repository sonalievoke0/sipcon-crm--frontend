export const companies = [
  {
    company_id: 1,
    company_name: "Acme Corp",
    city: "Mumbai",
    industry: "Manufacturing",
    gst_or_reg_no: "27ABCDE1234F1Z5",
    address: "123 Industrial Estate",
    source: "Existing",
    created_at: "2025-01-10T10:00:00Z"
  },
  {
    company_id: 2,
    company_name: "Tech Solutions",
    city: "Bangalore",
    industry: "Software",
    gst_or_reg_no: "29XYZDE1234F1Z5",
    address: "45 Tech Park",
    source: "Lead via assistant",
    created_at: "2025-03-15T09:30:00Z"
  }
];

export const contacts = [
  {
    contact_id: 1,
    company_id: 1,
    full_name: "Rahul Sharma",
    designation: "Quality Head",
    whatsapp_number: "+919876543210",
    callback_number: "+919876543210",
    email: "rahul@acmecorp.com",
    is_primary: true
  }
];

export const products = [
  {
    product_id: 1,
    machine_name: "SIPCON Projector Alpha",
    category: "Projector",
    description: "High precision optical profile projector",
    active: true
  },
  {
    product_id: 2,
    machine_name: "SIPCON Genie X",
    category: "Genie",
    description: "Automated vision measuring system",
    active: true
  }
];

export const purchases = [
  {
    purchase_id: 1,
    company_id: 1,
    product_id: 1,
    serial_no: "SP-2024-001",
    purchase_date: "2024-05-20T00:00:00Z",
    warranty_expiry: "2025-05-20T00:00:00Z",
    amc_status: "Active"
  }
];

export const staff = [
  {
    staff_id: 1,
    full_name: "Amit Patel",
    designation: "Service Engineer",
    level: 1,
    products_handled: [1, 2],
    phone: "+919999999999",
    email: "amit.patel@sipcon.com",
    active: true
  }
];

export const tickets = [
  {
    ticket_id: "SIP-2026-0001",
    company_id: 1,
    contact_id: 1,
    product_id: 1,
    query_text: "The projector lens seems out of focus even after manual calibration.",
    status: "Open",
    priority: "High",
    current_level: 1,
    assigned_to: 1,
    csat_rating: null,
    created_at: "2026-06-16T09:00:00Z",
    first_response_at: null,
    resolved_at: null,
    handled_successfully: false,
    reopened: false,
    notes: "Requires immediate attention as it is blocking production."
  },
  {
    ticket_id: "SIP-2026-0002",
    company_id: 2,
    contact_id: null,
    product_id: 2,
    query_text: "Need software update for Genie X.",
    status: "Resolved",
    priority: "Low",
    current_level: 1,
    assigned_to: 1,
    csat_rating: 5,
    created_at: "2026-06-15T11:00:00Z",
    first_response_at: "2026-06-15T11:30:00Z",
    resolved_at: "2026-06-15T14:00:00Z",
    handled_successfully: true,
    reopened: false,
    notes: "Update link provided. Customer installed successfully."
  }
];

export const leads = [
  {
    lead_id: 1,
    name: "Vikram Singh",
    company_name: "Modern Auto Parts",
    whatsapp_number: "+918888888888",
    machine_interest: "Cable Measuring System",
    converted: false,
    created_at: "2026-06-16T08:15:00Z"
  }
];

export const call_logs = [
  {
    log_id: 1,
    ticket_id: "SIP-2026-0001",
    level: 1,
    staff_called: 1,
    call_status: "Answered",
    timestamp: "2026-06-16T09:15:00Z",
    outcome: "Discussed issue, staff will visit site."
  },
  {
    log_id: 2,
    ticket_id: "SIP-2026-0002",
    level: 1,
    staff_called: 1,
    call_status: "Answered",
    timestamp: "2026-06-15T11:30:00Z",
    outcome: "Provided update link."
  }
];
