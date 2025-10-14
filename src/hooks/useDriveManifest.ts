// src/hooks/useDriveManifest.ts
import { useEffect, useState } from "react";

export interface DriveImage {
  id: string;
  name: string;
  fileId: string;
  fileUrl: string;
  locationSlug: string;
  locationName?: string;
  date: string;
  timestamp?: string;
  lat?: number | null;
  lng?: number | null;
}

/**
 * Fetches the JSON manifest produced by your Apps Script web app
 * and returns an array of DriveImage objects ready for the app.
 *
 * By default the hook uses the manifest URL you provided.
 */
const MANIFEST_URL =
  import.meta.env.VITE_DRIVE_MANIFEST_URL ??
  (() => {
    throw new Error("VITE_DRIVE_MANIFEST_URL env not set");
  })();

export default function useDriveManifest(manifestUrl = MANIFEST_URL) {
  const [images, setImages] = useState<DriveImage[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchManifest() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(manifestUrl, { cache: "no-cache" });
        if (!res.ok) {
          throw new Error(
            `Manifest fetch failed: ${res.status} ${res.statusText}`
          );
        }
        const data = (await res.json()) as any[];

        // Normalize and validate entries
        const normalized: DriveImage[] = data
          .filter(Boolean)
          .map((item) => ({
            id: String(
              item.id ?? `${item.locationSlug}-${item.date}-${item.name}`
            ),
            name: String(item.name ?? ""),
            fileId: String(item.fileId ?? ""),
            fileUrl: String(item.fileUrl ?? ""),
            locationSlug: String(item.locationSlug ?? "unknown"),
            locationName: item.locationName ?? item.locationSlug ?? "unknown",
            date: String(
              item.date ?? (item.timestamp ? item.timestamp.split("T")[0] : "")
            ),
            timestamp:
              item.timestamp ??
              (item.date ? `${item.date}T00:00:00` : undefined),
            lat: item.lat ?? null,
            lng: item.lng ?? null,
          }))
          // filter out clearly invalid ones (no fileUrl)
          .filter((it) => it.fileUrl && it.fileUrl.startsWith("http"));

        if (!cancelled) setImages(normalized);
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? "Failed to fetch manifest");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchManifest();
    return () => {
      cancelled = true;
    };
  }, [manifestUrl]);

  return { images, loading, error };
}
