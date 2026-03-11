import React from 'react';

export default function Header({ loading, onRefresh, lastUpdated }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      backdropFilter: 'blur(20px)',
      background: 'rgba(10,10,15,0.85)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '14px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '24px', fontWeight: '900',
          letterSpacing: '-0.04em',
          background: 'linear-gradient(135deg, #FF3CAC, #FFBE0B, #3BF4FB)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Pulse
        </div>
        <div style={{ 
          fontSize: '11px', color: '#555', 
          marginTop: '1px', letterSpacing: '0.03em' 
        }}>
          NO ADS · NO ALGORITHM · JUST WHAT'S HAPPENING
        </div>
      </div>

      <button
        className="refresh-btn"
        onClick={onRefresh}
        disabled={loading}
        style={{
          background: loading ? '#1a1a2e' : 'linear-gradient(135deg, #FF3CAC, #C77DFF)',
          color: loading ? '#444' : '#fff',
          border: 'none',
          borderRadius: '100px',
          padding: '10px 18px',
          fontSize: '13px',
          fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'transform 0.15s',
          letterSpacing: '0.01em',
        }}
      >
        {loading ? 'loading…' : '↻ refresh'}
      </button>
    </div>
  );
}