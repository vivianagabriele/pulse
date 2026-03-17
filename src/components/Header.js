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
      backdropFilter: 'blur(20px)',
      background: 'rgba(10,10,15,0.85)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '14px 20px',
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
