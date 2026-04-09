import { memo, useMemo } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
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

    // Pick 6 random hero images (randomized on each page load)
    const heroImages = useMemo(() => {
      if (images.length <= 6) return images;
      const shuffled = [...images];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, 6);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images.length]);

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
          header={({ scrollY }) => (
            <WaterfallHero 
              scrollY={scrollY} 
              stats={stats} 
              isMobile={isMobile} 
              heroImages={heroImages} 
              lineVariants={lineVariants} 
            />
          )}
          footer={<Footer />}
        />
      </section>
    );
  }
);

interface WaterfallHeroProps {
  scrollY: MotionValue<number>;
  stats: { photoCount: number; locationCount: number; yearLabel: string };
  isMobile: boolean;
  heroImages: Photo[];
  lineVariants: any;
}

const WaterfallImg = ({ img, yOffset }: { img: Photo; yOffset: number }) => {
  return (
    <div
      className="waterfall-img"
      style={{ marginTop: yOffset }}
    >
      <img
        src={img.fileUrl}
        alt={img.title}
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const WaterfallHero = ({ scrollY, stats, isMobile, heroImages, lineVariants }: WaterfallHeroProps) => {
  const leftY = useTransform(scrollY, [0, 1000], [0, 600]);
  const leftOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const rightY = useTransform(scrollY, [0, 1000], [0, -400]);
  const rightOpacity = useTransform(scrollY, [0, 800], [1, 0]);

  if (isMobile) {
    return (
      <div className="gallery-mode-header">
        <motion.div
          className="gallery-mode-hero"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
          }}
        >
          <motion.p
            variants={lineVariants}
            className="gallery-mode-meta mobile"
            aria-label="Gallery summary"
          >
            <span>{stats.photoCount} photos</span>
            <span className="gallery-mode-meta-sep" aria-hidden="true">
              /
            </span>
            <span>{stats.locationCount} locations</span>
            <span className="gallery-mode-meta-sep" aria-hidden="true">
              /
            </span>
            <span>{stats.yearLabel}</span>
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="waterfall-hero-container">
      <motion.div
        className="waterfall-hero-left"
        style={{ y: leftY, opacity: leftOpacity }}
      >
        <p className="gallery-mode-kicker">Complete Archive</p>
        <div className="gallery-mode-hero-copy">
          <h1 className="gallery-mode-title">
            The Collection<span className="gallery-title-dot">.</span>
          </h1>
          <p className="gallery-mode-description">
            Every frame from the map, arranged for an effortless scroll.
          </p>
        </div>
        <p className="gallery-mode-meta">
          <span>{stats.photoCount} photos</span>
          <span className="gallery-mode-meta-sep">/</span>
          <span>{stats.locationCount} locations</span>
          <span className="gallery-mode-meta-sep">/</span>
          <span>{stats.yearLabel}</span>
        </p>
      </motion.div>

      <motion.div
        className="waterfall-hero-right"
        style={{ y: rightY, opacity: rightOpacity }}
      >
        <div className="waterfall-header-track">
          {heroImages.map((img: Photo, i: number) => {
            const yOffset = i % 2 === 0 ? 0 : 60;
            return <WaterfallImg key={img.id} img={img} yOffset={yOffset} />;
          })}
        </div>
      </motion.div>
    </div>
  );
};

GalleryModeView.displayName = "GalleryModeView";

export default GalleryModeView;
