import React, { useEffect } from 'react';

export default function Toast({ message, setMessage }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-slate-200 text-slate-900 px-5 py-3 rounded-full text-sm font-semibold z-50 shadow-lg shadow-slate-400/20 animate-[toast_2.5s_ease_forwards] whitespace-nowrap">
      {message}
    </div>
  );
}
