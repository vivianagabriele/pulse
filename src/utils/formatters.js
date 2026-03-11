export const parseCount = (s) => {
  if (!s) return 0;
  const n = parseFloat(s);
  if (s.includes("M")) return n * 1e6;
  if (s.includes("K")) return n * 1e3;
  return n;
};

export const formatAge = (h) => {
  if (h === 0) return "just now";
  if (h < 1) return `${Math.round(h * 60)}m ago`;
  if (h < 24) return `${Math.round(h)}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};