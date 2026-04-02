import React from 'react';
import { LOADING_MSGS } from '../utils/constants';

export default function LoadingState({ message, step }) {
  return (
    <div style={{
      padding: '28px',
      margin: '16px',
      borderRadius: '18px',
      background: '#FFFFFF',
      border: '1px solid #CBD5E1',
      boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '14px', color: '#2563EB', animation: 'spin 1.2s linear infinite' }}>
        ✦
      </div>
      <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>{message}</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
        {LOADING_MSGS.map((_, i) => (
          <div
            key={i}
            style={{
              height: '7px',
              borderRadius: '999px',
              transition: 'all 0.3s ease',
              width: i <= step ? '42px' : '16px',
              background: i <= step ? '#2563EB' : '#CBD5E1',
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '10px' }}>searching live web data…</div>
    </div>
  );
}
