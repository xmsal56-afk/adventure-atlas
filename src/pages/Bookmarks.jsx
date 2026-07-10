import { Link } from "react-router-dom";
import destinations from "../data/destinations";
import SafeImage from "../components/SafeImage";

const vibeEmoji = {
  beach: "🏖️", adventure: "🏔️", romance: "💑", culture: "🏛️",
  foodie: "🍜", nature: "🌿", nightlife: "🌙", luxury: "💎",
  family: "👨‍👩‍👧‍👦", backpacker: "🎒",
};

export default function Bookmarks({ bookmarks, isBookmarked, onToggleBookmark, getNote, updateNote }) {
  const bookmarkedDestinations = destinations.filter((d) => bookmarks.includes(d.id));

  const handleNoteChange = (id, text) => {
    if (updateNote) updateNote(id, text);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          Your Bookmarks ⭐
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {bookmarkedDestinations.length === 0
            ? "You haven't saved any destinations yet."
            : `${bookmarkedDestinations.length} destination${bookmarkedDestinations.length > 1 ? "s" : ""} saved`}
        </p>
      </div>

      {bookmarkedDestinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedDestinations.map((dest) => {
            const note = getNote ? getNote(dest.id) : "";
            return (
              <div key={dest.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                <Link to={`/destination/${dest.id}`} className="no-underline">
                  <div className="relative h-40 overflow-hidden">
                    <SafeImage src={dest.image} alt={dest.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-gray-700 dark:text-gray-200">
                      {dest.region}
                    </div>
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-accent flex items-center gap-1">
                      <span>★</span>
                      {dest.rating}
                    </div>
                  </div>
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <Link to={`/destination/${dest.id}`} className="no-underline mb-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">
                      {dest.name}
                    </h3>
                  </Link>

                  {dest.vibes && dest.vibes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {dest.vibes.slice(0, 3).map((v) => (
                        <span key={v} className="text-xs">{vibeEmoji[v] || v}</span>
                      ))}
                    </div>
                  )}

                  {dest.budget && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Budget</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        ${dest.budget.min}–${dest.budget.max}
                      </span>
                    </div>
                  )}

                  {updateNote && (
                    <div className="mt-auto">
                      <textarea
                        placeholder="Add a private note..."
                        defaultValue={note}
                        onBlur={(e) => handleNoteChange(dest.id, e.target.value)}
                        rows={1}
                        className="w-full text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="text-6xl">📌</span>
          <p className="text-gray-500 text-lg mt-4 mb-6">
            Start exploring and bookmark places you'd love to visit!
          </p>
          <Link to="/" className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors no-underline">
            Browse Destinations
          </Link>
        </div>
      )}
    </div>
  );
}
