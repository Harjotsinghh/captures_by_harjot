import React from "react";
import { motion } from "framer-motion";
import { RiCameraLensAiFill } from "react-icons/ri";

const Header: React.FC = () => {
  return (
    <header
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.6rem",
        padding: "2.6rem 1rem 1.6rem",
        width: "100%",
      }}
    >
      {/* Main row: icon + text */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <motion.div
          initial={{ opacity: 0, rotate: -10, scale: 0.95 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RiCameraLensAiFill size={60} strokeWidth={1.6} color="#111827" />
        </motion.div>

        {/* Text stack */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}
        >
          <div
            style={{
              fontFamily:
                "Poppins, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
              fontSize: "0.9rem",
              fontWeight: 600,
              letterSpacing: "1.4px",
              textAlign: "left",
              background: "linear-gradient(90deg, #ff6a00, #ee0979, #00c3ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Captures by
          </div>

          <div
            style={{
              marginTop: 4,
              fontFamily:
                "Poppins, 'Satoshi', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "0.3px",
              background: "linear-gradient(90deg, #111827, #3b3b3b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "left",
            }}
          >
            Harjot
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
        style={{
          marginTop: 10,
          fontSize: "1rem",
          color: "#6b7280",
          maxWidth: 780,
          fontFamily:
            "'Poppins', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontStyle: "italic",
          textAlign: "center",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        "Through the lens, I chase the poetry of light."
      </motion.p>
    </header>
  );
};

export default Header;
