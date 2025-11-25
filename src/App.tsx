
import { useState, type JSX } from "react";
import MapView from "./components/MapView";
import GalleryModal from "./components/GalleryModal";
import usePhotos from "./hooks/usePhotos";
import Footer from "./components/Footer";
import AestheticLoader from "./components/Loader";
import Header from "./components/MotionHeader";
import ParticleNetwork from "./components/ParticleNetwork";
import Gallery3DView from "./components/Gallery3DView";
import ErrorScreen from "./components/ErrorScreen";
import { FaMapMarkedAlt, FaImages } from "react-icons/fa";
import "./App.css";

export default function App(): JSX.Element {
  const { images, loading, error } = usePhotos();
  const [selected, setSelected] = useState<any[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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

  if (loading) return <AestheticLoader active={true} />;
  if (error) return <ErrorScreen message={typeof error === 'string' ? error : "An unexpected error occurred"} />;

  return (
    <>
      <ParticleNetwork />
      <div className="app-container">
        <Header />

        {/* View Toggle */}
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

        {/* Main Content Area */}
        <main className={viewMode === 'map' ? "map-card" : "gallery-3d-container"}>
          {viewMode === 'map' ? (
            <MapView images={images || []} onMarkerClick={openGallery} />
          ) : (
            <Gallery3DView images={images || []} onPhotoClick={openGallery} />
          )}
        </main>

        <Footer />

        <GalleryModal isOpen={isOpen} onClose={closeGallery} images={selected} />
      </div>
    </>
  );
}