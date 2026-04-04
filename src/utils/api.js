import { fetchAllTrends } from './brave';
import { enhanceWithTrendsData } from './trendsMapper';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
const BRAVE_SEARCH_ENDPOINT = `${BACKEND_URL}/api/search`;

const CATEGORY_QUERIES = {
  movie: 'latest movie news trending today',
  music: 'new music releases trending today',
  show: 'tv shows trending this week',
  news: 'breaking news headlines',
  policy: 'current political news trending today',
  viral: 'viral social media trends right now',
};

const VIBE_BY_CATEGORY = {
  movie: '🔥 Exploding',
  music: '⚡ Breaking',
  show: '👀 Controversial',
  news: '💥 Big news',
  policy: '🤝 Feel-good',
  viral: '✨ Must-see',
};

const TALKING_OPTIONS = ['890K', '1.2M', '2.4M', '3.8M', '5.1M', '7.0M'];

const buildBraveQuery = (category, locationMode, userLocation) => {
  let query = CATEGORY_QUERIES[category] || category;
  if (locationMode === 'local' && userLocation?.city) {
    query = `${query} in ${userLocation.city} ${userLocation.country || ''}`.trim();
  }
  return query;
};

const fetchBraveSearchResults = async (query) => {
  const url = new URL(BRAVE_SEARCH_ENDPOINT);
  url.searchParams.set('q', query);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  const payload = await response.json();
  if (!response.ok) {
    const errorText = payload?.error || payload?.message || response.statusText;
    throw new Error(`Brave Search fetch failed: ${errorText}`);
  }

  return payload;
};

const extractBraveText = (payload) => {
  if (!payload) return '';
  if (typeof payload === 'string') return payload;
  if (payload.response) return payload.response;
  if (payload.answer) return payload.answer;
  if (payload.text) return payload.text;
  if (Array.isArray(payload.results) && payload.results.length) {
    const first = payload.results[0];
    return first.content || first.description || first.title || first.snippet || '';
  }
  if (Array.isArray(payload.contexts) && payload.contexts.length) {
    const context = payload.contexts[0];
    if (Array.isArray(context.documents) && context.documents.length) {
      return context.documents.map(doc => doc.content || doc.title || '').filter(Boolean).join(' ');
    }
    if (context.response) return context.response;
  }
  if (Array.isArray(payload.blocks) && payload.blocks.length) {
    return payload.blocks.map(block => block.text || block.content || '').filter(Boolean).join(' ');
  }
  return JSON.stringify(payload).slice(0, 320);
};

const extractTitle = (payload, category, query) => {
  if (!payload) return `${category[0].toUpperCase() + category.slice(1)} trend`;
  if (typeof payload === 'string') return query;
  if (payload.title) return payload.title;
  if (Array.isArray(payload.results) && payload.results.length) {
    return payload.results[0].title || query;
  }
  if (Array.isArray(payload.contexts) && payload.contexts.length) {
    const first = payload.contexts[0];
    return first.title || first.query || query;
  }
  return query;
};

const normalizeTimestamp = (text) => {
  if (!text) {
    return { phrase: 'just now', hours: 2 };
  }

  const match = text.match(/(\d+)\s*(hours?|hrs?)\s*ago/i)
    || text.match(/(\d+)\s*(minutes?|mins?)\s*ago/i)
    || text.match(/\b(yesterday|today|this morning|this afternoon|just now)\b/i);

  if (!match) {
    return { phrase: 'just now', hours: 2 };
  }

  const phrase = match[0];
  if (/\d+/.test(phrase)) {
    const value = parseInt(phrase.match(/\d+/)[0], 10);
    if (/minute/i.test(phrase)) {
      return { phrase, hours: Math.max(1, Math.round(value / 60)) };
    }
    if (/hour|hr/i.test(phrase)) {
      return { phrase, hours: value };
    }
  }

  if (/yesterday/i.test(phrase)) {
    return { phrase: 'yesterday', hours: 24 };
  }

  return { phrase, hours: 2 };
};

const buildTrendFromBraveResponse = (category, response, query) => {
  const raw = response?.data ?? response;
  const baseText = extractBraveText(raw).replace(/\s+/g, ' ').trim();
  const summary = baseText.split('. ').slice(0, 2).join('. ').trim() || `${category[0].toUpperCase() + category.slice(1)} is moving right now.`;
  const { phrase, hours } = normalizeTimestamp(summary);
  const reason = !summary.toLowerCase().includes(phrase.toLowerCase())
    ? `${summary}. ${phrase}.`
    : summary;

  return {
    title: extractTitle(raw, category, query),
    reason: reason.length > 220 ? `${reason.slice(0, 217)}...` : reason,
    talking: TALKING_OPTIONS[Math.floor(Math.random() * TALKING_OPTIONS.length)],
    hoursOld: hours,
    vibe: VIBE_BY_CATEGORY[category] || '💥 Big news',
  };
};

export const fetchTrends = async (
  setLoadingMsg,
  setLoadingStep,
  LOADING_MSGS,
  locationMode,
  userLocation
) => {
  console.log('🔍 fetchTrends called with:', { locationMode, userLocation });

  let interval = setInterval(() => {
    setLoadingStep(step => {
      const next = step + 1;
      if (next < LOADING_MSGS.length) {
        setLoadingMsg(LOADING_MSGS[next]);
        return next;
      }
      return step;
    });
  }, 3000);

  try {
    setLoadingMsg("Searching for trends with Brave...");
    
    // Fetch all trends using Brave Search API
    const trendsData = await fetchAllTrends(locationMode, userLocation);
    
    clearInterval(interval);
    
    // Optional: Enhance with Google Trends data (keep your existing logic)
    const enhancedData = await enhanceWithTrendsData(trendsData);
    
    return { data: enhancedData };
    
  } catch (error) {
    clearInterval(interval);
    console.error("Brave API error:", error);
    return { error: "Couldn't load trends. Please try again." };
  }
};