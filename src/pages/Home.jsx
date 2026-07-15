import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import destinations from "../data/destinations";
import SearchBar from "../components/SearchBar";
import DestinationCard from "../components/DestinationCard";

export default function Home({ bookmarks, isBookmarked, onToggleBookmark, recentIds, departureAirport = "NYC", onAddToItinerary }) {
  const [filtered, setFiltered] = useState(destinations);
  const navigate = useNavigate();

  const handleFilter = useCallback((list) => setFiltered(list), []);

  const pickRandom = () => {
    const rand = destinations[Math.floor(Math.random() * destinations.length)];
    if (rand) navigate(`/destination/${rand.id}`);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
          Explore the World 🌍
        </h1>
        <button onClick={pickRandom}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark cursor-pointer border-0">
          🎲 Surprise Me
        </button>
      </div>
      <SearchBar destinations={destinations} onFilter={handleFilter} />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <span className="text-2xl font-extrabold text-primary">{filtered.length}</span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Destinations</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <span className="text-2xl font-extrabold text-green-600">{new Set(destinations.map((d) => d.region)).size}</span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Regions</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <span className="text-2xl font-extrabold text-pink-500">{bookmarks.length}</span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Bookmarked</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <span className="text-2xl font-extrabold text-amber-500">{(destinations.reduce((s, d) => s + d.rating, 0) / destinations.length).toFixed(1)}</span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Avg Rating</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">{filtered.length} destinations found</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((dest, idx) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            isBookmarked={isBookmarked(dest.id)}
            onToggleBookmark={onToggleBookmark}
            departureAirport={departureAirport}
            onAddToItinerary={onAddToItinerary}
          />
        ))}
      </div>
    </div>
  );
}
