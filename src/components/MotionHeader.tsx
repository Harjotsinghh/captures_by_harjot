import React from "react";
import { motion } from "framer-motion";
import { RiCameraLensAiFill } from "react-icons/ri";
import { config } from "../config";

const Header: React.FC = () => {
  return (
    <header
      className="responsive-header"
      style={{
        padding: "0.5rem 0.5rem",
      }}
    >
      {/* Left: Logo & Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <motion.div
          initial={{ rotate: -20, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #e0eafc, #cfdef3)",
            padding: "10px",
            borderRadius: "12px",
          }}
        >
          <RiCameraLensAiFill size={30} color="#1f2937" />
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1, padding: "2px 0" }}>
          <motion.span
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(1.2rem, 5vw, 1.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              background: "linear-gradient(to right, #111827, #4b5563, #111827)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
              display: "inline-block",
              paddingBottom: "2px", // Extra buffer for descenders/gradient
            }}
          >
            {config.author.firstName}'s
          </motion.span>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "4px",
              color: "#6b7280",
              marginLeft: "2px",
            }}
          >
            Gallery
          </span>
        </div>
      </div>

      {/* Right: Quote */}
      <motion.div
        className="header-quote"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <p
          style={{
            fontSize: "0.9rem",
            color: "#4b5563",
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 500,
            margin: 0,
          }}
        >
          "{config.author.quote}"
        </p>
      </motion.div>
    </header>
  );
};

export default Header;
