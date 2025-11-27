import React from "react";
import { RiErrorWarningLine } from "react-icons/ri";

interface ErrorScreenProps {
    message?: string;
    onRetry?: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg-primary)",
                padding: "1rem",
            }}
        >
            <div
                style={{
                    background: "var(--glass-bg)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid var(--glass-border)",
                    padding: "2.5rem",
                    borderRadius: "24px",
                    boxShadow: "var(--card-shadow)",
                    maxWidth: "400px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                }}
            >
                <div
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "rgba(239, 68, 68, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ef4444",
                    }}
                >
                    <RiErrorWarningLine size={32} />
                </div>

                <h2
                    style={{
                        margin: 0,
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "1.5rem",
                        color: "var(--text-primary)",
                    }}
                >
                    Something went wrong
                </h2>

                <p
                    style={{
                        margin: 0,
                        fontFamily: "'Outfit', sans-serif",
                        color: "var(--text-secondary)",
                        fontSize: "0.95rem",
                        lineHeight: 1.5,
                    }}
                >
                    {message || "We couldn't load the gallery. Please check your connection and try again later."}
                </p>

                <button
                    onClick={onRetry || (() => window.location.reload())}
                    style={{
                        marginTop: "0.5rem",
                        padding: "10px 24px",
                        background: "var(--text-primary)",
                        color: "var(--bg-primary)",
                        border: "none",
                        borderRadius: "12px",
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    Reload Page
                </button>
            </div>
        </div>
    );
};

export default ErrorScreen;
