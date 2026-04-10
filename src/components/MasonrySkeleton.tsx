import { memo } from "react";
import "./MasonrySkeleton.css";

const MasonrySkeleton = memo(() => {
  // Generate a set of placeholder cards with varying heights to mimic masonry
  const skeletonCards = Array.from({ length: 12 }).map((_, i) => {
    const heightClass = i % 3 === 0 ? "large" : i % 2 === 0 ? "medium" : "small";
    return (
      <div key={i} className={`skeleton-card ${heightClass}`}>
        <div className="skeleton-image-shimmer" />
        <div className="skeleton-info">
          <div className="skeleton-line title" />
          <div className="skeleton-line date" />
        </div>
      </div>
    );
  });

  return (
    <div className="masonry-skeleton-container">
      {/* Waterfall Hero Skeleton */}
      <div className="skeleton-waterfall-hero">
        <div className="skeleton-hero-left">
          <div className="skeleton-line kicker-pill" />
          <div className="skeleton-line main-title" />
          <div className="skeleton-line description" />
          <div className="skeleton-line description-short" />
          <div className="skeleton-meta-row">
            <div className="skeleton-line meta-pill" />
            <div className="skeleton-line meta-pill" />
            <div className="skeleton-line meta-pill" />
          </div>
        </div>
        <div className="skeleton-hero-right">
          <div className="skeleton-waterfall-track">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-waterfall-img" />
            ))}
          </div>
        </div>
      </div>

      <div className="skeleton-grid">
        {skeletonCards}
      </div>
    </div>
  );
});

MasonrySkeleton.displayName = "MasonrySkeleton";

export default MasonrySkeleton;
