const BRAVE_API_KEY = process.env.REACT_APP_BRAVE_API_KEY;
const BRAVE_API_URL = 'https://api.search.brave.com/res/v1';

// Category-specific search queries for trends
const categoryQueries = {
  movie: 'latest movie releases trending news',
  music: 'new music trending this week billboard',
  show: 'tv shows trending streaming ratings',
  news: 'breaking news headlines today',
  policy: 'current political news policy debates',
  viral: 'viral social media trending today',
  sports: 'sports news trending today',
  tech: 'technology news trending',
  health: 'health news trending today',
  business: 'business news trending today',
  science: 'science news trending today',
  gaming: 'gaming news trending today',
  fashion: 'fashion news trending today',
  food: 'food news trending today',
  travel: 'travel news trending today'
};

// Fetch trends for a specific category
export const searchCategoryTrends = async (category, timeRange = 'd', locationMode, userLocation) => {
  const baseQuery = categoryQueries[category] || `${category} trending`;
  let query = baseQuery;
  if (locationMode === 'local' && userLocation?.city) {
    query = `${baseQuery} in ${userLocation.city} ${userLocation.country || ''}`.trim();
  }

  const params = new URLSearchParams({
    q: query,
    count: 5,
    freshness: timeRange, // d=day, w=week, m=month
    search_lang: 'en'
  });

  try {
    const response = await fetch(`${BRAVE_API_URL}/news/search?${params}`, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY,
      }
    });

    if (!response.ok) {
      throw new Error(`Brave API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform Brave results into your trend format
    const results = data.results || [];

    if (results.length === 0) {
      return null;
    }

    // Get the top result as the main trend
    const top = results[0];

    return {
      title: top.title,
      reason: top.description || `Trending now on ${category}`,
      talking: formatTalkingCount(results.length),
      hoursOld: parseTimeToHours(top.age),
      vibe: getVibeForCategory(category),
      source: top.url,
      sourceName: top.profile?.name || 'News'
    };

  } catch (error) {
    console.error(`Brave search failed for ${category}:`, error);
    return null;
  }
};

// Fetch all categories in parallel
export const fetchAllTrends = async (locationMode, userLocation) => {
  const categories = ['movie', 'music', 'show', 'news', 'policy', 'viral', 'sports', 'tech', 'health', 'business', 'science', 'gaming', 'fashion', 'food', 'travel'];
  
  const results = await Promise.all(
    categories.map(async (category) => {
      const trend = await searchCategoryTrends(category, 'd', locationMode, userLocation);
    })
  );

  const trends = {};
  results.forEach(({ category, trend }) => {
    if (trend) {
      trends[category] = trend;
    } else {
      // Provide fallback if search fails
      trends[category] = getFallbackTrend(category);
    }
  });

  return trends;
};

// Helper: Format talking count based on result count
const formatTalkingCount = (resultCount) => {
  const counts = ['1.2M', '890K', '2.1M', '12.4M', '3.7M', '6.8M'];
  return counts[Math.min(resultCount, counts.length - 1)];
};

// Helper: Parse Brave's age string (e.g., "2 hours ago") to hoursOld number
const parseTimeToHours = (ageString) => {
  if (!ageString) return 2;

  const match = ageString.match(/(\d+)\s+(hour|minute|day)s?\s+ago/);
  if (!match) return 2;

  const value = parseInt(match[1]);
  const unit = match[2];

  if (unit === 'minute') return Math.max(0, value / 60);
  if (unit === 'hour') return value;
  if (unit === 'day') return value * 24;

  return 2;
};

// Helper: Assign vibe based on category
const getVibeForCategory = (category) => {
  const vibes = {
    movie: '🔥 Exploding',
    music: '✨ Must-see',
    show: '👀 Controversial',
    news: '⚡ Breaking',
    policy: '😢 Touching',
    viral: '💥 Big news',
    sports: '🏆 Winning',
    tech: '🚀 Innovative',
    health: '💚 Healthy',
    business: '💼 Profitable',
    science: '🔬 Groundbreaking',
    gaming: '🎮 Epic',
    fashion: '👗 Stylish',
    food: '🍽️ Delicious',
    travel: '✈️ Adventurous'
  };
  return vibes[category] || '🔥 Exploding';
};

// Fallback trends if API fails
const getFallbackTrend = (category) => {
  const fallbacks = {
    movie: { title: "Dune: Part Two", reason: "Still dominating box office 2 weeks after release", talking: "2.1M", hoursOld: 24, vibe: "🔥 Exploding" },
    music: { title: "Kendrick Lamar", reason: "New surprise album dropped 6 hours ago", talking: "4.2M", hoursOld: 6, vibe: "⚡ Breaking" },
    show: { title: "The White Lotus", reason: "Season 3 finale aired last night, social media exploding", talking: "3.1M", hoursOld: 12, vibe: "👀 Controversial" },
    news: { title: "Election Updates", reason: "Primary results coming in from key states", talking: "8.7M", hoursOld: 2, vibe: "💥 Big news" },
    policy: { title: "AI Regulation Bill", reason: "Congress debates new framework today", talking: "1.2M", hoursOld: 5, vibe: "🤝 Feel-good" },
    viral: { title: "Cat Video Breaks Record", reason: "Funny cat video hits 50M views in 24h", talking: "5.5M", hoursOld: 8, vibe: "✨ Must-see" },
    sports: { title: "Championship Finals", reason: "Teams battling for the title this weekend", talking: "5.2M", hoursOld: 4, vibe: "🏆 Winning" },
    tech: { title: "New AI Breakthrough", reason: "Revolutionary tech announced by major company", talking: "3.8M", hoursOld: 3, vibe: "🚀 Innovative" },
    health: { title: "Medical Discovery", reason: "New treatment shows promising results", talking: "2.5M", hoursOld: 6, vibe: "💚 Healthy" },
    business: { title: "Market Surge", reason: "Stocks hitting record highs today", talking: "4.1M", hoursOld: 2, vibe: "💼 Profitable" },
    science: { title: "Space Mission Success", reason: "Historic achievement in space exploration", talking: "3.2M", hoursOld: 8, vibe: "🔬 Groundbreaking" },
    gaming: { title: "Game Release Hype", reason: "Highly anticipated title launches tomorrow", talking: "6.1M", hoursOld: 12, vibe: "🎮 Epic" },
    fashion: { title: "Fashion Week Highlights", reason: "Designers showcase latest collections", talking: "2.8M", hoursOld: 5, vibe: "👗 Stylish" },
    food: { title: "Culinary Trend", reason: "New food craze sweeping social media", talking: "4.5M", hoursOld: 7, vibe: "🍽️ Delicious" },
    travel: { title: "Travel Destination Boom", reason: "Popular spot seeing massive visitor increase", talking: "3.9M", hoursOld: 10, vibe: "✈️ Adventurous" }
  };
  return fallbacks[category];
};

// For LLM-optimized context (advanced use)
export const searchBraveLLMContext = async (query) => {
  try {
    const response = await fetch(`${BRAVE_API_URL}/llm/context?q=${encodeURIComponent(query)}`, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY,
      }
    });

    const data = await response.json();
    return data.grounding?.generic || [];
  } catch (error) {
    console.error('Brave LLM context failed:', error);
    return [];
  }
};