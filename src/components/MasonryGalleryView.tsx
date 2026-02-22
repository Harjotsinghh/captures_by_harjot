import { useMemo, useRef, useCallback, useState, useEffect, memo } from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import type { Photo } from "../data/images";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { useImageDimensions } from "../hooks/useImageDimensions";
import "./MasonryGalleryView.css";

interface MasonryGalleryViewProps {
    images: Photo[];
    onPhotoClick: (photos: Photo[]) => void;
}

interface LocationGroup {
    id: string;
    location: string;
    photos: Photo[];
}

const DEFAULT_WIDTH = 4;
const DEFAULT_HEIGHT = 3;

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
} as const;

const MasonryGalleryView = memo<MasonryGalleryViewProps>(
    ({ images, onPhotoClick }) => {
        const scrollContainerRef = useRef<HTMLDivElement>(null);
        const [scrollProgress, setScrollProgress] = useState(0);
        const [hoveredDot, setHoveredDot] = useState<string | null>(null);

        // Load real image dimensions
        const allSrcs = useMemo(() => images.map((img) => img.fileUrl), [images]);
        const imageDims = useImageDimensions(allSrcs);

        // Group images by location
        const locationGroups: LocationGroup[] = useMemo(() => {
            const groups: Record<string, Photo[]> = {};
            images.forEach((img) => {
                const loc = img.location || "Unknown Location";
                if (!groups[loc]) groups[loc] = [];
                groups[loc].push(img);
            });
            return Object.entries(groups).map(([location, photos]) => ({
                id: `loc-${location.replace(/\s+/g, "-").toLowerCase()}`,
                location,
                photos,
            }));
        }, [images]);

        const sectionIds = useMemo(
            () => locationGroups.map((g) => g.id),
            [locationGroups]
        );

        const activeId = useScrollSpy(sectionIds, {
            rootMargin: "-20% 0px -60% 0px",
            threshold: 0.05,
        });

        // Track scroll progress
        useEffect(() => {
            const container = scrollContainerRef.current;
            if (!container) return;
            const onScroll = () => {
                const { scrollTop, scrollHeight, clientHeight } = container;
                const progress = scrollTop / (scrollHeight - clientHeight);
                setScrollProgress(Math.min(Math.max(progress, 0), 1));
            };
            container.addEventListener("scroll", onScroll, { passive: true });
            return () => container.removeEventListener("scroll", onScroll);
        }, []);

        const scrollToSection = useCallback((sectionId: string) => {
            const el = document.getElementById(sectionId);
            if (el && scrollContainerRef.current) {
                const containerRect =
                    scrollContainerRef.current.getBoundingClientRect();
                const elementRect = el.getBoundingClientRect();
                const offset =
                    elementRect.top -
                    containerRect.top +
                    scrollContainerRef.current.scrollTop -
                    150;
                scrollContainerRef.current.scrollTo({
                    top: offset,
                    behavior: "smooth",
                });
            }
        }, []);

        if (!images || images.length === 0) {
            return (
                <div className="masonry-gallery-wrapper">
                    <div className="masonry-empty">
                        <div className="masonry-empty-icon">📷</div>
                        <p>No photos to display</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="masonry-gallery-wrapper" ref={scrollContainerRef}>
                <div className="masonry-header-spacer" />

                {/* Top Location Pills */}
                <div className="location-pills-top">
                    {locationGroups.map((group) => (
                        <button
                            key={group.id}
                            className={`location-pill ${activeId === group.id ? "active" : ""}`}
                            onClick={() => scrollToSection(group.id)}
                        >
                            <FaMapMarkerAlt size={11} />
                            {group.location}
                            <span className="pill-count">({group.photos.length})</span>
                        </button>
                    ))}
                </div>

                {/* Photo Content */}
                <div className="masonry-content">
                    {locationGroups.map((group) => (
                        <motion.section
                            key={group.id}
                            id={group.id}
                            className="location-section"
                            variants={sectionVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            <div className="location-section-header">
                                <div className="location-icon">
                                    <FaMapMarkerAlt />
                                </div>
                                <h2 className="location-section-title">{group.location}</h2>
                                <span className="location-section-count">
                                    {group.photos.length}{" "}
                                    {group.photos.length === 1 ? "photo" : "photos"}
                                </span>
                            </div>

                            <RowsPhotoAlbum
                                photos={group.photos.map((photo) => {
                                    const dims = imageDims.get(photo.fileUrl);
                                    return {
                                        src: photo.fileUrl,
                                        width: dims?.width ?? DEFAULT_WIDTH,
                                        height: dims?.height ?? DEFAULT_HEIGHT,
                                        key: photo.id,
                                        title: photo.title,
                                    };
                                })}
                                targetRowHeight={(containerWidth) =>
                                    containerWidth < 500 ? 100 : 160
                                }
                                rowConstraints={(containerWidth) => ({
                                    minPhotos: containerWidth < 500 ? 2 : 1,
                                    maxPhotos: containerWidth < 500 ? 5 : 4,
                                })}
                                spacing={(containerWidth) =>
                                    containerWidth < 500 ? 6 : 10
                                }
                                onClick={({ index }) => {
                                    const reordered = [
                                        ...group.photos.slice(index),
                                        ...group.photos.slice(0, index),
                                    ];
                                    onPhotoClick(reordered);
                                }}
                                render={{
                                    image: (props, context) => (
                                        <div className="masonry-photo-wrapper">
                                            <img
                                                {...props}
                                                loading="lazy"
                                                referrerPolicy="no-referrer"
                                            />
                                            <div className="masonry-photo-overlay">
                                                <p className="masonry-photo-title">
                                                    {group.photos[context.index]?.title}
                                                </p>
                                                <p className="masonry-photo-date">
                                                    📅 {group.photos[context.index]?.date}
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                }}
                                componentsProps={{
                                    container: { className: "masonry-album-container" },
                                }}
                            />
                        </motion.section>
                    ))}
                </div>

                {/* Side Location Navigator */}
                <nav className="side-loc-nav" aria-label="Location navigation">
                    <div className="side-loc-track">
                        <div
                            className="side-loc-track-fill"
                            style={{ height: `${scrollProgress * 100}%` }}
                        />
                    </div>

                    {locationGroups.map((group) => (
                        <div
                            key={group.id}
                            className={`side-loc-dot-wrapper ${activeId === group.id ? "active" : ""}`}
                            onClick={() => scrollToSection(group.id)}
                            onMouseEnter={() => setHoveredDot(group.id)}
                            onMouseLeave={() => setHoveredDot(null)}
                        >
                            <div className="side-loc-dot" />
                            <AnimatePresence>
                                {hoveredDot === group.id && (
                                    <motion.div
                                        className="side-loc-label"
                                        initial={{ opacity: 0, x: 6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 6 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {group.location}
                                        <span className="side-loc-label-count">
                                            {group.photos.length}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </nav>
            </div>
        );
    }
);

MasonryGalleryView.displayName = "MasonryGalleryView";

export default MasonryGalleryView;
