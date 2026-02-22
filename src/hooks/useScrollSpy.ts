import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook that uses IntersectionObserver to track which section
 * is currently in view and returns its ID.
 */
export function useScrollSpy(
    sectionIds: string[],
    options?: { rootMargin?: string; threshold?: number }
) {
    const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");
    const observerRef = useRef<IntersectionObserver | null>(null);

    const rootMargin = options?.rootMargin ?? "-20% 0px -60% 0px";
    const threshold = options?.threshold ?? 0.1;

    const setup = useCallback(() => {
        // Cleanup previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        const callback: IntersectionObserverCallback = (entries) => {
            // Find the entry that is intersecting with the highest intersection ratio
            const intersecting = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (intersecting.length > 0) {
                setActiveId(intersecting[0].target.id);
            }
        };

        observerRef.current = new IntersectionObserver(callback, {
            rootMargin,
            threshold,
        });

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                observerRef.current!.observe(el);
            }
        });
    }, [sectionIds, rootMargin, threshold]);

    useEffect(() => {
        setup();
        return () => observerRef.current?.disconnect();
    }, [setup]);

    return activeId;
}
