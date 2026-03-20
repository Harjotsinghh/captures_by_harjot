import { memo } from "react";
import { motion } from "framer-motion";
import { RiCameraLensAiFill } from "react-icons/ri";
import { config } from "../config";
import "./MotionHeader.css";

const Header = memo(() => {
  return (
    <header className="responsive-header">
      <div className="header-frame">
        <div className="header-top">
          <motion.div
            className="logo-container"
            initial={{ rotate: -20, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          >
            <RiCameraLensAiFill size={24} color="var(--text-primary)" />
          </motion.div>

          <motion.div
            className="logo-text-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="logo-text-main">
              {config.author.firstName}'s
            </span>
            <span className="logo-text-sub">
              Gallery
            </span>
          </motion.div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'MotionHeader';

export default Header;
