"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { useMapStore } from "@/store/useMapStore";
import { getRainfallColor } from "@/lib/colorScale";

export default function RainfallLayer() {
  const map = useMap();
  const { rainfallData } = useMapStore();
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    // 1. Clean up the previous layer completely
    if (layerRef.current) {
      console.log("🧹 Clearing old rainfall layer...");
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!rainfallData || !rainfallData.values || rainfallData.values.length === 0) {
      console.log("⚪ No data available to render yet.");
      return;
    }

    const { lats, lons, values, units } = rainfallData;
    console.log(`📊 Processing Grid Data: ${lats.length} Latitudes, ${lons.length} Longitudes`);

    const group = L.layerGroup();

    // 2. Determine step sizes cleanly (IMD is traditionally 0.25)
    const dlat = lats.length > 1 ? Math.abs(lats[1] - lats[0]) : 0.25;
    const dlon = lons.length > 1 ? Math.abs(lons[1] - lons[0]) : 0.25;
    const halfLat = dlat / 2;
    const halfLon = dlon / 2;

    let renderedCellsCount = 0;

    // 3. Loop over the dimensions safely
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      if (!row || i >= lats.length) continue;

      for (let j = 0; j < row.length; j++) {
        if (j >= lons.length) continue;

        const val = row[j];

        // Skip missing values or invalid data points completely
        if (val === null || val === undefined || val < 0) continue;

        const currentLat = lats[i];
        const currentLon = lons[j];
        const color = getRainfallColor(val);

        // 4. Create explicit bounds for the square cell
        const bounds: L.LatLngBoundsExpression = [
          [currentLat - halfLat, currentLon - halfLon],
          [currentLat + halfLat, currentLon + halfLon]
        ];

        // 5. Instantiated rectangle configuration
        L.rectangle(bounds, {
          color: "none", // No border lines to avoid grid visual noise
          fillColor: color,
          fillOpacity: 0.65,
          weight: 0,
        })
          .bindTooltip(`<b>Rainfall:</b> ${val.toFixed(1)} ${units || "mm"}<br/><b>Lat:</b> ${currentLat.toFixed(2)}, <b>Lon:</b> ${currentLon.toFixed(2)}`)
          .addTo(group);

        renderedCellsCount++;
      }
    }

    console.log(`🎨 Successfully added ${renderedCellsCount} grid blocks to the map group.`);

    // 6. Push to map and auto-pan directly to the data grid boundary
    if (renderedCellsCount > 0) {
      group.addTo(map);
      layerRef.current = group;

      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLon = Math.min(...lons);
      const maxLon = Math.max(...lons);

      console.log(`🗺️ Auto-focusing map view on bounds: [${minLat}, ${minLon}] to [${maxLat}, ${maxLon}]`);
      map.fitBounds([
        [minLat, minLon],
        [maxLat, maxLon]
      ]);
    } else {
      console.warn("⚠️ Grid parsing completed, but 0 valid cells were found above 0mm.");
    }

  }, [rainfallData, map]);

  return null;
}