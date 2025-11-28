import { Marker } from "react-leaflet";
import { useMemo, memo } from "react";
import L from "leaflet";
import type { Place } from "../hooks/useMapData";
import type { Photo } from "../data/images";

interface MapMarkerProps {
  place: Place;
  onClick: (images: Photo[]) => void;
}

import { useTheme } from "../context/ThemeContext";

function MapMarker({ place, onClick }: MapMarkerProps) {
  const { theme } = useTheme();
  const hasMultiple = place.images.length > 1;

  // Theme-based colors
  const strokeColor = theme === 'dark' ? '#e5e7eb' : 'white'; // Light grey leg for dark mode
  const pinColor = theme === 'dark' ? '#dc2626' : 'white';    // Dark red for dark mode
  const ringColor = theme === 'dark' ? '#e5e7eb' : 'white';   // Light grey ring for dark mode
  const image1 = place.images[0];
  const image2 = hasMultiple ? place.images[1] : null;

  const customIcon = useMemo(() => L.divIcon({
    className: "custom-map-marker",
    html: `
      <div style="
        position: relative;
        width: 50px;
        height: 70px;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
      ">
        <svg viewBox="0 0 100 140" style="width: 100%; height: 100%; display: block; overflow: visible;">
          <!-- Vertical Pin Line -->
          <line x1="50" y1="95" x2="50" y2="140" stroke="${strokeColor}" stroke-width="4" stroke-linecap="round" />
          
          <!-- Pin Head Background -->
          <circle cx="50" cy="50" r="50" fill="${pinColor}" />
          
          <defs>
            <clipPath id="circleView">
              <circle cx="50" cy="50" r="46" />
            </clipPath>
            <clipPath id="leftHalf">
              <path d="M 50 4 A 46 46 0 0 0 50 96 L 50 4" />
            </clipPath>
            <clipPath id="rightHalf">
              <path d="M 50 4 A 46 46 0 0 1 50 96 L 50 4" />
            </clipPath>
          </defs>
          
          ${hasMultiple && image2
        ? `
            <!-- Left Image -->
            <image 
              x="4" y="4" width="92" height="92" 
              href="${image1.fileUrl}" 
              clip-path="url(#leftHalf)" 
              preserveAspectRatio="xMidYMid slice"
              referrerPolicy="no-referrer"
              onerror="this.href.baseVal='https://placehold.co/100x100?text=Error'"
            />
            <!-- Right Image -->
            <image 
              x="4" y="4" width="92" height="92" 
              href="${image2.fileUrl}" 
              clip-path="url(#rightHalf)" 
              preserveAspectRatio="xMidYMid slice"
              referrerPolicy="no-referrer"
              onerror="this.href.baseVal='https://placehold.co/100x100?text=Error'"
            />
            <!-- Divider -->
            <line x1="50" y1="4" x2="50" y2="96" stroke="${strokeColor}" stroke-width="2" />
            `
        : `
            <!-- Single Image -->
            <image 
              x="4" y="4" width="92" height="92" 
              href="${image1.fileUrl}" 
              clip-path="url(#circleView)" 
              preserveAspectRatio="xMidYMid slice"
              referrerPolicy="no-referrer"
              onerror="this.href.baseVal='https://placehold.co/100x100?text=Error'"
            />
            `
      }
          
          <!-- Border Ring -->
          <circle cx="50" cy="50" r="46" fill="none" stroke="${ringColor}" stroke-width="4" />
        </svg>

        ${place.images.length > 1
        ? `<div style="
              position: absolute;
              top: 0;
              right: 0;
              background: #ff5252;
              color: white;
              font-size: 11px;
              font-weight: bold;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ">
              ${place.images.length}
            </div>`
        : ""
      }
      </div>
    `,
    iconSize: [50, 70],
    iconAnchor: [25, 70], // Anchor at the bottom of the line
  }), [strokeColor, pinColor, ringColor, image1, image2, hasMultiple, place.images.length]);

  return (
    <Marker
      position={[place.lat, place.lng]}
      icon={customIcon}
      eventHandlers={{
        click: () => onClick(place.images),
      }}
    />
  );
}

export default memo(MapMarker);
