import { motion } from "framer-motion";

export default function AmbientBackground() {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                overflow: "hidden",
                background: "var(--bg-primary)", // Base theme color
            }}
        >
            {/* Aurora Blob 1 - Top Left (Indigo) */}
            <motion.div
                animate={{
                    x: [0, 160, 0],
                    y: [0, -70, 0],
                    scale: [0.8, 1.9, 1],
                    rotate: [0, 70, 0], // Added rotation
                }}
                transition={{
                    duration: 7, // Sped up from 20
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    position: "absolute",
                    top: "-20%",
                    left: "-20%",
                    width: "80vw",
                    height: "80vw",
                    background:
                        "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(0,0,0,0) 70%)",
                    filter: "blur(80px)",
                    borderRadius: "50%",
                }}
            />

            {/* Aurora Blob 2 - Top Right (Pink) */}
            <motion.div
                animate={{
                    x: [0, -150, 0],
                    y: [0, 80, 0],
                    scale: [1, 1.2, 1],
                    rotate: [0, -45, 0], // Added rotation
                }}
                transition={{
                    duration: 8, // Sped up from 25
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                style={{
                    position: "absolute",
                    top: "-10%",
                    right: "-20%",
                    width: "90vw",
                    height: "90vw",
                    background:
                        "radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, rgba(0,0,0,0) 60%)",
                    filter: "blur(100px)",
                    borderRadius: "50%",
                }}
            />

            {/* Aurora Blob 3 - Bottom Center (Emerald) */}
            <motion.div
                animate={{
                    x: [0, 120, 0],
                    y: [0, 140, 0],
                    scale: [0.8, 1.4, 1],
                    rotate: [0, 70, 0], // Added rotation
                }}
                transition={{
                    duration: 5, // Sped up from 30
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                style={{
                    position: "absolute",
                    bottom: "-30%",
                    left: "10%",
                    width: "100vw",
                    height: "100vw",
                    background:
                        "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(0,0,0,0) 60%)",
                    filter: "blur(70px)",
                    borderRadius: "50%",
                }}
            />

            {/* Noise Overlay for Texture */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.3,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}
