import { useMemo } from "react";
import useDriveManifest, { type DriveImage } from "./useDriveManifest";
import type { Photo } from "../data/images";

export default function usePhotos() {
    const { images: driveImages, loading, error } = useDriveManifest();

    const images: Photo[] | null = useMemo(() => {
        if (!driveImages) return null;
        return driveImages.map((d: DriveImage) => {
            let preciseTimestamp = d.timestamp ?? (d.date ? `${d.date}T00:00:00` : new Date().toISOString());
            let preciseDate = d.date ?? "";

            // EXIF date usually looks like "YYYY:MM:DD HH:MM:SS"
            if (d.takenAt) {
                const parts = d.takenAt.split(" ");
                if (parts.length === 2) {
                    const normalizedDate = parts[0].replace(/:/g, "-");
                    preciseTimestamp = `${normalizedDate}T${parts[1]}`;
                    preciseDate = normalizedDate;
                }
            }

            return {
                id: d.id,
                title: d.name,
                fileUrl: d.fileUrl,
                lat: typeof d.lat === "number" ? d.lat : 0,
                lng: typeof d.lng === "number" ? d.lng : 0,
                timestamp: preciseTimestamp,
                date: preciseDate,
                location: d.locationName ?? "",
                width: d.dimensions?.width,
                height: d.dimensions?.height,
                camera: d.camera,
                exposure: d.exposure,
                takenAt: d.takenAt,
            };
        });
    }, [driveImages]);

    return { images, loading, error };
}
