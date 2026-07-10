import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// Fix default marker icon in bundlers
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function MapView({ destinations }) {
  const center = destinations.reduce(
    (acc, d) => [acc[0] + d.lat / destinations.length, acc[1] + d.lng / destinations.length],
    [0, 0]
  );

  return (
    <MapContainer
      center={center}
      zoom={2}
      className="w-full h-[600px] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {destinations.map((d) => (
        <Marker key={d.id} position={[d.lat, d.lng]}>
          <Popup>
            <div className="text-sm min-w-[160px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  {d.region}
                </span>
                <span className="text-xs font-bold text-amber-500">
                  ★ {d.rating}
                </span>
              </div>
              <p className="font-bold text-gray-900 text-sm mb-1">{d.name}</p>
              <p className="text-[11px] text-gray-500 mb-2 line-clamp-2">{d.shortDescription}</p>
              <div className="flex items-center gap-2 mb-2">
                {d.budget && (
                  <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    ${d.budget.min}–${d.budget.max}/day
                  </span>
                )}
              </div>
              <Link
                to={`/destination/${d.id}`}
                className="inline-block text-xs font-semibold text-primary hover:underline"
              >
                View details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
