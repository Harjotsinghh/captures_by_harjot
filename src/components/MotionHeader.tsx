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
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
          <RiCameraLensAiFill size={24} color="#1f2937" />
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#6b7280",
            }}
          >
            {config.author.title}
          </span>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "#111827",
            }}
          >
            {config.author.firstName}
          </span>
        </div>
      </div>

      {/* Right: Quote */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <p
          style={{
            fontSize: "0.95rem",
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
