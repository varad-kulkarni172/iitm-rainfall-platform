"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import RainfallLayer from "./RainfallLayer";

// India bounds
const INDIA_CENTER: [number, number] = [22.5, 82.5];
const INDIA_ZOOM = 5;

export default function IndiaMap() {
  return (
    <MapContainer
      center={INDIA_CENTER}
      zoom={INDIA_ZOOM}
      style={{ height: "100%", width: "100%", borderRadius: "8px" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        opacity={0.6}
      />
      <RainfallLayer />
    </MapContainer>
  );
}