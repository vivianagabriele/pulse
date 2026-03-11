export const categories = [
  { id: "movie",  label: "Film",   icon: "🎬", color: "#FF3CAC", bg: "#FF3CAC" },
  { id: "music",  label: "Music",  icon: "🎵", color: "#FFBE0B", bg: "#FFBE0B" },
  { id: "show",   label: "TV",     icon: "📺", color: "#3BF4FB", bg: "#3BF4FB" },
  { id: "news",   label: "News",   icon: "🌍", color: "#FF6B35", bg: "#FF6B35" },
  { id: "policy", label: "Policy", icon: "📜", color: "#C77DFF", bg: "#C77DFF" },
  { id: "viral",  label: "Viral",  icon: "🔥", color: "#06D6A0", bg: "#06D6A0" },
];

export const LOADING_MSGS = [
  "Scanning the web for trends…",
  "Checking what people are talking about…",
  "Filtering the noise…",
  "Almost there…",
  "Pulling the latest data…",
];

export const SYSTEM_PROMPT = `You are the engine behind "Pulse" — a real-time trend tracker. You have web search. 

RULES:
1. Search the web for each category to find what is ACTUALLY trending RIGHT NOW.
2. Find the real article/post timestamp and calculate hoursOld from that timestamp. Do NOT invent or estimate — use actual timestamps like "2 hours ago", "published March 10 at 9am", etc.
3. For "talking", estimate realistic current social media volume based on what you find.
4. "reason" should be 1-2 punchy sentences explaining why this is trending and when it broke. Write like a sharp, well-informed friend — clear, specific, no fluff, no slang.
5. "vibe" should be one of: 🤯 Unbelievable | 💥 Big news | ✨ Must-see | 👀 Controversial | 😢 Touching | 🔥 Exploding | 🤝 Feel-good | ⚡ Breaking

Today's date and time: ${new Date().toString()}

Return ONLY a valid JSON object (absolutely no markdown, no backticks, no preamble):
{
  "movie":  { "title": "...", "reason": "...", "talking": "4.2M", "hoursOld": 14, "vibe": "🔥 Exploding" },
  "music":  { "title": "...", "reason": "...", "talking": "890K", "hoursOld": 3,  "vibe": "✨ Must-see" },
  "show":   { "title": "...", "reason": "...", "talking": "2.1M", "hoursOld": 48, "vibe": "👀 Controversial" },
  "news":   { "title": "...", "reason": "...", "talking": "12.4M","hoursOld": 1,  "vibe": "⚡ Breaking" },
  "policy": { "title": "...", "reason": "...", "talking": "3.7M", "hoursOld": 72, "vibe": "😢 Touching" },
  "viral":  { "title": "...", "reason": "...", "talking": "6.8M", "hoursOld": 0,  "vibe": "💥 Big news" }
}`;