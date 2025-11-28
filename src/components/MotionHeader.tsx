import React from "react";
import { motion } from "framer-motion";
import { RiCameraLensAiFill } from "react-icons/ri";
import { config } from "../config";
import ThemeToggle from "./ThemeToggle";
import { useMediaQuery } from "../hooks/useMediaQuery";
import "./MotionHeader.css";

const Header: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <header className="responsive-header">
      {/* Logo & Title */}
      <div className="header-top">
        <motion.div
          className="logo-container"
          initial={{ rotate: -20, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        >
          <RiCameraLensAiFill size={30} color="var(--text-primary)" />
        </motion.div>

        <div className="logo-text-container">
          <motion.span
            className="logo-text-main"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            {config.author.firstName}'s
          </motion.span>
          <span className="logo-text-sub">
            Gallery
          </span>
        </div>
      </div>

      {/* Quote & Toggle */}
      <div className="header-bottom">
        {!isMobile && (
          <motion.div
            className="header-quote"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="header-quote-text">
              "{config.author.quote}"
            </p>
          </motion.div>
        )}

        <div className="desktop-only-toggle">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
