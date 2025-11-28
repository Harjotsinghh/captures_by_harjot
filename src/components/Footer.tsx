import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import { SiReact, SiVite } from "react-icons/si";
import { config } from "../config";

interface FooterProps {
  inBottomSheet?: boolean;
}

const Footer: React.FC<FooterProps> = ({ inBottomSheet }) => {


  const socialLinkStyle = {
    color: "#6b7280",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "rgba(0,0,0,0.03)",
  };

  return (
    <footer
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: inBottomSheet ? "0 1.5rem 1.5rem" : "1rem 1.5rem 2rem",
        marginTop: "auto",
        fontFamily: "'Outfit', sans-serif",
        borderRadius: inBottomSheet ? "0" : undefined, // Ensure no rounded corners on container
      }}
    >
      <div
        className="responsive-footer-top"
        style={{
          width: "100%",
        }}
      >
        {/* Left: Copyright */}
        <div
          className="footer-copyright"
          style={{
            fontSize: "0.85rem",
            color: "#6b7280",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>© {2025}</span>
          <span style={{ fontWeight: 600, color: "#374151" }}>
            {config.author.name}
          </span>
        </div>

        {/* Right: Socials */}
        <div className="footer-socials" style={{ display: "flex", gap: "0.8rem" }}>
          {[
            {
              icon: FaLinkedin,
              href: config.social.linkedin,
              color: "#0a66c2",
            },
            {
              icon: FaInstagram,
              href: config.social.instagram,
              color: "#e4405f",
            },
            {
              icon: FaGithub,
              href: config.social.github,
              color: "#333",
            },
          ].map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              style={socialLinkStyle}
              whileHover={{
                scale: 1.05,
                backgroundColor: item.color,
                color: "#fff",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon size={14} />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Bottom: Disclaimer & Tech */}
      <div
        className="responsive-footer-bottom"
        style={{
          fontSize: "0.7rem",
          color: "#9ca3af",
          borderTop: "1px solid rgba(0,0,0,0.05)",
          paddingTop: "1rem",
          width: "100%",
        }}
      >
        <div className="footer-disclaimer" style={{ fontStyle: "italic" }}>{config.meta.disclaimer}</div>

        <div
          className="footer-built-with"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          Built with
          <a
            href="https://react.dev/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#9ca3af", display: "flex" }}
          >
            <SiReact size={11} />
          </a>
          <span>&</span>
          <a
            href="https://vite.dev/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#9ca3af", display: "flex" }}
          >
            <SiVite size={11} />
          </a>
        </div>
      </div>
    </footer >
  );
};

export default Footer;
