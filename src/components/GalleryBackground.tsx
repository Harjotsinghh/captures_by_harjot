import { motion } from "framer-motion";
import "./GalleryBackground.css";

export default function GalleryBackground() {
  return (
    <div className="gallery-background" aria-hidden="true">
      <motion.div
        className="gallery-background__glow gallery-background__glow--one"
        animate={{ x: [0, 40, -12, 0], y: [0, -26, 18, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="gallery-background__glow gallery-background__glow--two"
        animate={{ x: [0, -34, 10, 0], y: [0, 18, -16, 0], scale: [1, 0.96, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
      <motion.div
        className="gallery-background__orb gallery-background__orb--one"
        animate={{ y: [0, -30, 0], x: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="gallery-background__orb gallery-background__orb--two"
        animate={{ y: [0, 22, 0], x: [0, -12, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div 
        className="gallery-background__warm-glow"
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="gallery-background__grid" />
      <div className="gallery-background__rings gallery-background__rings--one" />
      <div className="gallery-background__rings gallery-background__rings--two" />
      <div className="gallery-background__grain" />
    </div>
  );
}
