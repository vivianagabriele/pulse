import React from 'react';
import LocationToggle from './LocationToggle';

export default function Header({ 
  loading, onRefresh, lastUpdated, 
  locationMode, onLocationModeChange, 
  location, onOpenCityPicker, isUsingCache
}) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      backdropFilter: 'blur(12px)',
      background: 'rgba(255,255,255,0.92)',
      borderBottom: '1px solid #E2E8F0',
      padding: '14px 20px',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
    }}>
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        <div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '24px', fontWeight: '900',
            letterSpacing: '-0.04em',
            color: '#1e293b',
          }}>
            Pulse
          </div>
          <div style={{ 
            fontSize: '12px', color: '#475569', 
            marginTop: '2px', letterSpacing: '0.03em' 
          }}>
            REAL-TIME GLOBAL TRENDS · UNSILENCED
          </div>
        </div>

        <button
          className="refresh-btn"
          onClick={onRefresh}
          disabled={loading}
          style={{
            background: loading ? '#e2e8f0' : '#2563eb',
            color: loading ? '#94a3b8' : '#fff',
            border: 'none',
            borderRadius: '100px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'loading…' : '↻ refresh'}
        </button>
      </div>
      
      {/* Location Toggle */}
      <LocationToggle
        mode={locationMode}
        onToggle={onLocationModeChange}
        location={location}
        onOpenCityPicker={onOpenCityPicker}
      />
      
      {lastUpdated && (
        <div style={{ 
          marginTop: '10px',
          fontSize: '11px', 
          color: '#444',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ color: isUsingCache ? '#888' : '#06D6A0', fontSize: '8px' }}>
            {isUsingCache ? '○' : '●'}
          </span>
          last updated {lastUpdated.toLocaleTimeString()}
          {isUsingCache && <span style={{ color: '#666', fontSize: '9px' }}>(cached)</span>}
        </div>
      )}
    </div>
  );
}
