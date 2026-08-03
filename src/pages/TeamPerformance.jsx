import React, { useState, useEffect } from 'react';
import { useCrm } from '../context/CrmContext';

const API_BASE = 'https://sipcon-backend.evokeaisolutions.com/api';
const HEADERS = {
  'x-api-key': 'sip_9k2mXqLvT4rNwZdBpFhJeYcU8aGs3Ro',
  'x-client-source': 'evoke',
  'Content-Type': 'application/json'
};

const TeamPerformance = () => {
  const { staff } = useCrm();
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/call-escalation`, { headers: HEADERS })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setEscalations(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching call escalations:', err);
        setLoading(false);
      });
  }, []);

  const combinedStats = escalations.map(esc => {
    const s = staff.find(st => st.full_name === esc.support_person) || {};
    return {
      staff_id: esc.id,
      full_name: esc.support_person,
      role: s.role || 'Support Staff',
      received: esc.total_call || 0,
      picked: esc.connected || 0
    };
  });

  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0, color: 'var(--color-primary)' }}>Escalations</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Role</th>
                <th>Calls Received</th>
                <th>Calls Picked</th>
                <th>Pickup Rate</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>Loading data...</td>
                </tr>
              )}
              {!loading && combinedStats.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>No performance data available.</td>
                </tr>
              )}
              {!loading && combinedStats.map(s => {
                const received = s.received;
                const picked = s.picked;
                const pickupRate = received > 0 ? Math.round((picked / received) * 100) : 0;

                return (
                  <tr key={s.staff_id}>
                    <td style={{ fontWeight: 'bold' }}>{s.full_name}</td>
                    <td>{s.role}</td>
                    <td>{received}</td>
                    <td>{picked}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '999px', height: '8px' }}>
                          <div style={{ width: `${pickupRate}%`, backgroundColor: pickupRate > 75 ? 'var(--color-success)' : (pickupRate > 40 ? '#f97316' : 'var(--color-danger)'), height: '100%', borderRadius: '999px' }}></div>
                        </div>
                        <span style={{ fontSize: '13px', minWidth: '40px' }}>{pickupRate}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamPerformance;
