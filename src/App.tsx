import { useState, useCallback, lazy, Suspense, type JSX } from "react";
import { motion } from "framer-motion";

// Lazy load heavy components
const MapView = lazy(() => import("./components/MapView"));
const GalleryModal = lazy(() => import("./components/GalleryModal"));
const GalleryModeView = lazy(() => import("./components/GalleryModeView"));

import BottomSheet from "./components/BottomSheet";

import usePhotos from "./hooks/usePhotos";
import AestheticLoader from "./components/Loader";
import Header from "./components/MotionHeader";
import MobileTopBar from "./components/MobileTopBar";
import AmbientBackground from "./components/AmbientBackground";
import GalleryBackground from "./components/GalleryBackground";
import ErrorScreen from "./components/ErrorScreen";
import MasonrySkeleton from "./components/MasonrySkeleton";
import { ThemeProvider } from "./context/ThemeContext";
import MagneticCursor from "./components/MagneticCursor";
import { useMediaQuery } from "./hooks/useMediaQuery";
import ViewModeToggle from "./components/ViewModeToggle";
import "./App.css";
import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

export default function App(): JSX.Element {
  const { images, loading, error } = usePhotos();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selected, setSelected] = useState<any[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  const [viewMode, setViewMode] = useState<'map' | 'gallery'>('map');
  const [mapViewState, setMapViewState] = useState<{ center: [number, number], zoom: number } | null>(null);

  const isGalleryView = viewMode === "gallery";

  const handleViewModeChange = useCallback((newMode: 'map' | 'gallery') => {
    setViewMode(newMode);
  }, []);

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
      {isGalleryView && <MagneticCursor />}

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
            duration: 0.35, /* Sped up from 0.8s to feel responsive */
            ease: "easeOut"
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
          className={isGalleryView ? "gallery-mode-active" : ""}
        >
          {isGalleryView ? <GalleryBackground /> : <AmbientBackground />}
          <div className="app-container">
            {isMobile ? (
              <MobileTopBar
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                showBrand
              />
            ) : (
              <>
                <Header />
                <ViewModeToggle
                  viewMode={viewMode}
                  onViewModeChange={handleViewModeChange}
                />
              </>
            )}

            {/* Instant View Switch */}
            {!isGalleryView ? (
              <div key="map-view" style={{ position: 'absolute', inset: 0 }}>
                <main className="map-card">
                  <div style={{
                    display: 'block',
                    width: '100%',
                    height: '100%'
                  }}>
                    <Suspense fallback={null}>
                      <MapView
                        images={images || []}
                        onMarkerClick={openGallery}
                        targetState={(!isOpen && viewMode === 'map') ? mapViewState : null}
                      />
                    </Suspense>
                  </div>
                </main>

                {!loading && (
                  <BottomSheet />
                )}
              </div>
            ) : (
              <div key="gallery-view">
                <Suspense fallback={<MasonrySkeleton />}>
                  <GalleryModeView
                    images={images || []}
                    onPhotoClick={openGallery}
                  />
                </Suspense>
              </div>
            )}

            <Suspense fallback={null}>
              <GalleryModal isOpen={isOpen} onClose={closeGallery} images={selected} />
            </Suspense>


          </div>
        </motion.div>
      )}
    </ThemeProvider>
  );
}
