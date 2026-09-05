import { MapContainer, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState, useCallback, memo } from "react";
import L from "leaflet";
import type { Photo } from "../data/images";
import "leaflet/dist/leaflet.css";
import useMapData from "../hooks/useMapData";
import MapMarker from "./MapMarker";
import { useTheme } from "../context/ThemeContext";
import JourneyPath from "./JourneyPath";
import 'maplibre-gl/dist/maplibre-gl.css';
import '@maplibre/maplibre-gl-leaflet';

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


const VectorTileLayer = memo(({ styleUrl }: { styleUrl: string }) => {
  const map = useMap();
  const [styleJson, setStyleJson] = useState<any>(null);

  useEffect(() => {
    if (!styleUrl) return;
    
    // Fetch style and modify label densities
    fetch(styleUrl)
      .then(res => res.json())
      .then(data => {
        const minZooms: Record<string, number> = {
          place_country_major: 3,
          place_country_minor: 4,
          place_country_other: 5,
          place_state: 5,
          place_city_large: 6,
          place_city: 8,
          place_town: 10,
          place_village: 12,
          place_suburb: 13,
          place_other: 14,
        };

        if (data && data.layers) {
          data.layers = data.layers.map((layer: any) => {
            if (minZooms[layer.id] !== undefined) {
              return { ...layer, minzoom: minZooms[layer.id] };
            }
            return layer;
          });
        }
        
        setStyleJson(data);
      })
      .catch(err => {
        console.error("Failed to load map style:", err);
        // Fallback to URL if fetch fails
        setStyleJson(styleUrl);
      });
  }, [styleUrl]);

  useEffect(() => {
    if (!styleJson) return;

    const layer = (L as any).maplibreGL({
      style: styleJson,
      attribution: '&copy; <a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OSM</a>',
      noWrap: false,
    });

    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, styleJson]);

  return null;
});

// Map Controls (Zoom In/Out)
const MapZoomControls = memo(({ theme }: { theme: string }) => {
  const map = useMap();

  return (
    <div className={`map-unified-controls ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="muc-pill">
        <button className="muc-btn" onClick={(e) => { e.stopPropagation(); map.zoomIn(); }} title="Zoom In" aria-label="Zoom In">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <div className="muc-divider" />
        <button className="muc-btn" onClick={(e) => { e.stopPropagation(); map.zoomOut(); }} title="Zoom Out" aria-label="Zoom Out">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <div className="muc-divider" />
      </div>
    </div>
  );
});
MapZoomControls.displayName = "MapZoomControls";

function MapView({ images, onMarkerClick, targetState }: MapViewProps) {
  const { center, places, journeyWaypoints } = useMapData(images);
  const { theme } = useTheme();
  const [zoom, setZoom] = useState(6);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const vectorStyleUrl = theme === 'dark' 
    ? "https://tiles.openfreemap.org/styles/dark"
    : "https://tiles.openfreemap.org/styles/positron";

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
        <JourneyPath waypoints={journeyWaypoints} />

        <VectorTileLayer styleUrl={vectorStyleUrl} />

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
