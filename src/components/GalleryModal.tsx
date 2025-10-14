import React, { useState, useEffect } from "react";
import Lightbox, { type ThumbnailsRef } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import type { Photo } from "../data/images";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Share from "yet-another-react-lightbox/plugins/share";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/plugins/counter.css";

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
    alt: img.date,
    title: img.title,
  }));

  return (
    <Lightbox
      open={open}
      plugins={[Thumbnails, Share, Counter, Download]}
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
      thumbnails={{ ref: thumbnailsRef }}
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
