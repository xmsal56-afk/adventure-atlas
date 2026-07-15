import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import destinations from "../data/destinations";
import SearchBar from "../components/SearchBar";
import DestinationCard from "../components/DestinationCard";
import SafeImage from "../components/SafeImage";
import { isInBestTime } from "../utils/bestTime";

export default function Home({ bookmarks, isBookmarked, onToggleBookmark, recentIds, departureAirport = "NYC", onAddToItinerary }) {
  const [filtered, setFiltered] = useState(destinations);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");

  const handleFilter = useCallback((list) => setFiltered(list), []);

  const pickRandom = () => {
    const rand = destinations[Math.floor(Math.random() * destinations.length)];
    if (rand) navigate(`/destination/${rand.id}`);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">Explore the World 🌍</h1>
        <button onClick={pickRandom} className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark cursor-pointer border-0">🎲 Surprise Me</button>
      </div>

      <SearchBar destinations={destinations} onFilter={handleFilter} />

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
                <Link key={d.id} to={`/destination/${d.id}`} className="flex-shrink-0 w-36 group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-green-100 dark:border-green-800/40 shadow-sm hover:shadow-md transition-all no-underline">
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
          trending = Object.entries(views).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([id]) => destinations.find(d => d.id === Number(id))).filter(Boolean);
        } catch {}
        if (trending.length < 3) return null;
        return (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">🔥 Trending Now</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {trending.map((d) => (
                <Link key={d.id} to={`/destination/${d.id}`} className="flex-shrink-0 w-44 group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all no-underline">
                  <div className="h-20 overflow-hidden">
                    <SafeImage src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{d.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-gray-400">{d.region}</span>
                      <span className="text-[10px] font-bold text-amber-500">★ {d.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Recently Viewed */}
      {recentIds && recentIds.length > 0 && viewMode !== "map" && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">🕐 Recently Viewed</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {recentIds.map(function(id) {
              if (id == null) return null;
              var dest = null;
              for (var i = 0; i < destinations.length; i++) {
                if (destinations[i].id === id) { dest = destinations[i]; break; }
              }
              if (!dest) return null;
              return (
                <Link key={dest.id} to={"/destination/" + dest.id} className="flex-shrink-0 w-44 group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all no-underline">
                  <div className="h-20 overflow-hidden">
                    <SafeImage src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{dest.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-gray-400">{dest.region}</span>
                      <span className="text-[10px] font-bold text-accent">★ {dest.rating}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <span className="text-2xl font-extrabold text-primary">{filtered.length}</span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Destinations</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <span className="text-2xl font-extrabold text-green-600">{new Set(destinations.map(function(d) { return d.region; })).size}</span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Regions</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <span className="text-2xl font-extrabold text-pink-500">{bookmarks.length}</span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Bookmarked</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <span className="text-2xl font-extrabold text-amber-500">{(destinations.reduce(function(s, d) { return s + d.rating; }, 0) / destinations.length).toFixed(1)}</span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Avg Rating</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">{filtered.length} destinations found</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(function(dest, idx) {
          return (
            <DestinationCard
              key={dest.id}
              destination={dest}
              isBookmarked={isBookmarked(dest.id)}
              onToggleBookmark={onToggleBookmark}
              departureAirport={departureAirport}
              onAddToItinerary={onAddToItinerary}
            />
          );
        })}
      </div>
    </div>
  );
}
