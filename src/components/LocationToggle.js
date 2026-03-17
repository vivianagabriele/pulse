export default function LocationToggle({ mode, onToggle, location, onOpenCityPicker }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '100px',
      padding: '4px',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <button
        onClick={() => onToggle('global')}
        style={{
          background: mode === 'global' ? 'rgba(255,255,255,0.1)' : 'transparent',
          color: mode === 'global' ? '#fff' : '#666',
          border: 'none',
          borderRadius: '100px',
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        🌍 Global
      </button>

      <button
        onClick={() => onToggle('local')}
        style={{
          background: mode === 'local' ? 'rgba(6,214,160,0.2)' : 'transparent',
          color: mode === 'local' ? '#06D6A0' : '#666',
          border: mode === 'local' ? '1px solid #06D6A088' : 'none',
          borderRadius: '100px',
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        📍 Local
        {location?.city && mode === 'local' && (
          <span style={{
            background: '#06D6A022',
            padding: '2px 6px',
            borderRadius: '100px',
            fontSize: '10px',
            color: '#06D6A0'
          }}>
            {location.city}
          </span>
        )}
      </button>

      {mode === 'local' && (
        <button
          onClick={onOpenCityPicker}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#888',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          ✎
        </button>
      )}
    </div>
  );
}