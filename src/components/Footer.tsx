import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaInstagram, FaReact, FaGithub } from "react-icons/fa";
import { SiVite } from "react-icons/si";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        width: "100%",
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        color: "#374151",
        textAlign: "center",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.8rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        © {year} <strong>Harjot Singh</strong>
      </motion.div>

      {/* Social Icons */}
      <motion.div
        style={{
          display: "flex",
          gap: "1.5rem",
          marginTop: "0.2rem",
        }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <a
          href="https://www.linkedin.com/in/harjotsi/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0a66c2", textDecoration: "none" }}
          title="LinkedIn"
        >
          <FaLinkedin size={18} />
        </a>
        <a
          href="https://www.instagram.com/harjot.singh._/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#e4405f", textDecoration: "none" }}
          title="Instagram"
        >
          <FaInstagram size={18} />
        </a>
        <a
          href="https://github.com/Harjotsinghh/captures_by_harjot"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#333", textDecoration: "none" }}
          title="GitHub"
        >
          <FaGithub size={18} />
        </a>
      </motion.div>

      {/* Tech credit */}
      <motion.div
        style={{
          fontSize: "0.9rem",
          color: "#6b7280",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
        }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Made with{" "}
        <span style={{ color: "#e25555", fontSize: "1.2rem" }}>♥</span> using{" "}
        <a
          href="https://react.dev/"
          referrerPolicy="no-referrer"
          target="_blank"
        >
          <FaReact
            size={18}
            color="#61dafb"
            title="React"
            style={{ verticalAlign: "middle" }}
          />
        </a>
        +{" "}
        <a
          href="https://vite.dev/"
          referrerPolicy="no-referrer"
          target="_blank"
        >
          <SiVite
            size={18}
            color="#747bff"
            title="Vite"
            style={{ verticalAlign: "middle" }}
          />
        </a>
      </motion.div>
    </footer>
  );
};

export default Footer;
