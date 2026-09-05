import { Polyline } from "react-leaflet";
import { getCurvedPath } from "../utils/geometry";
import { useTheme } from "../context/ThemeContext";
import { memo, useMemo } from "react";

interface JourneyPathProps {
  waypoints: [number, number][];
}

function JourneyPath({ waypoints }: JourneyPathProps) {
  const { theme } = useTheme();

  const curvedPositions = useMemo(
    () => getCurvedPath(waypoints),
    [waypoints]
  );
  
  // Theme-based colors (using design tokens)
  const mainColor = "var(--accent-color)";

  return (
    <>
      {/* SHADOW/GLOW LAYER: Subtle depth for all modes */}
      <Polyline
        positions={curvedPositions}
        pathOptions={{
          color: theme === "dark" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)",
          weight: 5,
          opacity: 0.3,
          lineCap: "round",
          interactive: false
        }}
      />
      
      {/* MAIN JOURNEY LINE: Dotted/Dashed technical line */}
      <Polyline
        positions={curvedPositions}
        pathOptions={{
          className: "journey-line-path",
          color: mainColor,
          weight: 2,
          dashArray: "1, 12", // Clean aeronautical dots
          opacity: 0.9,
          lineCap: "round",
          interactive: false
        }}
      />
    </>
  );
}

export default memo(JourneyPath);
