import { Polyline } from "react-leaflet";
import { getCurvedPath } from "../utils/geometry";
import type { Place } from "../hooks/useMapData";
import { useTheme } from "../context/ThemeContext";
import { memo, useMemo } from "react";

interface JourneyPathProps {
  places: Place[];
}

function JourneyPath({ places }: JourneyPathProps) {
  const { theme } = useTheme();

  // Extract coordinates and generate curve
  const rawPositions = places.map(
    (place) => [place.lat, place.lng] as [number, number]
  );
  const curvedPositions = useMemo(
    () => getCurvedPath(rawPositions),
    [rawPositions]
  );

  // Theme-based color
  const pathColor = theme === "dark" ? "#0ea5a4" : "#ec4899"; // Cyan vs Pink

  return (
    <Polyline
      positions={curvedPositions}
      pathOptions={{
        className: "journey-line-path",
        color: pathColor,
        weight: 3,
        dashArray: "10, 20", // Longer gaps for shooting star effect
        opacity: 0.6,
        lineCap: "round",
      }}
    />
  );
}

export default memo(JourneyPath);
