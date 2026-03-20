import { Polyline } from "react-leaflet";
import { getCurvedPath } from "../utils/geometry";
import type { Place } from "../hooks/useMapData";
import { useTheme } from "../context/ThemeContext";
import { memo, useMemo } from "react";

interface JourneyPathProps {
  places: Place[];
  mapType: "simple" | "satellite";
}

function JourneyPath({ places, mapType }: JourneyPathProps) {
  const { theme } = useTheme();

  // Extract coordinates and generate curve
  const rawPositions = useMemo(() => 
    places.map((place) => [place.lat, place.lng] as [number, number]),
    [places]
  );
  
  const curvedPositions = useMemo(
    () => getCurvedPath(rawPositions),
    [rawPositions]
  );

  const isSat = mapType === "satellite";
  
  // Theme-based colors
  const mainColor = isSat 
    ? (theme === "dark" ? "#00ffff" : "#f43f5e") // Cyan Glow vs Rose Pink
    : (theme === "dark" ? "#0ea5a4" : "#ec4899");

  return (
    <>
      {/* SHADOW/GLOW LAYER: Only for Satellite Mode to separate path from busy terrain */}
      {isSat && (
        <Polyline
          positions={curvedPositions}
          pathOptions={{
            color: theme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.7)",
            weight: 8,
            opacity: 0.5,
            lineCap: "round",
            interactive: false
          }}
        />
      )}
      
      {/* MAIN JOURNEY LINE */}
      <Polyline
        positions={curvedPositions}
        pathOptions={{
          className: "journey-line-path",
          color: mainColor,
          weight: isSat ? 4 : 3,
          dashArray: isSat ? "8, 12" : "10, 20",
          opacity: isSat ? 1.0 : 0.6,
          lineCap: "round",
          interactive: false
        }}
      />
    </>
  );
}

export default memo(JourneyPath);
