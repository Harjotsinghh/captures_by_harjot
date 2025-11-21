import { useMemo } from "react";
import type { Photo } from "../data/images";

export interface Place {
    lat: number;
    lng: number;
    images: Photo[];
}

export default function useMapData(images: Photo[]) {
    // Determine map center (average lat/lng)
    const center = useMemo<[number, number]>(() => {
        if (images.length === 0) return [20, 0];
        const avgLat = images.reduce((s, i) => s + i.lat, 0) / images.length;
        const avgLng = images.reduce((s, i) => s + i.lng, 0) / images.length;
        return [avgLat, avgLng] as [number, number];
    }, [images]);

    // Group images by location (rounded coordinates)
    const places = useMemo(() => {
        const map = new Map<string, Place>();
        images.forEach((img) => {
            const key = `${img.lat.toFixed(3)},${img.lng.toFixed(3)}`;
            if (!map.has(key))
                map.set(key, { lat: img.lat, lng: img.lng, images: [] });
            map.get(key)!.images.push(img);
        });
        return Array.from(map.values());
    }, [images]);

    return { center, places };
}
