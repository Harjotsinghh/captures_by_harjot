export interface Photo {
  id: string;
  title: string;
  fileUrl: string;
  lat: number;
  lng: number;
  timestamp: string;
  date: string;
  location: string;
  width?: number;
  height?: number;
  camera?: {
    make?: string;
    model?: string;
    lens?: string;
  };
  exposure?: {
    iso?: number;
    aperture?: number;
    focalLength?: number;
    shutter?: number;
  };
  takenAt?: string;
}
