import { useState, useEffect, type RefObject } from "react";

/**
 * Custom hook that tracks which section is currently in view
 * by listening to scroll events on the given container.
 *
 * Uses a simple scroll-position check: finds the last section whose
 * top edge has scrolled past the 30% mark of the container. This is
 * more reliable than IntersectionObserver which can miss fast scrolls.
 *
 * @param sectionIds - IDs of the DOM elements to track (must be in DOM order)
 * @param options.root - Ref to the scroll container (required for reliable detection)
 */
export function useScrollSpy(
    sectionIds: string[],
    options?: {
        root?: RefObject<HTMLElement | null>;
        // kept for API compat but no longer used
        rootMargin?: string;
        threshold?: number;
    }
) {
    const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");
    const rootRef = options?.root;

    useEffect(() => {
        const container = rootRef?.current;
        if (!container || sectionIds.length === 0) return;

        const computeActive = () => {
            const containerRect = container.getBoundingClientRect();
            // Target line at 30% from the top of the container
            const targetY = containerRect.top + containerRect.height * 0.3;

            // Walk sections in order; pick the last one whose top is above the target line
            let current = sectionIds[0];
            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (!el) continue;
                if (el.getBoundingClientRect().top <= targetY) {
                    current = id;
                }
            }

            setActiveId(current);
        };

        container.addEventListener("scroll", computeActive, { passive: true });
        // Run once immediately so the pill shows the right location on mount
        computeActive();

        return () => container.removeEventListener("scroll", computeActive);
    }, [sectionIds, rootRef]);

    return activeId;
}

