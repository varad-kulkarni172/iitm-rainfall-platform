import axios from "axios";
import type { QueryParams, RainfallData } from "@/types/rainfall";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
});

export async function fetchDatasets(): Promise<string[]> {
  const res = await client.get<{ datasets: string[] }>("/dataset/list");
  return res.data.datasets;
}

export async function queryRainfall(params: QueryParams): Promise<RainfallData> {
  const res = await client.post<RainfallData>("/dataset/query", params);
  return res.data;
}