
import { useState, useCallback, type JSX } from "react";
import MapView from "./components/MapView";
import GalleryModal from "./components/GalleryModal";
import usePhotos from "./hooks/usePhotos";
import AestheticLoader from "./components/Loader";
import Header from "./components/MotionHeader";
import AmbientBackground from "./components/AmbientBackground";
import Gallery3DView from "./components/Gallery3DView";
import ErrorScreen from "./components/ErrorScreen";
import { motion } from "framer-motion";
import { FaMapMarkedAlt, FaImages } from "react-icons/fa";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import BottomSheet from "./components/BottomSheet";
import "./App.css";

export default function App(): JSX.Element {
  const { images, loading, error } = usePhotos();
  const [selected, setSelected] = useState<any[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  const [viewMode, setViewMode] = useState<'map' | 'gallery'>('map');
  const [mapViewState, setMapViewState] = useState<{ center: [number, number], zoom: number } | null>(null);

  const openGallery = useCallback((photos: any | any[], previousMapState?: { center: [number, number], zoom: number }) => {
    const selectedPhotos = Array.isArray(photos) ? photos : [photos];
    setSelected(selectedPhotos);
    setIsOpen(true);
    if (previousMapState) {
      setMapViewState(previousMapState);
    }
  }, []);

  const closeGallery = useCallback(() => {
    setIsOpen(false);
    setSelected(null);
  }, []);

  return (
    <ThemeProvider>
      {/* Loader Layer (Background) - Only show if intro not finished */}
      {!introFinished && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
          <AestheticLoader active={true} text="Curating Visuals" />
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: loading ? 0 : 1,
            scale: loading ? 0.95 : 1
          }}
          transition={{
            duration: 0.8,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          onAnimationComplete={() => {
            if (!loading) setIntroFinished(true);
          }}
          style={{
            position: 'relative',
            zIndex: 10,
            background: 'var(--bg-primary)',
            minHeight: '100vh',
            color: 'var(--text-primary)',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            willChange: 'opacity, transform'
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
                <div className="mobile-only-toggle">
                  <ThemeToggle />
                </div>
              </div>

              {/* Always render MapView to preserve state, hide via CSS/Z-index when not active */}
              <div style={{
                display: viewMode === 'map' ? 'block' : 'none',
                width: '100%',
                height: '100%'
              }}>
                <MapView
                  images={images || []}
                  onMarkerClick={openGallery}
                  targetState={(!isOpen && viewMode === 'map') ? mapViewState : null}
                />
              </div>

              {viewMode === 'gallery' && (
                <Gallery3DView images={images || []} onPhotoClick={openGallery} />
              )}
            </main>

            {/* Bottom Sheet for both Mobile and Desktop */}
            {!loading && <BottomSheet />}

            <GalleryModal isOpen={isOpen} onClose={closeGallery} images={selected} />
          </div>
        </motion.div>
      )}
    </ThemeProvider>
  );
}