import { Marker, useMap } from "react-leaflet";
import { useMemo, memo } from "react";
import L from "leaflet";
import type { Place } from "../hooks/useMapData";
import type { Photo } from "../data/images";

interface MapMarkerProps {
  place: Place;
  onClick: (images: Photo[], mapState?: { center: [number, number], zoom: number }) => void;
}

import { useTheme } from "../context/ThemeContext";

function MapMarker({ place, onClick }: MapMarkerProps) {
  const { theme } = useTheme();
  const hasMultiple = place.images.length > 1;

  // Theme-based colors
  // Theme-based colors
  const map = useMap();

  // Prepare images for display (max 2)
  const displayImages = place.images.slice(0, 2);
  const count = displayImages.length;

  // Generate HTML for the marker content
  const getMarkerContent = () => {
    if (count === 1) {
      return `<img src="${displayImages[0].fileUrl}" alt="Location thumbnail" />`;
    }

    // For 2 or more, just show the first 2 in a split view
    const imagesHtml = displayImages.map(img =>
      `<img src="${img.fileUrl}" alt="thumbnail" />`
    ).join('');

    return `<div class="marker-split">${imagesHtml}</div>`;
  };

  const customIcon = useMemo(() => L.divIcon({
    className: "custom-map-marker",
    html: `
      <div class="marker-wrapper">
        <div class="marker-pin">
          ${getMarkerContent()}
        </div>
        <div class="marker-leg"></div>
        ${hasMultiple ? `
          <div class="marker-badge">
            ${place.images.length}
          </div>
        ` : ''}
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 60], // Anchor at bottom of leg
  }), [displayImages, hasMultiple, place.images.length]);

  return (
    <Marker
      position={[place.lat, place.lng]}
      icon={customIcon}
      eventHandlers={{
        click: () => {
          // Capture current state BEFORE flying
          const currentCenter = map.getCenter();
          const currentZoom = map.getZoom();
          const savedState = { center: [currentCenter.lat, currentCenter.lng] as [number, number], zoom: currentZoom };

          map.flyTo([place.lat, place.lng], 14, {
            duration: 1.5,
            easeLinearity: 0.25
          });

          // Delay opening gallery to let the fly-to animation play
          setTimeout(() => {
            onClick(place.images, savedState);
          }, 1000);
        },
      }}
    />
  );
}

export default memo(MapMarker);
