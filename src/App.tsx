
import { useState, type JSX } from "react";
import MapView from "./components/MapView";
import GalleryModal from "./components/GalleryModal";
import usePhotos from "./hooks/usePhotos";
import Footer from "./components/Footer";
import AestheticLoader from "./components/Loader";
import Header from "./components/MotionHeader";
import AmbientBackground from "./components/AmbientBackground";
import Gallery3DView from "./components/Gallery3DView";
import ErrorScreen from "./components/ErrorScreen";
import { motion } from "framer-motion";
import { FaMapMarkedAlt, FaImages } from "react-icons/fa";
import "./App.css";

export default function App(): JSX.Element {
  const { images, loading, error } = usePhotos();
  const [selected, setSelected] = useState<any[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  const [viewMode, setViewMode] = useState<'map' | 'gallery'>('map');

  const openGallery = (photos: any | any[]) => {
    const selectedPhotos = Array.isArray(photos) ? photos : [photos];
    setSelected(selectedPhotos);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
    setSelected(null);
  };

  return (
    <>
      {/* Loader Layer (Background) - Only show if intro not finished */}
      {!introFinished && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
          <AestheticLoader active={true} text="Calibrating Lens..." />
        </div>
      )}

      {/* Error Layer (Overlay) */}
      {error && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <ErrorScreen message={typeof error === 'string' ? error : "An unexpected error occurred"} />
        </div>
      )}

      {/* Main App Layer (Foreground with Reveal Animation) */}
      {!error && (
        <motion.div
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{
            clipPath: loading ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)"
          }}
          transition={{
            duration: 1.5,
            ease: [0.43, 0.13, 0.23, 0.96] // Custom easing for cinematic feel
          }}
          onAnimationComplete={() => {
            if (!loading) setIntroFinished(true);
          }}
          style={{
            position: 'relative',
            zIndex: 10,
            background: '#f8f9fa',
            minHeight: '100vh'
          }}
        >
          <AmbientBackground />
          <div className="app-container">
            <Header />

            {/* Main Content Area */}
            <main className={viewMode === 'map' ? "map-card" : "gallery-3d-container"}>
              {/* View Toggle Overlay */}
              <div className="view-toggle">
                <button
                  className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                  onClick={() => setViewMode('map')}
                >
                  <FaMapMarkedAlt /> Map
                </button>
                <button
                  className={`toggle-btn ${viewMode === 'gallery' ? 'active' : ''}`}
                  onClick={() => setViewMode('gallery')}
                >
                  <FaImages /> Gallery
                </button>
              </div>

              {viewMode === 'map' ? (
                <MapView images={images || []} onMarkerClick={openGallery} />
              ) : (
                <Gallery3DView images={images || []} onPhotoClick={openGallery} />
              )}
            </main>

            <Footer />

            <GalleryModal isOpen={isOpen} onClose={closeGallery} images={selected} />
          </div>
        </motion.div>
      )}
    </>
  );
}