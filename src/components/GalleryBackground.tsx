import "./GalleryBackground.css";

export default function GalleryBackground() {
  return (
    <div className="gallery-background" aria-hidden="true">
      {/* Glow orbs — CSS animated for GPU compositor */}
      <div className="gallery-background__glow gallery-background__glow--one gallery-bg-animate-1" />
      <div className="gallery-background__glow gallery-background__glow--two gallery-bg-animate-2" />
      <div className="gallery-background__orb gallery-background__orb--one" />
      <div className="gallery-background__orb gallery-background__orb--two" />
      <div className="gallery-background__warm-glow gallery-bg-animate-3" />
      <div className="gallery-background__grid" />
      <div className="gallery-background__rings gallery-background__rings--one" />
      <div className="gallery-background__rings gallery-background__rings--two" />
      <div className="gallery-background__grain" />
    </div>
  );
}
