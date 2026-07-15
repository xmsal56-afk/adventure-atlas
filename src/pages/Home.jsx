import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import destinations from "../data/destinations";
import SearchBar from "../components/SearchBar";

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
      <p className="text-center text-gray-500">{filtered.length} destinations found</p>
    </div>
  );
}
