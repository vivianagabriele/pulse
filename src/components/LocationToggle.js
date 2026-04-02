export default function LocationToggle({ mode, onToggle, location, onOpenCityPicker }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: '#F8FAFC',
      borderRadius: '12px',
      padding: '5px',
      border: '1px solid #CBD5E1',
    }}>
      <button
        onClick={() => onToggle('global')}
        style={{
          background: mode === 'global' ? '#2563EB' : 'transparent',
          color: mode === 'global' ? '#FFF' : '#475569',
          border: mode === 'global' ? '1px solid #2563EB' : '1px solid transparent',
          borderRadius: '999px',
          padding: '7px 14px',
          fontSize: '12px',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        🌍 Global
      </button>

      <button
        onClick={() => onToggle('local')}
        style={{
          background: mode === 'local' ? '#FFFFFF' : 'transparent',
          color: mode === 'local' ? '#0f172a' : '#475569',
          border: mode === 'local' ? '1px solid #94A3B8' : '1px solid transparent',
          borderRadius: '999px',
          padding: '7px 14px',
          fontSize: '12px',
          fontWeight: '700',
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
            background: '#E2E8F0',
            border: '1px solid #CBD5E1',
            color: '#1e293b',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '5px 8px',
            borderRadius: '8px',
          }}
        >
          ✎
        </button>
      )}
    </div>
  );
}