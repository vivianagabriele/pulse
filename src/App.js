import { useState, useEffect, useCallback } from "react";
import { categories, LOADING_MSGS } from "./utils/constants";
import { parseCount } from "./utils/formatters";
import { fetchTrends } from "./utils/api";
import Card from "./components/Card";
import Header from "./components/Header";
import Toast from "./components/Toast";
import { detectUserLocation, loadUserCity, saveUserCity } from './utils/location';
import CityPicker from './components/CityPicker';
import "./styles/tailwind.css";
import "./styles/global.css";

export default function App() {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0]);
  const [loadingStep, setLoadingStep] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  
  // Like system state
  const [likes, setLikes] = useState({});
  const [liked, setLiked] = useState({});
  const [toastMsg, setToastMsg] = useState(null);

  // Location state
  const [location, setLocation] = useState(null); // { city, country, lat, lng }
  const [locationMode, setLocationMode] = useState('global'); // 'global' or 'local'
  const [isDetecting, setIsDetecting] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

// Cached trends by location
const [trendsCache, setTrendsCache] = useState({}); // { 'global': {...}, 'Seattle': {...} }
const [cacheTimestamps, setCacheTimestamps] = useState({}); // { 'global': timestamp, 'Seattle': timestamp }
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Track if current data is from cache
const [isUsingCache, setIsUsingCache] = useState(false);
  const TOP_MARKETS = [
    { label: 'France', city: 'Paris', country: 'France' },
    { label: 'Italy', city: 'Rome', country: 'Italy' },
    { label: 'Iran', city: 'Tehran', country: 'Iran' },
    { label: 'China', city: 'Shanghai', country: 'China' },
    { label: 'Korea', city: 'Seoul', country: 'South Korea' },
    { label: 'USA', city: 'New York', country: 'USA' },
  ];
  // Load likes from localStorage on startup
  useEffect(() => {
    // Reset all counts on app start for fresh experience
    setLikes({});
    setLiked({});
    localStorage.removeItem('pulse-likes');
    localStorage.removeItem('pulse-liked');
  }, []);

  // Save likes to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(likes).length > 0) {
      localStorage.setItem('pulse-likes', JSON.stringify(likes));
    }
    if (Object.keys(liked).length > 0) {
      localStorage.setItem('pulse-liked', JSON.stringify(liked));
    }
  }, [likes, liked]);

  // Load saved location on startup
  useEffect(() => {
    const savedCity = loadUserCity();
    if (savedCity) {
      setLocation(savedCity);
    }
  }, []);

  const handleFetchTrends = useCallback(async (forceRefresh = false, modeOverride = null, locationOverride = null) => {
    // Use override values if provided (for mode switching), otherwise use state
    const currentMode = modeOverride !== null ? modeOverride : locationMode;
    const currentLocation = locationOverride !== null ? locationOverride : location;
    
    // Determine cache key based on mode and location
    const cacheKey = currentMode === 'global' ? 'global' : (currentLocation?.city || 'unknown');
    
    // Check if we have fresh cached data
    const cachedData = trendsCache[cacheKey];
    const cacheTime = cacheTimestamps[cacheKey];
    const isCacheFresh = cachedData && cacheTime && (Date.now() - cacheTime < CACHE_DURATION);
    
    if (!forceRefresh && isCacheFresh) {
      console.log('💾 Using cached trends for:', cacheKey);
      setTrends(cachedData);
      setLastUpdated(new Date(cacheTime));
      setIsUsingCache(true);
      setLoading(false);
      return;
    }
    
    console.log('🚀 Fetching fresh trends for:', cacheKey, forceRefresh ? '(forced)' : '(cache miss/expired)');
    
    // Only reset loading if not already set by mode change
    if (!loading) {
      setLoading(true);
      setLoadingMsg(currentMode === 'local' ? '🔄 Fetching local trends...' : '🌍 Fetching global trends...');
      setLoadingStep(0);
    }
    setError(null);
    
    const result = await fetchTrends(
      setLoadingMsg,
      setLoadingStep,
      LOADING_MSGS,
      currentMode,
      currentLocation // Pass location to API
    );
    
    console.log('📊 Trends fetch result:', result);
    if (result.error) {
      setError(result.error);
    } else {
      // Cache the results
      setTrendsCache(prev => ({ ...prev, [cacheKey]: result.data }));
      setCacheTimestamps(prev => ({ ...prev, [cacheKey]: Date.now() }));
      
      console.log('🔄 Setting new trends data:', result.data);
      setTrends(result.data);
      setLastUpdated(new Date());
      setIsUsingCache(false);
      
      // Initialize like counts for new trends if they don't exist
      const newLikes = { ...likes };
      const trendIds = Object.keys(result.data).map(cat => `${cat}-${result.data[cat].title}`);
      
      trendIds.forEach(id => {
        if (!newLikes[id]) {
          // Generate a random but stable starting like count
          newLikes[id] = Math.floor(Math.random() * 500) + 50;
        }
      });
      
      setLikes(newLikes);
    }
    setLoading(false);
  }, [locationMode, location, trendsCache, cacheTimestamps, likes]);

  const toggleLike = (e, categoryId, trendTitle) => {
    e.stopPropagation();
    
    // Create a unique ID for this specific trend
    const trendId = `${categoryId}-${trendTitle}`;
    
    // Update likes count
    setLikes(prev => ({
      ...prev,
      [trendId]: (prev[trendId] || 0) + (liked[trendId] ? -1 : 1)
    }));
    
    // Update liked status
    setLiked(prev => ({
      ...prev,
      [trendId]: !prev[trendId]
    }));
    
    // Optional: haptic feedback on mobile
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  // Handle location detection when switching to local mode
  const handleLocationModeChange = async (mode) => {
    console.log('🔄 Location mode change:', mode);
    setLocationMode(mode);
    
    if (mode === 'local' && !location) {
      console.log('📍 Starting location detection...');
      setIsDetecting(true);
      setLoading(true);
      setLoadingMsg('📍 Detecting your location...');
      setLoadingStep(0);
      
      const detected = await detectUserLocation();
      console.log('📍 Detection result:', detected);
      if (detected.success && detected.city) {
        setLocation(detected);
        saveUserCity(detected);
        console.log('✅ Location set, fetching trends...');
        setLoadingMsg('🔄 Fetching local trends for ' + detected.city + '...');
        // Pass mode and detected location directly to avoid stale state
        handleFetchTrends(false, mode, detected);
      } else {
        // If detection fails, open city picker
        console.log('❌ Detection failed, opening city picker');
        setShowCityPicker(true);
        setIsDetecting(false);
        setLoading(false);
        return;
      }
      setIsDetecting(false);
    } else {
      // Just switch to cached data for this mode/location - pass mode override
      console.log('🔄 Switching to ' + mode + ' trends...');
      setLoadingMsg(mode === 'local' ? '🔄 Fetching local trends...' : '🌍 Fetching global trends...');
      setLoading(true);
      handleFetchTrends(false, mode, location);
    }
  };

  // Handle manual city selection
  const handleCitySelect = (cityData) => {
    console.log('🏙️ City selected:', cityData);
    setLocation(cityData);
    saveUserCity(cityData);
    // Always refresh trends when location changes - pass new location
    console.log('🔄 Refreshing trends with new city...');
    handleFetchTrends(false, 'local', cityData);
  };

  const handleMarketSelect = async (market) => {
    const cityData = { city: market.city, country: market.country };
    setLocation(cityData);
    setLocationMode('local');
    setLoading(true);
    setLoadingMsg(`🌎 Fetching ${market.label} trends...`);
    setLoadingStep(0);
    await handleFetchTrends(false, 'local', cityData);
  };

  useEffect(() => {
    handleFetchTrends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = trends
    ? [...categories].sort((a, b) => 
        parseCount(trends[b.id]?.talking) - parseCount(trends[a.id]?.talking)
      )
    : categories;

  return (
    <div className="app">
      <Toast message={toastMsg} setMessage={setToastMsg} />
      <Header 
        loading={loading}
        onRefresh={() => handleFetchTrends(true)} // Force refresh
        lastUpdated={lastUpdated}
        locationMode={locationMode}
        onLocationModeChange={handleLocationModeChange}
        location={location}
        onOpenCityPicker={() => setShowCityPicker(true)}
        isUsingCache={isUsingCache}
      />

      <div style={{
        maxWidth: '760px',
        margin: '16px auto',
        padding: '0 16px',
      }}>
        <div style={{
          borderRadius: '14px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          padding: '12px 14px',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.07)',
          marginBottom: '16px',
          color: '#334155'
        }}>
          <strong>Counter-censorship mode:</strong> Global trends from outside the US, in one place. Tap a key market to zoom into that country’s hottest stories.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          {TOP_MARKETS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleMarketSelect(item)}
              style={{
                cursor: 'pointer',
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                color: '#0f172a',
                borderRadius: '999px',
                padding: '8px 12px',
                fontWeight: '600',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.08)',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{
          maxWidth: '760px',
          margin: '8px auto',
          padding: '10px 14px',
          borderRadius: '12px',
          border: '1px solid #C2D3E8',
          background: '#ffffff',
          color: '#1e293b',
          fontWeight: 600,
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 14px rgba(15, 23, 42, 0.09)',
        }}>
          <span style={{ marginRight: '10px', animation: 'spin 0.9s linear infinite', display: 'inline-block' }}>⏳</span>
          {loadingMsg || 'Loading trends...'}
        </div>
      )}
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      
      {trends && !loading && (
        <div className="cards-container">
          {locationMode === 'local' && location?.city && (
            <div style={{
              textAlign: 'center',
              marginBottom: '16px',
              padding: '8px',
              background: 'rgba(6,214,160,0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(6,214,160,0.1)',
            }}>
              <span style={{ color: '#06D6A0', fontSize: '13px' }}>
                📍 Showing trends for {location.city}, {location.country || 'your area'}
              </span>
            </div>
          )}
          
          {sorted.map((cat, index) => {
            const trend = trends[cat.id];
            const trendId = `${cat.id}-${trend.title}`;
            
            return (
              <Card
                key={trendId}
                category={cat}
                trend={trend}
                rank={index + 1}
                isOpen={selected === cat.id}
                onToggle={() => setSelected(selected === cat.id ? null : cat.id)}
                likeCount={likes[trendId] || 0}
                isLiked={liked[trendId] || false}
                onLike={(e) => toggleLike(e, cat.id, trend.title)}
                onShare={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(
                    `🔥 Trending now: ${trend.title}\n${trend.vibe} — ${trend.reason}\n\nvia Pulse`
                  );
                  setToastMsg("copied to clipboard ✅");
                }}
                onTweet={(e) => {
                  e.stopPropagation();
                  const text = encodeURIComponent(`🔥 ${trend.title} is trending right now\n${trend.vibe}\n\nvia Pulse`);
                  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
                }}
                locationMode={locationMode}
                location={location}
              />
            );
          })}
          <div className="footer">
            PULSE © 2026 · TAP ANY CARD FOR DETAILS
          </div>
        </div>
      )}

      {/* Location detection loading */}
      {isDetecting && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#fff',
          border: '1px solid #CBD5E1',
          padding: '12px 20px',
          borderRadius: '100px',
          fontSize: '13px',
          color: '#0f172a',
          zIndex: 100,
          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.16)',
        }}>
          📍 Detecting your location...
        </div>
      )}

      {/* City Picker Modal */}
      <CityPicker
        isOpen={showCityPicker}
        onClose={() => setShowCityPicker(false)}
        onSelectCity={handleCitySelect}
      />
    </div>
  );
}