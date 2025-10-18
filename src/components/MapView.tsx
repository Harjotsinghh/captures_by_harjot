import { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import type { Photo } from "../data/images";
import "leaflet/dist/leaflet.css";

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
  // Determine map center (average lat/lng)
  const center = useMemo<[number, number]>(() => {
    if (images.length === 0) return [20, 0];
    const avgLat = images.reduce((s, i) => s + i.lat, 0) / images.length;
    const avgLng = images.reduce((s, i) => s + i.lng, 0) / images.length;
    return [avgLat, avgLng] as [number, number];
  }, [images]);

  // Group images by location (rounded coordinates)
  const places = useMemo(() => {
    const map = new Map<
      string,
      { lat: number; lng: number; images: Photo[] }
    >();
    images.forEach((img) => {
      const key = `${img.lat.toFixed(3)},${img.lng.toFixed(3)}`;
      if (!map.has(key))
        map.set(key, { lat: img.lat, lng: img.lng, images: [] });
      map.get(key)!.images.push(img);
    });
    return Array.from(map.values());
  }, [images]);

  const coords = places.map((l) => [l.lat, l.lng] as [number, number]);

  return (
    <MapContainer center={center} zoom={6} className="mapBox">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {places.map((place, idx) => (
        <Marker key={idx} position={[place.lat, place.lng]}>
          <Popup autoClose={false} keepInView autoPan>
            <div style={{ width: "auto" }}>
              <div style={{ fontWeight: 600 }}>
                {place.images.length} photo(s) here
              </div>
              <div style={{ marginTop: 6 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {place.images.slice(0, 3).map((im) => (
                    <img
                      key={im.id}
                      src={im.fileUrl}
                      alt={im.title}
                      style={{
                        width: 56,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={() => onMarkerClick(place.images)}
                  style={{
                    background: "#0ea5a4",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  Open gallery
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      <Polyline
        positions={coords}
        color="#1f77b4"
        weight={3}
        opacity={0.6}
        lineJoin="miter"
      />
    </MapContainer>
  );
}
