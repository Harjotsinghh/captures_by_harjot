import { useState, useCallback, type JSX } from "react";
import MapView from "./components/MapView";
import GalleryModal from "./components/GalleryModal";
import usePhotos from "./hooks/usePhotos";
import AestheticLoader from "./components/Loader";
import Header from "./components/MotionHeader";
import MobileTopBar from "./components/MobileTopBar";
import AmbientBackground from "./components/AmbientBackground";
import GalleryBackground from "./components/GalleryBackground";
import GalleryModeView from "./components/GalleryModeView";
import ErrorScreen from "./components/ErrorScreen";
import { motion } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import BottomSheet from "./components/BottomSheet";
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
          {isGalleryView ? <GalleryBackground /> : <AmbientBackground />}
          <div className="app-container">
            {isMobile ? (
              <MobileTopBar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                showBrand
              />
            ) : (
              <>
                <Header />
                <ViewModeToggle
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </>
            )}

            {!isGalleryView && (
              <>
                <main className="map-card">
                  <div style={{
                    display: 'block',
                    width: '100%',
                    height: '100%'
                  }}>
                    <MapView
                      images={images || []}
                      onMarkerClick={openGallery}
                      targetState={(!isOpen && viewMode === 'map') ? mapViewState : null}
                    />
                  </div>
                </main>

                {!loading && <BottomSheet />}
              </>
            )}

            {isGalleryView && (
              <GalleryModeView
                images={images || []}
                onPhotoClick={openGallery}
              />
            )}

            <GalleryModal isOpen={isOpen} onClose={closeGallery} images={selected} />
          </div>
        </motion.div>
      )}
    </ThemeProvider>
  );
}
