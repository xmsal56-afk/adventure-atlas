import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import destinations from "../data/destinations";
import SearchBar from "../components/SearchBar";
import DestinationCard from "../components/DestinationCard";
import MapView from "../components/MapView";
import CompareView from "../components/CompareView";
import SafeImage from "../components/SafeImage";
import { isInBestTime } from "../utils/bestTime";

const vibeEmoji = {
  beach: "🏖️", adventure: "🏔️", romance: "💑", culture: "🏛️",
  foodie: "🍜", nature: "🌿", nightlife: "🌙", luxury: "💎",
  family: "👨‍👩‍👧‍👦", backpacker: "🎒",
};

import DestinationQuiz from "../components/DestinationQuiz";

export default function Home({ bookmarks, isBookmarked, onToggleBookmark, recentIds, departureAirport = "NYC", onAddToItinerary }) {
  const navigate = useNavigate();
  const [filtered, setFiltered] = useState(destinations);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [compareMode, setCompareMode] = useState(false);
  const [activeVibe, setActiveVibe] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleFilter = useCallback((filteredList) => {
    setFiltered(filteredList);
  }, []);

  const pickRandom = () => {
    const random = destinations[Math.floor(Math.random() * destinations.length)];
    navigate(`/destination/${random.id}`);
  };

  const vibeFiltered = activeVibe
    ? filtered.filter((d) => d.vibes?.includes(activeVibe))
    : filtered;

  const sorted = [...vibeFiltered].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "cheapest") return (a.exchangeRate || 0) - (b.exchangeRate || 0);
    if (sortBy === "priciest") return (b.exchangeRate || 0) - (a.exchangeRate || 0);
    if (sortBy === "budget-low") return (a.budget?.min || 0) - (b.budget?.min || 0);
    if (sortBy === "budget-high") return (b.budget?.min || 0) - (a.budget?.min || 0);
    return 0;
  });

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const compareDestinations = compareIds.map((id) => destinations.find((d) => d.id === id)).filter(Boolean);
  const recentDestinations = (recentIds || [])
    .map((id) => destinations.find((d) => d.id === id))
    .filter(Boolean);

  const uniqueRegions = new Set(destinations.map((d) => d.region)).size;
  const bookmarkedCount = bookmarks.length;
  const avgRating = (destinations.reduce((s, d) => s + d.rating, 0) / destinations.length).toFixed(1);

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
          Explore the World 🌍
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-5">
          Discover amazing destinations, plan your next adventure, and save your favorites.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button onClick={pickRandom}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all shadow-md hover:shadow-lg cursor-pointer border-0">
            🎲 Surprise Me
          </button>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
            <button onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border-0 ${
                viewMode === "grid"
                  ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}>
              ▦ Grid
            </button>
            <button onClick={() => setViewMode("map")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border-0 ${
                viewMode === "map"
                  ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}>
              🗺️ Map
            </button>
          </div>
          <button onClick={() => { setCompareMode(!compareMode); if (compareMode) setCompareIds([]); }}
            className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer border-0 ${
              compareMode
                ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 ring-2 ring-pink-400"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}>
            ⚖️ Compare
          </button>
          <button onClick={() => setShowQuiz(true)}
            className="px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-all cursor-pointer border-0">
            🎯 Find Your Match
          </button>
        </div>
      </div>

      {/* Account prompt */}
      {(() => {
        try { if (localStorage.getItem("travel-account-dismissed")) return null; } catch {}
        return (
          <div className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
            <button onClick={() => { try { localStorage.setItem("travel-account-dismissed", "true"); window.location.reload(); } catch {} }}
              className="absolute top-3 right-3 text-white/60 hover:text-white text-lg cursor-pointer bg-transparent border-0">✕</button>
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">🔐</span>
              <div>
                <h3 className="font-bold text-lg">Create an account — coming soon</h3>
                <p className="text-sm text-white/80 mt-1 max-w-lg">Save your bookmarks, itineraries, and notes across devices. Never lose your trip plans again.</p>
                <button disabled
                  className="mt-3 px-5 py-2 rounded-xl bg-white/20 text-white font-semibold text-sm hover:bg-white/30 transition-colors cursor-not-allowed border-0 opacity-70">
                  🚧 In Development
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Where to Go This Month */}
      {viewMode !== "map" && (() => {
        const inSeason = destinations.filter(d => isInBestTime(d.bestTime));
        if (inSeason.length === 0) return null;
        return (
          <div className="mb-10 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-3xl p-6 border border-green-200 dark:border-green-800/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">🌿 Where to Go This Month</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Destinations in their peak season right now</p>
              </div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">{inSeason.length} spots</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {inSeason.map((d) => (
                <Link key={d.id} to={`/destination/${d.id}`}
                  className="flex-shrink-0 w-36 group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-green-100 dark:border-green-800/40 shadow-sm hover:shadow-md transition-all no-underline">
                  <div className="h-16 overflow-hidden">
                    <SafeImage src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{d.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] text-gray-400">{d.region}</span>
                      <span className="text-[10px] font-bold text-yellow-500">★ {d.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Trending Now */}
      {viewMode !== "map" && (() => {
        let trending = [];
        try {
          const views = JSON.parse(localStorage.getItem("travel-views") || "{}");
          trending = Object.entries(views)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([id]) => destinations.find(d => d.id === Number(id)))
            .filter(Boolean);
        } catch {}
        if (trending.length < 3) return null;
        return (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                🔥 Trending Now
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {trending.map((d) => (
                <Link key={d.id} to={`/destination/${d.id}`}
                  className="flex-shrink-0 w-44 group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all no-underline">
                  <div className="h-20 overflow-hidden">
                    <SafeImage src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{d.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-gray-400">{d.region}</span>
                      <span className="text-[10px] font-bold text-accent">★ {d.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Recently Viewed */}
      {recentDestinations.length > 0 && viewMode !== "map" && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              🕐 Recently Viewed
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {recentDestinations.map((d, idx) => (
              d ? <Link key={d.id || idx} to={`/destination/${d.id}`}
                className="flex-shrink-0 w-44 group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all no-underline">
                <div className="h-20 overflow-hidden">
                  <SafeImage src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{d?.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-gray-400">{d?.region}</span>
                    <span className="text-[10px] font-bold text-accent">★ {d?.rating}</span>
                  </div>
                </div>
              </Link> : null
            ))}
          </div>
        </div>
      )}

      {viewMode === "grid" && (
        <>
          <SearchBar destinations={destinations} onFilter={handleFilter} />
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              ["all","All"],
              ["beach","🏖️ Beach"],["adventure","🏔️ Adventure"],["culture","🏛️ Culture"],
              ["foodie","🍜 Foodie"],["nightlife","🌙 Nightlife"],["nature","🌿 Nature"],
              ["luxury","💎 Luxury"],["backpacker","🎒 Budget"],["romance","💑 Romance"],
              ["family","👨‍👩‍👧‍👦 Family"],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setActiveVibe(key === "all" ? null : key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border-0 ${
                  activeVibe === key || (key === "all" && !activeVibe)
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}>
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-700 dark:text-gray-200">{sorted.length}</span> destinations found
        </p>
        <div className="flex items-center gap-3">
          {compareMode && compareIds.length >= 2 && (
            <button onClick={() => document.getElementById("compare-modal")?.classList.remove("hidden")}
              className="text-sm font-semibold bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors cursor-pointer border-0">
              ⚖️ Compare {compareIds.length}
            </button>
          )}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="default">Default order</option>
            <option value="rating">Highest rated</option>
            <option value="name">Alphabetical (A-Z)</option>
            <option value="cheapest">🤑 Cheapest (against USD)</option>
            <option value="priciest">💎 Priciest (against USD)</option>
            <option value="budget-low">💰 Lowest daily budget</option>
            <option value="budget-high">💰 Highest daily budget</option>
          </select>
        </div>
      </div>

      {viewMode === "map" ? (
        <MapView destinations={sorted} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sorted.filter(Boolean).map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              isBookmarked={isBookmarked(dest.id)}
              onToggleBookmark={onToggleBookmark}
              compareMode={compareMode}
              selectedForCompare={compareIds.includes(dest.id)}
              onToggleCompare={toggleCompare}
              departureAirport={departureAirport}
              onAddToItinerary={onAddToItinerary}
            />
          ))}
        </div>
      )}

      {sorted.length === 0 && viewMode === "grid" && (
        <div className="text-center py-20">
          <span className="text-5xl">🔍</span>
          <p className="text-gray-500 dark:text-gray-400 text-lg mt-4">No destinations found. Try a different search!</p>
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-3xl font-extrabold text-primary">{destinations.length}</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium uppercase tracking-wide">Destinations</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">{uniqueRegions}</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium uppercase tracking-wide">Regions</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-3xl font-extrabold text-accent">{bookmarkedCount}</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium uppercase tracking-wide">Bookmarked</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-3xl font-extrabold text-green-600 dark:text-green-400">{avgRating}</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium uppercase tracking-wide">Avg Rating</p>
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      <div id="compare-modal" className="hidden">
        <CompareView destinations={compareDestinations} onClose={() => {
          document.getElementById("compare-modal")?.classList.add("hidden");
        }} />
      </div>

      {showQuiz && <DestinationQuiz onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
