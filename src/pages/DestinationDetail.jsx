import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import destinations from "../data/destinations";
import SafeImage from "../components/SafeImage";
import BookmarkButton from "../components/BookmarkButton";
import { isInBestTime } from "../utils/bestTime";

const vibeEmoji = {
  beach: "🏖️", adventure: "🏔️", romance: "💑", culture: "🏛️",
  foodie: "🍜", nature: "🌿", nightlife: "🌙", luxury: "💎",
  family: "👨‍👩‍👧‍👦", backpacker: "🎒",
};

export default function DestinationDetail({ isBookmarked, onToggleBookmark, getNote, updateNote, addRecent, departureAirport = "NYC", onAddToItinerary }) {
  const params = useParams();
  const id = params?.id;
  const navigate = useNavigate();
  const destination = destinations?.find?.((d) => d?.id === Number(id));

  useEffect(() => {
    if (!id) return;
    try {
      const views = JSON.parse(localStorage.getItem("travel-views") || "{}");
      views[id] = (views[id] || 0) + 1;
      localStorage.setItem("travel-views", JSON.stringify(views));
    } catch {}
  }, [id]);

  useEffect(() => {
    if (addRecent && destination) addRecent(destination.id);
  }, [destination?.id]);

  if (!destination) {
    return (
      <div className="text-center py-20">
        <Link to="/" className="text-primary font-semibold">← Back</Link>
      </div>
    );
  }

  const goRandom = () => {
    const others = destinations.filter((d) => d.id !== destination.id);
    const random = others[Math.floor(Math.random() * others.length)];
    if (random) navigate(`/destination/${random.id}`);
  };

  const handleNoteSave = () => {
    if (updateNote && destination) updateNote(destination.id, noteText);
  };

  const { name, description, image, rating, region, country, bestTime, currency, language, famousFor, exchangeRate, budget, vibes, flightTimes, visaInfo, mustEat, topAttractions, localPhrases, gettingAround, familiarChains } = destination;

  const flightHours = flightTimes?.[departureAirport];
  const related = destinations.filter((d) => d?.id !== destination?.id && d?.region === region).slice(0, 3);
  const allRelated = related.length ? related : destinations.filter((d) => d?.id !== destination?.id).slice(0, 3);
  const [noteText, setNoteText] = useState("");
  const [tripDays, setTripDays] = useState(7);

  useEffect(() => {
    if (getNote && id) setNoteText(getNote(id) || "");
  }, [id, getNote]);

  function getValueLabel(rate) {
    if (!rate || typeof rate !== "number") return null;
    if (rate === 1) return { label: "Same as USD", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" };
    if (rate < 1) return { label: "Premium - USD buys less", color: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" };
    if (rate <= 5) return { label: "Fair - roughly on par", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" };
    return { label: "Bargain - USD goes far", color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" };
  }

  function getBudgetLabel(b) {
    if (!b) return null;
    if (b.max <= 50) return { tier: "Budget", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" };
    if (b.min >= 120) return { tier: "Premium", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" };
    return { tier: "Moderate", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" };
  }

  const valueInfo = getValueLabel(exchangeRate);
  const budgetInfo = getBudgetLabel(budget);
  const isPeak = isInBestTime(destination.bestTime);

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-primary mb-6 no-underline">← Back</Link>
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
            {isBookmarked && onToggleBookmark && (
              <BookmarkButton isBookmarked={isBookmarked(id)} onClick={() => onToggleBookmark(id)} large />
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
              <span className={"text-xs font-semibold px-3 py-1 rounded-full " + budgetInfo.bg + " " + budgetInfo.color}>{budgetInfo.tier}</span>
            )}
            {valueInfo && typeof valueInfo.color === "string" && (
              <span className={"text-xs font-semibold px-3 py-1 rounded-full " + valueInfo.color}>{valueInfo.label}</span>
            )}
          </div>

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
              <span className="text-sm text-gray-400 block">Best Time</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{bestTime}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Currency</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{currency}</span>
            </div>
            {budget && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <span className="text-sm text-gray-400 block">Daily Budget</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">${budget.min} - ${budget.max}</span>
                <span className="block text-xs text-gray-400 mt-0.5">USD per person</span>
              </div>
            )}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Language</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{language}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Region</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{region}</span>
            </div>
            {flightHours !== undefined && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <span className="text-sm text-gray-400 block">Flight from {departureAirport}</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{flightHours} hours</span>
              </div>
            )}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Visa (US)</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{visaInfo || "-"}</span>
            </div>
          </div>

          {famousFor && famousFor.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Famous For</h2>
              <div className="flex flex-wrap gap-2">
                {famousFor.map((f) => (
                  <span key={f} className="bg-blue-50 dark:bg-blue-900/30 text-primary font-medium px-4 py-2 rounded-full text-sm">{f}</span>
                ))}
              </div>
            </div>
          )}

          {familiarChains && familiarChains.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">🍟 Familiar Eats</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Know you can find these familiar chains if you need a taste of home</p>
              <div className="flex flex-wrap gap-2">
                {familiarChains.map((f) => (
                  <span key={f} className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-medium px-4 py-2 rounded-full text-sm border border-yellow-200 dark:border-yellow-800/50">{f}</span>
                ))}
              </div>
            </div>
          )}

          {mustEat && mustEat.length > 0 && topAttractions && topAttractions.length > 0 && (
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-5 border border-orange-200 dark:border-orange-700/50">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">🍜 Must-Eat Foods</h3>
                <div className="flex flex-wrap gap-2">
                  {mustEat.map((e) => (
                    <span key={e} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium px-3 py-1.5 rounded-full text-xs shadow-sm">{e}</span>
                  ))}
                </div>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-700/50">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">📍 Top Attractions</h3>
                <ol className="space-y-1.5">
                  {topAttractions.map((a, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      {a}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

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
                {localPhrases.map((p) => (
                  <div key={p} className="bg-white dark:bg-gray-800 rounded-xl px-3 py-2 text-center shadow-sm">
                    <p className="text-xs text-gray-400">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isPeak && (
            <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-2xl p-5 flex items-start gap-3">
              <span className="text-2xl">🌿</span>
              <div>
                <h3 className="font-bold text-green-800 dark:text-green-300 text-sm">Peak Season - Now is a great time to visit!</h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">{bestTime}</p>
              </div>
            </div>
          )}

          {updateNote && (
            <div className="mb-8 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-700/50">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📝 Your Trip Note</h2>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onBlur={handleNoteSave}
                placeholder="e.g. Best time to visit is October. Budget around $1500."
                rows={2}
                className="w-full bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
              <p className="text-xs text-gray-400 mt-2">Saved automatically on blur.</p>
            </div>
          )}

          {allRelated && allRelated.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{related.length ? "More in " + region : "You Might Also Like"}</h2>
              <p className="text-sm text-gray-400 mb-4">{related.length ? "Other destinations in " + region + " worth exploring" : "Handpicked destinations you might enjoy"}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {allRelated.map((dest) => (
                  <Link key={dest.id} to={"/destination/" + dest.id} className="group block bg-white dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all no-underline">
                    <div className="h-32 overflow-hidden">
                      <SafeImage src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{dest.region}</span>
                        <span className="text-xs font-bold text-accent">★ {dest.rating}</span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{dest.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{dest.shortDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
            <button onClick={goRandom}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-medium text-sm cursor-pointer bg-transparent border-0">
              🎲 Show me another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
