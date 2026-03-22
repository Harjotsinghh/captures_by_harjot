import { MapContainer, TileLayer, useMap, useMapEvents, LayerGroup, Pane } from "react-leaflet";
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

  // Set initial zoom
  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);

  return null;
};

// Unified Map Controls (Zoom In/Out + Layer Toggle with Dropdown)
const MapUnifiedControls = memo(({ mapType, setMapType, theme }: any) => {
  const map = useMap();
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="muc-divider" />

        <div className="muc-dropdown-wrapper">
          <button
            className={`muc-btn ${isOpen ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            title="Map Layers"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          </button>

          {isOpen && (
            <div className="muc-dropdown">
              <button
                className={`muc-dropdown-item ${mapType === 'simple' ? 'selected' : ''}`}
                onClick={(e) => { e.stopPropagation(); setMapType('simple'); setIsOpen(false); }}
              >
                Simple
              </button>
              <button
                className={`muc-dropdown-item ${mapType === 'satellite' ? 'selected' : ''}`}
                onClick={(e) => { e.stopPropagation(); setMapType('satellite'); setIsOpen(false); }}
              >
                Satellite
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
MapUnifiedControls.displayName = "MapUnifiedControls";

function MapView({ images, onMarkerClick, targetState }: MapViewProps) {
  const { center, places } = useMapData(images);
  const { theme } = useTheme();
  const [zoom, setZoom] = useState(6);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const [mapType, setMapType] = useState<"simple" | "satellite">(() => {
    return (localStorage.getItem("gallery-map-type") as "simple" | "satellite") || "simple";
  });

  const handleSetMapType = useCallback((type: "simple" | "satellite") => {
    setMapType(type);
    localStorage.setItem("gallery-map-type", type);
  }, []);

  const cartoUrl = "https://{s}.basemaps.cartocdn.com/" + (theme === "dark" ? "dark_all" : "light_all") + "/{z}/{x}/{y}{r}.png";

  const esriImageryUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const cartoLabelsUrl = theme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png";

  return (
    <div
      className={`map-wrapper ${theme === 'dark' ? 'map-dark-mode' : ''} ${mapType === 'satellite' ? 'map-satellite-mode' : ''}`}
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
        minZoom={2}
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
        <MapUnifiedControls mapType={mapType} setMapType={handleSetMapType} theme={theme} />

        <AutoCenterMap places={places} />
        <FlyToController targetState={targetState} />
        <ZoomTracker onZoomChange={handleZoomChange} />
        <JourneyPath places={places} mapType={mapType} />

        {mapType === "simple" && (
          <TileLayer
            key="simple-map"
            attribution='&copy; CARTO'
            url={cartoUrl}
            noWrap={false}
          />
        )}

        {mapType === "satellite" && (
          <LayerGroup key="sat-map">
            <Pane name="satellite-imagery" style={{ zIndex: 100 }}>
              <TileLayer
                attribution='Tiles &copy; Esri'
                url={esriImageryUrl}
                noWrap={false}
              />
            </Pane>
            <Pane name="satellite-labels" style={{ zIndex: 150 }}>
              <TileLayer
                url={cartoLabelsUrl}
                noWrap={false}
              />
            </Pane>
          </LayerGroup>
        )}

        {/* Render markers only once, not three times */}
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
