// src/App.tsx
import { useState, type JSX } from "react";
import MapView from "./components/MapView";
import GalleryModal from "./components/GalleryModal";
import usePhotos from "./hooks/usePhotos";
import type { Photo } from "./data/images";
import Footer from "./components/Footer";
import AestheticLoader from "./components/Loader";
import Header from "./components/MotionHeader";
import ParticleNetwork from "./components/ParticleNetwork";
import "./App.css";

export default function App(): JSX.Element {
  const { images, loading, error } = usePhotos();

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
    <>
      <ParticleNetwork />
      <div className="app-container">
        <Header />

        {/* Map Section */}
        <main className={loading ? "map-placeholder" : "map-card"}>
          <AestheticLoader active={loading} />

          {!loading && error && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: 20,
              color: "crimson",
              background: "rgba(255,255,255,0.9)",
              borderRadius: 8
            }}>
              Error: {error}
            </div>
          )}

          {!loading && !error && images && images.length === 0 && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: 20,
              background: "rgba(255,255,255,0.9)",
              borderRadius: 8
            }}>
              No photos found in the manifest.
            </div>
          )}

          {!error && images && images.length > 0 && (
            <MapView images={images} onMarkerClick={openGallery} />
          )}
        </main>

        {!loading && <Footer />}

        <GalleryModal isOpen={isOpen} onClose={closeGallery} images={selected} />
      </div>
    </>
  );
}
