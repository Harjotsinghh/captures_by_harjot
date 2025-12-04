import Player from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import travelGlobeAnimation from "../assets/lottie/TravelTheGlobe.json";
import manMapAnimation from "../assets/lottie/ManHoldingMap.json";
import flightAnimation from "../assets/lottie/Flight.json";
import cameraAnimation from "../assets/lottie/Camera.json";

type Props = {
  active: boolean;
  text?: string;
};

// Define loader variants
const LOADER_VARIANTS = [
  {
    id: "globe",
    animation: travelGlobeAnimation,
    messages: [
      "Connecting to the World...",
      "Discovering Locations...",
      "Global Sync...",
    ],
  },
  {
    id: "map",
    animation: manMapAnimation,
    messages: [
      "Unfolding the Journey...",
      "Charting New Paths...",
      "Finding Waypoints...",
    ],
  },
  {
    id: "flight",
    animation: flightAnimation,
    messages: [
      "Preparing for Takeoff...",
      "Cruising Altitude...",
      "Arriving Soon...",
    ],
  },
  {
    id: "camera",
    animation: cameraAnimation,
    messages: [
      "Adjusting Focus...",
      "Capturing Moments...",
      "Developing Memories...",
    ],
  },
];

export default function AestheticLoader({
  active,
  text = "Curating Visuals",
}: Props) {
  // State to hold the current variant
  const [currentVariant, setCurrentVariant] = useState(LOADER_VARIANTS[0]);
  const [messageIndex, setMessageIndex] = useState(0);

  // Update variant whenever active becomes true
  useEffect(() => {
    if (active) {
      const randomIndex = Math.floor(Math.random() * LOADER_VARIANTS.length);
      setCurrentVariant(LOADER_VARIANTS[randomIndex]);
      setMessageIndex(0); // Reset message index
    }
  }, [active]);

  // Cycle messages
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % currentVariant.messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [active, currentVariant]);

  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        zIndex: 9999,
        overflow: "hidden",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Background Grid Effect (Subtle) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          textAlign: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Lottie Animation Container */}
        <div style={{
          width: "clamp(150px, 40vw, 280px)",
          height: "clamp(150px, 40vw, 280px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Player
            autoplay
            loop
            animationData={currentVariant.animation}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Text Container */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", minHeight: "60px" }}>
          {/* Title */}
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              margin: 0,
              fontSize: "clamp(1rem, 4vw, 1.4rem)",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              background: "linear-gradient(to right, var(--text-primary), var(--text-secondary), var(--text-primary))",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
              padding: "0 1rem",
            }}
          >
            {text}
          </motion.h2>

          {/* Subtitle with Changing Text */}
          <div style={{ position: "relative", height: "20px", width: "100%", display: "flex", justifyContent: "center" }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                style={{
                  margin: 0,
                  fontSize: "clamp(0.75rem, 3vw, 0.9rem)",
                  color: "var(--text-secondary)",
                  letterSpacing: "1px",
                  fontWeight: 400,
                  position: "absolute",
                  width: "max-content",
                  maxWidth: "90vw",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentVariant.messages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
