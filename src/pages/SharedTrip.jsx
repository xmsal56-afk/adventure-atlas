import { useParams, Link } from "react-router-dom";
import destinations from "../data/destinations";
import SafeImage from "../components/SafeImage";

export default function SharedTrip() {
  const { data } = useParams();

  let stops = [];
  try {
    const raw = atob(data);
    stops = JSON.parse(raw);
  } catch {
    return (
      <div className="text-center py-20">
        <span className="text-6xl">😕</span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Invalid Trip Link</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">This trip link doesn't seem to work. It may have been corrupted.</p>
        <Link to="/itinerary"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors no-underline">
          Plan Your Own Trip
        </Link>
      </div>
    );
  }

  if (!stops.length) {
    return (
      <div className="text-center py-20">
        <span className="text-6xl">🗺️</span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Empty Trip</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">This shared trip has no stops.</p>
        <Link to="/itinerary"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors no-underline">
          Plan Your Own Trip
        </Link>
      </div>
    );
  }

  const stopDests = stops
    .map((s) => ({ ...s, dest: destinations.find((d) => d.id === s.destId) }))
    .filter((s) => s.dest);

  const totalDays = stopDests.reduce((sum, s) => sum + (s.days || 1), 0);
  const totalBudgetMin = stopDests.reduce((sum, s) => sum + (s.dest.budget?.min || 0) * s.days, 0);
  const totalBudgetMax = stopDests.reduce((sum, s) => sum + (s.dest.budget?.max || 0) * s.days, 0);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-5xl">✈️</span>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-3 mb-1">Shared Trip Itinerary</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {stopDests.length} stop{stopDests.length > 1 ? "s" : ""} · {totalDays} day{totalDays > 1 ? "s" : ""} · ${totalBudgetMin.toLocaleString()}–${totalBudgetMax.toLocaleString()} estimated budget
        </p>
      </div>

      {/* Timeline stops */}
      <div className="relative mb-10">
        <div className="absolute left-[23px] top-12 bottom-12 w-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
        <div className="space-y-4">
          {stopDests.map((stop, idx) => {
            const d = stop.dest;
            const costMin = (d.budget?.min || 0) * stop.days;
            const costMax = (d.budget?.max || 0) * stop.days;
            return (
              <div key={d.id} className="relative flex items-start gap-4">
                <div className="hidden sm:flex flex-shrink-0 w-12 justify-center pt-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <Link to={`/destination/${d.id}`} className="flex-shrink-0 no-underline">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden">
                        <SafeImage src={d.image} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/destination/${d.id}`} className="no-underline">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base hover:text-primary transition-colors">{d.name}</h3>
                      </Link>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span>📍 {d.region}</span>
                        <span>⭐ {d.rating}</span>
                        <span>📅 {stop.days} day{stop.days > 1 ? "s" : ""}</span>
                        <span>💰 ${costMin}–${costMax}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{d.shortDescription}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mb-12">
        <Link to={`/itinerary?import=${data}`}
          className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg no-underline">
          📥 Import This Trip
        </Link>
        <p className="text-sm text-gray-400 mt-3">Opens in the Adventure Atlas itinerary planner</p>
      </div>

      {/* Share prompt */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700 mb-8">
        <span className="text-2xl">💡</span>
        <h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-1">Build your own trip</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Plan your perfect itinerary across {destinations.length} destinations worldwide</p>
        <Link to="/itinerary"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors no-underline">
          Start Planning
        </Link>
      </div>
    </div>
  );
}
