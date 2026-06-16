import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

const DirectorDashboard = () => {
  const { tickets, staff, products } = useCrm();
  const [dateFilter, setDateFilter] = useState('All Time');

  // Simple date filter logic based on local mock data
  const filteredTickets = tickets.filter(t => {
    if (dateFilter === 'All Time') return true;
    const tDate = new Date(t.created_at);
    const now = new Date('2026-06-16T12:00:00Z'); // Using fixed "now" based on mock data context
    if (dateFilter === 'Today') {
      return tDate.toDateString() === now.toDateString();
    }
    if (dateFilter === 'This Week') {
      const diffTime = Math.abs(now - tDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    if (dateFilter === 'This Month') {
      return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Calculate Metrics
  const totalQueries = filteredTickets.length;
  const resolvedTicketsList = filteredTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed');
  const queriesResolved = resolvedTicketsList.length;
  const resolutionRate = totalQueries > 0 ? ((queriesResolved / totalQueries) * 100).toFixed(1) : 0;
  
  const handledSuccessfully = filteredTickets.filter(t => t.handled_successfully).length;
  
  const getAvgHours = (keyStart, keyEnd) => {
    const valid = resolvedTicketsList.filter(t => t[keyStart] && t[keyEnd]);
    if (valid.length === 0) return 0;
    const totalMs = valid.reduce((acc, t) => acc + (new Date(t[keyEnd]) - new Date(t[keyStart])), 0);
    return (totalMs / valid.length / (1000 * 60 * 60)).toFixed(1);
  };
  
  const avgResolutionTime = getAvgHours('created_at', 'resolved_at');
  
  const getAvgFirstResponse = () => {
    const valid = filteredTickets.filter(t => t.created_at && t.first_response_at);
    if (valid.length === 0) return 0;
    const totalMs = valid.reduce((acc, t) => acc + (new Date(t.first_response_at) - new Date(t.created_at)), 0);
    return (totalMs / valid.length / (1000 * 60 * 60)).toFixed(1);
  };
  const avgFirstResponse = getAvgFirstResponse();

  const fcrTickets = resolvedTicketsList.filter(t => t.current_level === 1).length;
  const fcrRate = queriesResolved > 0 ? ((fcrTickets / queriesResolved) * 100).toFixed(1) : 0;

  const escalatedTicketsCount = filteredTickets.filter(t => t.current_level > 1).length;
  const escalationRate = totalQueries > 0 ? ((escalatedTicketsCount / totalQueries) * 100).toFixed(1) : 0;

  const csatTickets = filteredTickets.filter(t => t.csat_rating !== null);
  const avgCsat = csatTickets.length > 0 ? (csatTickets.reduce((acc, t) => acc + t.csat_rating, 0) / csatTickets.length).toFixed(1) : 0;

  const openPending = filteredTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;

  // Chart Data: Queries per Engineer
  const staffQueryCounts = staff.map(s => {
    const count = filteredTickets.filter(t => t.assigned_to === s.staff_id).length;
    return { name: s.full_name, queries: count };
  });

  // Chart Data: Busiest Machines
  const machineQueryCounts = products.map(p => {
    const count = filteredTickets.filter(t => t.product_id === p.product_id).length;
    return { name: p.machine_name.replace('SIPCON ', ''), queries: count };
  });

  // Chart Data: Queries over Time (simple daily grouping)
  const timeMap = {};
  filteredTickets.forEach(t => {
    const day = new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    timeMap[day] = (timeMap[day] || 0) + 1;
  });
  const timeData = Object.keys(timeMap).map(day => ({ day, queries: timeMap[day] })).sort((a,b) => new Date(a.day) - new Date(b.day));

  const MetricCard = ({ title, value, suffix = '', highlight = false }) => (
    <div className="card" style={{ marginBottom: 0, borderLeft: highlight ? '4px solid var(--color-primary)' : '4px solid transparent' }}>
      <h3 style={{ fontSize: '13px', color: 'var(--color-text)', opacity: 0.7, marginTop: 0 }}>{title}</h3>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color: highlight ? 'var(--color-primary)' : 'var(--color-text)' }}>
        {value}{suffix}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Director's Dashboard</h2>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--color-border)', fontWeight: 'bold' }}
        >
          <option value="All Time">All Time</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <MetricCard title="Total Queries" value={totalQueries} highlight />
        <MetricCard title="Queries Resolved" value={queriesResolved} highlight />
        <MetricCard title="Resolution Rate" value={resolutionRate} suffix="%" />
        <MetricCard title="Handled Successfully" value={handledSuccessfully} highlight />
        <MetricCard title="Avg Resolution Time" value={avgResolutionTime} suffix="h" />
        <MetricCard title="Average CSAT" value={avgCsat} suffix="/5" highlight />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <MetricCard title="Open / Pending" value={openPending} />
        <MetricCard title="Avg First Response" value={avgFirstResponse} suffix="h" />
        <MetricCard title="First-Contact Res." value={fcrRate} suffix="%" />
        <MetricCard title="Escalation Rate" value={escalationRate} suffix="%" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Queries per Engineer</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffQueryCounts} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="queries" fill="var(--color-secondary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Busiest Machines</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={machineQueryCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="queries" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ marginTop: 0 }}>Queries over Time</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="queries" stroke="var(--color-accent)" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorDashboard;
