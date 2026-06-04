"use client";
import { useMapStore } from "@/store/useMapStore";

export default function DateSelector() {
  const { date, setDate } = useMapStore();
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        Date (YYYY-MM)
      </label>
      <input
        type="month"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}