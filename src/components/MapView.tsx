import {
  MapContainer,
  TileLayer,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect, useMemo, memo } from "react";
import L from "leaflet";
import type { Photo } from "../data/images";
import "leaflet/dist/leaflet.css";
import useMapData from "../hooks/useMapData";
import MapMarker from "./MapMarker";
import { useTheme } from "../context/ThemeContext";

// Fix default marker icon paths for Vite bundling
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapViewProps {
  images: Photo[];
  onMarkerClick: (images: Photo[]) => void;
}

// Component to auto-center map on markers
const AutoCenterMap = memo<{ places: any[] }>(({ places }) => {
  const map = useMap();

  useEffect(() => {
    if (places.length > 0) {
      const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [80, 80] });
    }
  }, [places, map]);

  return null;
});

AutoCenterMap.displayName = 'AutoCenterMap';

function MapView({ images, onMarkerClick }: MapViewProps) {
  const { center, places } = useMapData(images);
  const { theme } = useTheme();

  const coords = useMemo(
    () => places.map((l) => [l.lat, l.lng] as [number, number]),
    [places]
  );

  const tileUrl = useMemo(
    () => theme === 'dark'
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    [theme]
  );

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={6}
        trackResize={true}
        touchZoom={true}
        className="mapBox"
      >
        <AutoCenterMap places={places} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />
        {places.map((place, idx) => (
          <MapMarker key={idx} place={place} onClick={onMarkerClick} />
        ))}

        <Polyline
          positions={coords}
          pathOptions={{
            color: theme === 'dark' ? "#a3a3a3" : "#555",
            weight: 2,
            opacity: 0.6,
            dashArray: "10, 10",
            lineCap: "round",
          }}
        />
      </MapContainer>
    </div>
  );
}

export default memo(MapView);
