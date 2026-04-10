import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState, useCallback, memo } from "react";
import L from "leaflet";
import type { Photo } from "../data/images";
import "leaflet/dist/leaflet.css";
import useMapData from "../hooks/useMapData";
import MapMarker from "./MapMarker";
import { useTheme } from "../context/ThemeContext";
import JourneyPath from "./JourneyPath";

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
  onMarkerClick: (images: Photo[], mapState?: { center: [number, number], zoom: number }) => void;
  targetState?: { center: [number, number], zoom: number } | null;
}

// Component to auto-center map on markers
const AutoCenterMap = memo<{ places: any[] }>(({ places }) => {
  const map = useMap();

  useEffect(() => {
    if (places.length > 0) {
      const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [100, 100] });
    }
  }, [places, map]);

  return null;
});

AutoCenterMap.displayName = "AutoCenterMap";

// Component to handle programmatic fly-to
const FlyToController = ({ targetState }: { targetState?: { center: [number, number], zoom: number } | null }) => {
  const map = useMap();

  useEffect(() => {
    if (targetState) {
      map.flyTo(targetState.center, targetState.zoom, {
        duration: 0.8,
        easeLinearity: 0.25
      });
    }
  }, [targetState, map]);

  return null;
};

// Component to track zoom level
const ZoomTracker = ({ onZoomChange }: { onZoomChange: (zoom: number) => void }) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });

  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);

  return null;
};

// Map Controls (Zoom In/Out only)
const MapZoomControls = memo(({ theme }: { theme: string }) => {
  const map = useMap();

  return (
    <div className={`map-unified-controls ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="muc-pill">
        <button className="muc-btn" onClick={(e) => { e.stopPropagation(); map.zoomIn(); }} title="Zoom In">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <div className="muc-divider" />
        <button className="muc-btn" onClick={(e) => { e.stopPropagation(); map.zoomOut(); }} title="Zoom Out">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
    </div>
  );
});
MapZoomControls.displayName = "MapZoomControls";

function MapView({ images, onMarkerClick, targetState }: MapViewProps) {
  const { center, places } = useMapData(images);
  const { theme } = useTheme();
  const [zoom, setZoom] = useState(6);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const cartoUrl = "https://{s}.basemaps.cartocdn.com/" + (theme === "dark" ? "dark_all" : "light_all") + "/{z}/{x}/{y}{r}.png";

  return (
    <div
      className={`map-wrapper ${theme === 'dark' ? 'map-dark-mode' : ''}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={center}
        zoom={5}
        minZoom={3}
        maxBounds={[
          [-85, -Infinity],
          [85, Infinity]
        ]}
        maxBoundsViscosity={1.0}
        trackResize={true}
        touchZoom={true}
        className="mapBox"
        zoomControl={false}
        worldCopyJump={true}
      >
        <MapZoomControls theme={theme} />

        <AutoCenterMap places={places} />
        <FlyToController targetState={targetState} />
        <ZoomTracker onZoomChange={handleZoomChange} />
        <JourneyPath places={places} />

        <TileLayer
          attribution='&copy; CARTO'
          url={cartoUrl}
          noWrap={false}
        />

        {places.map((place, idx) => (
          <MapMarker
            key={idx}
            place={place}
            onClick={onMarkerClick}
            zoom={zoom}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default memo(MapView);
