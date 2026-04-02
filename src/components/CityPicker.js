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
      background: 'rgba(15, 23, 42, 0.28)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '24px',
        maxWidth: '520px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        border: '1px solid #E2E8F0',
        boxShadow: '0 16px 30px rgba(15, 23, 42, 0.12)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h3 style={{ color: '#0f172a', fontSize: '20px', fontWeight: '700' }}>
            Choose Your City
          </h3>
          <button
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              color: '#475569',
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
            background: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '12px',
            color: '#0f172a',
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