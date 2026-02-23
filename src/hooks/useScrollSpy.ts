import { useState, useEffect, useRef, useCallback, type RefObject } from "react";

/**
 * Custom hook that uses IntersectionObserver to track which section
 * is currently in view and returns its ID.
 *
 * @param sectionIds - IDs of the DOM elements to observe
 * @param options.rootMargin - Margin around the root (default: "-20% 0px -60% 0px")
 * @param options.threshold - How much of the element must be visible (default: 0.1)
 * @param options.root - Optional ref to the scroll container. When omitted the viewport is used,
 *                       which can mis-fire on mobile when scrolling happens inside a nested container.
 */
export function useScrollSpy(
    sectionIds: string[],
    options?: {
        rootMargin?: string;
        threshold?: number;
        root?: RefObject<HTMLElement | null>;
    }
) {
    const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");
    const observerRef = useRef<IntersectionObserver | null>(null);

    const rootMargin = options?.rootMargin ?? "-20% 0px -60% 0px";
    const threshold = options?.threshold ?? 0.1;
    const rootRef = options?.root;

    const setup = useCallback(() => {
        // Cleanup previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // If a root ref was provided but not yet mounted, bail and retry on next effect
        if (rootRef && !rootRef.current) return;

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
            root: rootRef?.current ?? null,
            rootMargin,
            threshold,
        });

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                observerRef.current!.observe(el);
            }
        });
    }, [sectionIds, rootMargin, threshold, rootRef]);

    useEffect(() => {
        setup();
        return () => observerRef.current?.disconnect();
    }, [setup]);

    return activeId;
}
