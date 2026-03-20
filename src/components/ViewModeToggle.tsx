import { memo } from "react";
import { FaImages, FaMapMarkedAlt } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

type ViewMode = "map" | "gallery";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

const ViewModeToggle = memo(
  ({ viewMode, onViewModeChange, className = "view-toggle" }: ViewModeToggleProps) => {
    return (
      <div className={className}>
        <button
          className={`toggle-btn ${viewMode === "map" ? "active" : ""}`}
          onClick={() => onViewModeChange("map")}
          type="button"
        >
          <FaMapMarkedAlt /> Map
        </button>
        <button
          className={`toggle-btn ${viewMode === "gallery" ? "active" : ""}`}
          onClick={() => onViewModeChange("gallery")}
          type="button"
        >
          <FaImages /> Gallery
        </button>
        <div className="toggle-divider" aria-hidden="true" />
        <div className="toggle-theme-slot">
          <ThemeToggle />
        </div>
      </div>
    );
  }
);

ViewModeToggle.displayName = "ViewModeToggle";

export default ViewModeToggle;
