// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const express = require('express');
const cors = require('cors');
const googleTrends = require('google-trends-api');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Add a health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Trends proxy is running' });
});

const BRAVE_SEARCH_API_URL = 'https://api.search.brave.com/res/v1/llm/context';
const BRAVE_SEARCH_API_KEY = process.env.BRAVE_SEARCH_API_KEY || process.env.BRAVE_API_KEY;

async function fetchBraveSearch(query) {
  if (!BRAVE_SEARCH_API_KEY) {
    throw new Error('Missing Brave Search API key. Set BRAVE_SEARCH_API_KEY in your backend environment.');
  }

  const url = `${BRAVE_SEARCH_API_URL}?q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'X-Subscription-Token': BRAVE_SEARCH_API_KEY,
    },
  });

  const payload = await response.json();
  if (!response.ok) {
    const errorText = payload?.error || payload?.message || response.statusText;
    const error = new Error(`Brave Search API error ${response.status}: ${errorText}`);
    error.status = response.status;
    throw error;
  }

  return payload;
}

app.get('/api/search', async (req, res) => {
  const query = req.query.q || req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  console.log(`🔎 Brave Search query: "${query}"`);
  try {
    const data = await fetchBraveSearch(query);
    res.json({ query, data });
  } catch (error) {
    console.error('❌ Brave Search failed:', error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Endpoint to get trends data
app.get('/api/trends', async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  console.log(`📊 Fetching trends for: "${keyword}"`);

  try {
    // Add delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = await googleTrends.interestOverTime({
      keyword: keyword,
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      granularTimeResolution: true,
    });

    const data = JSON.parse(result);
    const timelineData = data.default?.timelineData;

    if (timelineData && timelineData.length > 0) {
      // Get the most recent value
      const latest = timelineData[timelineData.length - 1];
      const score = latest.value[0];

      console.log(`✅ Score for "${keyword}": ${score}`);
      res.json({ score });
    } else {
      // No data found - return moderate score as fallback
      console.log(`⚠️ No trend data for "${keyword}", using default 50`);
      res.json({ score: 50 });
    }
  } catch (error) {
    console.error(`❌ Error fetching trends for "${keyword}":`, error.message);

    // Check for specific error types
    if (error.message.includes('rate limit')) {
      res.status(429).json({ error: 'Rate limited', score: 50 });
    } else {
      // Return a default score instead of failing
      res.json({ score: 50, note: 'Using default score due to error' });
    }
  }
});

// Test endpoint for Google Trends directly
app.get('/api/test', async (req, res) => {
  try {
    const result = await googleTrends.interestOverTime({
      keyword: 'test',
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    });
    res.json({ success: true, data: JSON.parse(result) });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Trends proxy server running on http://localhost:${PORT}`);
  console.log(`📊 Test endpoint: http://localhost:${PORT}/api/test`);
});

// Handle process signals to keep server alive
process.on('SIGTERM', () => {
  console.log('📊 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📊 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Keep the process alive
setInterval(() => {
  // Silent heartbeat - server is still running
}, 30000);