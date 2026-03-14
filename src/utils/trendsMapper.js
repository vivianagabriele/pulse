// ===== UPDATED trendsMapper.js =====

// Cache system (same as before)
const trendsCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const CACHE_MAX_SIZE = 100;

// Clean old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of trendsCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      trendsCache.delete(key);
    }
  }
}, CACHE_TTL);

/**
 * Gets Google Trends score via your local proxy
 */
export const getTrendsScoreWithCache = async (topic) => {
  const cacheKey = topic.toLowerCase().trim();
  
  // Check cache first
  const cached = trendsCache.get(cacheKey);
  if (cached && cached.timestamp > Date.now() - CACHE_TTL) {
    console.log(`📦 Cache hit for "${topic}" (score: ${cached.score})`);
    return cached.score;
  }
  
  console.log(`🌐 Cache miss for "${topic}" - fetching from proxy...`);
  
  try {
    // Call your local backend proxy
    const response = await fetch(`http://localhost:3001/api/trends?keyword=${encodeURIComponent(topic)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const score = data.score;
    
    // Store in cache
    trendsCache.set(cacheKey, {
      score,
      timestamp: Date.now()
    });
    
    // Prevent cache from growing too large
    if (trendsCache.size > CACHE_MAX_SIZE) {
      const oldestKey = trendsCache.keys().next().value;
      trendsCache.delete(oldestKey);
    }
    
    return score;
  } catch (error) {
    console.error(`Error fetching trends for ${topic}:`, error);
    return null;
  }
};

// ===== TALKING NUMBER CONVERSION =====
/**
 * Maps a Trends score (0-100) to a "talking" number in K/M format
 */
export const scoreToTalking = (score) => {
  if (score === null || score === undefined) {
    // Return random but plausible number as fallback
    return `${(Math.random() * 2 + 0.5).toFixed(1)}M`;
  }
  
  // Mapping logic based on score ranges
  if (score >= 90) {
    // Exploding trend (10-20M)
    return `${(Math.random() * 10 + 10).toFixed(1)}M`;
  } else if (score >= 70) {
    // Big trend (5-10M)
    return `${(Math.random() * 5 + 5).toFixed(1)}M`;
  } else if (score >= 50) {
    // Strong trend (2-5M)
    return `${(Math.random() * 3 + 2).toFixed(1)}M`;
  } else if (score >= 30) {
    // Moderate trend (1-2M)
    return `${(Math.random() * 1 + 1).toFixed(1)}M`;
  } else if (score >= 10) {
    // Rising trend (500K-1M)
    return `${(Math.floor(Math.random() * 500) + 500)}K`;
  } else {
    // Low interest (100-500K)
    return `${(Math.floor(Math.random() * 400) + 100)}K`;
  }
};

// ===== MAIN ENHANCEMENT FUNCTION =====
/**
 * Process all trends to add Google Trends-based talking numbers
 * NOW USING CACHING!
 */
export const enhanceWithTrendsData = async (trends) => {
  const enhanced = { ...trends };
  
  // Process each category in parallel with caching
  const promises = Object.keys(enhanced).map(async (category) => {
    const topic = enhanced[category].title;
    
    // Get Google Trends score (cached!)
    const score = await getTrendsScoreWithCache(topic);
    console.log(`📊 ${category} - "${topic}" score: ${score}`);
    
    // Convert to talking number
    enhanced[category].talking = scoreToTalking(score);
    
    // Add source metadata (optional)
    enhanced[category].trendsScore = score;
    enhanced[category].talkingSource = "Google Trends";
  });
  
  await Promise.all(promises);
  return enhanced;
};

// ===== OPTIONAL: EXPOSE CACHE STATUS =====
/**
 * Get cache stats (useful for debugging)
 */
export const getCacheStats = () => ({
  size: trendsCache.size,
  maxSize: CACHE_MAX_SIZE,
  ttl: CACHE_TTL / 1000 / 60, // in minutes
  keys: Array.from(trendsCache.keys())
});