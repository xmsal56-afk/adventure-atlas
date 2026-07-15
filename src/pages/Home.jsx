import { useNavigate } from "react-router-dom";
import destinations from "../data/destinations";

export default function Home({ bookmarks, isBookmarked, onToggleBookmark, recentIds, departureAirport = "NYC", onAddToItinerary }) {
  const navigate = useNavigate();
  const pickRandom = () => {
    const rand = destinations[Math.floor(Math.random() * destinations.length)];
    if (rand) navigate(`/destination/${rand.id}`);
  };
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold mb-6">Adventure Atlas</h1>
      <p className="text-lg text-gray-500 mb-6">Explore 150 destinations worldwide</p>
      <button onClick={pickRandom} className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 cursor-pointer border-0">
        🎲 Surprise Me
      </button>
    </div>
  );
}
