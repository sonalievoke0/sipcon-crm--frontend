import React from 'react';

const StatusBadge = ({ status }) => {
  let backgroundColor = 'var(--color-bg)';
  let color = 'var(--color-text)';

  const s = status.toLowerCase();
  if (['connected', 'active', 'in progress', 'escalated', 'critical', 'overdue'].includes(s)) {
    backgroundColor = '#f97316';
    color = 'var(--color-white)';
  } else if (s === 'unresolved') {
    backgroundColor = 'var(--color-danger)';
    color = 'var(--color-white)';
  } else if (s === 'resolved') {
    backgroundColor = 'var(--color-success)';
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
