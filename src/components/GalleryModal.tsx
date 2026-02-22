import React, { useState, useEffect } from "react";
import ReactGA from "react-ga4";

import Lightbox, { type ThumbnailsRef } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import type { Photo } from "../data/images";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Share from "yet-another-react-lightbox/plugins/share";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/counter.css";
import "./GalleryModal.css";

import { FaInfoCircle, FaTimes, FaCamera, FaMapMarkerAlt, FaCalendarDay } from "react-icons/fa";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Photo[] | null;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  images,
}) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const thumbnailsRef = React.useRef<ThumbnailsRef>(null);

  useEffect(() => {
    setOpen(isOpen);
    if (!isOpen) {
      setShowInfo(false);
    }
  }, [isOpen]);

  const currentPhoto = images ? images[currentIndex] || images[0] : null;

  useEffect(() => {
    if (open && currentPhoto) {
      ReactGA.event({
        category: "Gallery",
        action: "View Photo",
        label: currentPhoto.id || currentPhoto.title,
      });
    }
  }, [currentIndex, open, currentPhoto]);

  if (!images || images.length === 0) return null;

  // Now we know it's safe to use currentPhoto for parsing details below
  const activePhoto = images[currentIndex] || images[0];

  const slides = images.map((img) => ({
    src: img.fileUrl,
    alt: img.title,
    referrerPolicy: "no-referrer" as const,
  }));

  // Parse details for Info Panel
  let captureDate = new Date(activePhoto.timestamp);

  // If EXIF takenAt is available (format: "YYYY:MM:DD HH:MM:SS"), parse it for accurate local capture time
  if (activePhoto.takenAt) {
    // Convert EXIF format to standard ISO-like string recognizable by JS "YYYY-MM-DDTHH:MM:SS"
    const exifDateString = activePhoto.takenAt.replace(/^(\d{4}):(\d{2}):(\d{2}) /, "$1-$2-$3T");
    const parsedDate = new Date(exifDateString);
    if (!isNaN(parsedDate.getTime())) {
      captureDate = parsedDate;
    }
  }

  const dateStr = captureDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeStr = activePhoto.takenAt
    ? captureDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : "";

  const cam = activePhoto.camera;
  const camStr = cam ? `${cam.make ?? ""} ${cam.model ?? ""}`.trim() : "";
  const lensStr = cam?.lens ? cam.lens : "";

  const exp = activePhoto.exposure;
  let hasExposure = false;
  let shutter = "", aperture = "", focal = "", iso = "";
  if (exp) {
    hasExposure = true;
    shutter = exp.shutter ? `1/${Math.round(1 / exp.shutter)}s` : "";
    aperture = exp.aperture ? `ƒ/${exp.aperture}` : "";
    focal = exp.focalLength ? `${exp.focalLength}mm` : "";
    iso = exp.iso ? `ISO ${exp.iso}` : "";
  }

  return (
    <>
      <Lightbox
        open={open}
        plugins={[
          Thumbnails,
          Share,
          Counter,
          Download,
          Fullscreen,
          Zoom,
          // Removed Captions so image is unobstructed
        ]}
        close={() => {
          setOpen(false);
          onClose();
        }}
        on={{
          view: ({ index }) => setCurrentIndex(index),
          click: () => {
            if (showInfo) {
              setShowInfo(false);
              return;
            }
            // Toggle thumbnails on click
            (thumbnailsRef.current?.visible
              ? thumbnailsRef.current?.hide
              : thumbnailsRef.current?.show)?.();
          },
        }}
        render={{
          iconZoomIn: () => undefined,
          iconZoomOut: () => undefined,
          slideFooter: () => (
            <>
              {!showInfo && (
                <button
                  className="gallery-floating-info-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(true);
                  }}
                >
                  <FaInfoCircle size={22} />
                </button>
              )}
            </>
          ),
          controls: () => (
            <>
              {/* Sidebar Panel */}
              <AnimatePresence>
                {open && showInfo && (
                  <motion.div
                    className="gallery-sidebar"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    onPointerDown={(e) => e.stopPropagation()} /* Prevent YARL from stealing clicks/swipes */
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="sidebar-header">
                      <h3>Details</h3>
                      <button className="close-sidebar" onClick={() => setShowInfo(false)}>
                        <FaTimes size={18} />
                      </button>
                    </div>

                    <div className="sidebar-content">
                      {/* Location Block */}
                      <div className="info-card">
                        <div className="info-card-icon"><FaMapMarkerAlt /></div>
                        <div className="info-card-text">
                          <span className="info-label">Location</span>
                          <span className="info-value">{activePhoto.location}</span>
                        </div>
                      </div>

                      {/* Date Block */}
                      <div className="info-card">
                        <div className="info-card-icon"><FaCalendarDay /></div>
                        <div className="info-card-text">
                          <span className="info-label">Captured on</span>
                          <span className="info-value">{dateStr}</span>
                          {timeStr && <span className="info-subvalue">{timeStr}</span>}
                        </div>
                      </div>

                      {/* Camera Block */}
                      {camStr && (
                        <div className="info-card">
                          <div className="info-card-icon"><FaCamera /></div>
                          <div className="info-card-text">
                            <span className="info-label">Camera</span>
                            <span className="info-value">{camStr}</span>
                            {lensStr && <span className="info-subvalue">{lensStr}</span>}
                          </div>
                        </div>
                      )}

                      {/* Exposure Block */}
                      {hasExposure && (
                        <div className="info-card">
                          <div className="info-card-icon"><MdOutlineSettingsSuggest size={20} /></div>
                          <div className="info-card-text">
                            <span className="info-label">Exposure</span>
                            <div className="exposure-pills">
                              {aperture && <span className="exp-pill">{aperture}</span>}
                              {shutter && <span className="exp-pill">{shutter}</span>}
                              {focal && <span className="exp-pill">{focal}</span>}
                              {iso && <span className="exp-pill">{iso}</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )
        }}
        thumbnails={{
          ref: thumbnailsRef,
          position: "bottom",
          showToggle: true,
          hidden: false,
          width: 70,
          height: 50,
          border: 2,
          borderRadius: 6,
          padding: 4,
          gap: 10,
        }}
        slides={slides}
        carousel={{ finite: false, imageFit: "contain" }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.9)", zIndex: 10000 },
        }}
      />
    </>
  );
};

export default GalleryModal;
