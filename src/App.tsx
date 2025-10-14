// src/App.tsx
import { useMemo, useState, type JSX } from "react";
import MapView from "./components/MapView";
import GalleryModal from "./components/GalleryModal";
import useDriveManifest, { type DriveImage } from "./hooks/useDriveManifest";
import type { Photo } from "./data/images";
import Footer from "./components/Footer";
import AestheticLoader from "./components/Loader";
import Header from "./components/MotionHeader";

export default function App(): JSX.Element {
  const { images: driveImages, loading, error } = useDriveManifest();

  // Map DriveImage -> Photo shape expected by existing components
  const images: Photo[] | null = useMemo(() => {
    if (!driveImages) return null;
    return driveImages.map((d: DriveImage) => ({
      id: d.id,
      title: d.name,
      fileUrl: d.fileUrl,
      lat: typeof d.lat === "number" ? d.lat : 0,
      lng: typeof d.lng === "number" ? d.lng : 0,
      timestamp:
        d.timestamp ??
        (d.date ? `${d.date}T00:00:00` : new Date().toISOString()),
      date: d.date ?? "",
      location: d.locationName ?? "",
    }));
  }, [driveImages]);

  const [selected, setSelected] = useState<Photo[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function openGallery(imgs: Photo[]) {
    setSelected(imgs);
    setIsOpen(true);
  }

  function closeGallery() {
    setIsOpen(false);
    setSelected(null);
  }

  return (
    <div className="app-shell">
      <Header />
      <div className="container grid">
        <AestheticLoader active={loading} />
        {!loading && (
          <div>
            {error && (
              <div style={{ padding: 20, color: "crimson" }}>
                Error: {error}
              </div>
            )}
            {!error && images && images.length === 0 && (
              <div style={{ padding: 20 }}>
                No photos found in the manifest.
              </div>
            )}
            {!error && images && images.length > 0 && (
              <MapView images={images} onMarkerClick={openGallery} />
            )}
          </div>
        )}
      </div>
      <GalleryModal isOpen={isOpen} onClose={closeGallery} images={selected} />

      <Footer />
    </div>
  );
}
