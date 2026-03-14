import React from 'react';

export default function Header({ loading, onRefresh, lastUpdated }) {
  return (
    <header className="sticky top-0 z-20 bg-slate-950/75 backdrop-blur-md border-b border-white/10 px-5 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-orange-400 to-cyan-300 bg-clip-text text-transparent">
          Pulse
        </h1>
        <div className="text-xs text-white/60 mt-0.5 tracking-widest">
          NO ADS · NO ALGORITHM · JUST WHAT&apos;S HAPPENING
        </div>
      </div>

      <button
        onClick={onRefresh}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
          loading
            ? 'bg-white/10 text-white/40 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm hover:shadow-glow'
        }`}
      >
        {loading ? 'loading…' : '↻ refresh'}
      </button>
    </header>
  );
}
