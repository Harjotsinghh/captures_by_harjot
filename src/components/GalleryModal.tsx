import React, { useState, useEffect } from "react";
import Lightbox, { type ThumbnailsRef } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";

import type { Photo } from "../data/images";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Share from "yet-another-react-lightbox/plugins/share";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/counter.css";
import "./GalleryModal.css";

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
  const thumbnailsRef = React.useRef<ThumbnailsRef>(null);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  if (!images || images.length === 0) return null;

  const slides = images.map((img) => ({
    src: img.fileUrl,
    alt: img.title,
    description: `📅 ${img.date}`,
    referrerPolicy: "no-referrer" as const,
  }));

  return (
    <Lightbox
      open={open}
      plugins={[
        Thumbnails,
        Share,
        Counter,
        Download,
        Fullscreen,
        Zoom,
        Captions,
      ]}
      close={() => {
        setOpen(false);
        onClose();
      }}
      on={{
        click: () => {
          (thumbnailsRef.current?.visible
            ? thumbnailsRef.current?.hide
            : thumbnailsRef.current?.show)?.();
        },
      }}
      render={{ iconZoomIn: () => undefined, iconZoomOut: () => undefined }}
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
      // Make main image slightly transparent via CSS class
      // (handled in CSS .yarl__slide img { opacity: 0.9; })
      captions={{
        showToggle: false,
        descriptionTextAlign: "end",
      }}
      slides={slides}
      carousel={{ finite: false, imageFit: "contain" }}
      controller={{ closeOnBackdropClick: true }}
      styles={{
        container: { backgroundColor: "rgba(0, 0, 0, 0.9)", zIndex: 10000 },
      }}
    />
  );
};

export default GalleryModal;
