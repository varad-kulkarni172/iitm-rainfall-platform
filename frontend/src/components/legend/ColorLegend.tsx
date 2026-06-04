"use client";
import { RAINFALL_COLORS } from "@/lib/colorScale";

export default function ColorLegend() {
  return (
    <div className="bg-white/90 backdrop-blur rounded-lg p-3 shadow text-xs">
      <p className="font-semibold mb-2 text-gray-700">Rainfall (mm)</p>
      <div className="flex flex-col gap-1">
        {RAINFALL_COLORS.map((c, i) => {
          const next = RAINFALL_COLORS[i + 1];
          return (
            <div key={c.threshold} className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-3 rounded-sm border border-gray-200"
                style={{ backgroundColor: c.color }}
              />
              <span className="text-gray-600">
                {c.threshold}–{next ? next.threshold : "300+"} mm
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}