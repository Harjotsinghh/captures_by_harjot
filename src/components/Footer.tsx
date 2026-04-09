import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import { SiReact, SiVite } from "react-icons/si";
import { config } from "../config";
import "./Footer.css";

interface FooterProps {
  inBottomSheet?: boolean;
}

const socialItems = [
  { icon: FaLinkedin, href: config.social.linkedin, color: "#0a66c2", label: "LinkedIn" },
  { icon: FaInstagram, href: config.social.instagram, color: "#e4405f", label: "Instagram" },
  { icon: FaGithub, href: config.social.github, color: "var(--text-primary)", label: "GitHub" },
];

const Footer: React.FC<FooterProps> = ({ inBottomSheet = false }) => {
  if (inBottomSheet) {
    return (
      <footer className="site-footer site-footer--sheet">
        <div className="site-footer__sheet-main">
          <div className="site-footer__sheet-copy">
            <span>© 2025–{new Date().getFullYear()}</span>
            <strong>{config.author.name}</strong>
          </div>

          <div className="site-footer__sheet-socials">
            {socialItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__sheet-link"
                aria-label={item.label}
                whileHover={{ y: -2, backgroundColor: item.color, color: "#fff", borderColor: item.color }}
                whileTap={{ scale: 0.96 }}
              >
                <item.icon size={14} />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="site-footer__sheet-meta">
          <span className="site-footer__sheet-note">{config.meta.disclaimer}</span>
          <span className="site-footer__sheet-tech">
            Built with
            <a href="https://react.dev/" target="_blank" rel="noreferrer" aria-label="React">
              <SiReact size={11} />
            </a>
            <span>&</span>
            <a href="https://vite.dev/" target="_blank" rel="noreferrer" aria-label="Vite">
              <SiVite size={11} />
            </a>
          </span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer site-footer--gallery">
      <div className="site-footer__gallery-rule" />
      <div className="site-footer__gallery-inner">
        <div className="site-footer__gallery-glow" aria-hidden="true" />

        <div className="site-footer__gallery-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="site-footer__gallery-center"
          >
            <h2 className="site-footer__gallery-brand">
              {config.author.name}
              <span className="brand-dot">.</span>
            </h2>
            <p className="site-footer__gallery-caption">
              Selected frames from the archive, presented as a quiet scrolling journal of places and light.
            </p>

            <div className="site-footer__gallery-socials">
              {socialItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer__gallery-social-link"
                  aria-label={item.label}
                  whileHover={{ y: -3, backgroundColor: item.color, color: "#fff", borderColor: item.color }}
                  whileTap={{ scale: 0.96 }}
                >
                  <item.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="site-footer__gallery-bottom">
          <p className="site-footer__gallery-copyright">
            © 2025–{new Date().getFullYear()} · {config.author.name}
          </p>
          <p className="site-footer__gallery-note">
            {config.meta.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
