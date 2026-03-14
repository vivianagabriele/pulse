import React from 'react';
import { LOADING_MSGS } from '../utils/constants';

export default function LoadingState({ message, step }) {
  return (
    <div className="text-center px-6 py-16">
      <div className="text-5xl mb-6 inline-block animate-spin">✦</div>
      <div className="text-base font-bold text-white mb-2">{message}</div>
      <div className="flex justify-center gap-2 mt-5">
        {LOADING_MSGS.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i <= step ? 'w-6 bg-gradient-to-r from-pink-500 to-purple-500' : 'w-2 bg-white/10'
            }`}
          />
        ))}
      </div>
      <div className="text-xs text-white/50 mt-4">searching live web data…</div>
    </div>
  );
}
