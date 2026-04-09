import { useMemo, useRef, useCallback, useState, useEffect, memo, type ReactNode } from "react";
import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionTemplate, type MotionValue } from "framer-motion";
import { FaCompass } from "react-icons/fa";
import { LuGrid2X2, LuGrid3X3, LuChevronDown } from "react-icons/lu";
import type { Photo } from "../data/images";
import { useScrollSpy } from "../hooks/useScrollSpy";

import { useMediaQuery } from "../hooks/useMediaQuery";
import Lenis from "lenis";
import "./MasonryGalleryView.css";

type Density = "comfortable" | "compact";

interface MasonryGalleryViewProps {
    images: Photo[];
    onPhotoClick: (photos: Photo[]) => void;
    variant?: "overlay" | "editorial";
    header?: ReactNode | ((props: { scrollY: MotionValue<number>; scrollYProgress: MotionValue<number> }) => ReactNode);
    footer?: ReactNode;
}

interface LocationGroup {
    id: string;
    location: string;
    photos: Photo[];
}

const DEFAULT_WIDTH = 4;
const DEFAULT_HEIGHT = 3;

// How many photos to show before collapsing
const PREVIEW_LIMITS: Record<Density, number> = {
    comfortable: 12, // ~2 rows on desktop
    compact: 24,
};

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
} as const;

const SplitLineDivider = memo(({ location, count }: { location: string; count: number }) => {
    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
    };
    const lineVariants = {
        hidden: { scaleX: 0 },
        visible: { scaleX: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
    };
    const textVariants = {
        hidden: { opacity: 0, y: 6 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3, ease: "easeOut" as const } },
    };

    return (
        <motion.div
            className="split-line-divider"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
        >
            <motion.div className="split-line-rule split-line-left" variants={lineVariants} />
            <motion.div className="split-line-content" variants={textVariants}>
                <span className="split-line-location">{location}</span>
                <span className="split-line-sep">·</span>
                <span className="split-line-count">{count}</span>
            </motion.div>
            <motion.div className="split-line-rule split-line-right" variants={lineVariants} />
        </motion.div>
    );
});
SplitLineDivider.displayName = "SplitLineDivider";

const MasonryGalleryView = memo<MasonryGalleryViewProps>(
    ({ images, onPhotoClick, variant = "overlay", header, footer }) => {
        const scrollContainerRef = useRef<HTMLDivElement>(null);
        const lenisRef = useRef<Lenis>(null);
        const [scrollProgress, setScrollProgress] = useState(0);
        const [hideDial, setHideDial] = useState(false);
        const [hoveredDot, setHoveredDot] = useState<string | null>(null);
        const [dialOpen, setDialOpen] = useState(false);
        const [density, setDensity] = useState<Density>("comfortable");
        const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
        const labelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
        const isMobile = useMediaQuery("(max-width: 768px)");
        const hasPointer = useMediaQuery("(hover: hover) and (pointer: fine)");
        const isEditorial = variant === "editorial";

        const previewLimit = PREVIEW_LIMITS[density];

        const toggleSection = useCallback((sectionId: string) => {
            setExpandedSections((prev) => {
                const wasExpanded = prev.has(sectionId);
                const next = new Set(prev);
                if (wasExpanded) {
                    next.delete(sectionId);
                    // Scroll back to section header on collapse
                    requestAnimationFrame(() => {
                        const el = document.getElementById(sectionId);
                        if (el && scrollContainerRef.current) {
                            const containerRect = scrollContainerRef.current.getBoundingClientRect();
                            const elementRect = el.getBoundingClientRect();
                            const offset =
                                elementRect.top -
                                containerRect.top +
                                scrollContainerRef.current.scrollTop -
                                (isEditorial ? (isMobile ? 108 : 118) : 150);
                            
                            if (lenisRef.current) {
                                lenisRef.current.scrollTo(offset, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                            } else {
                                scrollContainerRef.current.scrollTo({
                                    top: offset,
                                    behavior: "smooth",
                                });
                            }
                        }
                    });
                } else {
                    next.add(sectionId);
                }
                return next;
            });
        }, [isEditorial, isMobile]);

        // Group images by location
        const locationGroups: LocationGroup[] = useMemo(() => {
            const groups: Record<string, Photo[]> = {};
            images.forEach((img) => {
                const loc = img.location || "Unknown Location";
                if (!groups[loc]) groups[loc] = [];
                groups[loc].push(img);
            });
            return Object.entries(groups).map(([location, photos]) => ({
                id: `loc-${location.replace(/[^a-zA-Z0-9]+/g, "-").replace(/-+$/, "").toLowerCase()}`,
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
            root: scrollContainerRef,
        });

        // Get active location name
        const activeLocation = useMemo(
            () => locationGroups.find((g) => g.id === activeId)?.location ?? "",
            [locationGroups, activeId]
        );

        // Framer Motion useScroll
        const { scrollY, scrollYProgress } = useScroll({ container: scrollContainerRef });
        
        // Simplified breathing — single transform, no chained springs
        const scaleBreathing = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.997, 1]);
        const smoothScale = useSpring(scaleBreathing, { damping: 60, stiffness: 200 });

        // Chameleon Ambient Canvas Background — cooler blue-indigo palette
        const bgColors1 = ["rgba(0, 120, 255, 0.12)", "rgba(99, 102, 241, 0.25)", "rgba(139, 92, 246, 0.18)", "rgba(0, 120, 255, 0.12)"];
        const bgColors2 = ["rgba(56, 189, 248, 0.10)", "rgba(99, 102, 241, 0.22)", "rgba(167, 139, 250, 0.16)", "rgba(56, 189, 248, 0.10)"];
        const color1 = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], bgColors1);
        const color2 = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], bgColors2);
        const bgTemplate = useMotionTemplate`radial-gradient(ellipse at 20% 0%, ${color1} 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, ${color2} 0%, transparent 55%)`;

        // Init Lenis smooth scroll
        useEffect(() => {
            if (!scrollContainerRef.current) return;
            const contentElement = scrollContainerRef.current.querySelector('.masonry-scroll-content') as HTMLElement;
            
            const lenis = new Lenis({
                wrapper: scrollContainerRef.current,
                content: contentElement || undefined,
                lerp: 0.12, 
                wheelMultiplier: 1.4,
                smoothWheel: true,
            });
            lenisRef.current = lenis;

            const raf = (time: number) => {
                lenis.raf(time);
                requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);

            return () => {
                lenis.destroy();
                lenisRef.current = null;
            };
        }, []);

        // Track scroll progress
        useEffect(() => {
            return scrollYProgress.on("change", (latest) => {
                const container = scrollContainerRef.current;
                if (!container) return;
                setScrollProgress(latest);
                
                const { scrollHeight, clientHeight, scrollTop } = container;
                const remaining = scrollHeight - clientHeight - scrollTop;
                setHideDial(isEditorial && remaining < 180);
                
                if (isEditorial) {
                    document.documentElement.style.setProperty("--gallery-scroll-progress", latest.toFixed(4));
                }
            });
        }, [isEditorial, scrollYProgress]);

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
                    (isEditorial ? (isMobile ? 108 : 118) : 150);
                
                if (lenisRef.current) {
                    lenisRef.current.scrollTo(offset, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                } else {
                    scrollContainerRef.current.scrollTo({
                        top: offset,
                        behavior: "smooth",
                    });
                }
            }
        }, [isEditorial, isMobile]);

        // Show label temporarily (for tap on mobile)
        const showLabelBriefly = useCallback((id: string) => {
            if (labelTimerRef.current) clearTimeout(labelTimerRef.current);
            setHoveredDot(id);
            labelTimerRef.current = setTimeout(() => {
                setHoveredDot(null);
            }, 2000);
        }, []);

        // Desktop: show label briefly, then scroll
        const handleDotClick = useCallback((sectionId: string) => {
            showLabelBriefly(sectionId);
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 400);
        }, [scrollToSection, showLabelBriefly]);

        // Mobile dial: pick location, close, scroll
        const handleDialPick = useCallback((sectionId: string) => {
            setDialOpen(false);
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 200);
        }, [scrollToSection]);

        // Switch density and snap back to the current section
        const switchDensity = useCallback((newDensity: Density) => {
            if (newDensity === density) return;
            setDensity(newDensity);
            // Wait for re-layout, then scroll to the section that was in view
            requestAnimationFrame(() => {
                if (activeId) {
                    scrollToSection(activeId);
                }
            });
        }, [density, activeId, scrollToSection]);

        // Column config per density
        const getColumns = useCallback((containerWidth: number) => {
            if (density === "compact") {
                if (containerWidth < 400) return 4;
                if (containerWidth < 600) return 6;
                if (containerWidth < 900) return 8;
                return 10;
            }
            // comfortable (default)
            if (containerWidth < 400) return 3;
            if (containerWidth < 600) return 4;
            if (containerWidth < 900) return 5;
            return 6;
        }, [density]);

        const getSpacing = useCallback((containerWidth: number) => {
            if (density === "compact") return containerWidth < 500 ? 6 : 10;
            return containerWidth < 500 ? 8 : 16;
        }, [density]);

        // Simple hover feedback (desktop only) — rAF-throttled
        const tiltRaf = useRef<number>(0);
        const handleHoverMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
            if (!hasPointer) return;
            const el = e.currentTarget;
            const clientX = e.clientX;
            const clientY = e.clientY;
            cancelAnimationFrame(tiltRaf.current);
            tiltRaf.current = requestAnimationFrame(() => {
                const rect = el.getBoundingClientRect();
                const x = (clientX - rect.left) / rect.width;
                const y = (clientY - rect.top) / rect.height;
                el.style.setProperty('--glow-x', `${x * 100}%`);
                el.style.setProperty('--glow-y', `${y * 100}%`);
            });
        }, [hasPointer]);

        const handleHoverLeave = useCallback((_e: React.MouseEvent<HTMLDivElement>) => {
            cancelAnimationFrame(tiltRaf.current);
        }, []);

        if (!images || images.length === 0) {
            return (
                <div className={`masonry-gallery-wrapper ${isEditorial ? "editorial" : ""}`}>
                    <div className="masonry-empty">
                        <div className="masonry-empty-icon">📷</div>
                        <p>No photos to display</p>
                    </div>
                </div>
            );
        }

        return (
            <div className={`masonry-gallery-wrapper ${isEditorial ? "editorial" : ""}`} ref={scrollContainerRef}>
                {isEditorial && <motion.div className="chameleon-ambient-canvas" style={{ background: bgTemplate }} />}
                <div className="masonry-scroll-content">
                    {!isEditorial && <div className="masonry-header-spacer" />}
                    {header && (
                        <div className="masonry-header-shell">
                            {typeof header === 'function' ? header({ scrollY, scrollYProgress }) : header}
                        </div>
                    )}



                {/* Photo Content */}
                <div className={`masonry-content ${isEditorial ? "editorial" : ""} ${density === "compact" ? "density-compact" : ""}`}>
                    {locationGroups.map((group) => {
                        const isExpanded = expandedSections.has(group.id);
                        const hasMore = group.photos.length > previewLimit;
                        const visiblePhotos = isExpanded || !hasMore
                            ? group.photos
                            : group.photos.slice(0, previewLimit);
                        const hiddenCount = group.photos.length - previewLimit;

                        return (
                            <motion.section
                                key={group.id}
                                id={group.id}
                                className="location-section"
                                variants={sectionVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                            >
                                <SplitLineDivider
                                    location={group.location}
                                    count={group.photos.length}
                                />

                                <motion.div 
                                    className={`section-masonry-wrap ${hasMore && !isExpanded ? "is-truncated" : ""}`}
                                    style={{ scale: smoothScale }}
                                >
                                    <MasonryPhotoAlbum
                                        photos={visiblePhotos.map((photo) => {
                                            return {
                                                src: photo.fileUrl,
                                                width: photo.width ?? DEFAULT_WIDTH,
                                                height: photo.height ?? DEFAULT_HEIGHT,
                                                key: photo.id,
                                                title: photo.title,
                                            };
                                        })}
                                        columns={getColumns}
                                        spacing={getSpacing}
                                        onClick={({ index }) => {
                                            const allPhotos = group.photos;
                                            const reordered = [
                                                ...allPhotos.slice(index),
                                                ...allPhotos.slice(0, index),
                                            ];
                                            onPhotoClick(reordered);
                                        }}
                                        render={{
                                            image: (props, context) => {
                                                const delay = !isExpanded || context.index < previewLimit
                                                    ? Math.min(context.index, 12) * 60
                                                    : Math.min(context.index - previewLimit, 8) * 50;
                                                return (
                                                <div
                                                    className="masonry-photo-wrapper"
                                                    style={{ "--stagger-delay": `${delay}ms` } as React.CSSProperties}
                                                    onMouseMove={handleHoverMove}
                                                    onMouseLeave={handleHoverLeave}
                                                >
                                                    <img
                                                        {...props}
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer"
                                                        onLoad={(e) => {
                                                            (e.currentTarget.parentElement as HTMLElement)?.classList.add('loaded');
                                                        }}
                                                    />
                                                    <div className="photo-tilt-glow" />
                                                    <div className="masonry-photo-overlay">
                                                        <p className="masonry-photo-title">
                                                            {visiblePhotos[context.index]?.title}
                                                        </p>
                                                        <p className="masonry-photo-date">
                                                            📅 {visiblePhotos[context.index]?.date}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                            },
                                        }}
                                        componentsProps={{
                                            container: { className: "masonry-album-container" },
                                        }}
                                    />

                                </motion.div>

                                {hasMore && !isExpanded && (
                                    <div className="section-expand-bar">
                                        <motion.button
                                            className="section-expand-pill"
                                            onClick={() => toggleSection(group.id)}
                                            whileHover={{ scale: 1.04, y: -1 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <span>Show {hiddenCount} more</span>
                                            <LuChevronDown size={14} />
                                        </motion.button>
                                    </div>
                                )}

                                {hasMore && isExpanded && (
                                    <div className="section-expand-bar">
                                        <motion.button
                                            className="section-expand-pill expanded"
                                            onClick={() => toggleSection(group.id)}
                                            whileHover={{ scale: 1.04, y: -1 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <span>Show less</span>
                                            <LuChevronDown size={14} />
                                        </motion.button>
                                    </div>
                                )}
                            </motion.section>
                        );
                    })}

                    {footer && !isEditorial && (
                        <div className="masonry-footer-shell">
                            {footer}
                        </div>
                    )}
                </div>

                {footer && isEditorial && (
                    <div className="masonry-editorial-footer-shell">
                        {footer}
                    </div>
                )}
                </div>

                {/* Density Toggle — bottom-left */}
                <div
                    className={`density-toggle ${isEditorial ? "editorial" : ""}`}
                    style={{ position: "fixed", bottom: isMobile ? (isEditorial ? 22 : 74) : 24, left: isMobile ? 16 : 24, zIndex: 1100 }}
                >
                    <button
                        className={`density-toggle-btn ${density === "comfortable" ? "active" : ""}`}
                        onClick={() => switchDensity("comfortable")}
                        title="Comfortable"
                        aria-label="Comfortable density"
                    >
                        <LuGrid2X2 size={isMobile ? 14 : 16} />
                    </button>
                    <button
                        className={`density-toggle-btn ${density === "compact" ? "active" : ""}`}
                        onClick={() => switchDensity("compact")}
                        title="Compact"
                        aria-label="Compact density"
                    >
                        <LuGrid3X3 size={isMobile ? 14 : 16} />
                    </button>
                </div>

                {/* Desktop: Side Location Navigator */}
                {!isMobile && (
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
                                onClick={() => handleDotClick(group.id)}
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
                                            <img
                                                className="side-loc-thumb"
                                                src={group.photos[0]?.fileUrl}
                                                alt=""
                                                loading="lazy"
                                                referrerPolicy="no-referrer"
                                            />
                                            <div className="side-loc-label-text">
                                                {group.location}
                                                <span className="side-loc-label-count">
                                                    {group.photos.length}
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>
                )}

                {/* Mobile: Floating Location Dial */}
                {isMobile && (
                    <>
                        <motion.button
                            className={`loc-dial-fab ${isEditorial ? "editorial" : ""} ${hideDial && !dialOpen ? "is-hidden" : ""}`}
                            onClick={() => setDialOpen((prev) => !prev)}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Open location picker"
                        >
                            <FaCompass size={16} />
                            <span className="loc-dial-fab-label">{activeLocation}</span>
                        </motion.button>

                        <AnimatePresence>
                            {dialOpen && (
                                <>
                                    <motion.div
                                        className="loc-dial-backdrop"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setDialOpen(false)}
                                    />
                                    <motion.div
                                        className="loc-dial-sheet"
                                        initial={{ opacity: 0, scale: 0.9, y: 10, originX: 1, originY: 1 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                    >
                                        <div className="loc-dial-header">
                                            <span className="loc-dial-title">Jump to Location</span>
                                            <span className="loc-dial-subtitle">
                                                {locationGroups.length} locations · {images.length} photos
                                            </span>
                                        </div>
                                        <div className="loc-dial-list">
                                            {locationGroups.map((group) => (
                                                <button
                                                    key={group.id}
                                                    className={`loc-dial-item ${activeId === group.id ? "active" : ""}`}
                                                    onClick={() => handleDialPick(group.id)}
                                                >
                                                    <div className="loc-dial-item-dot" />
                                                    <span className="loc-dial-item-name">{group.location}</span>
                                                    <span className="loc-dial-item-count">
                                                        {group.photos.length}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        );
    }
);

MasonryGalleryView.displayName = "MasonryGalleryView";

export default MasonryGalleryView;
