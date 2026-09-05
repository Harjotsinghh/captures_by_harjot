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

    // Generate shortest journey path (Nearest Neighbor algorithm)
    const journeyWaypoints = useMemo(() => {
        if (places.length === 0) return [];
        
        // Start from the place that has the earliest photo
        const sortedPlaces = [...places].sort((a, b) => {
            const aTime = Math.min(...a.images.map(i => new Date(i.timestamp).getTime()));
            const bTime = Math.min(...b.images.map(i => new Date(i.timestamp).getTime()));
            return aTime - bTime;
        });

        const unvisited = [...sortedPlaces];
        const path: [number, number][] = [];
        
        // Helper to calculate distance (squared)
        const getDist = (p1: Place, p2: Place) => 
            Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2);

        // Start at the chronologically first place
        let current = unvisited.shift()!;
        path.push([current.lat, current.lng]);

        while (unvisited.length > 0) {
            let nearestIdx = 0;
            let minDist = Infinity;
            
            for (let i = 0; i < unvisited.length; i++) {
                const dist = getDist(current, unvisited[i]);
                if (dist < minDist) {
                    minDist = dist;
                    nearestIdx = i;
                }
            }
            
            current = unvisited.splice(nearestIdx, 1)[0];
            path.push([current.lat, current.lng]);
        }

        return path;
    }, [places]);

    return { center, places, journeyWaypoints };
}
