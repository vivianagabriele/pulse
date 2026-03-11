import React, { useEffect } from 'react';

export default function Toast({ message, setMessage }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%',
      transform: 'translateX(-50%)',
      background: '#1a1a2e', border: '1px solid #333',
      color: '#fff', padding: '12px 20px', borderRadius: '100px',
      fontSize: '13px', fontWeight: '600', zIndex: 1000,
      animation: 'toast 2.5s ease forwards',
      whiteSpace: 'nowrap',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      {message}
    </div>
  );
}