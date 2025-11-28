import { motion } from "framer-motion";
import "./AmbientBackground.css";

export default function AmbientBackground() {
    return (
        <div className="ambient-background">
            {/* Aurora Blob 1 - Top Left (Indigo) */}
            <motion.div
                className="aurora-blob aurora-blob-1"
                animate={{
                    x: [0, 160, 0],
                    y: [0, -70, 0],
                    scale: [0.8, 1.9, 1],
                    rotate: [0, 70, 0],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Aurora Blob 2 - Top Right (Pink) */}
            <motion.div
                className="aurora-blob aurora-blob-2"
                animate={{
                    x: [0, -150, 0],
                    y: [0, 80, 0],
                    scale: [1, 1.2, 1],
                    rotate: [0, -45, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />

            {/* Aurora Blob 3 - Bottom Center (Emerald) */}
            <motion.div
                className="aurora-blob aurora-blob-3"
                animate={{
                    x: [0, 120, 0],
                    y: [0, 140, 0],
                    scale: [0.8, 1.4, 1],
                    rotate: [0, 70, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            {/* Noise Overlay for Texture */}
            <div className="noise-overlay" />
        </div>
    );
}
