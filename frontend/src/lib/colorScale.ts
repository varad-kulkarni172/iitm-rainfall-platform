// Easily swappable color palette for rainfall intensity
export const RAINFALL_COLORS = [
  { threshold: 0,   color: "#f7fbff" },
  { threshold: 10,  color: "#c6dbef" },
  { threshold: 25,  color: "#6baed6" },
  { threshold: 50,  color: "#2171b5" },
  { threshold: 100, color: "#084594" },
  { threshold: 150, color: "#fcae91" },
  { threshold: 200, color: "#fb6a4a" },
  { threshold: 300, color: "#cb181d" },
];

export function getRainfallColor(value: number | null): string {
  if (value === null || value < 0) return "transparent";
  const match = [...RAINFALL_COLORS].reverse().find(c => value >= c.threshold);
  return match?.color ?? "#f7fbff";
}