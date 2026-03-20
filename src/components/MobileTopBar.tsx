import { memo } from "react";
import { motion } from "framer-motion";
import { FaImages, FaMapMarkedAlt } from "react-icons/fa";
import { RiCameraLensAiFill } from "react-icons/ri";
import { config } from "../config";
import ThemeToggle from "./ThemeToggle";
import "./MobileTopBar.css";

type ViewMode = "map" | "gallery";

interface MobileTopBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showBrand?: boolean;
}

const MobileTopBar = memo(({ viewMode, onViewModeChange, showBrand = true }: MobileTopBarProps) => {
  return (
    <motion.div
      className={`mobile-topbar ${showBrand ? "" : "mobile-topbar--toggle-only"}`.trim()}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {showBrand && (
        <>
          <div className="mobile-topbar__brand">
            <div className="mobile-topbar__icon" aria-hidden="true">
              <RiCameraLensAiFill size={18} />
            </div>
            <div className="mobile-topbar__text">
              <span className="mobile-topbar__title">
                {config.author.firstName.toUpperCase()}'S
              </span>
              <span className="mobile-topbar__subtitle">Gallery</span>
            </div>
          </div>
          <div className="mobile-topbar__divider" aria-hidden="true" />
        </>
      )}

      <div className="mobile-topbar__controls">
        <button
          type="button"
          className={`mobile-topbar__button ${viewMode === "map" ? "active" : ""}`}
          onClick={() => onViewModeChange("map")}
          aria-label="Show map view"
        >
          <FaMapMarkedAlt />
          <span>Map</span>
        </button>
        <button
          type="button"
          className={`mobile-topbar__button ${viewMode === "gallery" ? "active" : ""}`}
          onClick={() => onViewModeChange("gallery")}
          aria-label="Show gallery view"
        >
          <FaImages />
          <span>Gallery</span>
        </button>
        <div className="mobile-topbar__controls-divider" aria-hidden="true" />
        <ThemeToggle />
      </div>
    </motion.div>
  );
});

MobileTopBar.displayName = "MobileTopBar";

export default MobileTopBar;
