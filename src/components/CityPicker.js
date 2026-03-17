import { POPULAR_CITIES } from '../utils/location';

export default function CityPicker({ isOpen, onClose, onSelectCity }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: '#1a1a2e',
        borderRadius: '24px',
        padding: '24px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '700' }}>
            Choose Your City
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#888',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Search cities..."
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#fff',
            marginBottom: '16px',
          }}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '8px',
        }}>
          {POPULAR_CITIES.map(city => (
            <button
              key={`${city.city}-${city.country}`}
              onClick={() => {
                onSelectCity(city);
                onClose();
              }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                padding: '12px',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6,214,160,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <div style={{ fontSize: '14px', fontWeight: '600' }}>{city.city}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>{city.country}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}