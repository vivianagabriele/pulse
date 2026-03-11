import { useState, useEffect } from "react";
import { categories, LOADING_MSGS } from "./utils/constants";
import { parseCount, formatAge } from "./utils/formatters";
import { fetchTrends } from "./utils/api";
import Card from "./components/Card";
import Header from "./components/Header";
import LoadingState from "./components/LoadingState";
import Toast from "./components/Toast";
import "./styles/global.css";

export default function App() {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0]);
  const [loadingStep, setLoadingStep] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({});
  const [liked, setLiked] = useState({});
  const [toastMsg, setToastMsg] = useState(null);

  // Load likes from localStorage on startup
  useEffect(() => {
    const savedLikes = localStorage.getItem('pulse-likes');
    const savedLiked = localStorage.getItem('pulse-liked');
    if (savedLikes) setLikes(JSON.parse(savedLikes));
    if (savedLiked) setLiked(JSON.parse(savedLiked));
  }, []);

  // Save likes to localStorage
  useEffect(() => {
    localStorage.setItem('pulse-likes', JSON.stringify(likes));
    localStorage.setItem('pulse-liked', JSON.stringify(liked));
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
      
      // Initialize likes for new trends
      const initLikes = {};
      categories.forEach(c => { 
        initLikes[c.id] = Math.floor(Math.random() * 900) + 100; 
      });
      setLikes(initLikes);
      setLiked({});
    }
    setLoading(false);
  };

  const toggleLike = (e, id) => {
    e.stopPropagation();
    setLikes(p => ({ ...p, [id]: (p[id] || 0) + (liked[id] ? -1 : 1) }));
    setLiked(p => ({ ...p, [id]: !p[id] }));
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
          {sorted.map((cat, index) => (
            <Card
              key={cat.id}
              category={cat}
              trend={trends[cat.id]}
              rank={index + 1}
              isOpen={selected === cat.id}
              onToggle={() => setSelected(selected === cat.id ? null : cat.id)}
              likes={likes[cat.id] || 0}
              liked={liked[cat.id]}
              onLike={(e) => toggleLike(e, cat.id)}
              onShare={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(
                  `🔥 Trending now: ${trends[cat.id].title}\n${trends[cat.id].vibe} — ${trends[cat.id].reason}\n\nvia Pulse`
                );
                setToastMsg("copied to clipboard ✅");
              }}
              onTweet={(e) => {
                e.stopPropagation();
                const text = encodeURIComponent(`🔥 ${trends[cat.id].title} is trending right now\n${trends[cat.id].vibe}\n\nvia Pulse`);
                window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
              }}
            />
          ))}
          <div className="footer">
            PULSE © 2026 · TAP ANY CARD FOR DETAILS
          </div>
        </div>
      )}
    </div>
  );
}