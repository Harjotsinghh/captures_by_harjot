import { Marker, useMap } from "react-leaflet";
import { useMemo, memo } from "react";
import L from "leaflet";
import type { Place } from "../hooks/useMapData";
import type { Photo } from "../data/images";

interface MapMarkerProps {
  place: Place;
  onClick: (images: Photo[], mapState?: { center: [number, number], zoom: number }) => void;
  zoom: number;
}

function getMarkerSize(zoom: number, photoCount: number): number {
  let base: number;
  if (zoom <= 3) base = 18;
  else if (zoom <= 5) base = 24;
  else if (zoom <= 7) base = 32;
  else if (zoom <= 9) base = 40;
  else if (zoom <= 11) base = 48;
  else base = 56;
  const countBonus = Math.min(Math.floor(Math.log2(photoCount)) * 3, 10);
  return base + countBonus;
}

function MapMarker({ place, onClick, zoom }: MapMarkerProps) {
  const hasMultiple = place.images.length > 1;
  const map = useMap();

  const displayImages = place.images.slice(0, 2);
  const count = displayImages.length;
  const locationName = place.images[0]?.location || "Unknown";
  const photoCount = place.images.length;

  const getMarkerContent = () => {
    if (count === 1) {
      return `<img src="${displayImages[0].fileUrl}" alt="thumbnail" referrerpolicy="no-referrer" />`;
    }
    const imagesHtml = displayImages.map(img =>
      `<img src="${img.fileUrl}" alt="thumbnail" referrerpolicy="no-referrer" />`
    ).join('');
    return `<div class="marker-split">${imagesHtml}</div>`;
  };

  const size = getMarkerSize(zoom, place.images.length);
  const borderWidth = size > 40 ? 2.5 : 2;
  const badgeSize = Math.max(Math.round(size * 0.42), 16);
  const badgeFontSize = Math.max(Math.round(size * 0.22), 9);
  const labelFontSize = Math.max(Math.round(size * 0.26), 10);
  const legW = Math.round(size * 0.16);
  const legH = Math.round(size * 0.2);

  const customIcon = useMemo(() => L.divIcon({
    className: "custom-map-marker",
    html: `
      <div class="marker-wrapper">
        <div class="marker-pin" style="
          width: ${size}px;
          height: ${size}px;
          border-width: ${borderWidth}px;
        ">
          ${getMarkerContent()}
        </div>
        <div class="marker-label-card" style="
          left: ${size - 4}px;
          height: ${Math.round(size * 0.65)}px;
          font-size: ${labelFontSize}px;
          border-radius: 0 ${Math.round(size * 0.3)}px ${Math.round(size * 0.3)}px 0;
          top: ${Math.round(size * 0.175 + borderWidth)}px;
        ">
          <span class="marker-label-text">${locationName}</span>
          <span class="marker-label-sep">·</span>
          <span class="marker-label-num">${photoCount}</span>
        </div>
        <div class="marker-leg" style="
          border-left: ${legW}px solid transparent;
          border-right: ${legW}px solid transparent;
          border-top: ${legH}px solid white;
        "></div>
        ${hasMultiple ? `
          <div class="marker-badge" style="
            width: ${badgeSize}px;
            height: ${badgeSize}px;
            font-size: ${badgeFontSize}px;
          ">
            ${photoCount}
          </div>
        ` : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size + legH],
  }), [size, displayImages, hasMultiple, photoCount, borderWidth, badgeSize, badgeFontSize, labelFontSize, legW, legH, locationName]);

  return (
    <Marker
      position={[place.lat, place.lng]}
      icon={customIcon}
      eventHandlers={{
        click: () => {
          const currentCenter = map.getCenter();
          const currentZoom = map.getZoom();
          const savedState = { center: [currentCenter.lat, currentCenter.lng] as [number, number], zoom: currentZoom };

          // Disable zoom animation: just open the gallery without moving the map
          // onClick(place.images, savedState);
          
          // If you want to keep the map position unchanged, don't call flyTo at all
          // Simply open the gallery with the saved state
          onClick(place.images, savedState);
        },
      }}
    />
  );
}

export default memo(MapMarker);
