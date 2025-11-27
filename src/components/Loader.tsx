import Player from "lottie-react";
import { motion } from "framer-motion";
import animationData from "../assets/lottie/Flight.json";

type Props = {
  active: boolean;
  text?: string;
};

export default function AestheticLoader({
  active,
  text = "Curating Visuals",
}: Props) {
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)", // Theme background
        color: "var(--text-primary)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem", // Tighter spacing
          textAlign: "center",
        }}
      >
        {/* Lottie Animation */}
        <div style={{ width: "150px", height: "150px", marginBottom: "0.5rem" }}>
          <Player
            autoplay
            loop
            animationData={animationData}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Title */}
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            margin: 0,
            fontSize: "1.2rem",
            fontWeight: 800,
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: "1px",
            textTransform: "uppercase",
            background: "linear-gradient(to right, var(--text-primary), var(--text-secondary), var(--text-primary))", // Theme gradient
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
          }}
        >
          {text}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "var(--text-secondary)", // Theme secondary text
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: "0.5px",
            fontWeight: 500,
          }}
        >
          Gathering moments from across the globe...
        </motion.p>
      </div>
    </motion.div>
  );
}
