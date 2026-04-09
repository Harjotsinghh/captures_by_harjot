import "./AmbientBackground.css";

export default function AmbientBackground() {
    return (
        <div className="ambient-background">
            {/* Aurora blobs — animated via CSS keyframes (GPU compositor) */}
            <div className="aurora-blob aurora-blob-1" />
            <div className="aurora-blob aurora-blob-2" />
            <div className="aurora-blob aurora-blob-3" />

            {/* Noise Overlay for Texture */}
            <div className="noise-overlay" />
        </div>
    );
}

