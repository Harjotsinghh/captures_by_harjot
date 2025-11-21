import Player from "lottie-react";
import animationData from "../assets/lottie/Flight.json";

type Props = {
  active: boolean;
  text?: string;
};

export default function AestheticLoader({
  active,
  text = "Preparing your journey",
}: Props) {
  if (!active) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99,
        pointerEvents: "auto",
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          textAlign: "center",
        }}
      >
        {/* Lottie Animation */}
        <Player
          autoplay
          loop
          style={{ height: 180, width: "auto" }}
          animationData={animationData}
        />

        {/* Title */}
        <div
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#111827",
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: "-0.3px",
          }}
        >
          {text}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "0.9rem",
            color: "#6b7280",
            fontFamily: "'Outfit', sans-serif",
            lineHeight: 1.5,
            maxWidth: "320px",
          }}
        >
          Mapping moments from around the world
        </div>
      </div>
    </div>
  );
}
