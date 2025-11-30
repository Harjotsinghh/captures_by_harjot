import { useMemo, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules";
import { FaImages } from "react-icons/fa";
import type { Photo } from "../data/images";


// Import Swiper styles
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/effect-coverflow";
// @ts-ignore
import "swiper/css/pagination";
// @ts-ignore
import "swiper/css/navigation";

interface Gallery3DViewProps {
    images: Photo[];
    onPhotoClick: (photos: Photo[]) => void;
}

interface LocationGroup {
    location: string;
    coverPhoto: Photo;
    count: number;
    photos: Photo[];
}

const Gallery3DView = memo<Gallery3DViewProps>(({ images, onPhotoClick }) => {
    // Group images by location
    const locationGroups: LocationGroup[] = useMemo(() => {
        const groups: Record<string, Photo[]> = {};

        images.forEach(img => {
            const loc = img.location || "Unknown Location";
            if (!groups[loc]) {
                groups[loc] = [];
            }
            groups[loc].push(img);
        });

        return Object.entries(groups).map(([location, photos]) => ({
            location,
            coverPhoto: photos[0],
            count: photos.length,
            photos
        }));
    }, [images]);

    return (
        <div className="gallery-3d-container">
            <Swiper
                key={locationGroups.length}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={"auto"}
                initialSlide={Math.floor(locationGroups.length / 2)}
                coverflowEffect={{
                    rotate: 35,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                className="mySwiper"
                style={{ width: "100%", height: "100%" }}
            >
                {locationGroups.map((group) => (
                    <SwiperSlide key={group.location} className="gallery-slide">
                        <div
                            className="slide-content"
                            onClick={() => onPhotoClick(group.photos)}
                            style={{ pointerEvents: 'auto' }}
                        >
                            <img
                                src={group.coverPhoto.fileUrl}
                                alt={group.location}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                            />
                            <div className="slide-info">
                                <h3>{group.location}</h3>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', opacity: 0.9, marginTop: '4px' }}>
                                    <FaImages size={14} /> {group.count} Photos
                                </p>
                                <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '4px' }}>
                                    Click to view album
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
});

Gallery3DView.displayName = 'Gallery3DView';

export default Gallery3DView;
