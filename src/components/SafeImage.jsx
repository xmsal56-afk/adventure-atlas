import { useState } from "react";

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%231a73e8' opacity='0.1' width='400' height='300'/%3E%3Ctext x='200' y='145' text-anchor='middle' fill='%231a73e8' opacity='0.3' font-size='48'%3E✈️%3C/text%3E%3Ctext x='200' y='175' text-anchor='middle' fill='%231a73e8' opacity='0.2' font-size='12'%3EImage unavailable%3C/text%3E%3C/svg%3E";

export default function SafeImage({ src, alt, className, loading = "lazy" }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
      )}
      <img
        src={failed ? FALLBACK : src}
        alt={alt}
        className={`${className || ""} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading={loading}
        onError={() => { setFailed(true); setLoaded(true); }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
