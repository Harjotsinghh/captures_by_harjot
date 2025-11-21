import { useMemo } from "react";
import useDriveManifest, { type DriveImage } from "./useDriveManifest";
import type { Photo } from "../data/images";

export default function usePhotos() {
    const { images: driveImages, loading, error } = useDriveManifest();

    const images: Photo[] | null = useMemo(() => {
        if (!driveImages) return null;
        return driveImages.map((d: DriveImage) => ({
            id: d.id,
            title: d.name,
            fileUrl: d.fileUrl,
            lat: typeof d.lat === "number" ? d.lat : 0,
            lng: typeof d.lng === "number" ? d.lng : 0,
            timestamp:
                d.timestamp ??
                (d.date ? `${d.date}T00:00:00` : new Date().toISOString()),
            date: d.date ?? "",
            location: d.locationName ?? "",
        }));
    }, [driveImages]);

    return { images, loading, error };
}
