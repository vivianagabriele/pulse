import React from 'react';
import { formatAge } from '../utils/formatters';

export default function Card({
  category,
  trend,
  rank,
  isOpen,
  onToggle,
  likeCount,
  isLiked,
  onLike,
  onShare,
  locationMode,
  location,
}) {
  if (!trend) return null;

  const isNew = trend.hoursOld < 2;
  const isRank1 = rank === 1;

  const cardStyle = {
    background: isOpen
      ? 'linear-gradient(180deg, #FFFFFF, #F8FAFC)'
      : '#FFFFFF',
    border: `1px solid ${isOpen ? '#CBD5E1' : '#E2E8F0'}`,
    boxShadow: isOpen ? '0 10px 20px rgba(15, 23, 42, 0.08)' : '0 4px 10px rgba(15, 23, 42, 0.04)',
  };

  const badgeStyle = {
    background: category.color,
    color: '#ffffff',
  };

  const borderGlow = {
    background: `linear-gradient(90deg, transparent, ${category.color}, transparent)`,
  };

  const handleTweet = (e) => {
    e.stopPropagation();

    const cleanTitle = trend.title
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '');

    const categoryTags = {
      movie: '#Movies #FilmTwitter',
      music: '#Music #NowPlaying',
      show: '#TV #Streaming',
      news: '#News #BreakingNews',
      policy: '#Politics #Policy',
      viral: '#Viral #Trending',
    };

    const vibeOnly = trend.vibe.replace(/[^\w\s]/g, '').trim();

    const hashtags = [
      `#${cleanTitle}`,
      categoryTags[category.id] || '#Trending',
      `#${vibeOnly}`,
      '#PulseApp',
    ].join(' ');

    const tweetText = `🔥 ${trend.title} is trending right now\n\n${hashtags}`;

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
      '_blank'
    );
  };

  return (
    <div
      className="group relative rounded-2xl border p-5 mb-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-glow"
      style={cardStyle}
      onClick={onToggle}
    >
      {isRank1 && (
        <div className="absolute inset-x-0 top-0 h-1" style={borderGlow} />
      )}

      <div className="flex items-start gap-4">
        <div
          className={`font-extrabold leading-none ${
            isRank1 ? 'text-4xl' : 'text-3xl'
          }`}
          style={{
            color: isRank1 ? category.color : '#94a3b8',
            textShadow: isRank1 ? `0 0 18px ${category.color}88` : 'none',
          }}
        >
          {rank}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
              style={badgeStyle}
            >
              {category.icon} {category.label}
            </span>

            {trend.vibe && (
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {trend.vibe}
              </span>
            )}

            <span
              className={`text-xs font-semibold flex items-center gap-1 ${
                isNew ? 'text-emerald-300' : 'text-slate-500'
              }`}
            >
              {isNew && <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />}
              {formatAge(trend.hoursOld)}
            </span>

            {locationMode === 'local' && location?.city && (
              <span style={{
                fontSize: '11px',
                color: '#06D6A0',
                marginLeft: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
              }}>
                📍 {location.city}
              </span>
            )}
          </div>

<div className="text-lg font-extrabold text-slate-900 leading-snug tracking-tight">
            {trend.title}
          </div>

          {isOpen && (
            <div className="mt-3 text-sm text-slate-600 pt-3 border-t border-slate-100 animate-[fadeUp_0.2s_ease_both]">
              {trend.reason}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={onLike}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                isLiked
                  ? 'bg-indigo-100 border border-indigo-200 text-indigo-700'
                  : 'bg-slate-100 border border-slate-200 text-slate-700'
              } hover:bg-slate-200`}
            >
              <span className="text-sm">❗</span>
              {likeCount.toLocaleString()}
            </button>

            <button
              onClick={onShare}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
            >
              Copy
            </button>

            <button
              onClick={handleTweet}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:opacity-90"
            >
              Tweet
            </button>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-xs text-slate-500 font-medium">People talking</div>
          <div className="text-lg font-bold text-slate-900">{trend.talking}</div>
        </div>
      </div>
    </div>
  );
}
