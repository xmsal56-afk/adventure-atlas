import { Link } from "react-router-dom";
import BookmarkButton from "./BookmarkButton";
import { isInBestTime } from "../utils/bestTime";
import SafeImage from "../components/SafeImage";

const vibeEmoji = {
  beach: "🏖️", adventure: "🏔️", romance: "💑", culture: "🏛️",
  foodie: "🍜", nature: "🌿", nightlife: "🌙", luxury: "💎",
  family: "👨‍👩‍👧‍👦", backpacker: "🎒",
};

export default function DestinationCard({
  destination,
  isBookmarked,
  onToggleBookmark,
  compareMode,
  selectedForCompare,
  onToggleCompare,
  departureAirport = "NYC",
  onAddToItinerary,
}) {
  if (!destination) return null;
  const { id, name, shortDescription, image, rating, region, famousFor, exchangeRate, budget, vibes, flightTimes, bestTime, mustEat, familiarChains } = destination;
  const flightHours = flightTimes?.[departureAirport];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col ${
      selectedForCompare ? "border-pink-500 ring-2 ring-pink-300" : "border-gray-100 dark:border-gray-700"
    }`}>
      <div className="relative">
        <Link to={`/destination/${id}`} className="no-underline block">
          <div className="relative h-52 overflow-hidden">
            <SafeImage
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200">
              {region}
            </div>
            {isInBestTime(bestTime) && (
              <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                🌿 Peak
              </div>
            )}
            {exchangeRate !== undefined && (
              <div className={`absolute top-3 left-3 ${region ? "mt-8" : ""} ${
                exchangeRate < 1 ? "bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300"
                  : exchangeRate <= 5 ? "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300"
                  : "bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300"
              } backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold`}>
                {exchangeRate === 1 ? "💰 USD"
                  : exchangeRate < 1 ? "💎 Premium"
                  : exchangeRate <= 5 ? "💰 Fair" : "🤑 Bargain"}
              </div>
            )}
            {isInBestTime(destination.bestTime) && (
              <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md">
                ✅ Best time now
              </div>
            )}
            {flightHours !== undefined && flightHours > 0 && (
              <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                ✈️ {flightHours}h from {departureAirport}
              </div>
            )}
            <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-accent flex items-center gap-1">
              <span>★</span>
              {rating}
            </div>
          </div>
        </Link>

        {compareMode && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <input
              type="checkbox"
              checked={selectedForCompare}
              onChange={() => onToggleCompare(id)}
              className="w-6 h-6 accent-pink-500 cursor-pointer rounded"
            />
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <Link to={`/destination/${id}`} className="no-underline">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{shortDescription}</p>
        </Link>

        {vibes && vibes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {vibes.slice(0, 3).map((v) => (
              <span key={v} className="text-[11px]">
                {vibeEmoji[v] || v}
              </span>
            ))}
          </div>
        )}

        {mustEat && mustEat.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wide mr-0.5">Eat:</span>
            {mustEat.slice(0, 2).map((item) => (
              <span key={item} className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 text-[10px] px-2 py-0.5 rounded-full font-medium">{item}</span>
            ))}
          </div>
        )}

        {familiarChains && familiarChains.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="text-[10px] font-semibold text-yellow-600 uppercase tracking-wide mr-0.5">🍟 Familiar:</span>
            {familiarChains.slice(0, 3).map((item) => (
              <span key={item} className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-[10px] px-2 py-0.5 rounded-full font-medium">{item}</span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {(famousFor || []).slice(0, 2).map((item) => (
            <span key={item} className="bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-xs px-2.5 py-1 rounded-full font-medium">
              {item}
            </span>
          ))}
        </div>

        {budget && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Budget</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              budget.max <= 50 ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                : budget.min >= 120 ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
            }`}>
              ${budget.min}–${budget.max}
            </span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onAddToItinerary && (
              <button onClick={(e) => { e.preventDefault(); onAddToItinerary(id); }}
                className="text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary px-2.5 py-1 rounded-lg transition-all cursor-pointer border-0">
                + Trip
              </button>
            )}
            <Link to={`/destination/${id}`}
              className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors no-underline">
              Explore more →
            </Link>
          </div>
          <BookmarkButton isBookmarked={isBookmarked} onClick={() => onToggleBookmark(id)} />
        </div>
      </div>
    </div>
  );
}
