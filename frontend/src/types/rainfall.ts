export interface RainfallData {
  variable: string;
  lats: number[];
  lons: number[];
  values: (number | null)[][];
  units: string;
}

export interface QueryParams {
  dataset: string;
  date: string;
  lat_min?: number;
  lat_max?: number;
  lon_min?: number;
  lon_max?: number;
  aggregation?: string;
}