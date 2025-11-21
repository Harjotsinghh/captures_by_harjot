import {
  MapContainer,
  TileLayer,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import type { Photo } from "../data/images";
import "leaflet/dist/leaflet.css";
import useMapData from "../hooks/useMapData";
import MapMarker from "./MapMarker";

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

export default function MapView({ images, onMarkerClick }: MapViewProps) {
  const { center, places } = useMapData(images);
  const coords = places.map((l) => [l.lat, l.lng] as [number, number]);

  return (
    <MapContainer
      center={center}
      zoom={6}
      trackResize={true}
      touchZoom={true}
      className="mapBox"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {places.map((place, idx) => (
        <MapMarker key={idx} place={place} onClick={onMarkerClick} />
      ))}

      <Polyline
        positions={coords}
        pathOptions={{
          color: "#555",
          weight: 2,
          opacity: 0.6,
          dashArray: "10, 10",
          lineCap: "round",
        }}
      />
    </MapContainer>
  );
}
