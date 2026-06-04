"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import DateSelector from "@/components/controls/DateSelector";
import ColorLegend from "@/components/legend/ColorLegend";
import { useMapStore } from "@/store/useMapStore";
import { fetchDatasets, queryRainfall } from "@/lib/api";

// Leaflet requires no-SSR
const IndiaMap = dynamic(() => import("@/components/map/IndiaMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />,
});

export default function Home() {
  const { dataset, date, loading, error, setDataset, setRainfallData, setLoading, setError } = useMapStore();
  const [datasets, setDatasets] = useState<string[]>([]);

  useEffect(() => {
    fetchDatasets().then(setDatasets).catch(console.error);
  }, []);

  async function handleLoad() {
    if (!dataset || !date) return;
    setLoading(true);
    setError(null);
    try {
      const data = await queryRainfall({ dataset, date });
      setRainfallData(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }

    const data = await queryRainfall({ dataset, date });
    setRainfallData(data);
    console.log("API response:", JSON.stringify(data).slice(0, 300));
  }
  

  return (
    <main className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col gap-6 p-5 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Rainfall Viewer</h1>
          <p className="text-xs text-gray-400 mt-0.5">IITM · IMD Dataset</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Dataset</label>
          <select
            value={dataset}
            onChange={(e) => setDataset(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select dataset…</option>
            {datasets.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <DateSelector />

        <button
          onClick={handleLoad}
          disabled={loading || !dataset}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          {loading ? "Loading…" : "Load Rainfall"}
        </button>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <div className="mt-auto">
          <ColorLegend />
        </div>
      </aside>

      {/* Map */}
      <section className="flex-1 relative p-4">
        <IndiaMap />
      </section>
    </main>
  );
}