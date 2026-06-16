import React from 'react';

const StatusBadge = ({ status }) => {
  let backgroundColor = 'var(--color-bg)';
  let color = 'var(--color-text)';

  const s = status.toLowerCase();
  if (s === 'resolved' || s === 'closed' || s === 'active') {
    backgroundColor = 'var(--color-success)';
    color = 'var(--color-white)';
  } else if (s === 'pending' || s === 'in progress' || s === 'open') {
    backgroundColor = 'var(--color-warning)';
    color = 'var(--color-white)';
  } else if (s === 'escalated' || s === 'critical' || s === 'overdue') {
    backgroundColor = 'var(--color-danger)';
    color = 'var(--color-white)';
  }

  return (
    <span style={{
      backgroundColor,
      color,
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block'
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;
