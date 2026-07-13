import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import destinations from "../data/destinations";
import BookmarkButton from "../components/BookmarkButton";
import DestinationCard from "../components/DestinationCard";
import { isInBestTime, parseBestTimeRanges } from "../utils/bestTime";
import SafeImage from "../components/SafeImage";

function extractCode(currency) {
  const m = currency.match(/\(([^)]+)\)/);
  return m ? m[1] : "";
}

const vibeEmoji = {
  beach: "🏖️", adventure: "🏔️", romance: "💑", culture: "🏛️",
  foodie: "🍜", nature: "🌿", nightlife: "🌙", luxury: "💎",
  family: "👨‍👩‍👧‍👦", backpacker: "🎒",
};

export default function DestinationDetail({ isBookmarked, onToggleBookmark, getNote, updateNote, addRecent, departureAirport = "NYC", onAddToItinerary }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const destination = destinations.find((d) => d.id === Number(id));
  const [tripDays, setTripDays] = useState(7);
  const [noteText, setNoteText] = useState(getNote(id));

  // Track view for trending
  useEffect(() => {
    if (!id) return;
    try {
      const key = "travel-views";
      const views = JSON.parse(localStorage.getItem(key) || "{}");
      views[id] = (views[id] || 0) + 1;
      localStorage.setItem(key, JSON.stringify(views));
    } catch {}
  }, [id]);

  useEffect(() => {
    if (addRecent && destination) addRecent(destination.id);
  }, [destination?.id]);

  if (!destination) {
    return (
      <div className="text-center py-20">
        <span className="text-5xl">😕</span>
        <p className="text-gray-500 text-lg mt-4 mb-6">Destination not found</p>
        <Link to="/" className="text-primary font-semibold hover:underline">← Back to destinations</Link>
      </div>
    );
  }

  const {
    name, description, image, rating, region, country,
    bestTime, currency, language, famousFor, exchangeRate, budget, vibes,
 flightTimes, visaInfo, mustEat, topAttractions, localPhrases, gettingAround,
 } = destination;

  const flightHours = flightTimes?.[departureAirport];
  const code = extractCode(currency);

  const getValueLabel = (rate) => {
    if (!rate) return null;
    if (rate === 1) return { label: "Same as USD", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" };
    if (rate < 1) return { label: "💎 Premium — USD buys less", color: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" };
    if (rate <= 5) return { label: "💰 Fair — roughly on par", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" };
    return { label: "🤑 Bargain — USD goes far", color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" };
  };

  const valueInfo = getValueLabel(exchangeRate);

  const getBudgetLabel = (b) => {
    if (!b) return null;
    if (b.max <= 50) return { tier: "Budget", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" };
    if (b.min >= 120) return { tier: "Premium", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" };
    return { tier: "Moderate", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" };
  };

  const budgetInfo = getBudgetLabel(budget);

  const goRandom = () => {
    const others = destinations.filter((d) => d.id !== destination.id);
    const random = others[Math.floor(Math.random() * others.length)];
    navigate(`/destination/${random.id}`);
  };

  const related = destinations.filter((d) => d.id !== destination.id && d.region === region).slice(0, 3);
  const allRelated = related.length ? related : destinations.filter((d) => d.id !== destination.id).slice(0, 3);

  const handleNoteSave = () => {
    if (updateNote) updateNote(destination.id, noteText);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-primary font-medium mb-6 no-underline transition-colors">
        ← Back to destinations
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative h-64 sm:h-80 md:h-96">
          <SafeImage src={image} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">{region}</span>
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">{country}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{name}</h1>
            </div>
            <BookmarkButton isBookmarked={isBookmarked(destination.id)} onClick={() => onToggleBookmark(destination.id)} large />
            {onAddToItinerary && (
              <button onClick={() => onAddToItinerary(destination.id)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer border-0 mt-2 sm:mt-0 whitespace-nowrap">
                + Itinerary
              </button>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-accent text-xl">★</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{rating}</span>
              <span className="text-gray-400 text-sm">/ 5.0</span>
            </div>
            {budgetInfo && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${budgetInfo.bg} ${budgetInfo.color}`}>{budgetInfo.tier}</span>
            )}
            {valueInfo && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${valueInfo.color.split(" ").slice(0, 2).join(" ")}`}>
                {valueInfo.label.split(" — ")[0]}
              </span>
            )}
          </div>

          {/* Vibes */}
          {vibes && vibes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {vibes.map((v) => (
                <span key={v} className="bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 font-medium px-3 py-1.5 rounded-full text-xs flex items-center gap-1">
                  <span>{vibeEmoji[v] || "🏷️"}</span>
                  <span className="capitalize">{v}</span>
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">{description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Best Time to Visit</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{bestTime}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Currency</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{currency}</span>
              {exchangeRate && (
                <span className="block text-xs text-primary font-medium mt-1">
                  {exchangeRate === 1 ? "At par with USD" : `1 USD ≈ ${exchangeRate.toLocaleString()} ${code}`}
                </span>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Est. Daily Budget</span>
              {budget ? (
                <>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">${budget.min} – ${budget.max}</span>
                  <span className="block text-xs text-gray-400 mt-0.5">USD per person</span>
                </>
              ) : (<span className="font-semibold text-gray-400">—</span>)}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Language</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{language}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Region</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{region}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Value Rating</span>
              {valueInfo ? (
                <span className={`font-semibold ${valueInfo.color.split(" ")[1]}`}>
                  {valueInfo.label.split(" — ")[1] || valueInfo.label.split(" — ")[0]}
                </span>
              ) : (<span className="font-semibold text-gray-400">—</span>)}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">✈️ Flight from {departureAirport}</span>
              {flightHours !== undefined ? (
                <>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{flightHours} hours</span>
                  <span className="block text-xs text-gray-400 mt-0.5">Approximate flight time</span>
                </>
              ) : (<span className="font-semibold text-gray-400">—</span>)}
            </div>
            {flightHours !== undefined && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <span className="text-sm text-gray-400 block">💰 Est. Flight Cost</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  ~${Math.round(flightHours * 65)}–${Math.round(flightHours * 120)}
                </span>
                <span className="block text-xs text-gray-400 mt-0.5">{flightHours < 5 ? "Short haul" : flightHours < 10 ? "Medium haul" : "Long haul"} · Economy per person</span>
              </div>
            )}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">🛂 Visa (US Passport)</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{visaInfo || "—"}</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Famous For</h2>
            <div className="flex flex-wrap gap-2">
              {famousFor.map((item) => (
                <span key={item} className="bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 font-medium px-4 py-2 rounded-full text-sm">{item}</span>
              ))}
            </div>
          </div>

          {/* Insider Info — mustEat, topAttractions, gettingAround */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mustEat && mustEat.length > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-5 border border-orange-200 dark:border-orange-700/50">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">🍜 Must-Eat Foods</h3>
                <div className="flex flex-wrap gap-2">
                  {mustEat.map((item) => (
                    <span key={item} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium px-3 py-1.5 rounded-full text-xs shadow-sm">{item}</span>
                  ))}
                </div>
              </div>
            )}
            {topAttractions && topAttractions.length > 0 && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-700/50">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">📍 Top Attractions</h3>
                <ol className="space-y-1.5">
                  {topAttractions.map((item, i) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {gettingAround && (
            <div className="mb-8 bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-700/50">
              <div className="flex items-start gap-3">
                <span className="text-xl">🚕</span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Getting Around</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{gettingAround}</p>
                </div>
              </div>
            </div>
          )}

          {localPhrases && localPhrases.length > 0 && (
            <div className="mb-8 bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-5 border border-rose-200 dark:border-rose-700/50">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">💬 Useful Phrases</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {localPhrases.map((phrase) => {
                  const [en, local] = phrase.split(" — ");
                  return (
                    <div key={phrase} className="bg-white dark:bg-gray-800 rounded-xl px-3 py-2 text-center shadow-sm">
                      <p className="text-xs text-gray-400">{en}</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{local}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Seasonal Banner */}
          {isInBestTime(bestTime) && (
            <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-2xl p-5 flex items-start gap-3">
              <span className="text-2xl">🌿</span>
              <div>
                <h3 className="font-bold text-green-800 dark:text-green-300 text-sm">Peak Season — Now is a great time to visit!</h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">{bestTime}</p>
              </div>
            </div>
          )}

          {/* Trip Note */}
          {updateNote && (
            <div className="mb-8 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-700/50">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📝 Your Trip Note</h2>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onBlur={handleNoteSave}
                placeholder="e.g. Best time to visit is October. Budget around $1500. Travel with Sarah."
                rows={2}
                className="w-full bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
              <p className="text-xs text-gray-400 mt-2">Saved automatically on blur. Shown on your bookmarks page.</p>
            </div>
          )}

          {/* Trip Cost Calculator */}
          {budget && (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🧮 Trip Cost Calculator</h2>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">How many days?</span>
                <input type="range" min={1} max={30} value={tripDays}
                  onChange={(e) => setTripDays(Number(e.target.value))}
                  className="flex-1 accent-primary h-2 rounded-full cursor-pointer" />
                <div className="flex items-center gap-1">
                  <input type="number" min={1} max={30} value={tripDays}
                    onChange={(e) => setTripDays(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
                    className="w-16 text-center font-bold text-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <span className="text-sm text-gray-500">days</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
                  <span className="text-sm text-gray-400 block mb-1">Budget Stay</span>
                  <span className="text-2xl font-extrabold text-green-600 dark:text-green-400">${budget.min * tripDays}</span>
                  <span className="text-xs text-gray-400 block mt-0.5">${budget.min}/day × {tripDays} days</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
                  <span className="text-sm text-gray-400 block mb-1">Moderate</span>
                  <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">${Math.round((budget.min + budget.max) / 2 * tripDays)}</span>
                  <span className="text-xs text-gray-400 block mt-0.5">~${Math.round((budget.min + budget.max) / 2)}/day avg</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
                  <span className="text-sm text-gray-400 block mb-1">Premium Stay</span>
                  <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">${budget.max * tripDays}</span>
                  <span className="text-xs text-gray-400 block mt-0.5">${budget.max}/day × {tripDays} days</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">Estimates per person. Excludes flights. Prices vary by season and travel style.</p>
            </div>
          )}

          {/* Related Destinations */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {related.length ? `More in ${region}` : "You Might Also Like"}
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              {related.length ? `Other destinations in ${region} worth exploring` : "Handpicked destinations you might enjoy"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {allRelated.map((dest) => (
                <Link key={dest.id} to={`/destination/${dest.id}`}
                  className="group block bg-white dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all no-underline">
                  <div className="h-32 overflow-hidden">
                    <SafeImage src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wide">{dest.region}</span>
                      <span className="text-xs font-bold text-accent">★ {dest.rating}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{dest.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{dest.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
            <button onClick={goRandom}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-medium text-sm transition-colors cursor-pointer bg-transparent border-0">
              🎲 Show me another
            </button>
            <Link to="/"
              className="inline-flex items-center gap-1 text-gray-500 hover:text-primary font-medium text-sm transition-colors no-underline">
              Browse all destinations →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
