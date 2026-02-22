import { useState, useEffect, useRef } from "react";

interface ImageDimensions {
    width: number;
    height: number;
}

// Global cache persists across component re-mounts
const dimensionCache = new Map<string, ImageDimensions>();

/**
 * Hook that loads real image dimensions asynchronously.
 * Returns a map of src → { width, height } that updates as images load.
 */
export function useImageDimensions(srcs: string[]): Map<string, ImageDimensions> {
    const [dimensions, setDimensions] = useState<Map<string, ImageDimensions>>(
        () => {
            // Start with whatever is already cached
            const initial = new Map<string, ImageDimensions>();
            srcs.forEach((src) => {
                const cached = dimensionCache.get(src);
                if (cached) initial.set(src, cached);
            });
            return initial;
        }
    );

    const pendingRef = useRef(new Set<string>());

    useEffect(() => {
        const imagesToLoad: HTMLImageElement[] = [];

        srcs.forEach((src) => {
            // Already cached
            if (dimensionCache.has(src) || pendingRef.current.has(src)) return;

            pendingRef.current.add(src);
            const img = new Image();

            img.onload = () => {
                const dims = { width: img.naturalWidth, height: img.naturalHeight };
                dimensionCache.set(src, dims);
                pendingRef.current.delete(src);

                setDimensions((prev) => {
                    const next = new Map(prev);
                    next.set(src, dims);
                    return next;
                });
            };

            img.onerror = () => {
                // Fallback to 4:3 on error
                const fallback = { width: 4, height: 3 };
                dimensionCache.set(src, fallback);
                pendingRef.current.delete(src);

                setDimensions((prev) => {
                    const next = new Map(prev);
                    next.set(src, fallback);
                    return next;
                });
            };

            // Needed for cross-origin images (Google Photos etc.)
            img.crossOrigin = "anonymous";
            img.referrerPolicy = "no-referrer";
            img.src = src;
            imagesToLoad.push(img);
        });

        // Cleanup
        return () => {
            imagesToLoad.forEach((img) => {
                img.onload = null;
                img.onerror = null;
            });
        };
    }, [srcs]);

    return dimensions;
}
