import React from 'react';
import { LOADING_MSGS } from '../utils/constants';

export default function LoadingState({ message, step }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px' }}>
      <div style={{
        fontSize: '48px', marginBottom: '24px',
        animation: 'spin 1.5s linear infinite',
        display: 'inline-block',
      }}>✦</div>
      <div style={{ 
        fontSize: '16px', fontWeight: '700', 
        color: '#fff', marginBottom: '8px' 
      }}>
        {message}
      </div>
      <div style={{ 
        display: 'flex', gap: '6px', 
        justifyContent: 'center', marginTop: '20px' 
      }}>
        {LOADING_MSGS.map((_, i) => (
          <div key={i} style={{
            width: i <= step ? '24px' : '6px',
            height: '6px',
            borderRadius: '3px',
            background: i <= step
              ? 'linear-gradient(90deg, #FF3CAC, #FFBE0B)'
              : '#222',
            transition: 'all 0.4s ease',
          }} />
        ))}
      </div>
      <div style={{ 
        fontSize: '12px', color: '#444', 
        marginTop: '16px' 
      }}>
        searching live web data…
      </div>
    </div>
  );
}