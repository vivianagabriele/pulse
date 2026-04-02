// Free IP geolocation API - no API key needed!
export const detectUserLocation = async () => {
  try {
    // hoskes.geoapi - completely free, no auth required
    const response = await fetch('https://geoapi-hoskes.onrender.com/json.gp');
    const data = await response.json();

    return {
      city: data.hoskes_locplugin_city || null,
      country: data.hoskes_locplugin_countryName || null,
      countryCode: data.hoskes_locplugin_countryCode || null,
      lat: data.hoskes_locplugin_latitude || null,
      lng: data.hoskes_locplugin_longitude || null,
      region: data.hoskes_locplugin_region || null,
      success: true
    };
  } catch (error) {
    console.error('Location detection failed:', error);
    return {
      success: false,
      error: 'Could not detect location',
      city: null,
      country: null
    };
  }
};

// Fallback: Popular cities for manual selection
export const POPULAR_CITIES = [
  { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
  { city: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437 },
  { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { city: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
  { city: 'Tehran', country: 'Iran', lat: 35.6892, lng: 51.3890 },
  { city: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780 },
  { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
  { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
  { city: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792 },
  { city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333 },
  { city: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332 },
  { city: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
  { city: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173 },
  { city: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737 },
  { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 }
];

// Save user's preferred city to localStorage
export const saveUserCity = (cityData) => {
  localStorage.setItem('pulse-preferred-city', JSON.stringify(cityData));
};

// Load user's preferred city from localStorage
export const loadUserCity = () => {
  const saved = localStorage.getItem('pulse-preferred-city');
  return saved ? JSON.parse(saved) : null;
};

// Cache location for 24 hours
export const CACHE_DURATION = 24 * 60 * 60 * 1000;

export const getCachedLocation = () => {
  const cached = localStorage.getItem('pulse-location-cache');
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  return null;
};

export const cacheLocation = (locationData) => {
  localStorage.setItem('pulse-location-cache', JSON.stringify({
    data: locationData,
    timestamp: Date.now()
  }));
};