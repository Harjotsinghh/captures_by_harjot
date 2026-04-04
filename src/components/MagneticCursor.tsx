import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";
import "./MagneticCursor.css";

export default function MagneticCursor() {
  const hasPointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Sharp, fast spring physics
  const springConfig = { damping: 20, stiffness: 800, mass: 0.1 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const [hoverState, setHoverState] = useState<"default" | "ui" | "photo">("default");
  const [hoveredText, setHoveredText] = useState("");

  useEffect(() => {
    if (!hasPointer) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest(".masonry-photo-wrapper") || target.closest(".waterfall-image-wrapper")) {
        setHoverState("photo");
        setHoveredText("VIEW");
      } else if (
        target.tagName.toLowerCase() === "button" || 
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") || 
        target.closest("a") ||
        target.closest(".view-toggle") ||
        target.closest(".section-show-more")
      ) {
        setHoverState("ui");
        setHoveredText("");
      } else {
        setHoverState("default");
        setHoveredText("");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, hasPointer]);

  if (!hasPointer) return null;

  return (
    <motion.div
      className={`magnetic-cursor ${hoverState !== "default" ? `hover-${hoverState}` : ""}`}
      style={{ x: smoothX, y: smoothY }}
    >
      <span className="magnetic-cursor-text">{hoveredText}</span>
    </motion.div>
  );
}
