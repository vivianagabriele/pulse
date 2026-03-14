import { useState, useEffect } from "react";
import { categories, LOADING_MSGS } from "./utils/constants";
import { parseCount, formatAge } from "./utils/formatters";
import { fetchTrends } from "./utils/api";
import Card from "./components/Card";
import Header from "./components/Header";
import LoadingState from "./components/LoadingState";
import Toast from "./components/Toast";
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

  const handleFetchTrends = async () => {
    setLoading(true);
    setError(null);
    setLoadingMsg(LOADING_MSGS[0]);
    setLoadingStep(0);

    const result = await fetchTrends(
      setLoadingMsg,
      setLoadingStep,
      LOADING_MSGS
    );
    
    if (result.error) {
      setError(result.error);
    } else {
      setTrends(result.data);
      setLastUpdated(new Date());
      
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
  };

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

  useEffect(() => {
    handleFetchTrends();
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
        onRefresh={handleFetchTrends}
        lastUpdated={lastUpdated}
      />
      
      {loading && <LoadingState message={loadingMsg} step={loadingStep} />}
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      
      {trends && !loading && (
        <div className="cards-container">
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
              />
            );
          })}
          <div className="footer">
            PULSE © 2026 · TAP ANY CARD FOR DETAILS
          </div>
        </div>
      )}
    </div>
  );
}