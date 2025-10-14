import React from "react";
import Player from "lottie-react"; // or use 'lottie-react'
import animationData from "../assets/lottie/Flight.json"; // relative path inside src

type Props = {
  active: boolean;
  text?: string;
  dark?: boolean;
};

export default function AestheticLoader({
  active,
  text = "Preparing map & fetching photos…",
  dark = true,
}: Props) {
  if (!active) return null;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99,
        pointerEvents: "auto",
        height: "100%",
        backdropFilter: "blur(4px)",
        padding: 20,
        borderRadius: "12px",
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          gap: 14,
          maxWidth: 520,
          width: "min(92%, 520px)",
          textAlign: "center",
          color: "#000",
        }}
      >
        <Player
          autoplay
          loop
          style={{ height: 200, width: "auto" }}
          animationData={animationData}
        />
        {/* Optional title + subtitle */}
        <div style={{ fontSize: 18, fontWeight: 600 }}>{text}</div>
        <div style={{ fontSize: 13, opacity: 0.9 }}>
          Loading map tiles & resolving images — this may take a few seconds.
        </div>
      </div>
    </div>
  );
}
