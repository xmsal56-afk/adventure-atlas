import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import destinations from "../data/destinations";
import SearchBar from "../components/SearchBar";
import DestinationCard from "../components/DestinationCard";

export default function Home({ bookmarks, isBookmarked, onToggleBookmark, recentIds, departureAirport = "NYC", onAddToItinerary }) {
  const [filtered, setFiltered] = useState(destinations);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [activeVibe, setActiveVibe] = useState(null);
  const [sortBy, setSortBy] = useState("default");

  const handleFilter = (filteredList) => { setFiltered(filteredList); };
  
  const pickRandom = () => {
    const rand = destinations[Math.floor(Math.random() * destinations.length)];
    if (rand) navigate(`/destination/${rand.id}`);
  };

  const vibeFiltered = activeVibe
    ? filtered.filter((d) => d.vibes?.includes(activeVibe))
    : filtered;

  const sorted = [...vibeFiltered].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

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
        </div>
      </div>

      <SearchBar destinations={destinations} onFilter={handleFilter} />
      <div className="flex flex-wrap items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-700 dark:text-gray-200">{sorted.length}</span> destinations found
        </p>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="default">Default order</option>
          <option value="rating">Highest rated</option>
          <option value="name">Alphabetical (A-Z)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sorted.map((dest, idx) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            style={{ animationDelay: `${idx * 0.04}s` }}
            className="card-enter"
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
