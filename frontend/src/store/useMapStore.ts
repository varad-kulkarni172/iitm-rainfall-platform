import { create } from "zustand";
import type { RainfallData } from "@/types/rainfall";

interface MapState {
  dataset: string;
  date: string;
  rainfallData: RainfallData | null;
  loading: boolean;
  error: string | null;
  setDataset: (d: string) => void;
  setDate: (d: string) => void;
  setRainfallData: (data: RainfallData | null) => void;
  setLoading: (b: boolean) => void;
  setError: (e: string | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  dataset: "",
  date: "2001-07",
  rainfallData: null,
  loading: false,
  error: null,
  setDataset: (dataset) => set({ dataset }),
  setDate: (date) => set({ date }),
  setRainfallData: (rainfallData) => set({ rainfallData }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));