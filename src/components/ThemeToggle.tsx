import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSunFill, RiMoonFill } from 'react-icons/ri';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    // Generate particle positions
    const particles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: (i * 360) / 8,
    }));

    return (
        <motion.button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
            style={{
                position: 'relative',
                overflow: 'visible',
            }}
        >
            {/* Particles/Stars */}
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: isDark ? [0, 1, 0.8, 0] : [0.8, 0, 0],
                            opacity: isDark ? [0, 1, 0.6, 0] : [0.6, 0, 0],
                            x: isDark
                                ? Math.cos((particle.angle * Math.PI) / 180) * 18
                                : Math.cos((particle.angle * Math.PI) / 180) * 15,
                            y: isDark
                                ? Math.sin((particle.angle * Math.PI) / 180) * 18
                                : Math.sin((particle.angle * Math.PI) / 180) * 15,
                        }}
                        transition={{
                            duration: 0.8,
                            delay: particle.id * 0.05,
                            ease: 'easeOut',
                        }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: isDark ? '3px' : '4px',
                            height: isDark ? '3px' : '4px',
                            borderRadius: '50%',
                            background: isDark
                                ? 'linear-gradient(135deg, #93c5fd, #3b82f6)'
                                : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                            pointerEvents: 'none',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Main Icon Container with Morph Effect */}
            <motion.div
                initial={false}
                animate={{
                    rotate: isDark ? 360 : 0,
                    scale: isDark ? [1, 1.2, 1] : [1, 1.2, 1],
                }}
                transition={{
                    rotate: { duration: 0.6, ease: 'easeInOut' },
                    scale: { duration: 0.4, ease: 'easeOut' },
                }}
                style={{
                    transformOrigin: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={theme}
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, rotate: 180, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {isDark ? (
                            <RiMoonFill size={20} />
                        ) : (
                            <RiSunFill size={20} style={{ color: '#FDB813' }} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;
