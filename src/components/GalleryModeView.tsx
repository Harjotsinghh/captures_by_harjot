import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import type { Photo } from "../data/images";
import Footer from "./Footer";
import MasonryGalleryView from "./MasonryGalleryView";
import { useMediaQuery } from "../hooks/useMediaQuery";
import "./GalleryModeView.css";

interface GalleryModeViewProps {
  images: Photo[];
  onPhotoClick: (photos: Photo[]) => void;
}

const GalleryModeView = memo(
  ({ images, onPhotoClick }: GalleryModeViewProps) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const stats = useMemo(() => {
      const locations = new Set(images.map((image) => image.location || "Unknown Location"));
      const years = images
        .map((image) => {
          const source = image.timestamp || image.takenAt || image.date;
          const value = source ? new Date(source).getFullYear() : Number.NaN;
          return Number.isFinite(value) ? value : null;
        })
        .filter((year): year is number => year !== null);

      const startYear = years.length ? Math.min(...years) : null;
      const endYear = years.length ? Math.max(...years) : null;
      const yearLabel =
        startYear && endYear
          ? startYear === endYear
            ? `${startYear}`
            : `${startYear} - ${endYear}`
          : "Across recent journeys";

      return {
        photoCount: images.length,
        locationCount: locations.size,
        yearLabel,
      };
    }, [images]);

    const lineVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };

    return (
      <section className="gallery-mode-shell">
        <MasonryGalleryView
          images={images}
          onPhotoClick={onPhotoClick}
          variant="editorial"
          header={
            <div className="gallery-mode-header">
              <motion.div 
                className="gallery-mode-hero"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
                  }
                }}
              >
                {!isMobile && (
                  <>
                    <motion.p variants={lineVariants} className="gallery-mode-kicker">
                      Complete Archive
                    </motion.p>
                    <div className="gallery-mode-hero-copy">
                      <motion.h1 variants={lineVariants} className="gallery-mode-title">
                        The Collection<span className="gallery-title-dot">.</span>
                      </motion.h1>
                      <motion.p variants={lineVariants} className="gallery-mode-description">
                        Every frame from the map, arranged for an effortless scroll.
                      </motion.p>
                    </div>
                  </>
                )}
                
                <motion.p 
                  variants={lineVariants} 
                  className={`gallery-mode-meta ${isMobile ? "mobile" : ""}`} 
                  aria-label="Gallery summary"
                >
                  <span>{stats.photoCount} photos</span>
                  <span className="gallery-mode-meta-sep" aria-hidden="true">/</span>
                  <span>{stats.locationCount} locations</span>
                  <span className="gallery-mode-meta-sep" aria-hidden="true">/</span>
                  <span>{stats.yearLabel}</span>
                </motion.p>
              </motion.div>
            </div>
          }
          footer={<Footer />}
        />
      </section>
    );
  }
);

GalleryModeView.displayName = "GalleryModeView";

export default GalleryModeView;
